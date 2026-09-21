import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';

function formatCurrencyINR(amount) {
  if (!amount) return '₹0';
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return `₹${Math.round(amount)}`;
}

export default function ChartCard({ statusData, courseData, institutionData, creditData, loading }) {
  // Color palette for status chart
  const STATUS_COLORS = {
    'Approved': '#10B981',
    'Under Review': '#F59E0B',
    'Submitted': '#3B82F6',
    'Rejected': '#EF4444'
  };

  const COURSE_COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#3B82F6', '#14B8A6', '#F97316'];

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 h-72 animate-pulse flex flex-col justify-between">
            <div className="h-4 bg-slate-100 rounded w-1/3 mb-4"></div>
            <div className="flex-1 bg-slate-50 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      
      {/* Chart 1: Applications by Status */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Applications by Status</h3>
            <p className="text-xs text-slate-500">Pipeline conversion and distribution</p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
            Total 150
          </span>
        </div>

        <div className="h-56 w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData || []}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
              >
                {(statusData || []).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STATUS_COLORS[entry.status] || '#6B7280'}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(val, name, item) => [
                  `${val} apps (${item.payload.percentage}%) • ${formatCurrencyINR(item.payload.total_amount)}`,
                  name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom scannable legend */}
        <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100 text-xs">
          {(statusData || []).map((s, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: STATUS_COLORS[s.status] || '#6B7280' }}
                />
                <span className="text-slate-600 truncate">{s.status}</span>
              </div>
              <span className="font-semibold text-slate-900 ml-1">
                {s.count} <span className="text-slate-400 font-normal">({s.percentage}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart 2: Applications by Course */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Applications by Course</h3>
            <p className="text-xs text-slate-500">Degree demand across all 10 programs</p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
            Top Degree: MBA (27)
          </span>
        </div>

        <div className="h-56 w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={(courseData || []).slice(0, 7)}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 35, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="course_name"
                tick={{ fontSize: 11 }}
                width={70}
              />
              <Tooltip
                formatter={(val, name, item) => [
                  `${val} applicants (Avg loan: ${formatCurrencyINR(item.payload.average_loan_requested)})`,
                  'Applications'
                ]}
              />
              <Bar dataKey="applications_count" fill="#4F46E5" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Highest avg ticket: <strong className="text-slate-900">MBBS (₹12.0L)</strong></span>
          <span>Lowest avg ticket: <strong className="text-slate-900">PG Dip AI (₹3.1L)</strong></span>
        </div>
      </div>

      {/* Chart 3: Applications by Institution */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Applications by Institution</h3>
            <p className="text-xs text-slate-500">Volume across top partner institutes</p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
            12 Institutions
          </span>
        </div>

        <div className="h-56 w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={(institutionData || []).slice(0, 6)}
              margin={{ top: 5, right: 10, left: -15, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="institution_name"
                tick={{ fontSize: 9 }}
                angle={-20}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(val, name, item) => [
                  `${val} total apps (${item.payload.approved_count} approved - ${item.payload.approval_rate}%)`,
                  'Applications'
                ]}
              />
              <Bar dataKey="applications_count" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Top partner: <strong className="text-slate-900">Deccan & Summit (16)</strong></span>
          <span>Total loan pipeline: <strong className="text-slate-900">₹7.49 Cr</strong></span>
        </div>
      </div>

    </div>
  );
}
