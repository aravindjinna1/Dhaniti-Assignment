require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { cleanString, cleanNumber, cleanApplicationRecord } = require('../src/utils/dataCleaner');

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL environment variable is not defined in backend/.env');
    console.error('Please configure your DATABASE_URL, for example:');
    console.error('DATABASE_URL=postgresql://postgres:password@localhost:5432/dhaniti_db');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('--- Connecting to PostgreSQL ---');
    const client = await pool.connect();
    console.log('Connected successfully!');

    // 1. Run Schema
    console.log('\n--- Creating Database Schema ---');
    const schemaSql = fs.readFileSync(path.join(__dirname, '../schema.sql'), 'utf-8');
    await client.query(schemaSql);
    console.log('Tables and indexes verified/created.');

    const dataDir = path.join(__dirname, '../data');

    // Helper to parse CSV
    function parseCsv(filename) {
      const filePath = path.join(dataDir, filename);
      const content = fs.readFileSync(filePath, 'utf-8').trim();
      const lines = content.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      return lines.slice(1).filter(l => l.trim().length > 0).map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((h, i) => {
          obj[h] = values[i] !== undefined ? values[i].trim() : '';
        });
        return obj;
      });
    }

    // 2. Seed Statuses
    console.log('\n--- Seeding Statuses ---');
    const statuses = parseCsv('statuses.csv');
    for (const s of statuses) {
      await client.query(
        `INSERT INTO statuses (status, description)
         VALUES ($1, $2)
         ON CONFLICT (status) DO UPDATE SET description = EXCLUDED.description`,
        [s.status, s.description]
      );
    }
    console.log(`Seeded ${statuses.length} statuses.`);

    // 3. Seed Institutions
    console.log('\n--- Seeding Institutions ---');
    const institutions = parseCsv('institutions.csv');
    for (const inst of institutions) {
      await client.query(
        `INSERT INTO institutions (institution_id, institution_name, city, state, institution_type)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (institution_id) DO UPDATE SET
           institution_name = EXCLUDED.institution_name,
           city = EXCLUDED.city,
           state = EXCLUDED.state,
           institution_type = EXCLUDED.institution_type`,
        [inst.institution_id, inst.institution_name, inst.city, inst.state, inst.institution_type]
      );
    }
    console.log(`Seeded ${institutions.length} institutions.`);

    // 4. Seed Courses
    console.log('\n--- Seeding Courses ---');
    const courses = parseCsv('courses.csv');
    for (const c of courses) {
      await client.query(
        `INSERT INTO courses (course_id, course_name, domain, typical_fee_inr, duration_months)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (course_id) DO UPDATE SET
           course_name = EXCLUDED.course_name,
           domain = EXCLUDED.domain,
           typical_fee_inr = EXCLUDED.typical_fee_inr,
           duration_months = EXCLUDED.duration_months`,
        [c.course_id, c.course_name, c.domain, Number(c.typical_fee_inr), Number(c.duration_months)]
      );
    }
    console.log(`Seeded ${courses.length} courses.`);

    // 5. Seed Applications
    console.log('\n--- Seeding Applications with Data Quality Normalization ---');
    const applicationsRaw = parseCsv('education_loan_applications.csv');
    let insertedCount = 0;
    let missingCreditCount = 0;
    let typoNormalizedCount = 0;

    for (const raw of applicationsRaw) {
      const cleaned = cleanApplicationRecord(raw);

      if (cleaned.credit_score === null) {
        missingCreditCount++;
      }
      if (raw.student_state.toLowerCase() === 'telengana') {
        typoNormalizedCount++;
      }

      await client.query(
        `INSERT INTO applications (
           application_id, student_name, age, student_state,
           institution_id, course_id, course_fee_inr,
           loan_amount_requested_inr, parent_monthly_income_inr,
           existing_monthly_obligations_inr, credit_score,
           employment_type, application_date, application_status,
           application_channel
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         ON CONFLICT (application_id) DO UPDATE SET
           student_name = EXCLUDED.student_name,
           age = EXCLUDED.age,
           student_state = EXCLUDED.student_state,
           institution_id = EXCLUDED.institution_id,
           course_id = EXCLUDED.course_id,
           course_fee_inr = EXCLUDED.course_fee_inr,
           loan_amount_requested_inr = EXCLUDED.loan_amount_requested_inr,
           parent_monthly_income_inr = EXCLUDED.parent_monthly_income_inr,
           existing_monthly_obligations_inr = EXCLUDED.existing_monthly_obligations_inr,
           credit_score = EXCLUDED.credit_score,
           employment_type = EXCLUDED.employment_type,
           application_date = EXCLUDED.application_date,
           application_status = EXCLUDED.application_status,
           application_channel = EXCLUDED.application_channel,
           updated_at = CURRENT_TIMESTAMP`,
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
      insertedCount++;
    }

    console.log(`Seeded ${insertedCount} applications successfully.`);
    console.log(`- Missing credit scores preserved as NULL: ${missingCreditCount}`);
    console.log(`- State typos normalized (e.g. Telengana -> Telangana): ${typoNormalizedCount}`);

    client.release();
    await pool.end();
    console.log('\nDatabase seeding completed successfully!');
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
