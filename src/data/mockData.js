export const INITIAL_TRANSACTIONS = [
  { id: 1, date: "2025-03-01", description: "Salary", category: "Income", amount: 85000, type: "income" },
  { id: 2, date: "2025-03-02", description: "Rent", category: "Housing", amount: -22000, type: "expense" },
  { id: 3, date: "2025-03-03", description: "Groceries - BigBasket", category: "Food", amount: -3200, type: "expense" },
  { id: 4, date: "2025-03-05", description: "Netflix", category: "Entertainment", amount: -649, type: "expense" },
  { id: 5, date: "2025-03-06", description: "Freelance Project", category: "Income", amount: 18000, type: "income" },
  { id: 6, date: "2025-03-08", description: "Petrol", category: "Transport", amount: -2100, type: "expense" },
  { id: 7, date: "2025-03-10", description: "Electricity Bill", category: "Utilities", amount: -1850, type: "expense" },
  { id: 8, date: "2025-03-12", description: "Dinner - Prego", category: "Food", amount: -1200, type: "expense" },
  { id: 9, date: "2025-03-14", description: "Medical - Pharmacy", category: "Health", amount: -870, type: "expense" },
  { id: 10, date: "2025-03-15", description: "Gym Membership", category: "Health", amount: -1500, type: "expense" },
  { id: 11, date: "2025-03-17", description: "Swiggy Order", category: "Food", amount: -450, type: "expense" },
  { id: 12, date: "2025-03-18", description: "Dividend - HDFC", category: "Income", amount: 4200, type: "income" },
  { id: 13, date: "2025-03-20", description: "Uber rides", category: "Transport", amount: -780, type: "expense" },
  { id: 14, date: "2025-03-22", description: "Clothing - Myntra", category: "Shopping", amount: -3800, type: "expense" },
  { id: 15, date: "2025-03-24", description: "Internet - Jio Fiber", category: "Utilities", amount: -999, type: "expense" },
  { id: 16, date: "2025-03-25", description: "Book purchase", category: "Education", amount: -620, type: "expense" },
  { id: 17, date: "2025-03-27", description: "Consulting Fee", category: "Income", amount: 12000, type: "income" },
  { id: 18, date: "2025-03-28", description: "Weekend Trip", category: "Travel", amount: -8500, type: "expense" },
  { id: 19, date: "2025-03-29", description: "OTT - Hotstar", category: "Entertainment", amount: -299, type: "expense" },
  { id: 20, date: "2025-03-31", description: "Mobile Recharge", category: "Utilities", amount: -599, type: "expense" },
  { id: 21, date: "2025-02-01", description: "Salary", category: "Income", amount: 85000, type: "income" },
  { id: 22, date: "2025-02-03", description: "Rent", category: "Housing", amount: -22000, type: "expense" },
  { id: 23, date: "2025-02-07", description: "Groceries", category: "Food", amount: -2900, type: "expense" },
  { id: 24, date: "2025-02-10", description: "Freelance Project", category: "Income", amount: 9500, type: "income" },
  { id: 25, date: "2025-02-14", description: "Valentine Dinner", category: "Food", amount: -2400, type: "expense" },
  { id: 26, date: "2025-02-18", description: "Clothing", category: "Shopping", amount: -5200, type: "expense" },
  { id: 27, date: "2025-02-20", description: "Electricity Bill", category: "Utilities", amount: -1600, type: "expense" },
  { id: 28, date: "2025-02-25", description: "Medical checkup", category: "Health", amount: -2100, type: "expense" },
];

export const MONTHLY_TREND = [
  { month: "Oct", income: 95000, expenses: 38000, balance: 57000 },
  { month: "Nov", income: 88000, expenses: 42000, balance: 46000 },
  { month: "Dec", income: 102000, expenses: 55000, balance: 47000 },
  { month: "Jan", income: 85000, expenses: 36000, balance: 49000 },
  { month: "Feb", income: 94500, expenses: 36200, balance: 58300 },
  { month: "Mar", income: 119200, expenses: 49117, balance: 70083 },
];

export const CATEGORY_COLORS = {
  Housing: "#F59E0B",
  Food: "#10B981",
  Transport: "#3B82F6",
  Utilities: "#8B5CF6",
  Entertainment: "#EC4899",
  Health: "#EF4444",
  Shopping: "#F97316",
  Travel: "#06B6D4",
  Education: "#84CC16",
  Income: "#22C55E",
};

export const ALL_CATEGORIES = ["Housing", "Food", "Transport", "Utilities", "Entertainment", "Health", "Shopping", "Travel", "Education"];