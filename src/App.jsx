import React, { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getSampleTransactions } from './utils/sampleData';
import { Navbar } from './components/Navbar';
import { SummaryCards } from './components/SummaryCards';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { TransactionList } from './components/TransactionList';
import { TransactionModal } from './components/TransactionModal';
import { DataBackupModal } from './components/DataBackupModal';
import { LoginScreen } from './components/LoginScreen';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { Plus } from 'lucide-react';

export default function App() {
  // Authentication & Security State
  // Default password is 'Login2026'
  const [storedPassword, setStoredPassword] = useLocalStorage('rupeewise_password', 'Login2026');
  
  // Pure in-memory session: resets to false on every page refresh!
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Persistent State in LocalStorage
  const [transactions, setTransactions] = useLocalStorage('rupeewise_transactions', () => getSampleTransactions());
  const [darkMode, setDarkMode] = useLocalStorage('rupeewise_darkmode', false);

  // Current selected month: defaults to current month YYYY-MM
  const currentMonthKey = useMemo(() => new Date().toISOString().slice(0, 7), []);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  // Handle Dark mode class on root HTML element and body
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (darkMode) {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
  }, [darkMode]);

  // Clean any old session storage tokens on mount
  useEffect(() => {
    try {
      sessionStorage.removeItem('rupeewise_session_auth');
    } catch {}
  }, []);

  // Login handler
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Lock / Logout handler
  const handleLock = () => {
    setIsAuthenticated(false);
  };

  // Password change handler
  const handleChangePassword = (newPassword) => {
    setStoredPassword(newPassword);
  };

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

  // Monthly Wise Data Deletion
  const handleDeleteMonthlyData = (monthKey) => {
    setTransactions((prev) => prev.filter((t) => !t.date || !t.date.startsWith(monthKey)));
  };

  // Total Data Deletion
  const handleClearAllData = () => {
    setTransactions([]);
  };

  const handleImportData = (newTransactions) => {
    setTransactions(newTransactions);
  };

  const handleLoadSampleData = () => {
    setTransactions(getSampleTransactions());
  };

  // If not authenticated, display login password screen
  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        storedPassword={storedPassword}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 pb-16 md:pb-0">
      
      {/* Top Sticky Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenAddModal={() => {
          setEditingTransaction(null);
          setIsAddModalOpen(true);
        }}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onOpenChangePasswordModal={() => setIsChangePasswordModalOpen(true)}
        onLock={handleLock}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        availableMonths={availableMonths}
      />

      {/* Main Dashboard Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-8">
        
        {/* KPI / Metric Cards */}
        <SummaryCards
          transactions={filteredTransactions}
          selectedMonth={selectedMonth}
        />

        {/* Visual Analytics Charts */}
        <AnalyticsCharts
          transactions={filteredTransactions}
          allTransactions={transactions}
          darkMode={darkMode}
        />

        {/* Transactions Table & Filters */}
        <TransactionList
          transactions={filteredTransactions}
          selectedMonth={selectedMonth}
          onDeleteMonthlyData={handleDeleteMonthlyData}
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
          Personal Expense Tracker • 100% Client-Side & Private • Stored securely in your browser
        </p>
      </footer>

      {/* Mobile Floating Action Button (FAB) */}
      <button
        onClick={() => {
          setEditingTransaction(null);
          setIsAddModalOpen(true);
        }}
        aria-label="Add transaction"
        className="md:hidden fixed bottom-5 right-5 z-40 w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/40 flex items-center justify-center active:scale-90 transition-all cursor-pointer"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

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

      <DataBackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        transactions={transactions}
        selectedMonth={selectedMonth}
        availableMonths={availableMonths}
        onImportData={handleImportData}
        onLoadSampleData={handleLoadSampleData}
        onDeleteMonthlyData={handleDeleteMonthlyData}
        onClearAllData={handleClearAllData}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        storedPassword={storedPassword}
        onPasswordChanged={handleChangePassword}
      />

    </div>
  );
}
