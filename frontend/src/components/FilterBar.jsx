import React from 'react';
import { Search, RotateCcw, Filter, ArrowUpDown } from 'lucide-react';

export default function FilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  filterOptions,
  totalCount
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        
        {/* Search input */}
        <div className="lg:col-span-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search student or ID (e.g. Ishita or EDU1001)..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Under Review">Under Review</option>
            <option value="Submitted">Submitted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Course Filter */}
        <div>
          <select
            value={filters.course}
            onChange={(e) => onFilterChange('course', e.target.value)}
            className="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700"
          >
            <option value="">All Courses</option>
            {filterOptions?.courses?.map((c) => (
              <option key={c.course_id} value={c.course_name}>
                {c.course_name}
              </option>
            ))}
          </select>
        </div>

        {/* Institution Filter */}
        <div>
          <select
            value={filters.institution}
            onChange={(e) => onFilterChange('institution', e.target.value)}
            className="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700"
          >
            <option value="">All Institutions</option>
            {filterOptions?.institutions?.map((i) => (
              <option key={i.institution_id} value={i.institution_name}>
                {i.institution_name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Controls */}
        <div className="flex gap-2">
          <select
            value={`${filters.sortBy}-${filters.order}`}
            onChange={(e) => {
              const [sortBy, order] = e.target.value.split('-');
              onFilterChange('sortBy', sortBy);
              onFilterChange('order', order);
            }}
            className="w-full py-2 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700"
          >
            <option value="application_id-asc">Sort: ID (Default)</option>
            <option value="loan_amount-desc">Loan (High to Low)</option>
            <option value="loan_amount-asc">Loan (Low to High)</option>
            <option value="credit_score-desc">Credit Score (High to Low)</option>
            <option value="credit_score-asc">Credit Score (Low to High)</option>
            <option value="application_date-desc">Date (Newest first)</option>
            <option value="student_name-asc">Student Name (A-Z)</option>
          </select>

          {/* Reset button */}
          {(filters.search || filters.status || filters.course || filters.institution || filters.sortBy !== 'application_id' || filters.order !== 'asc') && (
            <button
              onClick={onResetFilters}
              title="Reset Filters"
              className="px-2.5 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Filter status row */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Showing <strong className="text-slate-900 font-semibold">{totalCount}</strong> applications</span>
          {(filters.search || filters.status || filters.course || filters.institution) && (
            <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-medium">
              Filtered results
            </span>
          )}
        </div>

        <span className="text-slate-400 hidden sm:inline">
          Click any row to open full financial underwriting view
        </span>
      </div>
    </div>
  );
}
