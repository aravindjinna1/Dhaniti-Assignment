import React, { useState } from 'react';
import { X, CheckCircle2, Clock, XCircle, AlertTriangle, ShieldCheck, User, Building, BookOpen, IndianRupee } from 'lucide-react';

function formatCurrencyINR(amount) {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export default function ApplicationDetails({
  application,
  onClose,
  onUpdateStatus
}) {
  const [selectedStatus, setSelectedStatus] = useState(application?.application_status || 'Submitted');
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (!application) return null;

  const handleStatusChange = async () => {
    if (selectedStatus === application.application_status) return;
    setIsUpdating(true);
    setStatusMessage('');
    try {
      await onUpdateStatus(application.application_id, selectedStatus);
      setStatusMessage('Status updated successfully!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      setStatusMessage('Failed to update status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const income = Number(application.parent_monthly_income_inr) || 0;
  const obligations = Number(application.existing_monthly_obligations_inr) || 0;
  const foir = income > 0 ? ((obligations / income) * 100).toFixed(1) : 'N/A';
  const fee = Number(application.course_fee_inr) || 0;
  const loan = Number(application.loan_amount_requested_inr) || 0;
  const loanRatio = fee > 0 ? ((loan / fee) * 100).toFixed(1) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 sm:p-6 backdrop-blur-2xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              {application.application_id}
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">{application.student_name}</h2>
              <p className="text-xs text-slate-500">Application Date: {application.application_date}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 text-sm">
          
          {/* Status Update Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">
                Current Application Status
              </span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">{application.application_status}</span>
                <span className="text-slate-400">•</span>
                <span className="text-xs text-slate-500">Via {application.application_channel}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="py-1.5 px-3 text-xs font-medium bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>

              <button
                onClick={handleStatusChange}
                disabled={isUpdating || selectedStatus === application.application_status}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 rounded-lg transition-colors shadow-2xs"
              >
                {isUpdating ? 'Saving...' : 'Update'}
              </button>
            </div>
          </div>

          {statusMessage && (
            <div className={`p-2.5 rounded-lg text-xs font-medium ${statusMessage.includes('Failed') ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
              {statusMessage}
            </div>
          )}

          {/* Illustrative Attention Level (Section 21) */}
          <div className={`p-4 rounded-xl border ${application.attention_level === 'High Attention' ? 'bg-rose-50/70 border-rose-200' : application.attention_level === 'Review Required' ? 'bg-amber-50/70 border-amber-200' : 'bg-emerald-50/70 border-emerald-200'}`}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className={`w-4 h-4 ${application.attention_level === 'High Attention' ? 'text-rose-600' : application.attention_level === 'Review Required' ? 'text-amber-600' : 'text-emerald-600'}`} />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Illustrative Attention Level: {application.attention_level}
              </span>
            </div>
            <ul className="text-xs text-slate-600 list-disc list-inside mt-1 space-y-0.5">
              {application.attention_reasons?.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
            <p className="text-2xs text-slate-400 mt-2 italic">
              Notice: Illustrative rule-based analytics feature. Does not constitute real lending underwriting criteria.
            </p>
          </div>

          {/* Student & Demographics */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              <User className="w-3.5 h-3.5" />
              <span>Student & Demographic Profile</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
              <div>
                <span className="text-2xs text-slate-400 uppercase block">Age</span>
                <span className="font-semibold text-slate-800">{application.age} years</span>
              </div>
              <div>
                <span className="text-2xs text-slate-400 uppercase block">State</span>
                <span className="font-semibold text-slate-800">{application.student_state}</span>
              </div>
              <div>
                <span className="text-2xs text-slate-400 uppercase block">Employment Category</span>
                <span className="font-semibold text-slate-800">{application.employment_type}</span>
              </div>
              <div>
                <span className="text-2xs text-slate-400 uppercase block">Credit Score</span>
                <span className="font-semibold text-slate-800">
                  {application.credit_score !== null ? application.credit_score : 'Missing in CSV'}
                </span>
              </div>
            </div>
          </div>

          {/* Academic Profile */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Course & Academic Institution</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
              <div>
                <span className="text-2xs text-slate-400 uppercase block">Course Program</span>
                <span className="font-semibold text-slate-900">{application.course_name}</span>
                <span className="text-xs text-slate-500 block">Domain: {application.course_domain}</span>
              </div>
              <div>
                <span className="text-2xs text-slate-400 uppercase block">Institution Master</span>
                <span className="font-semibold text-slate-900">{application.institution_name}</span>
                <span className="text-xs text-slate-500 block">
                  {application.institution_type} • {application.institution_city}, {application.institution_state}
                </span>
              </div>
            </div>
          </div>

          {/* Financial Profile */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Financial & Obligation Metrics</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
              <div>
                <span className="text-2xs text-slate-400 uppercase block">Total Course Fee</span>
                <span className="font-semibold text-slate-900">{formatCurrencyINR(application.course_fee_inr)}</span>
              </div>
              <div>
                <span className="text-2xs text-slate-400 uppercase block">Loan Requested</span>
                <span className="font-semibold text-indigo-700">{formatCurrencyINR(application.loan_amount_requested_inr)}</span>
                <span className="text-2xs text-slate-400 block">{loanRatio}% of fee</span>
              </div>
              <div>
                <span className="text-2xs text-slate-400 uppercase block">Parent Monthly Income</span>
                <span className="font-semibold text-slate-900">{formatCurrencyINR(application.parent_monthly_income_inr)}</span>
              </div>
              <div>
                <span className="text-2xs text-slate-400 uppercase block">Existing Obligations</span>
                <span className="font-semibold text-slate-900">{formatCurrencyINR(application.existing_monthly_obligations_inr)}</span>
                <span className="text-2xs text-slate-400 block">FOIR: {foir}%</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
