import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  RotateCcw, 
  Tag, 
  Palette,
  AlertCircle
} from 'lucide-react';
import { PRESET_COLORS, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';
import { AVAILABLE_ICON_NAMES, CategoryIcon } from './CategoryIcon';

export const CategoryManagerModal = ({
  isOpen,
  onClose,
  expenseCategories,
  incomeCategories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onResetCategories,
}) => {
  const [activeTab, setActiveTab] = useState('expense'); // 'expense' | 'income'
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [icon, setIcon] = useState('Tag');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentList = activeTab === 'expense' ? expenseCategories : incomeCategories;

  const resetForm = () => {
    setName('');
    setColor(PRESET_COLORS[0]);
    setIcon('Tag');
    setError('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleStartEdit = (cat) => {
    setEditingId(cat.id);
    setName(cat.name);
    setColor(cat.color || PRESET_COLORS[0]);
    setIcon(cat.icon || 'Tag');
    setIsAdding(false);
    setError('');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a category name.');
      return;
    }

    // Check for duplicate name
    const exists = currentList.find(
      (c) => c.name.toLowerCase() === name.trim().toLowerCase() && c.id !== editingId
    );
    if (exists) {
      setError('A category with this name already exists.');
      return;
    }

    if (editingId) {
      onUpdateCategory(activeTab, editingId, {
        name: name.trim(),
        color,
        icon,
      });
    } else {
      onAddCategory(activeTab, {
        id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name: name.trim(),
        color,
        icon,
      });
    }

    resetForm();
  };

  const handleDeleteWithConfirm = (cat) => {
    if (window.confirm(`Are you sure you want to delete "${cat.name}"? Existing transactions will retain their record.`)) {
      onDeleteCategory(activeTab, cat.id, cat.name);
      if (editingId === cat.id) resetForm();
    }
  };

  const handleReset = () => {
    if (window.confirm(`Reset ${activeTab === 'expense' ? 'expense' : 'income'} categories to standard defaults?`)) {
      onResetCategories(activeTab);
      resetForm();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Manage Categories
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Add, edit, or remove your personal categories
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Pills */}
        <div className="px-4 sm:px-5 pt-3">
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => {
                setActiveTab('expense');
                resetForm();
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'expense'
                  ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span>Expenses</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300">
                {expenseCategories.length}
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab('income');
                resetForm();
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'income'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span>Income</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300">
                {incomeCategories.length}
              </span>
            </button>
          </div>
        </div>

        {/* Action Button & Add/Edit Form */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          
          {/* Add / Edit Form Panel */}
          {(isAdding || editingId) ? (
            <form onSubmit={handleSave} className="p-3.5 sm:p-4 rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {editingId ? 'Edit Category' : `Add New ${activeTab === 'expense' ? 'Expense' : 'Income'} Category`}
                </span>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
              </div>

              {error && (
                <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Name input */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  CATEGORY NAME *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g., Gym, Pets, Freelance, Subscriptions"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Color Swatches */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  SELECT COLOR
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                        color === c ? 'ring-2 ring-offset-2 ring-emerald-500 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Icon Selector Grid */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  SELECT ICON
                </label>
                <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 max-h-32 overflow-y-auto p-1.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  {AVAILABLE_ICON_NAMES.map((icName) => (
                    <button
                      key={icName}
                      type="button"
                      onClick={() => setIcon(icName)}
                      className={`p-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                        icon === icName
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                      title={icName}
                    >
                      <CategoryIcon name={icName} className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingId ? 'Save Changes' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => {
                resetForm();
                setIsAdding(true);
              }}
              className="w-full py-2.5 px-3 rounded-2xl border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/10 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New {activeTab === 'expense' ? 'Expense' : 'Income'} Category</span>
            </button>
          )}

          {/* List of Existing Categories */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              {activeTab === 'expense' ? 'Expense' : 'Income'} Categories ({currentList.length})
            </span>

            {currentList.map((cat) => (
              <div
                key={cat.id}
                className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-2xs"
                    style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                  >
                    <CategoryIcon name={cat.icon} className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate">
                    {cat.name}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleStartEdit(cat)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Edit category"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteWithConfirm(cat)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Defaults
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold text-xs cursor-pointer shadow-xs transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
