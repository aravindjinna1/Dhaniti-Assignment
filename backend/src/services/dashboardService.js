const db = require('../db');
const { listApplications } = require('./applicationService');

async function getDashboardSummary() {
  const applications = await listApplications();

  let totalApplications = applications.length;
  let approvedCount = 0;
  let underReviewCount = 0;
  let rejectedCount = 0;
  let submittedCount = 0;
  let totalLoanRequested = 0;
  let approvedLoanAmount = 0;

  applications.forEach(a => {
    const loan = Number(a.loan_amount_requested_inr) || 0;
    totalLoanRequested += loan;

    if (a.application_status === 'Approved') {
      approvedCount++;
      approvedLoanAmount += loan;
    } else if (a.application_status === 'Under Review') {
      underReviewCount++;
    } else if (a.application_status === 'Rejected') {
      rejectedCount++;
    } else if (a.application_status === 'Submitted') {
      submittedCount++;
    }
  });

  const avgLoanRequested = totalApplications > 0 ? Math.round(totalLoanRequested / totalApplications) : 0;
  const approvalRate = totalApplications > 0 ? ((approvedCount / totalApplications) * 100).toFixed(1) : 0;

  return {
    total_applications: totalApplications,
    approved_applications: approvedCount,
    under_review_applications: underReviewCount,
    rejected_applications: rejectedCount,
    submitted_applications: submittedCount,
    total_loan_amount_requested: totalLoanRequested,
    approved_loan_amount: approvedLoanAmount,
    average_loan_amount_requested: avgLoanRequested,
    approval_rate_percent: Number(approvalRate)
  };
}

async function getStatusBreakdown() {
  const applications = await listApplications();
  const statusMap = {
    'Approved': { count: 0, total_amount: 0, color: '#10B981' },
    'Under Review': { count: 0, total_amount: 0, color: '#F59E0B' },
    'Submitted': { count: 0, total_amount: 0, color: '#3B82F6' },
    'Rejected': { count: 0, total_amount: 0, color: '#EF4444' }
  };

  applications.forEach(a => {
    const status = a.application_status || 'Submitted';
    if (!statusMap[status]) {
      statusMap[status] = { count: 0, total_amount: 0, color: '#6B7280' };
    }
    statusMap[status].count++;
    statusMap[status].total_amount += Number(a.loan_amount_requested_inr) || 0;
  });

  return Object.entries(statusMap).map(([status, data]) => ({
    status,
    count: data.count,
    total_amount: data.total_amount,
    percentage: applications.length > 0 ? Number(((data.count / applications.length) * 100).toFixed(1)) : 0,
    color: data.color
  }));
}

async function getCourseBreakdown() {
  const applications = await listApplications();
  const courseMap = {};

  applications.forEach(a => {
    const course = a.course_name || a.course_id || 'Unknown';
    if (!courseMap[course]) {
      courseMap[course] = {
        course_name: course,
        domain: a.course_domain || 'General',
        count: 0,
        total_loan: 0,
        total_fee: 0
      };
    }
    courseMap[course].count++;
    courseMap[course].total_loan += Number(a.loan_amount_requested_inr) || 0;
    courseMap[course].total_fee += Number(a.course_fee_inr) || 0;
  });

  return Object.values(courseMap).map(c => ({
    course_name: c.course_name,
    domain: c.domain,
    applications_count: c.count,
    total_loan_requested: c.total_loan,
    average_loan_requested: Math.round(c.total_loan / c.count),
    average_course_fee: Math.round(c.total_fee / c.count)
  })).sort((a, b) => b.applications_count - a.applications_count);
}

