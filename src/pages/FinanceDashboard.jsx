import React, { useState, useMemo, useEffect } from "react";
import Header from "../components/dashboard/Header";
import SummarySection from "../components/dashboard/SummarySection";
import ChartsSection from "../components/dashboard/ChartsSection";
import TransactionsSection from "../components/dashboard/TransactionsSection";
import InsightsSection from "../components/dashboard/InsightsSection";
import AddTransactionModal from "../components/common/AddTransactionModal";
import { INITIAL_TRANSACTIONS, CATEGORY_COLORS } from "../data/mockData";
import { fmt } from "../utils/format";

export default function FinanceDashboard() {
  const [transactions, setTransactions] = useState(() => {
    try {
      const s = localStorage.getItem("fin_txns");
      return s ? JSON.parse(s) : INITIAL_TRANSACTIONS;
    } catch { return INITIAL_TRANSACTIONS; }
  });
  const [role, setRole] = useState("admin");
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    try { localStorage.setItem("fin_txns", JSON.stringify(transactions)); } catch {}
  }, [transactions]);

  const isAdmin = role === "admin";

  const totalIncome = useMemo(() =>
    transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
    [transactions]);
  const totalExpenses = useMemo(() =>
    transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0),
    [transactions]);
  const balance = totalIncome - totalExpenses;

  const categoryBreakdown = useMemo(() => {
    const map = {};
    transactions.filter((t) => t.type === "expense").forEach((t) => {
      map[t.category] = (map[t.category] || 0) + Math.abs(t.amount);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (search) list = list.filter((t) =>
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()));
    if (filterType !== "all") list = list.filter((t) => t.type === filterType);
    if (filterCategory !== "all") list = list.filter((t) => t.category === filterCategory);
    list.sort((a, b) => {
      if (sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
      if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
      if (sortBy === "amount-desc") return Math.abs(b.amount) - Math.abs(a.amount);
      if (sortBy === "amount-asc") return Math.abs(a.amount) - Math.abs(b.amount);
      return 0;
    });
    return list;
  }, [transactions, search, filterType, filterCategory, sortBy]);

  const handleAdd = (txn) => setTransactions((prev) => [txn, ...prev]);
  const handleDelete = (id) => setTransactions((prev) => prev.filter((t) => t.id !== id));

  const exportCSV = () => {
    const rows = [
      ["Date", "Description", "Category", "Type", "Amount"],
      ...transactions.map((t) => [t.date, t.description, t.category, t.type, t.amount]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "transactions.csv"; a.click();
  };

  return (
    <div className="min-h-screen bg-[#080D1A] text-slate-100">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;700&display=swap');
        * { box-sizing: border-box; }
        * :focus { outline: none !important; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease forwards; }
        select option { background: #0F1729; }
      `}</style>

      <Header role={role} setRole={setRole} activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} setShowModal={setShowModal} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "overview" && (
          <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <SummarySection balance={balance} totalIncome={totalIncome} totalExpenses={totalExpenses} />
            <ChartsSection categoryBreakdown={categoryBreakdown} />
          </div>
        )}

        {activeTab === "transactions" && (
          <TransactionsSection
            filtered={filtered} search={search} setSearch={setSearch}
            filterType={filterType} setFilterType={setFilterType}
            filterCategory={filterCategory} setFilterCategory={setFilterCategory}
            sortBy={sortBy} setSortBy={setSortBy}
            isAdmin={isAdmin} handleDelete={handleDelete} exportCSV={exportCSV}
          />
        )}

        {activeTab === "insights" && (
          <InsightsSection
            categoryBreakdown={categoryBreakdown}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            balance={balance}
          />
        )}
      </div>

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
    </div>
  );
}