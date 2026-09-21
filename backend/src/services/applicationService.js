const db = require('../db');
const { cleanString, cleanNumber, cleanApplicationRecord } = require('../utils/dataCleaner');

// Helper to compute illustrative attention level
function calculateAttentionLevel(app) {
  const creditScore = app.credit_score !== null && app.credit_score !== undefined ? Number(app.credit_score) : null;
  const income = Number(app.parent_monthly_income_inr) || 0;
  const debt = Number(app.existing_monthly_obligations_inr) || 0;
  const loan = Number(app.loan_amount_requested_inr) || 0;
  const fee = Number(app.course_fee_inr) || 0;

  // Rule 1: High Attention
  // Credit score under 600 OR monthly obligations exceed monthly income OR loan exceeds course fee
  if ((creditScore !== null && creditScore < 600) || (income > 0 && debt > income) || (fee > 0 && loan > fee) || (income === 0 && debt > 0)) {
    return {
      level: 'High Attention',
      reasons: [
        creditScore !== null && creditScore < 600 ? `Low Credit Score (${creditScore})` : null,
        (income > 0 && debt > income) || (income === 0 && debt > 0) ? `Debt exceeds stated income (${debt} vs ${income})` : null,
        fee > 0 && loan > fee ? `Loan requested exceeds tuition fee by ₹${loan - fee}` : null
      ].filter(Boolean)
    };
  }

  // Rule 2: Review Required
  // Credit score between 600 and 680 OR FOIR (Debt/Income) > 40% OR Status is Under Review OR Missing Credit Score
  const foir = income > 0 ? debt / income : 0;
  if (creditScore === null || (creditScore >= 600 && creditScore <= 680) || foir > 0.4 || app.application_status === 'Under Review') {
    return {
      level: 'Review Required',
      reasons: [
        creditScore === null ? 'Missing credit score requires manual verification' : null,
        creditScore >= 600 && creditScore <= 680 ? `Moderate credit score (${creditScore})` : null,
        foir > 0.4 ? `High fixed obligation ratio (${(foir * 100).toFixed(1)}%)` : null,
        app.application_status === 'Under Review' ? 'Application currently undergoing manual evaluation' : null
      ].filter(Boolean)
    };
  }

  // Rule 3: Low Attention
  return {
    level: 'Low Attention',
    reasons: ['Standard risk profile: satisfactory credit score and debt-to-income ratio']
  };
}

// Format single application record
function formatApplication(row) {
  const attention = calculateAttentionLevel(row);
  return {
    application_id: row.application_id,
    student_name: row.student_name,
    age: Number(row.age),
    student_state: row.student_state,
    institution_id: row.institution_id,
    institution_name: row.institution_name,
    institution_city: row.institution_city || row.city || '',
    institution_state: row.institution_state || row.state || '',
    institution_type: row.institution_type || '',
    course_id: row.course_id,
    course_name: row.course_name,
    course_domain: row.course_domain || row.domain || '',
    duration_months: row.duration_months ? Number(row.duration_months) : null,
    course_fee_inr: Number(row.course_fee_inr),
    loan_amount_requested_inr: Number(row.loan_amount_requested_inr),
    parent_monthly_income_inr: Number(row.parent_monthly_income_inr),
    existing_monthly_obligations_inr: Number(row.existing_monthly_obligations_inr),
    credit_score: row.credit_score !== null && row.credit_score !== undefined && row.credit_score !== '' 
      ? Number(row.credit_score) 
      : null,
    employment_type: row.employment_type,
    application_date: row.application_date,
    application_status: row.application_status,
    application_channel: row.application_channel,
    created_at: row.created_at,
    updated_at: row.updated_at,
    attention_level: attention.level,
    attention_reasons: attention.reasons
  };
}

