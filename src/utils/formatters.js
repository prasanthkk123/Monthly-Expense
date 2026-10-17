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
export const getCategoryMeta = (categoryName, type = 'expense') => {
  const pool = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const found = pool.find((c) => c.name.toLowerCase() === (categoryName || '').toLowerCase());
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
 * Generate CSV and trigger browser download
 */
export const downloadCSV = (transactions) => {
  const headers = ['ID', 'Date', 'Type', 'Title', 'Category', 'Amount (INR)', 'Payment Method', 'Notes'];
  
  const rows = transactions.map((t) => [
    `"${t.id || ''}"`,
    `"${t.date || ''}"`,
    `"${t.type || 'expense'}"`,
    `"${(t.title || '').replace(/"/g, '""')}"`,
    `"${(t.category || '').replace(/"/g, '""')}"`,
    Number(t.amount || 0).toFixed(2),
    `"${(t.paymentMethod || '').replace(/"/g, '""')}"`,
    `"${(t.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `RupeeWise_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export complete application data to JSON backup
 */
export const downloadJSONBackup = (data) => {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const link = document.createElement('a');
  link.setAttribute('href', jsonString);
  link.setAttribute('download', `RupeeWise_Backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
