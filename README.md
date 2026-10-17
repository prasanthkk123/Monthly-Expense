# Personal Expense Tracker 💰

A fast, clean, and 100% private personal expense tracker designed specifically for personal financial management in Indian Rupees (₹ INR).

All your transaction records and preferences are stored **locally in your browser's LocalStorage**. Your sensitive financial data never leaves your computer.

---

## 🔒 Security & Password Protection

- **Default Master Password**: `Login2026`
- **Auto-Logout on Refresh**: Reopening or refreshing the page immediately requires authentication.
- **Lock / Unlock**: You can lock the application anytime with the lock icon in the top navigation bar.
- **Change Password**: Click the **Key icon** (🔑) in the navigation bar to update your vault password at any time.

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
- **🗑️ Data Purge & Deletion Controls**:
  - **Monthly-wise Data Deletion**: Delete all records belonging to any specific month (e.g., October 2026) directly from the **Data & Backup** modal or from the transaction list header.
  - **Total Data Deletion**: Full reset option to erase all transaction records permanently.
- **📁 100% Data Portability & Privacy**:
  - **Export to CSV**: Download standard spreadsheet files compatible with Microsoft Excel and Google Sheets without any SYLK errors.
  - **Full JSON Backup**: One-click complete snapshot of all transactions.
  - **Restore / Import**: Load previous JSON backups anytime.
  - **Load Realistic Demo Data**: Instant one-click sample data for immediate exploration.
- **🌙 Dark & Light Mode**: Built-in sleek dark mode toggle for comfortable viewing.
- **📱 Fully Mobile Responsive**: Slide-down menu drawer, 2-column mobile KPI cards, and floating quick-add button (FAB).

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
4. Enter password `Login2026` to unlock.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Charts & Data Viz**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Storage**: Browser LocalStorage (Offline-first, zero cloud dependencies)