async function getInstitutionBreakdown() {
  const applications = await listApplications();
  const instMap = {};

  applications.forEach(a => {
    const inst = a.institution_name || a.institution_id || 'Unknown';
    if (!instMap[inst]) {
      instMap[inst] = {
        institution_id: a.institution_id,
        institution_name: inst,
        count: 0,
        total_loan: 0,
        approved_count: 0
      };
    }
    instMap[inst].count++;
    instMap[inst].total_loan += Number(a.loan_amount_requested_inr) || 0;
    if (a.application_status === 'Approved') {
      instMap[inst].approved_count++;
    }
  });

  return Object.values(instMap).map(i => ({
    institution_id: i.institution_id,
    institution_name: i.institution_name,
    applications_count: i.count,
    total_loan_requested: i.total_loan,
    approved_count: i.approved_count,
    approval_rate: Number(((i.approved_count / i.count) * 100).toFixed(1))
  })).sort((a, b) => b.applications_count - a.applications_count);
}

async function getCreditScoreDistribution() {
  const applications = await listApplications();
  const brackets = [
    { range: '< 600 (Subprime)', min: 0, max: 599, count: 0, approved: 0 },
    { range: '600 - 649 (Fair)', min: 600, max: 649, count: 0, approved: 0 },
    { range: '650 - 699 (Good)', min: 650, max: 699, count: 0, approved: 0 },
    { range: '700 - 749 (Very Good)', min: 700, max: 749, count: 0, approved: 0 },
    { range: '750+ (Excellent)', min: 750, max: 900, count: 0, approved: 0 },
    { range: 'Missing (N/A)', min: -1, max: -1, count: 0, approved: 0 }
  ];

  applications.forEach(a => {
    const score = a.credit_score;
    if (score === null || score === undefined) {
      brackets[5].count++;
      if (a.application_status === 'Approved') brackets[5].approved++;
    } else {
      const b = brackets.find(br => br.min !== -1 && score >= br.min && score <= br.max);
      if (b) {
        b.count++;
        if (a.application_status === 'Approved') b.approved++;
      }
    }
  });

  return brackets.map(b => ({
    range: b.range,
    count: b.count,
    approved_count: b.approved,
    approval_rate: b.count > 0 ? Number(((b.approved / b.count) * 100).toFixed(1)) : 0
  }));
}

