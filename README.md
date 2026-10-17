# RupeeWise 💰 — Personal Expense Tracker & Budget Planner

RupeeWise is a fast, beautiful, and 100% private personal expense tracker designed specifically for personal financial management in Indian Rupees (₹ INR). 

All your transaction records, monthly budgets, and preferences are stored **locally in your browser's LocalStorage**. Your sensitive financial data never leaves your computer.

---

## ✨ Features

- **🇮🇳 Indian Rupee Formatting**: Native formatting with Lakhs and Crores support (e.g. `₹1,25,000`).
- **📊 Real-time Dashboard KPIs**:
  - **Net Savings**: Net cashflow surplus or deficit for the period.
  - **Total Income & Expenses**: Instant aggregation with deposit counts and daily average expense.
  - **Savings Rate (%)**: Visual health gauge (Aiming for 20-40%+).
- **💡 Smart Financial Insights**:
  - Automatically identifies your highest spending category and percentage share.
  - Analyzes your savings rate and primary payment methods (UPI, Credit Card, Net Banking).
- **📈 Interactive Analytics & Charts**:
  - **Category Spending Donut Chart** (Powered by Recharts) with color-coded categories and interactive tooltips.
  - **Income vs. Expense Trend Bar Chart** across recent months to monitor your financial velocity.
  - Top payment method breakdowns.
- **🎯 Category Budget Planner**:
  - Set monthly spending caps for Food & Dining, Groceries, Utilities, Transport, Shopping, Entertainment, etc.
  - Color-coded progress bars:
    - 🟢 **Green**: Under 80%
    - 🟡 **Amber**: 80% – 99% (Near limit warning)
    - 🔴 **Red**: Over 100% (Budget exceeded alert)
- **⚡ Rapid Transaction Entry**:
  - Type toggle (Expense / Income).
  - Quick amount boosters (`+100`, `+500`, `+1000`, `+5000`).
  - Pre-configured Indian categories & payment modes (UPI, Credit Card, Net Banking, Cash).
- **🔍 Powerful Filters & Search**:
  - Instant text search across merchants, notes, categories, and payment types.
  - One-click filters: All / Expense / Income.
  - Dropdown filters for specific categories and payment methods.
  - Multi-criteria sorting (Newest, Oldest, Highest Amount, Lowest Amount).
- **📁 100% Data Portability & Privacy**:
  - **Export to CSV**: Download standard spreadsheet files compatible with Microsoft Excel and Google Sheets.
  - **Full JSON Backup**: One-click complete snapshot of all transactions, custom categories, and budgets.
  - **Restore / Import**: Load previous JSON backups anytime.
  - **Load Realistic Demo Data**: Instant one-click sample data for immediate exploration.
- **🌙 Dark & Light Mode**: Built-in sleek dark mode toggle for comfortable viewing.

---

## 🚀 How to Run

1. Open your terminal in this directory:
   ```bash
   cd d:\Expense
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Charts & Data Viz**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Storage**: Browser LocalStorage (Offline-first, zero cloud dependencies)
