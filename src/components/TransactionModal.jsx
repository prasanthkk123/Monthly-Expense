import React, { useState, useEffect } from 'react';
import { X, Check, Tag, Calendar, CreditCard, Settings, SlidersHorizontal, Plus } from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../constants/categories';
import { CategoryIcon } from './CategoryIcon';

export const TransactionModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  expenseCategories = EXPENSE_CATEGORIES,
  incomeCategories = INCOME_CATEGORIES,
  onOpenCategoryManager,
}) => {
  const [type, setType] = useState('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].name);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const currentCategories = type === 'income' ? incomeCategories : expenseCategories;

  useEffect(() => {
    if (initialData) {
      setType(initialData.type || 'expense');
      setTitle(initialData.title || '');
      setAmount(initialData.amount ? String(initialData.amount) : '');
      setCategory(initialData.category || (initialData.type === 'income' ? incomeCategories[0]?.name : expenseCategories[0]?.name));
      setDate(initialData.date || new Date().toISOString().slice(0, 10));
      setPaymentMethod(initialData.paymentMethod || PAYMENT_METHODS[0].name);
      setNotes(initialData.notes || '');
    } else {
      setType('expense');
      setTitle('');
      setAmount('');
      setCategory(expenseCategories[0]?.name || 'Other Expenses');
      setDate(new Date().toISOString().slice(0, 10));
      setPaymentMethod(PAYMENT_METHODS[0].name);
      setNotes('');
    }
    setError('');
  }, [initialData, isOpen, expenseCategories, incomeCategories]);

  // Adjust default category when type toggles
  const handleTypeChange = (newType) => {
    setType(newType);
    const list = newType === 'income' ? incomeCategories : expenseCategories;
    setCategory(list[0]?.name || '');
  };

  const handleQuickAddAmount = (addValue) => {
    const current = Number(amount) || 0;
    setAmount(String(current + addValue));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title or description');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    const payload = {
      id: initialData?.id || `tx_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type,
      title: title.trim(),
      amount: parsedAmount,
      category: category || currentCategories[0]?.name || 'Other',
      date,
      paymentMethod,
      notes: notes.trim(),
    };

    onSave(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {initialData ? 'Edit Transaction' : 'Record Transaction'}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Personal Cash Flow Entry
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto overscroll-contain">
          
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Type Selector Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Expense (-₹)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                type === 'income'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Income (+₹)
            </button>
          </div>

          {/* Amount Input with Currency Symbol */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              AMOUNT (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                step="any"
                inputMode="decimal"
                required
                autoFocus
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 sm:py-3 text-xl sm:text-2xl font-extrabold rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Quick Amount Booster Pills */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400 mr-1 font-medium">Add:</span>
              {[100, 500, 1000, 5000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAddAmount(val)}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  +{val}
                </button>
              ))}
            </div>
          </div>

          {/* Title / Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              TITLE / MERCHANT / REASON *
            </label>
            <input
              type="text"
              required
              placeholder={type === 'expense' ? "e.g., Swiggy dinner, Electricity, Petrol" : "e.g., Salary, Freelance project, Dividend"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Visual Category Picker (Scrollable Grid + Manage Categories Button) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                CATEGORY *
              </label>
              {onOpenCategoryManager && (
                <button
                  type="button"
                  onClick={onOpenCategoryManager}
                  className="text-[11px] font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 flex items-center gap-1 cursor-pointer"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Manage / Add Categories</span>
                </button>
              )}
            </div>

            {/* Smooth Touch-Scrollable Category Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2 max-h-44 sm:max-h-52 overflow-y-auto overscroll-contain p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40">
              {currentCategories.map((c) => {
                const isSelected = (category || '').toLowerCase() === c.name.toLowerCase();
                return (
                  <button
                    key={c.id || c.name}
                    type="button"
                    onClick={() => setCategory(c.name)}
                    className={`p-2 rounded-xl text-left flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-slate-700 shadow-xs ring-2 ring-emerald-500'
                        : 'bg-white/70 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/50'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${c.color || '#64748b'}20`, color: c.color || '#64748b' }}
                    >
                      <CategoryIcon name={c.icon} className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-[11px] sm:text-xs text-slate-800 dark:text-slate-200 truncate">
                      {c.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                TRANSACTION DATE *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                PAYMENT METHOD
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm.id} value={pm.name}>
                    {pm.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              NOTES (OPTIONAL)
            </label>
            <input
              type="text"
              placeholder="Add memo or receipt note..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'Update Record' : 'Save Transaction'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
