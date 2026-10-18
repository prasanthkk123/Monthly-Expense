import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { formatINR, getCategoryMeta } from '../utils/formatters';
import { PieChart as PieIcon, BarChart3 } from 'lucide-react';

export const AnalyticsCharts = ({ transactions, allTransactions, darkMode }) => {
  // 1. Category-wise expense aggregation for selected view
  const categoryData = useMemo(() => {
    const expenseOnly = transactions.filter((t) => t.type === 'expense');
    const totalExp = expenseOnly.reduce((acc, t) => acc + Number(t.amount || 0), 0);

    const map = {};
    expenseOnly.forEach((t) => {
      const cat = t.category || 'Other';
      map[cat] = (map[cat] || 0) + Number(t.amount || 0);
    });

    const result = Object.entries(map).map(([name, value]) => {
      const meta = getCategoryMeta(name, 'expense');
      const percentage = totalExp > 0 ? Math.round((value / totalExp) * 100) : 0;
      return {
        name,
        value,
        color: meta.color || '#64748b',
        percentage,
      };
    });

    return result.sort((a, b) => b.value - a.value);
  }, [transactions]);

  // 2. Multi-month Income vs Expense comparison (from all transactions)
  const monthlyTrendData = useMemo(() => {
    const monthsMap = {};

    allTransactions.forEach((t) => {
      if (!t.date) return;
      const key = t.date.slice(0, 7); // YYYY-MM
      if (!monthsMap[key]) {
        const [year, month] = key.split('-');
        const dateObj = new Date(Number(year), Number(month) - 1, 1);
        const label = dateObj.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
        monthsMap[key] = { key, label, income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        monthsMap[key].income += Number(t.amount || 0);
      } else {
        monthsMap[key].expense += Number(t.amount || 0);
      }
    });

    return Object.values(monthsMap)
      .sort((a, b) => a.key.localeCompare(b.key))
      .slice(-6); // last 6 months
  }, [allTransactions]);

  const hasExpenses = categoryData.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full min-w-0">
      
      {/* 1. Spending by Category (Donut Chart) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between w-full min-w-0 overflow-hidden">
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
                <PieIcon className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm sm:text-base lg:text-lg text-slate-900 dark:text-white">
                Category Spending
              </h3>
            </div>
            <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
              {categoryData.length} categories
            </span>
          </div>

          {!hasExpenses ? (
            <div className="h-52 sm:h-60 flex flex-col items-center justify-center text-slate-400 text-xs sm:text-sm">
              <p>No expense data recorded for this period</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center w-full min-w-0">
              <div className="h-48 sm:h-56 md:col-span-7 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={46}
                      outerRadius={74}
                      paddingAngle={3}
                      stroke={darkMode ? '#0f172a' : '#ffffff'}
                      strokeWidth={2}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val, name) => [formatINR(val), name]}
                      contentStyle={{
                        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                        borderColor: darkMode ? '#334155' : '#e2e8f0',
                        borderRadius: '0.75rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        color: darkMode ? '#f8fafc' : '#0f172a',
                        fontSize: '11px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category Legend Pills */}
              <div className="md:col-span-5 flex flex-col gap-1.5 max-h-48 sm:max-h-56 overflow-y-auto pr-1 w-full min-w-0">
                {categoryData.slice(0, 5).map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <div className="flex items-center gap-1.5 truncate min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="truncate font-medium text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs" title={item.name}>
                        {item.name}
                      </span>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-[11px] sm:text-xs">{formatINR(item.value)}</span>
                      <span className="text-slate-400 dark:text-slate-500 ml-1 text-[10px]">({item.percentage}%)</span>
                    </div>
                  </div>
                ))}
                {categoryData.length > 5 && (
                  <p className="text-[10px] text-center text-slate-400 mt-0.5">
                    +{categoryData.length - 5} more in list
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Income vs Expense Trend Bar Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between w-full min-w-0 overflow-hidden">
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm sm:text-base lg:text-lg text-slate-900 dark:text-white">
                Cashflow Trend
              </h3>
            </div>
            <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
              Recent months
            </span>
          </div>

          <div className="h-52 sm:h-60 w-full min-w-0">
            {monthlyTrendData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs sm:text-sm">
                No monthly data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#334155' : '#f1f5f9'} />
                  <XAxis
                    dataKey="label"
                    stroke={darkMode ? '#94a3b8' : '#64748b'}
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke={darkMode ? '#94a3b8' : '#64748b'}
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `₹${val >= 1000 ? `${Math.round(val / 1000)}k` : val}`}
                  />
                  <Tooltip
                    formatter={(val) => formatINR(val)}
                    contentStyle={{
                      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                      borderColor: darkMode ? '#334155' : '#e2e8f0',
                      borderRadius: '0.75rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      color: darkMode ? '#f8fafc' : '#0f172a',
                      fontSize: '11px',
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    iconSize={7}
                    wrapperStyle={{ fontSize: '10px', paddingBottom: '6px' }}
                  />
                  <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
