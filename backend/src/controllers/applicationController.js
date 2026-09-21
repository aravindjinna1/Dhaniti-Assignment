const applicationService = require('../services/applicationService');
const db = require('../db');

// GET /api/applications
async function getAllApplications(req, res) {
  try {
    const { search, status, course, institution, sortBy, order } = req.query;
    const applications = await applicationService.listApplications({
      search,
      status,
      course,
      institution,
      sortBy,
      order
    });
    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ success: false, error: 'Unable to load applications.' });
  }
}

// GET /api/applications/:id
async function getApplication(req, res) {
  try {
    const { id } = req.params;
    const application = await applicationService.getApplicationById(id);
    if (!application) {
      return res.status(404).json({ success: false, error: `Application ${id} not found.` });
    }
    res.json({ success: true, data: application });
  } catch (err) {
    console.error('Error fetching application:', err);
    res.status(500).json({ success: false, error: 'Unable to load application details.' });
  }
}

// POST /api/applications
async function createApplication(req, res) {
  try {
    const newApp = await applicationService.createApplication(req.body);
    res.status(201).json({
      success: true,
      message: 'Application created successfully.',
      data: newApp
    });
  } catch (err) {
    console.error('Error creating application:', err);
    res.status(400).json({ success: false, error: err.message || 'Unable to create application.' });
  }
}

// PATCH /api/applications/:id/status
async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required in request body.' });
    }

    const updatedApp = await applicationService.updateApplicationStatus(id, status);
    res.json({
      success: true,
      message: `Status updated to "${status}" successfully.`,
      data: updatedApp
    });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(400).json({ success: false, error: err.message || 'Unable to update application status.' });
  }
}

// GET /api/meta/filters
async function getFilterOptions(req, res) {
  try {
    const store = db.getInMemoryStore();
    res.json({
      success: true,
      data: {
        statuses: store.statuses.map(s => s.status),
        courses: store.courses.map(c => ({ course_id: c.course_id, course_name: c.course_name })),
        institutions: store.institutions.map(i => ({ institution_id: i.institution_id, institution_name: i.institution_name }))
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Unable to load filter options.' });
  }
}

module.exports = {
  getAllApplications,
  getApplication,
  createApplication,
  updateStatus,
  getFilterOptions
};
