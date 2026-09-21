const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

// GET /api/applications - List with search, filter, sort
router.get('/', applicationController.getAllApplications);

// GET /api/applications/meta/filters - Dropdown options
router.get('/meta/filters', applicationController.getFilterOptions);

// GET /api/applications/:id - View single application
router.get('/:id', applicationController.getApplication);

// POST /api/applications - Create new application
router.post('/', applicationController.createApplication);

// PATCH /api/applications/:id/status - Update application status
router.patch('/:id/status', applicationController.updateStatus);

module.exports = router;
