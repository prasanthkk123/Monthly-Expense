import React, { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DEFAULT_BUDGETS } from './constants/categories';
import { getSampleTransactions } from './utils/sampleData';
import { Navbar } from './components/Navbar';
import { SummaryCards } from './components/SummaryCards';
import { QuickInsights } from './components/QuickInsights';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { BudgetOverview } from './components/BudgetOverview';
import { TransactionList } from './components/TransactionList';
import { TransactionModal } from './components/TransactionModal';
import { BudgetModal } from './components/BudgetModal';
import { DataBackupModal } from './components/DataBackupModal';

export default function App() {
  // Persistent State in LocalStorage
  const [transactions, setTransactions] = useLocalStorage('rupeewise_transactions', () => getSampleTransactions());
  const [budgets, setBudgets] = useLocalStorage('rupeewise_budgets', DEFAULT_BUDGETS);
  const [darkMode, setDarkMode] = useLocalStorage('rupeewise_darkmode', false);

  // Current selected month: defaults to current month YYYY-MM
  const currentMonthKey = useMemo(() => new Date().toISOString().slice(0, 7), []);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Handle Dark mode class on root HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Compute available months dynamically from transactions
  const availableMonths = useMemo(() => {
    const monthsSet = new Set();
    // Always include current month
    monthsSet.add(currentMonthKey);

    transactions.forEach((t) => {
      if (t.date && t.date.length >= 7) {
        monthsSet.add(t.date.slice(0, 7));
      }
    });

    return Array.from(monthsSet)
      .sort((a, b) => b.localeCompare(a))
      .map((key) => {
        const [year, month] = key.split('-').map(Number);
        const d = new Date(year, month - 1, 1);
        return {
          value: key,
          label: d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
        };
      });
  }, [transactions, currentMonthKey]);

  // Transactions filtered by selected month
  const filteredTransactions = useMemo(() => {
    if (selectedMonth === 'all') {
      return transactions;
    }
    return transactions.filter((t) => t.date && t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  // CRUD Operations
  const handleSaveTransaction = (transactionData) => {
    setTransactions((prev) => {
      const existsIndex = prev.findIndex((t) => t.id === transactionData.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = transactionData;
        return updated;
      }
      return [transactionData, ...prev];
    });
  };

  const handleEditTransaction = (tx) => {
    setEditingTransaction(tx);
    setIsAddModalOpen(true);
  };

  const handleDeleteTransaction = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction record?')) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleSaveBudgets = (newBudgets) => {
    setBudgets(newBudgets);
  };

  const handleImportData = (newTransactions, newBudgets) => {
    setTransactions(newTransactions);
    if (newBudgets && Object.keys(newBudgets).length > 0) {
      setBudgets(newBudgets);
    }
  };

  const handleLoadSampleData = () => {
    setTransactions(getSampleTransactions());
    setBudgets(DEFAULT_BUDGETS);
  };

  const handleClearAllData = () => {
    setTransactions([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Top Sticky Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenAddModal={() => {
          setEditingTransaction(null);
          setIsAddModalOpen(true);
        }}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        availableMonths={availableMonths}
      />

      {/* Main Dashboard Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* KPI / Metric Cards */}
        <SummaryCards
          transactions={filteredTransactions}
          selectedMonth={selectedMonth}
        />

        {/* Smart Insights Banner */}
        <QuickInsights
          transactions={filteredTransactions}
          budgets={budgets}
        />

        {/* Visual Analytics Charts */}
        <AnalyticsCharts
          transactions={filteredTransactions}
          allTransactions={transactions}
          darkMode={darkMode}
        />

        {/* Category Budget Tracker */}
        <BudgetOverview
          transactions={filteredTransactions}
          budgets={budgets}
          onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        />

        {/* Transactions Table & Filters */}
        <TransactionList
          transactions={filteredTransactions}
          onEditTransaction={handleEditTransaction}
          onDeleteTransaction={handleDeleteTransaction}
          onOpenAddModal={() => {
            setEditingTransaction(null);
            setIsAddModalOpen(true);
          }}
        />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>
          RupeeWise Personal Expense Tracker • 100% Client-Side & Private • Stored securely in your browser
        </p>
      </footer>

      {/* Modals */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        initialData={editingTransaction}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        budgets={budgets}
        onSaveBudgets={handleSaveBudgets}
      />

      <DataBackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        transactions={transactions}
        budgets={budgets}
        onImportData={handleImportData}
        onLoadSampleData={handleLoadSampleData}
        onClearAllData={handleClearAllData}
      />

    </div>
  );
}
