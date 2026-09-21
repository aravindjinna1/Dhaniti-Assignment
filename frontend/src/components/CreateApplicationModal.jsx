import React, { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';

export default function CreateApplicationModal({
  isOpen,
  onClose,
  onApplicationCreated,
  filterOptions
}) {
  const [formData, setFormData] = useState({
    student_name: '',
    age: 21,
    student_state: 'Telangana',
    institution_id: filterOptions?.institutions?.[0]?.institution_id || 'INS001',
    course_id: filterOptions?.courses?.[0]?.course_id || 'CRS001',
    course_fee_inr: 850000,
    loan_amount_requested_inr: 500000,
    parent_monthly_income_inr: 75000,
    existing_monthly_obligations_inr: 12000,
    credit_score: 720,
    employment_type: 'Salaried',
    application_channel: 'Website'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.student_name.trim()) {
      setError('Student name is required.');
      return;
    }
    if (!formData.loan_amount_requested_inr || Number(formData.loan_amount_requested_inr) <= 0) {
      setError('Valid loan amount is required.');
      return;
    }

    setLoading(true);
    try {
      await onApplicationCreated({
        ...formData,
        age: Number(formData.age),
        course_fee_inr: Number(formData.course_fee_inr),
        loan_amount_requested_inr: Number(formData.loan_amount_requested_inr),
        parent_monthly_income_inr: Number(formData.parent_monthly_income_inr),
        existing_monthly_obligations_inr: Number(formData.existing_monthly_obligations_inr),
        credit_score: formData.credit_score ? Number(formData.credit_score) : null
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 sm:p-6 backdrop-blur-2xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">New Education Loan Application</h2>
              <p className="text-xs text-slate-500">Record a new student financing request</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Student Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
              Student Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">Student Full Name *</label>
                <input
                  type="text"
                  name="student_name"
                  value={formData.student_name}
                  onChange={handleChange}
                  placeholder="e.g. Aravind Sharma"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Age (Years)</label>
                <input
                  type="number"
                  name="age"
                  min="16"
                  max="45"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Student State</label>
                <select
                  name="student_state"
                  value={formData.student_state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Telangana">Telangana</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Rajasthan">Rajasthan</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Employment Type</label>
                <select
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Salaried">Salaried</option>
                  <option value="Business">Business</option>
                  <option value="Self-Employed">Self-Employed</option>
                  <option value="Pensioner">Pensioner</option>
                </select>
              </div>
            </div>
          </div>

          {/* Academic Profile */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
              Academic Selection
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Institution *</label>
                <select
                  name="institution_id"
                  value={formData.institution_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  {filterOptions?.institutions?.map((i) => (
                    <option key={i.institution_id} value={i.institution_id}>
                      {i.institution_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Course *</label>
                <select
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  {filterOptions?.courses?.map((c) => (
                    <option key={c.course_id} value={c.course_id}>
                      {c.course_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Financial Profile */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
              Financial Information (INR)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Course Fee (₹) *</label>
                <input
                  type="number"
                  name="course_fee_inr"
                  value={formData.course_fee_inr}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Loan Amount Requested (₹) *</label>
                <input
                  type="number"
                  name="loan_amount_requested_inr"
                  value={formData.loan_amount_requested_inr}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Parent Monthly Income (₹)</label>
                <input
                  type="number"
                  name="parent_monthly_income_inr"
                  value={formData.parent_monthly_income_inr}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Monthly Obligations (₹)</label>
                <input
                  type="number"
                  name="existing_monthly_obligations_inr"
                  value={formData.existing_monthly_obligations_inr}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Credit Score (300-900)</label>
                <input
                  type="number"
                  name="credit_score"
                  min="300"
                  max="900"
                  value={formData.credit_score}
                  onChange={handleChange}
                  placeholder="Leave blank if unavailable"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Acquisition Channel</label>
                <select
                  name="application_channel"
                  value={formData.application_channel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Website">Website (Direct)</option>
                  <option value="Counsellor">Counsellor</option>
                  <option value="Institution Referral">Institution Referral</option>
                  <option value="Partner Referral">Partner Referral</option>
                  <option value="Campus Drive">Campus Drive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 rounded-lg shadow-xs transition-colors"
            >
              {loading ? 'Submitting...' : 'Create Application'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
