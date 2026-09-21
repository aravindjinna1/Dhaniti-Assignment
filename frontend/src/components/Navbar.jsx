import React from 'react';
import { Landmark, Plus, Lightbulb, ShieldAlert, RefreshCw } from 'lucide-react';

export default function Navbar({ onOpenCreate, onOpenInsights, onOpenDataQuality, onRefresh, isRefreshing }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand and Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">Dhaniti</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                  Portfolio Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Education Lending Application Intelligence Dashboard
              </p>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Refresh Dashboard"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
            </button>

            <button
              onClick={onOpenDataQuality}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Data Audit (5)</span>
            </button>

            <button
              onClick={onOpenInsights}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
            >
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              <span>Insights (5)</span>
            </button>

            <button
              onClick={onOpenCreate}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Application</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
