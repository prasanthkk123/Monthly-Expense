import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';

/**
 * Format a number as Indian Rupee (₹)
 * Example: 154000 -> ₹1,54,000
 */
export const formatINR = (amount, includeDecimals = false) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  
  const num = Number(amount);
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: includeDecimals ? 2 : 0,
    minimumFractionDigits: includeDecimals ? 2 : 0,
  }).format(absNum);

  return `${isNegative ? '-' : ''}₹${formatted}`;
};

/**
 * Format date string (YYYY-MM-DD) into readable human format
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const targetDate = new Date(year, month - 1, day);
  targetDate.setHours(0, 0, 0, 0);

  if (targetDate.getTime() === today.getTime()) {
    return 'Today';
  }
  if (targetDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Lookup category metadata (color, icon, style)
 */
export const getCategoryMeta = (categoryName, type = 'expense', customList = null) => {
  const pool = customList && customList.length > 0 
    ? customList 
    : (type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES);
  const found = pool.find((c) => (c.name || '').toLowerCase() === (categoryName || '').toLowerCase());
  if (found) return found;

  // Fallback
  return {
    id: 'other',
    name: categoryName || 'Other',
    icon: type === 'income' ? 'PlusCircle' : 'MoreHorizontal',
    color: '#64748b',
    bgLight: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  };
};

/**
 * Escape CSV field according to RFC 4180
 */
const escapeCSVField = (val) => {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  // If string contains comma, quote, or newline, wrap in quotes and escape quotes
  return `"${str.replace(/"/g, '""')}"`;
};

/**
 * Generate CSV and trigger browser download.
 * Formatted cleanly with UTF-8 BOM to prevent Microsoft Excel SYLK format errors.
 */
export const downloadCSV = (transactions) => {
  // NOTE: Microsoft Excel mistakes any CSV starting with "ID" as a SYLK file format!
  // Starting with "Date" or "Transaction ID" completely avoids this error.
  const headers = [
    'Date',
    'Type',
    'Title',
    'Category',
    'Amount (INR)',
    'Payment Method',
    'Notes',
    'Transaction ID'
  ];

  const headerRow = headers.map(escapeCSVField).join(',');

  const rows = transactions.map((t) => [
    escapeCSVField(t.date || ''),
    escapeCSVField(t.type || 'expense'),
    escapeCSVField(t.title || ''),
    escapeCSVField(t.category || ''),
    Number(t.amount || 0).toFixed(2),
    escapeCSVField(t.paymentMethod || ''),
    escapeCSVField(t.notes || ''),
    escapeCSVField(t.id || ''),
  ].join(','));

  const csvContent = [headerRow, ...rows].join('\r\n');

  // Prefix with UTF-8 BOM (\uFEFF) so Excel on Windows properly recognizes UTF-8 encoding
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `RupeeWise_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export complete application data to JSON backup
 */
export const downloadJSONBackup = (data) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `RupeeWise_Backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
