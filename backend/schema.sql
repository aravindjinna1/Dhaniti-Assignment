-- ====================================================================
-- Dhaniti - Education Lending Application Intelligence Database Schema
-- Relational PostgreSQL Schema for Applications, Institutions, Courses & Statuses
-- ====================================================================

-- 1. Statuses Master Table
CREATE TABLE IF NOT EXISTS statuses (
    status VARCHAR(50) PRIMARY KEY,
    description TEXT
);

-- 2. Institutions Master Table
CREATE TABLE IF NOT EXISTS institutions (
    institution_id VARCHAR(20) PRIMARY KEY,
    institution_name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    institution_type VARCHAR(100) NOT NULL
);

-- 3. Courses Master Table
CREATE TABLE IF NOT EXISTS courses (
    course_id VARCHAR(20) PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    domain VARCHAR(100) NOT NULL,
    typical_fee_inr NUMERIC(12, 2) NOT NULL,
    duration_months INTEGER NOT NULL
);

-- 4. Education Loan Applications Table
CREATE TABLE IF NOT EXISTS applications (
    application_id VARCHAR(20) PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    student_state VARCHAR(100) NOT NULL,
    institution_id VARCHAR(20) NOT NULL REFERENCES institutions(institution_id) ON UPDATE CASCADE,
    course_id VARCHAR(20) NOT NULL REFERENCES courses(course_id) ON UPDATE CASCADE,
    course_fee_inr NUMERIC(12, 2) NOT NULL,
    loan_amount_requested_inr NUMERIC(12, 2) NOT NULL,
    parent_monthly_income_inr NUMERIC(12, 2) NOT NULL,
    existing_monthly_obligations_inr NUMERIC(12, 2) NOT NULL,
    credit_score NUMERIC(6, 1), -- Nullable: handles missing credit score (e.g. EDU1092)
    employment_type VARCHAR(100) NOT NULL,
    application_date DATE NOT NULL,
    application_status VARCHAR(50) NOT NULL REFERENCES statuses(status) ON UPDATE CASCADE,
    application_channel VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance on filterable and searchable columns
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(application_status);
CREATE INDEX IF NOT EXISTS idx_applications_institution ON applications(institution_id);
CREATE INDEX IF NOT EXISTS idx_applications_course ON applications(course_id);
CREATE INDEX IF NOT EXISTS idx_applications_student_name ON applications(student_name);
CREATE INDEX IF NOT EXISTS idx_applications_loan_amount ON applications(loan_amount_requested_inr);
CREATE INDEX IF NOT EXISTS idx_applications_credit_score ON applications(credit_score);
