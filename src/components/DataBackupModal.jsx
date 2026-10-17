import React, { useRef, useState } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  Sparkles, 
  Trash2, 
  FileSpreadsheet, 
  Database, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { downloadCSV, downloadJSONBackup } from '../utils/formatters';
import { getSampleTransactions } from '../utils/sampleData';

export const DataBackupModal = ({
  isOpen,
  onClose,
  transactions,
  budgets,
  onImportData,
  onLoadSampleData,
  onClearAllData,
}) => {
  const fileInputRef = useRef(null);
  const [statusMessage, setStatusMessage] = useState(null);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    downloadJSONBackup({
      version: '1.0',
      exportDate: new Date().toISOString(),
      transactions,
      budgets,
    });
    setStatusMessage({ type: 'success', text: 'JSON backup downloaded successfully!' });
  };

  const handleExportCSV = () => {
    downloadCSV(transactions);
    setStatusMessage({ type: 'success', text: 'CSV spreadsheet downloaded successfully!' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result);
        if (json.transactions && Array.isArray(json.transactions)) {
          onImportData(json.transactions, json.budgets || {});
          setStatusMessage({ type: 'success', text: `Imported ${json.transactions.length} transactions!` });
        } else {
          setStatusMessage({ type: 'error', text: 'Invalid backup file structure.' });
        }
      } catch (err) {
        setStatusMessage({ type: 'error', text: 'Error parsing JSON file: ' + err.message });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearWithConfirm = () => {
    if (window.confirm('Are you sure you want to delete all transactions and reset? This cannot be undone.')) {
      onClearAllData();
      setStatusMessage({ type: 'success', text: 'All transactions cleared.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Data Backup & Portability
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                100% private: your data lives on your device
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

        {/* Status Alert */}
        {statusMessage && (
          <div className={`px-6 py-2.5 flex items-center gap-2 text-xs font-semibold ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300' 
              : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Options Content */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* 1. Export CSV */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Export as CSV</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">For Excel, Google Sheets, or Numbers</p>
              </div>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          </div>

          {/* 2. Export JSON Backup */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Full JSON Backup</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Includes all records, categories, & budgets</p>
              </div>
            </div>
            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Backup
            </button>
          </div>

          {/* 3. Import JSON Backup */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Restore from JSON</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Upload previously exported RupeeWise file</p>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              Import
            </button>
          </div>

          {/* 4. Demo Data & Reset Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => {
                onLoadSampleData();
                setStatusMessage({ type: 'success', text: 'Sample data loaded!' });
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Load Sample Demo Data
            </button>

            <button
              onClick={handleClearWithConfirm}
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All Data
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
