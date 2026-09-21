/**
 * Dhaniti Dashboard API Service
 * Centralized HTTP Client utilizing standard fetch.
 * Reads backend URL from VITE_API_BASE_URL (defaults to /api).
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`[API Error] Request failed on ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // Summary & KPIs
  getSummary: () => request('/dashboard/summary'),
  
  // Charts & Breakdowns
  getStatusBreakdown: () => request('/dashboard/status'),
  getCourseBreakdown: () => request('/dashboard/courses'),
  getInstitutionBreakdown: () => request('/dashboard/institutions'),
  getCreditScoreBreakdown: () => request('/dashboard/credit-scores'),
  
  // Business Insights & Data Quality
  getBusinessInsights: () => request('/dashboard/insights'),
  getDataQualityReport: () => request('/dashboard/data-quality'),

  // Filter options
  getFilterOptions: () => request('/applications/meta/filters'),

  // Applications
  getApplications: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    if (params.course) query.append('course', params.course);
    if (params.institution) query.append('institution', params.institution);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.order) query.append('order', params.order);

    const qs = query.toString();
    return request(`/applications${qs ? `?${qs}` : ''}`);
  },

  getApplicationById: (id) => request(`/applications/${id}`),

  createApplication: (data) => request('/applications', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  updateApplicationStatus: (id, status) => request(`/applications/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
};

export default api;