// 1. List Applications with Search, Filter & Sort
async function listApplications(options = {}) {
  const {
    search = '',
    status = '',
    course = '',
    institution = '',
    sortBy = 'application_id',
    order = 'asc'
  } = options;

  // Try PostgreSQL
  const pool = db.getPool();
  if (pool) {
    try {
      let queryText = `
        SELECT 
          a.*,
          i.institution_name,
          i.city AS institution_city,
          i.state AS institution_state,
          i.institution_type,
          c.course_name,
          c.domain AS course_domain,
          c.duration_months
        FROM applications a
        LEFT JOIN institutions i ON a.institution_id = i.institution_id
        LEFT JOIN courses c ON a.course_id = c.course_id
        WHERE 1=1
      `;
      const params = [];
      let paramIdx = 1;

      if (search) {
        queryText += ` AND (a.application_id ILIKE $${paramIdx} OR a.student_name ILIKE $${paramIdx})`;
        params.push(`%${search}%`);
        paramIdx++;
      }

      if (status) {
        queryText += ` AND a.application_status = $${paramIdx}`;
        params.push(status);
        paramIdx++;
      }

      if (course) {
        queryText += ` AND (a.course_id = $${paramIdx} OR c.course_name = $${paramIdx})`;
        params.push(course);
        paramIdx++;
      }

      if (institution) {
        queryText += ` AND (a.institution_id = $${paramIdx} OR i.institution_name = $${paramIdx})`;
        params.push(institution);
        paramIdx++;
      }

      // Safe sorting mapping
      const sortColumnMap = {
        application_id: 'a.application_id',
        student_name: 'a.student_name',
        loan_amount: 'a.loan_amount_requested_inr',
        loan_amount_requested_inr: 'a.loan_amount_requested_inr',
        credit_score: 'a.credit_score',
        application_date: 'a.application_date',
        status: 'a.application_status'
      };

      const sortCol = sortColumnMap[sortBy] || 'a.application_id';
      const sortDir = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

      // Nulls last for credit score
      if (sortBy === 'credit_score') {
        queryText += ` ORDER BY ${sortCol} ${sortDir} NULLS LAST`;
      } else {
        queryText += ` ORDER BY ${sortCol} ${sortDir}`;
      }

      const res = await pool.query(queryText, params);
      return res.rows.map(formatApplication);
    } catch (err) {
      console.warn('[ApplicationService] PostgreSQL query failed, using in-memory store:', err.message);
    }
  }

  // Fallback to in-memory store
  const store = db.getInMemoryStore();
  let results = [...store.applications];

  if (search) {
    const s = search.toLowerCase();
    results = results.filter(
      a => a.application_id.toLowerCase().includes(s) || a.student_name.toLowerCase().includes(s)
    );
  }

  if (status) {
    results = results.filter(a => a.application_status.toLowerCase() === status.toLowerCase());
  }

  if (course) {
    results = results.filter(a => a.course_id === course || a.course_name === course);
  }

  if (institution) {
    results = results.filter(a => a.institution_id === institution || a.institution_name === institution);
  }

  // Sorting
  results.sort((a, b) => {
    let valA, valB;
    if (sortBy === 'loan_amount' || sortBy === 'loan_amount_requested_inr') {
      valA = Number(a.loan_amount_requested_inr);
      valB = Number(b.loan_amount_requested_inr);
    } else if (sortBy === 'credit_score') {
      valA = a.credit_score !== null ? Number(a.credit_score) : -1;
      valB = b.credit_score !== null ? Number(b.credit_score) : -1;
    } else if (sortBy === 'application_date') {
      valA = new Date(a.application_date).getTime();
      valB = new Date(b.application_date).getTime();
    } else if (sortBy === 'student_name') {
      valA = a.student_name.toLowerCase();
      valB = b.student_name.toLowerCase();
    } else {
      valA = a.application_id;
      valB = b.application_id;
    }

    if (order.toLowerCase() === 'desc') {
      return valA < valB ? 1 : valA > valB ? -1 : 0;
    }
    return valA > valB ? 1 : valA < valB ? -1 : 0;
  });

  return results.map(formatApplication);
}

// 2. View Single Application
async function getApplicationById(id) {
  const pool = db.getPool();
  if (pool) {
    try {
      const res = await pool.query(`
        SELECT 
          a.*,
          i.institution_name,
          i.city AS institution_city,
          i.state AS institution_state,
          i.institution_type,
          c.course_name,
          c.domain AS course_domain,
          c.typical_fee_inr,
          c.duration_months
        FROM applications a
        LEFT JOIN institutions i ON a.institution_id = i.institution_id
        LEFT JOIN courses c ON a.course_id = c.course_id
        WHERE a.application_id = $1
      `, [id]);

      if (res.rows.length > 0) {
        return formatApplication(res.rows[0]);
      }
      return null;
    } catch (err) {
      console.warn('[ApplicationService] Single record query fallback:', err.message);
    }
  }

  const store = db.getInMemoryStore();
  const found = store.applications.find(a => a.application_id === id);
  return found ? formatApplication(found) : null;
}

