/**
 * Generates rich realistic sample transactions relative to today's date
 */
export const getSampleTransactions = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed

  const makeDate = (dayOffset = 0, targetMonth = month) => {
    const d = new Date(year, targetMonth, Math.max(1, Math.min(28, dayOffset)));
    return d.toISOString().slice(0, 10);
  };

  return [
    {
      id: 'tx_samp_1',
      type: 'income',
      title: 'Monthly Tech Salary',
      category: 'Salary',
      amount: 95000,
      date: makeDate(1),
      paymentMethod: 'Net Banking',
      notes: 'Direct credit to HDFC Salary Account',
    },
    {
      id: 'tx_samp_2',
      type: 'expense',
      title: 'Apartment Rent',
      category: 'Rent & Housing',
      amount: 22000,
      date: makeDate(2),
      paymentMethod: 'Net Banking',
      notes: 'Paid to landlord via IMPS',
    },
    {
      id: 'tx_samp_3',
      type: 'expense',
      title: 'SIP - Parag Parikh Flexi Cap',
      category: 'Investments & SIP',
      amount: 15000,
      date: makeDate(5),
      paymentMethod: 'Net Banking',
      notes: 'Monthly automated mutual fund investment',
    },
    {
      id: 'tx_samp_4',
      type: 'expense',
      title: 'Zepto Instant Grocery',
      category: 'Groceries & Mart',
      amount: 1450,
      date: makeDate(6),
      paymentMethod: 'UPI (GPay / PhonePe / Paytm)',
      notes: 'Milk, vegetables, fruits, bread',
    },
    {
      id: 'tx_samp_5',
      type: 'expense',
      title: 'Electricity & Water Bill',
      category: 'Bills & Utilities',
      amount: 2340,
      date: makeDate(8),
      paymentMethod: 'UPI (GPay / PhonePe / Paytm)',
      notes: 'Electricity board bill payment',
    },
    {
      id: 'tx_samp_6',
      type: 'income',
      title: 'Web Design Freelance',
      category: 'Freelance & Side Gig',
      amount: 28000,
      date: makeDate(10),
      paymentMethod: 'UPI (GPay / PhonePe / Paytm)',
      notes: 'Landing page revamp project milestone 2',
    },
    {
      id: 'tx_samp_7',
      type: 'expense',
      title: 'Swiggy Gourmet Dinner',
      category: 'Food & Dining',
      amount: 1120,
      date: makeDate(11),
      paymentMethod: 'UPI (GPay / PhonePe / Paytm)',
      notes: 'Weekend meal with friends',
    },
    {
      id: 'tx_samp_8',
      type: 'expense',
      title: 'Petrol Fueling',
      category: 'Fuel & Transport',
      amount: 2600,
      date: makeDate(12),
      paymentMethod: 'Credit Card',
      notes: 'Full tank at IndianOil station',
    },
    {
      id: 'tx_samp_9',
      type: 'expense',
      title: 'Amazon Great Indian Sale',
      category: 'Shopping & Apparel',
      amount: 4890,
      date: makeDate(14),
      paymentMethod: 'Credit Card',
      notes: 'Wireless headphones & casual shoes',
    },
    {
      id: 'tx_samp_10',
      type: 'expense',
      title: 'Netflix & Spotify Family',
      category: 'Entertainment & OTT',
      amount: 828,
      date: makeDate(15),
      paymentMethod: 'Credit Card',
      notes: 'Monthly recurring entertainment subscriptions',
    },
    {
      id: 'tx_samp_11',
      type: 'expense',
      title: 'Apollo Pharmacy Health Check',
      category: 'Health & Pharmacy',
      amount: 1180,
      date: makeDate(16),
      paymentMethod: 'UPI (GPay / PhonePe / Paytm)',
      notes: 'Routine vitamins and supplements',
    },
    {
      id: 'tx_samp_12',
      type: 'expense',
      title: 'Blue Tokai Specialty Coffee',
      category: 'Food & Dining',
      amount: 460,
      date: makeDate(today.getDate() > 2 ? today.getDate() - 1 : 2),
      paymentMethod: 'UPI (GPay / PhonePe / Paytm)',
      notes: 'Coffee & croissant',
    },
    {
      id: 'tx_samp_13',
      type: 'income',
      title: 'Quarterly Stock Dividend',
      category: 'Dividends & Interest',
      amount: 3200,
      date: makeDate(today.getDate()),
      paymentMethod: 'Net Banking',
      notes: 'TCS & Infosys dividend payout',
    },
  ];
};
