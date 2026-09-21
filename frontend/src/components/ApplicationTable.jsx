import React from 'react';
import { ChevronRight, AlertCircle, AlertTriangle, CheckCircle, Clock, XCircle, ArrowUpRight } from 'lucide-react';

function formatCurrencyINR(amount) {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export default function ApplicationTable({
  applications,
  loading,
  error,
  onSelectApplication,
  onQuickStatusChange
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            Approved
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-500" />
            Under Review
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-500" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-500" />
            Submitted
          </span>
        );
    }
  };

  const getAttentionBadge = (level) => {
    switch (level) {
      case 'High Attention':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            High Attention
          </span>
        );
      case 'Review Required':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            Review Required
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
            Low Attention
          </span>
        );
    }
  };

  const getCreditScoreBadge = (score) => {
    if (score === null || score === undefined || score === '') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200" title="Missing in source record (EDU1092)">
          N/A (Missing)
        </span>
      );
    }
    const num = Number(score);
    if (num >= 750) {
      return <span className="font-semibold text-emerald-700">{num}</span>;
    }
    if (num >= 650) {
      return <span className="font-semibold text-indigo-700">{num}</span>;
    }
    if (num >= 600) {
      return <span className="font-semibold text-amber-700">{num}</span>;
    }
    return <span className="font-semibold text-rose-700">{num}</span>;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-xs">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3"></div>
        <p className="text-sm text-slate-600">Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-rose-200 p-8 text-center shadow-xs">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
        <p className="text-sm font-semibold text-rose-700">Unable to load applications.</p>
        <p className="text-xs text-slate-500 mt-1">{error}</p>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
        <p className="text-base font-semibold text-slate-800">No applications found.</p>
        <p className="text-xs text-slate-500 mt-1">Try clearing filters or changing your search term.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-700 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Application ID</th>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Course</th>
              <th className="py-3 px-4">Institution</th>
              <th className="py-3 px-4 text-right">Loan Requested</th>
              <th className="py-3 px-4 text-center">Credit Score</th>
              <th className="py-3 px-4">Attention Level</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applications.map((app) => (
              <tr
                key={app.application_id}
                onClick={() => onSelectApplication(app)}
                className="hover:bg-slate-50/80 cursor-pointer transition-colors"
              >
                {/* ID */}
                <td className="py-3 px-4 font-mono font-semibold text-indigo-600 whitespace-nowrap">
                  {app.application_id}
                </td>

                {/* Student */}
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-900">{app.student_name}</div>
                  <div className="text-slate-400 text-2xs">
                    Age {app.age} • {app.student_state}
                  </div>
                </td>

                {/* Course */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="font-medium text-slate-900">{app.course_name}</div>
                  <div className="text-slate-400 text-2xs">{app.course_domain}</div>
                </td>

                {/* Institution */}
                <td className="py-3 px-4">
                  <div className="font-medium text-slate-800 line-clamp-1" title={app.institution_name}>
                    {app.institution_name}
                  </div>
                  <div className="text-slate-400 text-2xs">{app.institution_city || app.institution_state}</div>
                </td>

                {/* Loan Amount */}
                <td className="py-3 px-4 text-right font-semibold text-slate-900 whitespace-nowrap">
                  {formatCurrencyINR(app.loan_amount_requested_inr)}
                </td>

                {/* Credit Score */}
                <td className="py-3 px-4 text-center whitespace-nowrap">
                  {getCreditScoreBadge(app.credit_score)}
                </td>

                {/* Attention Level */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {getAttentionBadge(app.attention_level)}
                </td>

                {/* Status */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {getStatusBadge(app.application_status)}
                </td>

                {/* Action */}
                <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onSelectApplication(app)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-colors"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
