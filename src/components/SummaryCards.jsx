import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, PiggyBank, TrendingUp } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export const SummaryCards = ({ transactions, selectedMonth }) => {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  // Calculate daily average expense if filtered by a month
  const getDaysCount = () => {
    if (selectedMonth && selectedMonth !== 'all') {
      const [year, month] = selectedMonth.split('-').map(Number);
      return new Date(year, month, 0).getDate();
    }
    return 30; // default 30-day view
  };
  const dailyAverageExpense = Math.round(totalExpense / getDaysCount());

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      
      {/* 1. Net Balance */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-bold tracking-wide text-slate-500 dark:text-slate-400 uppercase">
              Net Savings
            </span>
            <div className={`p-1.5 sm:p-2 rounded-xl ${netSavings >= 0 ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'}`}>
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight truncate ${netSavings >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'}`}>
              {formatINR(netSavings)}
            </span>
          </div>
        </div>
        <div className="mt-2.5 sm:mt-3 flex items-center gap-1 text-[11px] sm:text-xs font-medium">
          {netSavings >= 0 ? (
            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold truncate">
              <ArrowUpRight className="w-3 h-3 mr-0.5 shrink-0" />
              Surplus
            </span>
          ) : (
            <span className="inline-flex items-center text-rose-600 dark:text-rose-400 font-semibold truncate">
              <ArrowDownRight className="w-3 h-3 mr-0.5 shrink-0" />
              Deficit
            </span>
          )}
        </div>
      </div>

      {/* 2. Total Income */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-bold tracking-wide text-slate-500 dark:text-slate-400 uppercase">
              Total Income
            </span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400 truncate">
              {formatINR(totalIncome)}
            </span>
          </div>
        </div>
        <div className="mt-2.5 sm:mt-3 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
          <span>{transactions.filter((t) => t.type === 'income').length} deposits</span>
        </div>
      </div>

      {/* 3. Total Expenses */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-bold tracking-wide text-slate-500 dark:text-slate-400 uppercase">
              Total Expenses
            </span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 truncate">
              {formatINR(totalExpense)}
            </span>
          </div>
        </div>
        <div className="mt-2.5 sm:mt-3 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
          <span>Avg. {formatINR(dailyAverageExpense)}/day</span>
        </div>
      </div>

      {/* 4. Savings Rate */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-bold tracking-wide text-slate-500 dark:text-slate-400 uppercase">
              Savings Rate
            </span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <PiggyBank className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400">
              {savingsRate}%
            </span>
            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hidden sm:inline">
              {savingsRate >= 30 ? 'Healthy' : savingsRate > 0 ? 'Fair' : 'Overspent'}
            </span>
          </div>
        </div>
        <div className="mt-2.5 sm:mt-3">
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 sm:h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                savingsRate >= 30 ? 'bg-emerald-500' : savingsRate > 10 ? 'bg-indigo-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, savingsRate))}%` }}
            />
          </div>
        </div>
      </div>

    </div>
  );
};
