import React from 'react';
import { Target, AlertTriangle, CheckCircle2, ChevronRight, Plus } from 'lucide-react';
import { formatINR, getCategoryMeta } from '../utils/formatters';

export const BudgetOverview = ({ transactions, budgets, onOpenBudgetModal }) => {
  // Calculate expenses per category for the current filtered list
  const categoryExpenses = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const cat = t.category || 'Other';
      categoryExpenses[cat] = (categoryExpenses[cat] || 0) + Number(t.amount || 0);
    });

  const budgetEntries = Object.entries(budgets || {}).filter(([_, limit]) => Number(limit) > 0);

  if (budgetEntries.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white">Track Monthly Category Budgets</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Set spending limits on Food, Shopping, Fuel, etc. to get early warnings before you overspend.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenBudgetModal}
          className="shrink-0 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Set Budgets
        </button>
      </div>
    );
  }

  // Summary counts
  let exceededCount = 0;
  let warningCount = 0;

  budgetEntries.forEach(([cat, limit]) => {
    const spent = categoryExpenses[cat] || 0;
    const ratio = spent / limit;
    if (ratio >= 1) exceededCount++;
    else if (ratio >= 0.8) warningCount++;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              Budget Health
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {exceededCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              {exceededCount} exceeded
            </span>
          )}
          {warningCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              {warningCount} near limit
            </span>
          )}
          <button
            onClick={onOpenBudgetModal}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 flex items-center gap-1 cursor-pointer"
          >
            Manage <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgetEntries.map(([category, limit]) => {
          const spent = categoryExpenses[category] || 0;
          const percentage = Math.min(Math.round((spent / limit) * 100), 200);
          const isExceeded = spent > limit;
          const isWarning = !isExceeded && percentage >= 80;
          const remaining = limit - spent;
          const meta = getCategoryMeta(category, 'expense');

          let progressColor = 'bg-emerald-500';
          let textColor = 'text-emerald-600 dark:text-emerald-400';
          if (isExceeded) {
            progressColor = 'bg-rose-500';
            textColor = 'text-rose-600 dark:text-rose-400';
          } else if (isWarning) {
            progressColor = 'bg-amber-500';
            textColor = 'text-amber-600 dark:text-amber-400';
          }

          return (
            <div
              key={category}
              className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                    {category}
                  </span>
                </div>
                <span className={`font-bold ${textColor}`}>
                  {percentage}%
                </span>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden my-2">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                <span>
                  Spent: <b className="text-slate-700 dark:text-slate-200">{formatINR(spent)}</b>
                </span>
                <span>
                  {isExceeded ? (
                    <span className="text-rose-600 dark:text-rose-400 font-semibold">
                      +{formatINR(Math.abs(remaining))} over
                    </span>
                  ) : (
                    <span>{formatINR(remaining)} left</span>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
