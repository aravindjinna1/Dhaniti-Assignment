import React from 'react';
import { Files, CheckCircle2, Clock, XCircle, IndianRupee, TrendingUp } from 'lucide-react';

function formatCurrencyINR(amount) {
  if (amount === undefined || amount === null) return '₹0';
  const num = Number(amount);
  if (isNaN(num)) return '₹0';
  
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} L`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
}

export default function KPICardsSection({ summary, loading }) {
  const cards = [
    {
      title: 'Total Applications',
      value: summary?.total_applications ?? 0,
      subtext: `${summary?.submitted_applications ?? 0} freshly submitted`,
      icon: Files,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100'
    },
    {
      title: 'Approved Applications',
      value: summary?.approved_applications ?? 0,
      subtext: `${summary?.approval_rate_percent ?? 0}% overall conversion`,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100'
    },
    {
      title: 'Under-Review Applications',
      value: summary?.under_review_applications ?? 0,
      subtext: 'Active evaluation queue',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100'
    },
    {
      title: 'Rejected Applications',
      value: summary?.rejected_applications ?? 0,
      subtext: 'High-risk or incomplete profile',
      icon: XCircle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-100'
    },
    {
      title: 'Total Loan Requested',
      value: formatCurrencyINR(summary?.total_loan_amount_requested),
      subtext: `Avg: ${formatCurrencyINR(summary?.average_loan_amount_requested)} / applicant`,
      icon: IndianRupee,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100',
      highlight: true
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`bg-white rounded-xl border ${card.borderColor} p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {card.title}
              </span>
              <div className={`w-8 h-8 rounded-lg ${card.bgColor} ${card.color} flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              {loading ? (
                <div className="h-8 w-24 bg-slate-100 animate-pulse rounded my-1"></div>
              ) : (
                <div className="text-2xl font-bold tracking-tight text-slate-900">
                  {card.value}
                </div>
              )}
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