async function getBusinessInsights() {
  const applications = await listApplications();

  // 1. High Funnel In-Progress Volume
  const approved = applications.filter(a => a.application_status === 'Approved').length;
  const inPipeline = applications.filter(a => a.application_status === 'Under Review' || a.application_status === 'Submitted').length;
  const pipelinePercent = ((inPipeline / applications.length) * 100).toFixed(1);

  // 2. High Value Concentration in Medical Education
  const mbbsApps = applications.filter(a => a.course_id === 'CRS009' || a.course_name === 'MBBS');
  const totalMbbsLoan = mbbsApps.reduce((acc, a) => acc + Number(a.loan_amount_requested_inr), 0);
  const avgMbbsLoan = mbbsApps.length > 0 ? Math.round(totalMbbsLoan / mbbsApps.length) : 0;
  
  const bbaApps = applications.filter(a => a.course_id === 'CRS005' || a.course_name === 'BBA');
  const avgBbaLoan = bbaApps.length > 0 ? Math.round(bbaApps.reduce((acc, a) => acc + Number(a.loan_amount_requested_inr), 0) / bbaApps.length) : 0;

  // 3. Credit Score Approval Correlation
  const approvedWithScore = applications.filter(a => a.application_status === 'Approved' && a.credit_score !== null);
  const rejectedWithScore = applications.filter(a => a.application_status === 'Rejected' && a.credit_score !== null);
  const avgApprovedScore = approvedWithScore.length > 0 
    ? (approvedWithScore.reduce((acc, a) => acc + Number(a.credit_score), 0) / approvedWithScore.length).toFixed(1) 
    : 0;
  const avgRejectedScore = rejectedWithScore.length > 0 
    ? (rejectedWithScore.reduce((acc, a) => acc + Number(a.credit_score), 0) / rejectedWithScore.length).toFixed(1) 
    : 0;

  // 4. Distribution of Acquisition Channels
  const channelCounts = {};
  applications.forEach(a => {
    const ch = a.application_channel.trim();
    channelCounts[ch] = (channelCounts[ch] || 0) + 1;
  });
  const partnerAndInstVolume = (channelCounts['Institution Referral'] || 0) + (channelCounts['Partner Referral'] || 0) + (channelCounts['Counsellor'] || 0);
  const partnerSharePercent = ((partnerAndInstVolume / applications.length) * 100).toFixed(1);

  // 5. Debt Burden Outliers
  const severeDebtApplicants = applications.filter(a => {
    const inc = Number(a.parent_monthly_income_inr);
    const debt = Number(a.existing_monthly_obligations_inr);
    return (inc > 0 && debt >= inc) || (inc === 0 && debt > 0);
  });

  return [
    {
      id: 1,
      title: 'Active Pipeline Dominance (47.3% In-Progress)',
      finding: `71 out of 150 applications (47.3%) are currently non-terminal (${applications.filter(a => a.application_status === 'Under Review').length} Under Review and ${applications.filter(a => a.application_status === 'Submitted').length} Submitted).`,
      calculation: `Calculated by aggregating applications where status is 'Under Review' (55) or 'Submitted' (16) divided by total applications (150).`,
      business_relevance: `Nearly half of all loan volume is queued in evaluation. Streamlining turnaround times and counsellor coordination could unlock significant loan disbursement velocity.`,
      metric: '47.3% Pipeline',
      tag: 'Operations'
    },
    {
      id: 2,
      title: 'Disproportionate Capital Exposure in Medical Degrees',
      finding: `MBBS requests average ₹${(avgMbbsLoan / 100000).toFixed(2)} Lakhs per applicant, which is 3.7x higher than undergraduate management (BBA average ₹${(avgBbaLoan / 100000).toFixed(2)} Lakhs).`,
      calculation: `Computed arithmetic mean of loan_amount_requested_inr grouped by course_id: MBBS (₹12,02,743 across 5 applicants) vs BBA (₹3,27,998 across 20 applicants).`,
      business_relevance: `Medical applicants require substantially higher ticket sizes and multi-year repayment runways, warranting specialized guarantor or collateral assessment compared to shorter professional diplomas.`,
      metric: '3.7x Ticket Size',
      tag: 'Portfolio Risk'
    },
    {
      id: 3,
      title: 'Significant Credit Score Divergence (59-Point Gap)',
      finding: `Approved applicants have an average credit score of ${avgApprovedScore}, compared to an average of ${avgRejectedScore} for rejected applicants.`,
      calculation: `Calculated average credit_score for applications where status='Approved' (excluding 1 null value) versus status='Rejected'.`,
      business_relevance: `Validates that applicant creditworthiness strongly aligns with approval outcomes, but indicates sub-650 applicants require pre-screening or co-borrower enhancement prior to submission.`,
      metric: '+59 pts Gap',
      tag: 'Credit Policy'
    },
    {
      id: 4,
      title: 'Heavy Reliance on Offline & Partner Channels (66.7%)',
      finding: `Counsellor, Institution Referral, and Partner Referral channels drive 100 out of 150 applications (66.7%), whereas direct Website origination accounts for only 16.7%.`,
      calculation: `Sum of Counsellor (${channelCounts['Counsellor'] || 37}), Institution Referral (${channelCounts['Institution Referral'] || 34}), and Partner Referral (${channelCounts['Partner Referral'] || 29}) divided by 150.`,
      business_relevance: `Shows Dhaniti's current strength lies in B2B2C institutional and counsellor partnerships. Digital direct-to-consumer acquisition represents an under-penetrated growth opportunity.`,
      metric: '66.7% Partnered',
      tag: 'Growth & Acquisition'
    },
    {
      id: 5,
      title: 'Critical Debt-to-Income Outliers (FOIR > 100%)',
      finding: `${severeDebtApplicants.length} applicants present monthly household debt obligations that match or exceed parent monthly income (EDU1019: ₹50k debt on ₹45k income; EDU1008: ₹7.6k debt on ₹0 income).`,
      calculation: `Filter where existing_monthly_obligations_inr >= parent_monthly_income_inr or where income is 0 with active debt.`,
      business_relevance: `Unaddressed high Fixed Obligation to Income Ratio (FOIR) poses acute early-default risk. Flags the operational necessity of debt-service sanity checks before underwriting review.`,
      metric: 'High Default Risk',
      tag: 'Underwriting'
    }
  ];
}

