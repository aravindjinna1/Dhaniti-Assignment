const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const { cleanApplicationRecord } = require('../utils/dataCleaner');

let pool = null;
let isConnected = false;
let inMemoryStore = null;

// Initialize PostgreSQL pool if DATABASE_URL is provided
function getPool() {
  if (!pool && process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 3000
    });

    pool.on('error', (err) => {
      console.warn('[PostgreSQL] Background pool error:', err.message);
      isConnected = false;
    });
  }
  return pool;
}

// Check database connection
async function checkConnection() {
  const currentPool = getPool();
  if (!currentPool) return false;
  try {
    const res = await currentPool.query('SELECT 1');
    isConnected = true;
    return true;
  } catch (err) {
    console.warn('[PostgreSQL] Connection check failed:', err.message);
    isConnected = false;
    return false;
  }
}

// Simple CSV parser for in-memory fallback
function parseCsvFile(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = line.split(',');
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] !== undefined ? values[idx].trim() : '';
    });
    rows.push(obj);
  }
  return rows;
}

// Load in-memory data from CSV files for standalone fallback
function getInMemoryStore() {
  if (!inMemoryStore) {
    const dataDir = path.join(__dirname, '../../data');
    const statusesRaw = parseCsvFile(path.join(dataDir, 'statuses.csv'));
    const institutionsRaw = parseCsvFile(path.join(dataDir, 'institutions.csv'));
    const coursesRaw = parseCsvFile(path.join(dataDir, 'courses.csv'));
    const applicationsRaw = parseCsvFile(path.join(dataDir, 'education_loan_applications.csv'));

    const cleanedApps = applicationsRaw.map(raw => {
      const cleaned = cleanApplicationRecord(raw);
      const inst = institutionsRaw.find(i => i.institution_id === cleaned.institution_id) || {};
      const crs = coursesRaw.find(c => c.course_id === cleaned.course_id) || {};
      
      return {
        ...cleaned,
        institution_name: inst.institution_name || raw.institution_name || '',
        institution_city: inst.city || '',
        institution_state: inst.state || '',
        institution_type: inst.institution_type || '',
        course_name: crs.course_name || raw.course_name || '',
        course_domain: crs.domain || raw.course_domain || '',
        duration_months: crs.duration_months ? Number(crs.duration_months) : null,
        created_at: new Date(cleaned.application_date || Date.now()).toISOString(),
        updated_at: new Date(cleaned.application_date || Date.now()).toISOString()
      };
    });

    inMemoryStore = {
      statuses: statusesRaw,
      institutions: institutionsRaw,
      courses: coursesRaw,
      applications: cleanedApps
    };
  }
  return inMemoryStore;
}

// Query helper: uses PostgreSQL when available, falls back to in-memory store
async function query(text, params = []) {
  const currentPool = getPool();
  if (currentPool) {
    try {
      const result = await currentPool.query(text, params);
      return result;
    } catch (err) {
      console.warn(`[PostgreSQL Query Fallback] Query error: ${err.message}. Routing to in-memory store.`);
    }
  }
  return null;
}

module.exports = {
  getPool,
  checkConnection,
  query,
  getInMemoryStore
};
