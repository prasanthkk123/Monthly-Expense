import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Trash2, 
  Edit3, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Calendar,
  CreditCard,
  Tag
} from 'lucide-react';
import { formatINR, formatDate, getCategoryMeta, downloadCSV } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

export const TransactionList = ({
  transactions,
  onEditTransaction,
  onDeleteTransaction,
  onOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // all | expense | income
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, amount-desc, amount-asc

  // Extract unique categories & payment methods available in transactions
  const uniqueCategories = useMemo(() => {
    const set = new Set();
    transactions.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set).sort();
  }, [transactions]);

  const uniquePaymentMethods = useMemo(() => {
    const set = new Set();
    transactions.forEach((t) => {
      if (t.paymentMethod) set.add(t.paymentMethod);
    });
    return Array.from(set).sort();
  }, [transactions]);

  // Filtering and sorting
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        // Type filter
        if (typeFilter !== 'all' && t.type !== typeFilter) return false;
        // Category filter
        if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
        // Payment filter
        if (paymentFilter !== 'all' && t.paymentMethod !== paymentFilter) return false;
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = (t.title || '').toLowerCase().includes(q);
          const matchCategory = (t.category || '').toLowerCase().includes(q);
          const matchNotes = (t.notes || '').toLowerCase().includes(q);
          const matchPayment = (t.paymentMethod || '').toLowerCase().includes(q);
          if (!matchTitle && !matchCategory && !matchNotes && !matchPayment) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.date || 0) - new Date(a.date || 0);
        }
        if (sortBy === 'date-asc') {
          return new Date(a.date || 0) - new Date(b.date || 0);
        }
        if (sortBy === 'amount-desc') {
          return Number(b.amount || 0) - Number(a.amount || 0);
        }
        if (sortBy === 'amount-asc') {
          return Number(a.amount || 0) - Number(b.amount || 0);
        }
        return 0;
      });
  }, [transactions, typeFilter, categoryFilter, paymentFilter, searchQuery, sortBy]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
      
      {/* Table Header & Controls Bar */}
      <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Transactions History
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {filteredTransactions.length} of {transactions.length} records
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadCSV(filteredTransactions)}
              disabled={filteredTransactions.length === 0}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-40 transition-colors"
              title="Download CSV for Excel or Google Sheets"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          
          {/* Search box */}
          <div className="relative lg:col-span-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search title, category, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Type Pills */}
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 lg:col-span-3">
            <button
              onClick={() => setTypeFilter('all')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                typeFilter === 'expense'
                  ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Expense
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                typeFilter === 'income'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Income
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="lg:col-span-2">
            <select
              aria-label="Filter by category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Payment Method Dropdown */}
          <div className="lg:col-span-2">
            <select
              aria-label="Filter by payment method"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Payment Modes</option>
              {uniquePaymentMethods.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="lg:col-span-1">
            <select
              aria-label="Sort transactions"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2 px-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="date-desc">Newest</option>
              <option value="date-asc">Oldest</option>
              <option value="amount-desc">High ₹</option>
              <option value="amount-asc">Low ₹</option>
            </select>
          </div>

        </div>
      </div>

      {/* Transactions List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[600px] overflow-y-auto">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
              No transactions match your filters
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search query, changing the date range, or add a new record.
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs cursor-pointer shadow-xs"
            >
              + Add Transaction
            </button>
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const isIncome = tx.type === 'income';
            const meta = getCategoryMeta(tx.category, tx.type);

            return (
              <div
                key={tx.id}
                className="p-4 sm:px-6 flex items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
              >
                {/* Left side: Icon + Title + Meta */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                    style={{ backgroundColor: `${meta.color}18`, color: meta.color }}
                  >
                    <CategoryIcon name={meta.icon} className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 truncate">
                        {tx.title}
                      </h4>
                    </div>

                    <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-medium text-slate-600 dark:text-slate-300">
                        {tx.category}
                      </span>
                      <span>•</span>
                      <span>{formatDate(tx.date)}</span>
                      {tx.paymentMethod && (
                        <>
                          <span>•</span>
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px]">
                            {tx.paymentMethod}
                          </span>
                        </>
                      )}
                      {tx.notes && (
                        <span className="hidden md:inline italic truncate max-w-xs text-slate-400">
                          - "{tx.notes}"
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Amount + Action buttons */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span
                      className={`text-base sm:text-lg font-bold tracking-tight ${
                        isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {isIncome ? '+' : '-'}{formatINR(tx.amount)}
                    </span>
                  </div>

                  {/* Actions (visible on hover / always on mobile) */}
                  <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditTransaction(tx)}
                      title="Edit transaction"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTransaction(tx.id)}
                      title="Delete transaction"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
