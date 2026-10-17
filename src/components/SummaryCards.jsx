import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, PiggyBank, CalendarCheck, TrendingUp } from 'lucide-react';
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      
      {/* 1. Net Balance */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400">
            NET SAVINGS
          </span>
          <div className={`p-2.5 rounded-xl ${netSavings >= 0 ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'}`}>
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${netSavings >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'}`}>
            {formatINR(netSavings)}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium">
          {netSavings >= 0 ? (
            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              Surplus in cashflow
            </span>
          ) : (
            <span className="inline-flex items-center text-rose-600 dark:text-rose-400 font-semibold">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              Deficit this period
            </span>
          )}
        </div>
      </div>

      {/* 2. Total Income */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400">
            TOTAL INCOME
          </span>
          <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
            {formatINR(totalIncome)}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{transactions.filter((t) => t.type === 'income').length} deposits recorded</span>
        </div>
      </div>

      {/* 3. Total Expenses */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400">
            TOTAL EXPENSES
          </span>
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            {formatINR(totalExpense)}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Avg. {formatINR(dailyAverageExpense)} / day</span>
          <span>{transactions.filter((t) => t.type === 'expense').length} transactions</span>
        </div>
      </div>

      {/* 4. Savings Rate */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400">
            SAVINGS RATE
          </span>
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400">
            {savingsRate}%
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
            {savingsRate >= 40 ? 'Exceptional' : savingsRate >= 20 ? 'Good' : savingsRate > 0 ? 'Fair' : 'Overspent'}
          </span>
        </div>
        <div className="mt-3">
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
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
