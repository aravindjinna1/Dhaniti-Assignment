import React from 'react';
import { X, ShieldAlert, CheckCircle2, FileText, Database } from 'lucide-react';

export default function DataQualityModal({ isOpen, onClose, report }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 sm:p-6 backdrop-blur-2xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">5 Data Quality Issues Audited in CSV Datasets</h2>
              <p className="text-xs text-slate-500">
                Detailed documentation of anomalies, affected records, handling methods, and architectural rationale
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

        {/* Audit List */}
        <div className="p-6 space-y-4 text-xs">
          {report?.map((item) => (
            <div
              key={item.issue_id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-2xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                    {item.issue_id}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                </div>
              </div>

              {/* Description */}
              <div className="text-slate-600 mb-2">{item.description}</div>

              {/* Affected Records & Found Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 bg-white p-2.5 rounded-lg border border-slate-200">
                <div>
                  <span className="text-2xs font-bold uppercase text-slate-400 block">Affected Record(s)</span>
                  <span className="font-mono text-slate-800 font-semibold">{item.affected_records.join(', ')}</span>
                </div>
                <div>
                  <span className="text-2xs font-bold uppercase text-slate-400 block">Raw CSV Value</span>
                  <span className="font-mono text-rose-700">{item.found_value}</span>
                </div>
              </div>

              {/* Handling Method */}
              <div className="mb-2">
                <div className="flex items-center gap-1.5 text-slate-800 font-semibold mb-0.5">
                  <Database className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Implemented Handling Method:</span>
                </div>
                <p className="text-slate-600 pl-5">{item.handling_method}</p>
              </div>

              {/* Architectural Rationale */}
              <div>
                <div className="flex items-center gap-1.5 text-slate-800 font-semibold mb-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Engineering Rationale:</span>
                </div>
                <p className="text-slate-600 pl-5">{item.rationale}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-between items-center text-2xs text-slate-500">
          <span>Processed by backend/src/utils/dataCleaner.js during database ingestion</span>
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
