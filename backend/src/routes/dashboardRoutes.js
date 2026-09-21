const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// GET /api/dashboard/summary - KPI Cards
router.get('/summary', dashboardController.getSummary);

// GET /api/dashboard/status - Status breakdown
router.get('/status', dashboardController.getStatusStats);

// GET /api/dashboard/courses - Course distribution & avg fees
router.get('/courses', dashboardController.getCourseStats);

// GET /api/dashboard/institutions - Institution distribution & approvals
router.get('/institutions', dashboardController.getInstitutionStats);

// GET /api/dashboard/credit-scores - Credit score bracket distribution
router.get('/credit-scores', dashboardController.getCreditScoreStats);

// GET /api/dashboard/insights - 5 Calculated real business insights
router.get('/insights', dashboardController.getInsights);

// GET /api/dashboard/data-quality - Documented audit of actual issues
router.get('/data-quality', dashboardController.getDataQualityReport);

module.exports = router;