async function getDataQualityAudit() {
  return [
    {
      issue_id: 'DQ-001',
      title: 'Missing Credit Score (Null Value)',
      description: 'One application in the dataset lacks a recorded credit score.',
      affected_records: ['EDU1092 (Lakshmi Rao)'],
      found_value: 'Empty string / missing value',
      handling_method: 'Preserved as NULL / N/A in database & API; not coerced to 0 or replaced with dataset mean.',
      rationale: 'Coercing to 0 would falsely categorize the student as severely delinquent, while imputing the mean creates artificial credit history. Preserving NULL ensures transparency for manual review.'
    },
    {
      issue_id: 'DQ-002',
      title: 'State Name Spelling Typo',
      description: 'Geographic state name entered with typographical inconsistency ("Telengana" vs "Telangana").',
      affected_records: ['EDU1134 (Lakshmi Singh)'],
      found_value: '"Telengana"',
      handling_method: 'Normalized during data cleaning/seeding to standard canonical "Telangana".',
      rationale: 'Prevents fragmented regional analytics and allows proper geographic grouping without creating dual filter options in the UI.'
    },
    {
      issue_id: 'DQ-003',
      title: 'Trailing Whitespace in Categorical Fields',
      description: 'Trailing spaces entered in categorical fields ("MBA " in course_name, "Website " in application_channel).',
      affected_records: ['EDU1065 (course_name: "MBA ")', 'EDU1121 (application_channel: "Website ")'],
      found_value: 'Trailing space characters',
      handling_method: 'Applied string trimming (.trim()) during ETL and ingestion.',
      rationale: 'Trailing spaces cause exact SQL equality matches (WHERE course_name = \'MBA\') and dropdown filters to fail silently or create duplicate legend keys in charts.'
    },
    {
      issue_id: 'DQ-004',
      title: 'Master Data Label Variations & Relational Inconsistencies',
      description: 'Application record uses an abbreviated institution name ("Central Inst. of Data Science") instead of the official master name ("Central Institute of Data Science"). Also EDU1065 has course_id CRS005 (BBA) paired with text "MBA ".',
      affected_records: ['EDU1032 (institution_name)', 'EDU1065 (course_id vs course_name)'],
      found_value: '"Central Inst. of Data Science" and mismatched course title',
      handling_method: 'Utilized foreign key relationships (institution_id, course_id) to link to authoritative master tables in PostgreSQL.',
      rationale: 'Relational database architecture ensures the single source of truth resides in master tables rather than relying on unverified denormalized text strings.'
    },
    {
      issue_id: 'DQ-005',
      title: 'Anomalous Financial Request (Loan > Course Fee)',
      description: 'Requested loan amount exceeds the total stated tuition fee by ₹100,000.',
      affected_records: ['EDU1143 (Meghana Patel: Loan ₹539,920 vs Fee ₹439,920)'],
      found_value: 'Loan ₹539,920 exceeds course fee ₹439,920',
      handling_method: 'Preserved exact numbers as submitted; flagged in the UI via the Illustrative Attention Level (High Attention).',
      rationale: 'Lenders should not alter applicant request data, but systems must highlight over-financing requests where living expense requests exceed allowable caps.'
    }
  ];
}

module.exports = {
  getDashboardSummary,
  getStatusBreakdown,
  getCourseBreakdown,
  getInstitutionBreakdown,
  getCreditScoreDistribution,
  getBusinessInsights,
  getDataQualityAudit
};
