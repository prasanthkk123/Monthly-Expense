import React, { useState } from 'react';
import { 
  PlusCircle, 
  Download, 
  Moon, 
  Sun, 
  Lock, 
  KeyRound, 
  Menu, 
  X,
  ChevronDown,
  Database,
  ShieldCheck
} from 'lucide-react';

export const Navbar = ({ 
  darkMode, 
  setDarkMode, 
  onOpenAddModal, 
  onOpenBackupModal, 
  onOpenChangePasswordModal, 
  onLock, 
  selectedMonth, 
  setSelectedMonth, 
  availableMonths 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-18">
            
            {/* Logo & Brand Title */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white font-extrabold text-base sm:text-xl">
                ₹
              </div>
              <div className="min-w-0">
                <span className="font-extrabold text-sm sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  Expense<span className="text-emerald-500">Tracker</span>
                </span>
              </div>
            </div>

            {/* Desktop Navigation Items (md and up) */}
            <div className="hidden md:flex items-center gap-2 lg:gap-2.5">
              {/* Month Selector */}
              <div className="relative">
                <select
                  aria-label="Filter transactions by month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer shadow-xs"
                >
                  <option value="all">All Time</option>
                  {availableMonths.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {/* Data & Backup Button */}
              <button
                onClick={onOpenBackupModal}
                title="Backup, Export CSV/JSON, Purge Data"
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-teal-500" />
                <span>Data & Backup</span>
              </button>

              {/* Change Password Button */}
              <button
                onClick={onOpenChangePasswordModal}
                title="Change Login Password"
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Change password"
              >
                <KeyRound className="w-4 h-4 text-amber-500" />
              </button>

              {/* Lock / Logout Button */}
              <button
                onClick={onLock}
                title="Lock Screen"
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Lock screen"
              >
                <Lock className="w-4 h-4 text-rose-500" />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>

              {/* Add Transaction Primary CTA */}
              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Record</span>
              </button>
            </div>

            {/* Mobile Controls Header (always visible & compact on mobile) */}
            <div className="flex md:hidden items-center gap-1.5 shrink-0">
              
              {/* Always-Visible Compact Month Selector on Mobile */}
              <div className="relative">
                <select
                  aria-label="Filter transactions by month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="appearance-none pl-2.5 pr-6 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-2xs max-w-[120px] truncate"
                >
                  <option value="all">All Time</option>
                  {availableMonths.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-slate-400">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>

              {/* Mobile Menu Drawer Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  mobileMenuOpen 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' 
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                aria-label="Open menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>

          </div>

          {/* Mobile Slide-Down Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2 duration-150">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    onOpenBackupModal();
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/80 font-medium text-xs flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4 text-teal-500" />
                  <span className="text-[11px] font-semibold">Data & Backup</span>
                </button>

                <button
                  onClick={() => {
                    onOpenChangePasswordModal();
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/80 font-medium text-xs flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center active:scale-95 transition-all"
                >
                  <KeyRound className="w-4 h-4 text-amber-500" />
                  <span className="text-[11px] font-semibold">Password</span>
                </button>

                <button
                  onClick={() => {
                    onLock();
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20 font-medium text-xs flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center active:scale-95 transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span className="text-[11px] font-semibold">Lock App</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </header>

      {/* Backdrop overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 top-14 z-20 bg-slate-900/30 backdrop-blur-2xs md:hidden"
        />
      )}
    </>
  );
};
