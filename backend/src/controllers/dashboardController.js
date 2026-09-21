const dashboardService = require('../services/dashboardService');

async function getSummary(req, res) {
  try {
    const summary = await dashboardService.getDashboardSummary();
    res.json({ success: true, data: summary });
  } catch (err) {
    console.error('Error fetching summary:', err);
    res.status(500).json({ success: false, error: 'Unable to load dashboard summary.' });
  }
}

async function getStatusStats(req, res) {
  try {
    const stats = await dashboardService.getStatusBreakdown();
    res.json({ success: true, data: stats });
  } catch (err) {
    console.error('Error fetching status stats:', err);
    res.status(500).json({ success: false, error: 'Unable to load status metrics.' });
  }
}

async function getCourseStats(req, res) {
  try {
    const stats = await dashboardService.getCourseBreakdown();
    res.json({ success: true, data: stats });
  } catch (err) {
    console.error('Error fetching course stats:', err);
    res.status(500).json({ success: false, error: 'Unable to load course metrics.' });
  }
}

async function getInstitutionStats(req, res) {
  try {
    const stats = await dashboardService.getInstitutionBreakdown();
    res.json({ success: true, data: stats });
  } catch (err) {
    console.error('Error fetching institution stats:', err);
    res.status(500).json({ success: false, error: 'Unable to load institution metrics.' });
  }
}

async function getCreditScoreStats(req, res) {
  try {
    const stats = await dashboardService.getCreditScoreDistribution();
    res.json({ success: true, data: stats });
  } catch (err) {
    console.error('Error fetching credit score stats:', err);
    res.status(500).json({ success: false, error: 'Unable to load credit score metrics.' });
  }
}

async function getInsights(req, res) {
  try {
    const insights = await dashboardService.getBusinessInsights();
    res.json({ success: true, data: insights });
  } catch (err) {
    console.error('Error fetching insights:', err);
    res.status(500).json({ success: false, error: 'Unable to load business insights.' });
  }
}

async function getDataQualityReport(req, res) {
  try {
    const report = await dashboardService.getDataQualityAudit();
    res.json({ success: true, data: report });
  } catch (err) {
    console.error('Error fetching data quality report:', err);
    res.status(500).json({ success: false, error: 'Unable to load data quality report.' });
  }
}

module.exports = {
  getSummary,
  getStatusStats,
  getCourseStats,
  getInstitutionStats,
  getCreditScoreStats,
  getInsights,
  getDataQualityReport
};
