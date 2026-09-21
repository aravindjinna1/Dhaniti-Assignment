import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import KPICardsSection from '../components/KPICard';
import ChartCard from '../components/ChartCard';
import FilterBar from '../components/FilterBar';
import ApplicationTable from '../components/ApplicationTable';
import ApplicationDetails from '../components/ApplicationDetails';
import CreateApplicationModal from '../components/CreateApplicationModal';
import BusinessInsightsModal from '../components/BusinessInsightsModal';
import DataQualityModal from '../components/DataQualityModal';
import api from '../services/api';

export default function Dashboard() {
  // Data States
  const [summary, setSummary] = useState(null);
  const [statusData, setStatusData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [institutionData, setInstitutionData] = useState([]);
  const [creditData, setCreditData] = useState([]);
  const [applications, setApplications] = useState([]);
  const [filterOptions, setFilterOptions] = useState({ statuses: [], courses: [], institutions: [] });
  const [insights, setInsights] = useState([]);
  const [dataQualityReport, setDataQualityReport] = useState([]);

  // Filter & Search State
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    course: '',
    institution: '',
    sortBy: 'application_id',
    order: 'asc'
  });

  // Modal States
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [isDataQualityOpen, setIsDataQualityOpen] = useState(false);

  // Status & Loading States
  const [kpiLoading, setKpiLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Initial Load (KPIs, Charts, Meta, Insights, Data Quality)
  const loadAnalyticsData = useCallback(async () => {
    try {
      setKpiLoading(true);
      setChartsLoading(true);

      const [
        summaryRes,
        statusRes,
        courseRes,
        instRes,
        creditRes,
        filtersRes,
        insightsRes,
        dqRes
      ] = await Promise.all([
        api.getSummary(),
        api.getStatusBreakdown(),
        api.getCourseBreakdown(),
        api.getInstitutionBreakdown(),
        api.getCreditScoreBreakdown(),
        api.getFilterOptions(),
        api.getBusinessInsights(),
        api.getDataQualityReport()
      ]);

      if (summaryRes?.success) setSummary(summaryRes.data);
      if (statusRes?.success) setStatusData(statusRes.data);
      if (courseRes?.success) setCourseData(courseRes.data);
      if (instRes?.success) setInstitutionData(instRes.data);
      if (creditRes?.success) setCreditData(creditRes.data);
      if (filtersRes?.success) setFilterOptions(filtersRes.data);
      if (insightsRes?.success) setInsights(insightsRes.data);
      if (dqRes?.success) setDataQualityReport(dqRes.data);
    } catch (err) {
      console.error('Failed to load analytics data:', err);
    } finally {
      setKpiLoading(false);
      setChartsLoading(false);
    }
  }, []);

  // Fetch applications based on current filters
  const loadApplications = useCallback(async () => {
    try {
      setTableLoading(true);
      setError(null);
      const res = await api.getApplications(filters);
      if (res?.success) {
        setApplications(res.data);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
      setError(err.message || 'Error connecting to backend API');
    } finally {
      setTableLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    await Promise.all([loadAnalyticsData(), loadApplications()]);
    setIsRefreshing(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: '',
      course: '',
      institution: '',
      sortBy: 'application_id',
      order: 'asc'
    });
  };

  // Status update handler
  const handleUpdateStatus = async (applicationId, newStatus) => {
    await api.updateApplicationStatus(applicationId, newStatus);
    
    // Update local table view
    setApplications((prev) =>
      prev.map((app) =>
        app.application_id === applicationId
          ? { ...app, application_status: newStatus }
          : app
      )
    );

    // Update selected app if open
    if (selectedApplication && selectedApplication.application_id === applicationId) {
      setSelectedApplication((prev) => ({
        ...prev,
        application_status: newStatus
      }));
    }

    // Refresh KPIs and charts in background
    loadAnalyticsData();
  };

  // Create application handler
  const handleCreateApplication = async (newAppData) => {
    const res = await api.createApplication(newAppData);
    if (res?.success) {
      // Prepend to applications table
      setApplications((prev) => [res.data, ...prev]);
      // Refresh summary and charts
      loadAnalyticsData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* Top Navigation */}
      <Navbar
        onOpenCreate={() => setIsCreateOpen(true)}
        onOpenInsights={() => setIsInsightsOpen(true)}
        onOpenDataQuality={() => setIsDataQualityOpen(true)}
        onRefresh={handleRefreshAll}
        isRefreshing={isRefreshing}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Section 1: Dashboard Header & Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Education Lending Application Intelligence
            </h1>
            <p className="text-xs text-slate-500">
              Real-time portfolio metrics, academic risk profiles, and operational pipeline analytics
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Relational Store</span>
          </div>
        </div>

        {/* Section 2: KPI Summary Cards (Section 12) */}
        <section aria-label="KPI Metrics">
          <KPICardsSection summary={summary} loading={kpiLoading} />
        </section>

        {/* Section 3: Charts & Breakdowns (Section 13) */}
        <section aria-label="Visual Analytics">
          <ChartCard
            statusData={statusData}
            courseData={courseData}
            institutionData={institutionData}
            creditData={creditData}
            loading={chartsLoading}
          />
        </section>

        {/* Section 4: Filter & Search Controls (Section 14) */}
        <section aria-label="Application Filters">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            filterOptions={filterOptions}
            totalCount={applications.length}
          />
        </section>

        {/* Section 5: Applications Table (Section 14) */}
        <section aria-label="Applications Directory">
          <ApplicationTable
            applications={applications}
            loading={tableLoading}
            error={error}
            onSelectApplication={(app) => setSelectedApplication(app)}
            onQuickStatusChange={handleUpdateStatus}
          />
        </section>

      </main>

      {/* Application Details Modal (Section 15) */}
      <ApplicationDetails
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Create Application Modal (Section 16) */}
      <CreateApplicationModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onApplicationCreated={handleCreateApplication}
        filterOptions={filterOptions}
      />

      {/* Business Insights Modal (Section 19) */}
      <BusinessInsightsModal
        isOpen={isInsightsOpen}
        onClose={() => setIsInsightsOpen(false)}
        insights={insights}
      />

      {/* Data Quality Modal (Section 18) */}
      <DataQualityModal
        isOpen={isDataQualityOpen}
        onClose={() => setIsDataQualityOpen(false)}
        report={dataQualityReport}
      />

    </div>
  );
}
