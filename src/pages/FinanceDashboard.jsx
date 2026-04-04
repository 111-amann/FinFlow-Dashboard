import React, { useState, useMemo, useEffect } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import SummaryCard from "../components/SummaryCard";
import CustomTooltip from "../components/CustomTooltip";
import AddTransactionModal from "../components/AddTransactionModal";

import {
  INITIAL_TRANSACTIONS,
  MONTHLY_TREND,
  CATEGORY_COLORS,
  ALL_CATEGORIES,
} from "../data/mockData";

import { fmt, fmtDate } from "../utils/format";

export default function FinanceDashboard() {
  const [transactions, setTransactions] = useState(() => {
    try {
      const s = localStorage.getItem("fin_txns");
      return s ? JSON.parse(s) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });
  const [role, setRole] = useState("admin");
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("fin_txns", JSON.stringify(transactions));
    } catch {}
  }, [transactions]);

  const isAdmin = role === "admin";

  // Derived
  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + t.amount, 0),
    [transactions],
  );
  const totalExpenses = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + Math.abs(t.amount), 0),
    [transactions],
  );
  const balance = totalIncome - totalExpenses;

  const categoryBreakdown = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + Math.abs(t.amount);
      });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (search)
      list = list.filter(
        (t) =>
          t.description.toLowerCase().includes(search.toLowerCase()) ||
          t.category.toLowerCase().includes(search.toLowerCase()),
      );
    if (filterType !== "all") list = list.filter((t) => t.type === filterType);
    if (filterCategory !== "all")
      list = list.filter((t) => t.category === filterCategory);
    list.sort((a, b) => {
      if (sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
      if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
      if (sortBy === "amount-desc")
        return Math.abs(b.amount) - Math.abs(a.amount);
      if (sortBy === "amount-asc")
        return Math.abs(a.amount) - Math.abs(b.amount);
      return 0;
    });
    return list;
  }, [transactions, search, filterType, filterCategory, sortBy]);

  const topCategory = categoryBreakdown[0];
  const marIncome = MONTHLY_TREND[5].income;
  const febIncome = MONTHLY_TREND[4].income;
  const incomeGrowth = (((marIncome - febIncome) / febIncome) * 100).toFixed(1);

  const handleAdd = (txn) => setTransactions((prev) => [txn, ...prev]);
  const handleDelete = (id) =>
    setTransactions((prev) => prev.filter((t) => t.id !== id));

  const exportCSV = () => {
    const rows = [
      ["Date", "Description", "Category", "Type", "Amount"],
      ...transactions.map((t, i) => [
        t.date,
        t.description,
        t.category,
        t.type,
        t.amount,
      ]),
    ];
    const csv = rows.map((r, i) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
  };

  const TABS = ["overview", "transactions", "insights"];

  return (
    <div className="min-h-screen bg-[#080D1A] text-slate-100">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease forwards; }
        .row-hover:hover { background: rgba(255,255,255,0.04) !important; }
        select option { background: #0F1729; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 sm:px-6 h-auto md:h-16 py-3 md:py-0 border-b border-white/10 backdrop-blur bg-[#080D1A]/90 sticky top-0 z-50 gap-3">
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, #F59E0B, #F97316)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            ₹
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            FinFlow
          </span>
        </div>

        <div className="flex flex-wrap gap-2 bg-white/5 rounded-xl p-1 w-full md:w-auto justify-center">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "6px 18px",
                borderRadius: 8,
                border: "none",
                background:
                  activeTab === tab ? "rgba(255,255,255,0.1)" : "transparent",
                color: activeTab === tab ? "#F1F5F9" : "#64748B",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                textTransform: "capitalize",
                transition: "all 0.15s",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-between md:justify-end w-full md:w-auto">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
              padding: "6px 12px",
            }}
          >
            <span style={{ fontSize: 12, color: "#64748B" }}>Role:</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                color: role === "admin" ? "#F59E0B" : "#94A3B8",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              style={{
                padding: "8px 18px",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg, #F59E0B, #F97316)",
                color: "#0A0F1E",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              + Add
            </button>
          )}
        </div>
      </div>

      {/* Role Banner */}
      {role === "viewer" && (
        <div
          style={{
            background: "rgba(99,102,241,0.1)",
            borderBottom: "1px solid rgba(99,102,241,0.2)",
            padding: "8px 32px",
            fontSize: 12,
            color: "#818CF8",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          👁 Viewer mode — you can explore data but cannot add or delete
          transactions.
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div
            className="fade-up"
            style={{ display: "flex", flexDirection: "column", gap: 28 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <SummaryCard
                label="Net Balance"
                value={fmt(balance)}
                icon="⚖️"
                color="#F59E0B"
                sub="Across all time"
                trend={0}
              />
              <SummaryCard
                label="Total Income"
                value={fmt(totalIncome)}
                icon="↑"
                color="#10B981"
                sub={`+${incomeGrowth}% vs last month`}
                trend={1}
              />
              <SummaryCard
                label="Total Expenses"
                value={fmt(totalExpenses)}
                icon="↓"
                color="#EF4444"
                sub="This period"
                trend={-1}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Balance Trend */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div style={{ marginBottom: 20 }}>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 18,
                      fontWeight: 600,
                    }}
                  >
                    Balance Trend
                  </h3>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: 12,
                      color: "#64748B",
                    }}
                  >
                    6-month overview
                  </p>
                </div>
                {MONTHLY_TREND.length === 0 ? (
                  <div className="flex items-center justify-center h-[250px] text-slate-500">
                    No trend data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={MONTHLY_TREND}>
                      <defs>
                        <linearGradient
                          id="balGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#F59E0B"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="100%"
                            stopColor="#F59E0B"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="incGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#10B981"
                            stopOpacity={0.2}
                          />
                          <stop
                            offset="100%"
                            stopColor="#10B981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.04)"
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: "#64748B", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#64748B", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="income"
                        name="Income"
                        stroke="#10B981"
                        fill="url(#incGrad)"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Area
                        type="monotone"
                        dataKey="balance"
                        name="Balance"
                        stroke="#F59E0B"
                        fill="url(#balGrad)"
                        strokeWidth={2.5}
                        dot={{ fill: "#F59E0B", r: 4 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Spending Breakdown Pie */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3
                  style={{
                    margin: "0 0 4px",
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 18,
                    fontWeight: 600,
                  }}
                >
                  Spending
                </h3>
                <p
                  style={{ margin: "0 0 16px", fontSize: 12, color: "#64748B" }}
                >
                  By category
                </p>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={72}
                      strokeWidth={0}
                    >
                      {categoryBreakdown.map((e, i) => (
                        <Cell
                          key={i}
                          fill={CATEGORY_COLORS[e.name] || "#64748B"}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    marginTop: 12,
                  }}
                >
                  {categoryBreakdown.slice(0, 4).map((c, i) => (
                    <div
                      key={c.name}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: 12,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 2,
                            background: CATEGORY_COLORS[c.name] || "#64748B",
                            display: "inline-block",
                          }}
                        />
                        <span style={{ color: "#94A3B8" }}>{c.name}</span>
                      </div>
                      <span style={{ color: "#F1F5F9", fontWeight: 600 }}>
                        {fmt(c.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly Bar Comparison */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3
                style={{
                  margin: "0 0 4px",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                Monthly Income vs Expenses
              </h3>
              <p style={{ margin: "0 0 20px", fontSize: 12, color: "#64748B" }}>
                Side-by-side comparison
              </p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={MONTHLY_TREND} barGap={4}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.04)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#64748B", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="income"
                    name="Income"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="expenses"
                    name="Expenses"
                    fill="#EF444480"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === "transactions" && (
          <div
            className="fade-up"
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            {/* Controls */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-stretch sm:items-center">
              <input
                placeholder="🔍  Search transactions…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none"
              />

              {[
                {
                  label: "Type",
                  val: filterType,
                  set: setFilterType,
                  opts: [
                    ["all", "All Types"],
                    ["income", "Income"],
                    ["expense", "Expense"],
                  ],
                },
                {
                  label: "Category",
                  val: filterCategory,
                  set: setFilterCategory,
                  opts: [
                    ["all", "All Categories"],
                    ...ALL_CATEGORIES.map((c, i) => [c, c]),
                  ],
                },
                {
                  label: "Sort",
                  val: sortBy,
                  set: setSortBy,
                  opts: [
                    ["date-desc", "Newest First"],
                    ["date-asc", "Oldest First"],
                    ["amount-desc", "Highest Amount"],
                    ["amount-asc", "Lowest Amount"],
                  ],
                },
              ].map(({ val, set, opts }, i) => (
                <select
                  value={val} key={i}
                  onChange={(e) => set(e.target.value)}
                  className="w-full sm:w-auto bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300"
                >
                  {opts.map(([v, l], i) => (
                    <option key={`${v}-${i}`} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              ))}

              {isAdmin && (
                <button
                  onClick={exportCSV}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "transparent",
                    color: "#94A3B8",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  ↓ Export CSV
                </button>
              )}
            </div>

            <div style={{ fontSize: 12, color: "#64748B" }}>
              {filtered.length} transactions found
            </div>

            {/* Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              {/* Header (desktop only) */}
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                {/* HEADER (DESKTOP ONLY) */}
                <div
                  className={`hidden sm:grid px-6 py-3 border-b border-white/10 text-xs text-slate-500 uppercase tracking-wider font-semibold ${
                    isAdmin
                      ? "grid-cols-[120px_1fr_130px_110px_120px_80px]"
                      : "grid-cols-[120px_1fr_130px_110px_120px]"
                  }`}
                >
                  <span>Date</span>
                  <span>Description</span>
                  <span>Category</span>
                  <span>Type</span>
                  <span className="text-right">Amount</span>
                  {isAdmin && <span className="text-center">Act</span>}
                </div>

                {/* EMPTY STATE */}
                {filtered.length === 0 ? (
                  <div className="py-12 text-center text-slate-500">
                    <div className="text-3xl mb-2">🔍</div>
                    <div className="text-sm">
                      No transactions match your filters
                    </div>
                  </div>
                ) : (
                  filtered.map((t, i) => (
                    <div
                      key={t.id}
                      className={`border-b border-white/5 p-4 sm:px-6 sm:py-4 flex flex-col gap-3 sm:grid sm:items-center hover:bg-white/5 transition ${
                        isAdmin
                          ? "sm:grid-cols-[120px_1fr_130px_110px_120px_80px]"
                          : "sm:grid-cols-[120px_1fr_130px_110px_120px]"
                      }`}
                    >
                      {/* MOBILE VIEW */}
                      <div className="flex justify-between sm:hidden text-xs text-slate-400">
                        <span>{fmtDate(t.date)}</span>
                        <span
                          className={`${t.type === "income" ? "text-green-400" : "text-red-400"} font-semibold`}
                        >
                          {t.type === "income" ? "+" : "-"}
                          {fmt(t.amount)}
                        </span>
                      </div>

                      <div className="sm:hidden text-sm font-medium text-slate-200">
                        {t.description}
                      </div>

                      <div className="sm:hidden flex justify-between items-center">
                        <span
                          className="text-xs px-2 py-1 rounded-md"
                          style={{
                            background: `${CATEGORY_COLORS[t.category]}22`,
                            color: CATEGORY_COLORS[t.category],
                          }}
                        >
                          {t.category}
                        </span>

                        <span
                          className={`text-xs font-semibold ${
                            t.type === "income"
                              ? "text-green-400"
                              : "text-slate-400"
                          }`}
                        >
                          {t.type === "income" ? "↑ Income" : "↓ Expense"}
                        </span>
                      </div>

                      {/* DESKTOP VIEW (MATCHES HEADER EXACTLY) */}
                      <div className="hidden sm:block text-xs text-slate-400">
                        {fmtDate(t.date)}
                      </div>

                      <div className="hidden sm:block text-sm font-medium text-slate-200">
                        {t.description}
                      </div>

                      <div className="hidden sm:block">
                        <span
                          className="text-xs px-2 py-1 rounded-md"
                          style={{
                            background: `${CATEGORY_COLORS[t.category]}22`,
                            color: CATEGORY_COLORS[t.category],
                          }}
                        >
                          {t.category}
                        </span>
                      </div>

                      <div
                        className={`hidden sm:block text-xs font-semibold ${
                          t.type === "income"
                            ? "text-green-400"
                            : "text-slate-400"
                        }`}
                      >
                        {t.type === "income" ? "↑ Income" : "↓ Expense"}
                      </div>

                      <div
                        className={`hidden sm:block text-right font-bold ${
                          t.type === "income"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {t.type === "income" ? "+" : "-"}
                        {fmt(t.amount)}
                      </div>

                      {isAdmin && (
                        <div className="hidden sm:flex justify-center">
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="text-slate-400 hover:text-red-400 transition"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {filtered.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <div className="text-3xl mb-2">🔍</div>
                  <div className="text-sm">
                    No transactions match your filters
                  </div>
                </div>
              ) : (
                filtered.map((t, i) => (
                  <div
                    key={t.id}
                    className="border-b border-white/5 p-4 sm:px-6 sm:py-4 flex flex-col gap-3 sm:grid sm:grid-cols-[120px_1fr_130px_110px_120px_80px] sm:items-center hover:bg-white/5 transition"
                  >
                    {/* Mobile top row */}
                    <div className="flex justify-between sm:hidden text-xs text-slate-400">
                      <span>{fmtDate(t.date)}</span>
                      <span
                        className={`${t.type === "income" ? "text-green-400" : "text-red-400"} font-semibold`}
                      >
                        {t.type === "income" ? "+" : "-"}
                        {fmt(t.amount)}
                      </span>
                    </div>

                    {/* Description */}
                    <div className="text-sm font-medium text-slate-200">
                      {t.description}
                    </div>

                    {/* Category + Type (mobile) */}
                    <div className="flex justify-between items-center sm:block">
                      <span
                        className="text-xs px-2 py-1 rounded-md"
                        style={{
                          background: `${CATEGORY_COLORS[t.category]}22`,
                          color: CATEGORY_COLORS[t.category],
                        }}
                      >
                        {t.category}
                      </span>

                      <span
                        className={`text-xs font-semibold ${
                          t.type === "income"
                            ? "text-green-400"
                            : "text-slate-400"
                        }`}
                      >
                        {t.type === "income" ? "↑ Income" : "↓ Expense"}
                      </span>
                    </div>

                    {/* Desktop-only */}
                    <div className="hidden sm:block text-xs text-slate-400">
                      {fmtDate(t.date)}
                    </div>

                    <div className="hidden sm:block text-sm font-medium">
                      {t.description}
                    </div>

                    <div className="hidden sm:block">
                      <span
                        className="text-xs px-2 py-1 rounded-md"
                        style={{
                          background: `${CATEGORY_COLORS[t.category]}22`,
                          color: CATEGORY_COLORS[t.category],
                        }}
                      >
                        {t.category}
                      </span>
                    </div>

                    <div
                      className={`hidden sm:block text-xs font-semibold ${
                        t.type === "income"
                          ? "text-green-400"
                          : "text-slate-400"
                      }`}
                    >
                      {t.type === "income" ? "↑ Income" : "↓ Expense"}
                    </div>

                    <div
                      className={`hidden sm:block text-right font-bold ${
                        t.type === "income" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {fmt(t.amount)}
                    </div>

                    {/* Action */}
                    {isAdmin && (
                      <div className="text-right sm:text-center">
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="text-slate-400 hover:text-red-400 transition"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* INSIGHTS TAB */}
        {activeTab === "insights" && (
          <div
            className="fade-up"
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            {/* Insight Cards */}
            <div
              style={{ display: "grid", gap: 16 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {[
                {
                  title: "Top Spending Category",
                  icon: "🏠",
                  color: CATEGORY_COLORS[topCategory?.name] || "#F59E0B",
                  main: topCategory?.name || "—",
                  sub: topCategory
                    ? `${fmt(topCategory.value)} spent`
                    : "No data",
                },
                {
                  title: "Income Growth",
                  icon: "📈",
                  color: "#10B981",
                  main: `+${incomeGrowth}%`,
                  sub: "vs previous month",
                },
                {
                  title: "Savings Rate",
                  icon: "💰",
                  color: "#F59E0B",
                  main: `${((balance / totalIncome) * 100).toFixed(1)}%`,
                  sub: `${fmt(balance)} saved of ${fmt(totalIncome)}`,
                },
              ].map((card) => (
                <div
                  key={card.title}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${card.color}30`,
                    borderRadius: 16,
                    padding: "24px 28px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: -20,
                      right: -20,
                      fontSize: 80,
                      opacity: 0.06,
                    }}
                  >
                    {card.icon}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#64748B",
                      marginBottom: 12,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    {card.title}
                  </div>
                  <div
                    style={{
                      fontSize: 34,
                      fontWeight: 700,
                      fontFamily: "'Playfair Display', serif",
                      color: card.color,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {card.main}
                  </div>
                  <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 6 }}>
                    {card.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Category Breakdown Bar */}
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: "24px 28px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 4px",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                Spending Breakdown
              </h3>
              <p style={{ margin: "0 0 24px", fontSize: 12, color: "#64748B" }}>
                How your money is distributed
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {categoryBreakdown.map((c, i) => {
                  const pct = ((c.value / totalExpenses) * 100).toFixed(1);
                  return (
                    <div key={c.name}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 13,
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            color: "#94A3B8",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: 2,
                              background: CATEGORY_COLORS[c.name] || "#64748B",
                              display: "inline-block",
                            }}
                          />
                          {c.name}
                        </span>
                        <span style={{ color: "#E2E8F0", fontWeight: 600 }}>
                          {fmt(c.value)}{" "}
                          <span style={{ color: "#64748B", fontWeight: 400 }}>
                            ({pct}%)
                          </span>
                        </span>
                      </div>
                      <div
                        style={{
                          height: 6,
                          background: "rgba(255,255,255,0.05)",
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${pct}%`,
                            background: CATEGORY_COLORS[c.name] || "#64748B",
                            borderRadius: 3,
                            transition: "width 0.8s ease",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly Comparison */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 lg:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-1">
                Month-over-Month
              </h3>

              <p className="text-xs text-slate-500 mb-4 sm:mb-5">
                Feb vs Mar comparison
              </p>

              {/* Responsive grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {[
                  {
                    label: "Income",
                    feb: MONTHLY_TREND[4].income,
                    mar: MONTHLY_TREND[5].income,
                    color: "#10B981",
                  },
                  {
                    label: "Expenses",
                    feb: MONTHLY_TREND[4].expenses,
                    mar: MONTHLY_TREND[5].expenses,
                    color: "#EF4444",
                  },
                  {
                    label: "Net Saved",
                    feb: MONTHLY_TREND[4].balance,
                    mar: MONTHLY_TREND[5].balance,
                    color: "#F59E0B",
                  },
                ].map((m, i) => {
                  const delta = (((m.mar - m.feb) / m.feb) * 100).toFixed(1);
                  const up = m.mar >= m.feb;

                  return (
                    <div
                      key={m.label}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5"
                    >
                      {/* Title */}
                      <div className="text-[11px] sm:text-xs text-slate-500 uppercase tracking-wider mb-3">
                        {m.label}
                      </div>

                      {/* Values */}
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <div className="text-[10px] text-slate-500 mb-1">
                            Feb
                          </div>
                          <div className="text-sm sm:text-base font-semibold text-slate-400">
                            {fmt(m.feb)}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[10px] text-slate-500 mb-1">
                            Mar
                          </div>
                          <div
                            className="text-sm sm:text-base font-semibold"
                            style={{ color: m.color }}
                          >
                            {fmt(m.mar)}
                          </div>
                        </div>
                      </div>

                      {/* Change */}
                      <div
                        className={`text-xs sm:text-sm font-semibold ${
                          up ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {up ? "▲" : "▼"} {Math.abs(delta)}%{" "}
                        {up ? "increase" : "decrease"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <AddTransactionModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}
