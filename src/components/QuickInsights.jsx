import React from 'react';
import { Lightbulb, CreditCard } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export const QuickInsights = ({ transactions }) => {
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const incomeTransactions = transactions.filter((t) => t.type === 'income');

  const totalExpense = expenseTransactions.reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const totalIncome = incomeTransactions.reduce((acc, t) => acc + Number(t.amount || 0), 0);

  if (transactions.length === 0) return null;

  // Find top expense category
  const catMap = {};
  expenseTransactions.forEach((t) => {
    const cat = t.category || 'Other';
    catMap[cat] = (catMap[cat] || 0) + Number(t.amount || 0);
  });
  const sortedCategories = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  const topCategory = sortedCategories[0];

  // Find most frequent payment method
  const payMap = {};
  expenseTransactions.forEach((t) => {
    const m = t.paymentMethod || 'Other';
    payMap[m] = (payMap[m] || 0) + 1;
  });
  const sortedPayments = Object.entries(payMap).sort((a, b) => b[1] - a[1]);
  const topPayment = sortedPayments[0];

  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;
  const avgExpensePerTx = expenseTransactions.length > 0 ? Math.round(totalExpense / expenseTransactions.length) : 0;

  return (
    <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-indigo-950/30 rounded-2xl p-4 sm:p-5 border border-emerald-500/20 dark:border-emerald-500/10">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider">
          Smart Financial Insights
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-700 dark:text-slate-300">
        
        {/* Top Spending Insight */}
        {topCategory && (
          <div className="p-3 bg-white/70 dark:bg-slate-900/70 rounded-xl border border-white/50 dark:border-slate-800 backdrop-blur-xs">
            <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
              Top Expense Category
            </span>
            <span>
              <b className="text-emerald-600 dark:text-emerald-400">{topCategory[0]}</b> accounts for{' '}
              <b>{totalExpense > 0 ? Math.round((topCategory[1] / totalExpense) * 100) : 0}%</b> ({formatINR(topCategory[1])}) of your spending this period.
            </span>
          </div>
        )}

        {/* Savings Rate Insight */}
        <div className="p-3 bg-white/70 dark:bg-slate-900/70 rounded-xl border border-white/50 dark:border-slate-800 backdrop-blur-xs">
          <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
            Cashflow Health
          </span>
          <span>
            {savingsRate >= 20 ? (
              <>
                You're saving <b className="text-emerald-600 dark:text-emerald-400">{savingsRate}%</b> of income. Great financial discipline!
              </>
            ) : savingsRate > 0 ? (
              <>
                You're saving <b className="text-indigo-600 dark:text-indigo-400">{savingsRate}%</b> of income. Aim for 20-30% for a stronger emergency cushion.
              </>
            ) : (
              <>
                Your expenses exceed income this period by <b className="text-rose-600 dark:text-rose-400">{formatINR(Math.abs(totalIncome - totalExpense))}</b>.
              </>
            )}
          </span>
        </div>

        {/* Primary Payment Mode or Average Ticket Size */}
        <div className="p-3 bg-white/70 dark:bg-slate-900/70 rounded-xl border border-white/50 dark:border-slate-800 backdrop-blur-xs">
          {topPayment ? (
            <>
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                Primary Payment Mode
              </span>
              <span>
                Most of your day-to-day expenses ({topPayment[1]} times) are completed via <b>{topPayment[0]}</b>. Average expense is <b>{formatINR(avgExpensePerTx)}</b>.
              </span>
            </>
          ) : (
            <>
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                Spending Activity
              </span>
              <span>
                Recorded {transactions.length} total transactions this period.
              </span>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