// 3. Create Application
async function createApplication(data) {
  const cleaned = cleanApplicationRecord(data);
  const store = db.getInMemoryStore();

  // Validate required fields
  if (!cleaned.student_name) throw new Error('Student name is required');
  if (!cleaned.institution_id) throw new Error('Institution is required');
  if (!cleaned.course_id) throw new Error('Course is required');
  if (!cleaned.loan_amount_requested_inr || cleaned.loan_amount_requested_inr <= 0) {
    throw new Error('Valid loan amount requested is required');
  }

  // Generate ID if missing
  if (!cleaned.application_id) {
    const existingIds = store.applications.map(a => parseInt(a.application_id.replace('EDU', ''), 10)).filter(n => !isNaN(n));
    const nextNum = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1151;
    cleaned.application_id = `EDU${nextNum}`;
  }

  // Default status
  if (!cleaned.application_status) {
    cleaned.application_status = 'Submitted';
  }
  if (!cleaned.application_date) {
    cleaned.application_date = new Date().toISOString().split('T')[0];
  }
  if (!cleaned.application_channel) {
    cleaned.application_channel = 'Direct Website';
  }

  const pool = db.getPool();
  if (pool) {
    try {
      await pool.query(
        `INSERT INTO applications (
           application_id, student_name, age, student_state,
           institution_id, course_id, course_fee_inr,
           loan_amount_requested_inr, parent_monthly_income_inr,
           existing_monthly_obligations_inr, credit_score,
           employment_type, application_date, application_status,
           application_channel
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          cleaned.application_id,
          cleaned.student_name,
          cleaned.age,
          cleaned.student_state,
          cleaned.institution_id,
          cleaned.course_id,
          cleaned.course_fee_inr,
          cleaned.loan_amount_requested_inr,
          cleaned.parent_monthly_income_inr,
          cleaned.existing_monthly_obligations_inr,
          cleaned.credit_score,
          cleaned.employment_type,
          cleaned.application_date,
          cleaned.application_status,
          cleaned.application_channel
        ]
      );
    } catch (err) {
      console.warn('[ApplicationService] DB insert fallback to memory:', err.message);
    }
  }

  // Also maintain in-memory store
  const inst = store.institutions.find(i => i.institution_id === cleaned.institution_id) || {};
  const crs = store.courses.find(c => c.course_id === cleaned.course_id) || {};
  const fullApp = {
    ...cleaned,
    institution_name: inst.institution_name || '',
    course_name: crs.course_name || '',
    course_domain: crs.domain || '',
    duration_months: crs.duration_months ? Number(crs.duration_months) : null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  store.applications.unshift(fullApp);
  return formatApplication(fullApp);
}

// 4. Update Application Status
async function updateApplicationStatus(id, newStatus) {
  const validStatuses = ['Submitted', 'Under Review', 'Approved', 'Rejected'];
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: "${newStatus}". Must be one of: ${validStatuses.join(', ')}`);
  }

  const pool = db.getPool();
  if (pool) {
    try {
      const res = await pool.query(
        `UPDATE applications 
         SET application_status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE application_id = $2
         RETURNING *`,
        [newStatus, id]
      );
      if (res.rows.length === 0) {
        throw new Error(`Application with ID ${id} not found`);
      }
    } catch (err) {
      console.warn('[ApplicationService] DB update fallback to memory:', err.message);
    }
  }

  // Update in-memory store
  const store = db.getInMemoryStore();
  const app = store.applications.find(a => a.application_id === id);
  if (!app) {
    throw new Error(`Application with ID ${id} not found`);
  }

  app.application_status = newStatus;
  app.updated_at = new Date().toISOString();

  return formatApplication(app);
}

module.exports = {
  listApplications,
  getApplicationById,
  createApplication,
  updateApplicationStatus,
  calculateAttentionLevel
};
