import React, { useState, useEffect } from 'react';
import { X, Check, RotateCcw, Target } from 'lucide-react';
import { EXPENSE_CATEGORIES, DEFAULT_BUDGETS } from '../constants/categories';
import { formatINR } from '../utils/formatters';

export const BudgetModal = ({
  isOpen,
  onClose,
  budgets,
  onSaveBudgets,
}) => {
  const [localBudgets, setLocalBudgets] = useState({});

  useEffect(() => {
    if (budgets) {
      setLocalBudgets({ ...budgets });
    }
  }, [budgets, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (categoryName, value) => {
    const num = Math.max(0, parseFloat(value) || 0);
    setLocalBudgets((prev) => ({
      ...prev,
      [categoryName]: num,
    }));
  };

  const handleResetDefaults = () => {
    setLocalBudgets({ ...DEFAULT_BUDGETS });
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSaveBudgets(localBudgets);
    onClose();
  };

  const totalMonthlyBudget = Object.values(localBudgets).reduce((sum, v) => sum + (Number(v) || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Monthly Spending Budgets
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Set monthly spending caps per category
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Overview Banner */}
        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            TOTAL MONTHLY EXPENSE CAP:
          </span>
          <span className="text-base sm:text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
            {formatINR(totalMonthlyBudget)}
          </span>
        </div>

        {/* Category Inputs List */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5">
          {EXPENSE_CATEGORIES.map((cat) => {
            const currentVal = localBudgets[cat.name] || 0;

            return (
              <div
                key={cat.id}
                className="flex items-center justify-between gap-4 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {cat.name}
                  </span>
                </div>

                <div className="relative w-36 shrink-0">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    inputMode="numeric"
                    placeholder="0"
                    value={currentVal === 0 ? '' : currentVal}
                    onChange={(e) => handleInputChange(cat.name, e.target.value)}
                    className="w-full pl-7 pr-3 py-1.5 text-right font-bold text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            );
          })}

          {/* Modal Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 mt-4">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Recommended
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/30 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Save Budgets
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
