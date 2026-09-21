import React from 'react';
import { X, Lightbulb, TrendingUp, ShieldAlert, Award, Compass, Scale } from 'lucide-react';

export default function BusinessInsightsModal({ isOpen, onClose, insights }) {
  if (!isOpen) return null;

  const getTagColor = (tag) => {
    switch (tag) {
      case 'Portfolio Risk':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Credit Policy':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Growth & Acquisition':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Underwriting':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 sm:p-6 backdrop-blur-2xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">5 Data-Driven Portfolio Business Insights</h2>
              <p className="text-xs text-slate-500">
                Calculated directly from the 150 education lending applications dataset
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Insights List */}
        <div className="p-6 space-y-4 text-xs">
          {insights?.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-2xs">
                    {item.id}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-0.5 text-2xs font-bold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {item.metric}
                  </span>
                  <span className={`px-2 py-0.5 text-2xs font-semibold rounded-full border ${getTagColor(item.tag)}`}>
                    {item.tag}
                  </span>
                </div>
              </div>

              {/* Finding */}
              <div className="mb-2">
                <span className="font-semibold text-slate-700">Observed Finding: </span>
                <span className="text-slate-600">{item.finding}</span>
              </div>

              {/* Underlying Calculation */}
              <div className="mb-2 p-2.5 rounded-lg bg-white border border-slate-200 text-slate-600 font-mono text-2xs">
                <span className="font-bold text-slate-800 font-sans">Calculation Method: </span>
                {item.calculation}
              </div>

              {/* Business Relevance */}
              <div className="text-slate-600">
                <span className="font-semibold text-indigo-900">Commercial & Risk Impact: </span>
                {item.business_relevance}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-between items-center text-2xs text-slate-500">
          <span>All metrics dynamically aggregated from live database/ETL ingestion</span>
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
