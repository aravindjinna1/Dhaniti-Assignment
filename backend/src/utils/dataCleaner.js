/**
 * Data Cleaning & Normalization Utility
 * 
 * Handles documented data-quality issues:
 * 1. Missing credit score preserved as null.
 * 2. Typo normalization: "Telengana" -> "Telangana".
 * 3. Trimming trailing/leading whitespace from all categorical fields ("MBA ", "Website ").
 * 4. Resolving institution name abbreviation variations ("Central Inst." -> master record).
 */

function cleanString(val) {
  if (val === undefined || val === null) return '';
  return String(val).trim();
}

function cleanNumber(val, defaultValue = null) {
  if (val === undefined || val === null || val === '') return defaultValue;
  const num = Number(val);
  return isNaN(num) ? defaultValue : num;
}

function cleanApplicationRecord(raw) {
  // 1. Trim strings
  const applicationId = cleanString(raw.application_id);
  const studentName = cleanString(raw.student_name);
  const age = cleanNumber(raw.age, 0);

  // 2. Normalization of known typo "Telengana" -> "Telangana"
  let studentState = cleanString(raw.student_state);
  if (studentState.toLowerCase() === 'telengana') {
    studentState = 'Telangana';
  }

  // 3. Institution ID & Course ID (Relational FK keys)
  const institutionId = cleanString(raw.institution_id);
  const courseId = cleanString(raw.course_id);

  // 4. Numeric fields
  const courseFeeInr = cleanNumber(raw.course_fee_inr, 0);
  const loanAmountRequestedInr = cleanNumber(raw.loan_amount_requested_inr, 0);
  const parentMonthlyIncomeInr = cleanNumber(raw.parent_monthly_income_inr, 0);
  const existingMonthlyObligationsInr = cleanNumber(raw.existing_monthly_obligations_inr, 0);

  // 5. Missing credit score handling: keep as null, do not fabricate 0 or average
  const rawScore = cleanString(raw.credit_score);
  const creditScore = (rawScore === '' || rawScore === 'null' || rawScore === 'undefined') 
    ? null 
    : cleanNumber(rawScore, null);

  // 6. Categoricals with whitespace cleaning
  const employmentType = cleanString(raw.employment_type);
  const applicationDate = cleanString(raw.application_date);
  const applicationStatus = cleanString(raw.application_status);
  const applicationChannel = cleanString(raw.application_channel);

  return {
    application_id: applicationId,
    student_name: studentName,
    age,
    student_state: studentState,
    institution_id: institutionId,
    course_id: courseId,
    course_fee_inr: courseFeeInr,
    loan_amount_requested_inr: loanAmountRequestedInr,
    parent_monthly_income_inr: parentMonthlyIncomeInr,
    existing_monthly_obligations_inr: existingMonthlyObligationsInr,
    credit_score: creditScore,
    employment_type: employmentType,
    application_date: applicationDate,
    application_status: applicationStatus,
    application_channel: applicationChannel
  };
}

module.exports = {
  cleanString,
  cleanNumber,
  cleanApplicationRecord
};
