import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const CHART_COLORS = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#F97316', '#14B8A6'];

function formatCurrencyINR(amount) {
  const value = Number(amount) || 0;
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
}

function ChartShell({ title, subtitle, children }) {
  return (
    <article className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs" style={{ minWidth: 0 }}>
      <header className="mb-4">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </header>
      {children}
    </article>
  );
}

export default function ChartCard({ statusData = [], courseData = [], institutionData = [], loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-[360px] bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
            <div className="h-4 bg-slate-100 rounded w-2/5" />
            <div className="h-[285px] bg-slate-50 rounded mt-5" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <ChartShell title="Applications by Status" subtitle="Pipeline conversion and distribution">
        <div className="w-full" style={{ height: 285, minWidth: 0 }} aria-label="Bar chart of applications by status">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} margin={{ top: 24, right: 8, left: -18, bottom: 14 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="status" tick={{ fontSize: 11, fill: '#475569' }} interval={0} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#475569' }} />
              <Tooltip
                cursor={{ fill: '#F8FAFC' }}
                formatter={(value, _name, item) => [`${value} applications (${item.payload.percentage}%)`, 'Applications']}
                labelFormatter={(label) => `Status: ${label}`}
              />
              <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={entry.status} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
                <LabelList dataKey="count" position="top" fill="#334155" fontSize={11} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartShell>

      <ChartShell title="Applications by Course" subtitle="Application volume across all available courses">
        <div className="w-full" style={{ height: 285, minWidth: 0 }} aria-label="Bar chart of applications by course">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={courseData} margin={{ top: 24, right: 4, left: -18, bottom: 72 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="course_name"
                tick={{ fontSize: 10, fill: '#475569' }}
                angle={-38}
                textAnchor="end"
                interval={0}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#475569' }} />
              <Tooltip
                cursor={{ fill: '#F8FAFC' }}
                formatter={(value, _name, item) => [
                  `${value} applications · Avg request: ${formatCurrencyINR(item.payload.average_loan_requested)}`,
                  'Applications'
                ]}
                labelFormatter={(label) => `Course: ${label}`}
              />
              <Bar dataKey="applications_count" radius={[5, 5, 0, 0]} fill="#4F46E5">
                <LabelList dataKey="applications_count" position="top" fill="#334155" fontSize={10} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartShell>

      <ChartShell title="Applications by Institution" subtitle="Application volume across partner institutions">
        <div className="w-full" style={{ height: 285, minWidth: 0 }} aria-label="Horizontal bar chart of applications by institution">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={institutionData}
              layout="vertical"
              margin={{ top: 4, right: 28, left: 34, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#475569' }} />
              <YAxis
                type="category"
                dataKey="institution_name"
                width={126}
                tick={{ fontSize: 10, fill: '#475569' }}
              />
              <Tooltip
                cursor={{ fill: '#F8FAFC' }}
                formatter={(value, _name, item) => [
                  `${value} applications · ${item.payload.approved_count} approved (${item.payload.approval_rate}%) · ${formatCurrencyINR(item.payload.total_loan_requested)}`,
                  'Applications'
                ]}
                labelFormatter={(label) => `Institution: ${label}`}
              />
              <Bar dataKey="applications_count" fill="#0EA5E9" radius={[0, 5, 5, 0]}>
                <LabelList dataKey="applications_count" position="right" fill="#334155" fontSize={10} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartShell>
    </div>
  );
}
