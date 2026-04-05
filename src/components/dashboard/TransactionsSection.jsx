import React from "react";
import { CATEGORY_COLORS, ALL_CATEGORIES } from "../../data/mockData";
import { fmt, fmtDate } from "../../utils/format";

export default function TransactionsSection({
  filtered, search, setSearch,
  filterType, setFilterType,
  filterCategory, setFilterCategory,
  sortBy, setSortBy,
  isAdmin, handleDelete, exportCSV,
}) {
  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
            val: filterType, set: setFilterType,
            opts: [["all", "All Types"], ["income", "Income"], ["expense", "Expense"]],
          },
          {
            val: filterCategory, set: setFilterCategory,
            opts: [["all", "All Categories"], ...ALL_CATEGORIES.map((c) => [c, c])],
          },
          {
            val: sortBy, set: setSortBy,
            opts: [["date-desc", "Newest First"], ["date-asc", "Oldest First"], ["amount-desc", "Highest Amount"], ["amount-asc", "Lowest Amount"]],
          },
        ].map(({ val, set, opts }, i) => (
          <select
            key={i} value={val}
            onChange={(e) => set(e.target.value)}
            className="w-full sm:w-auto bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300"
          >
            {opts.map(([v, l], j) => (
              <option key={`${v}-${j}`} value={v}>{l}</option>
            ))}
          </select>
        ))}

        {isAdmin && (
          <button
            onClick={exportCSV}
            style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#94A3B8", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}
          >
            ↓ Export CSV
          </button>
        )}
      </div>

      <div style={{ fontSize: 12, color: "#64748B" }}>{filtered.length} transactions found</div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {/* Header */}
        <div
          className={`hidden sm:grid px-6 py-3 border-b border-white/10 text-xs text-slate-500 uppercase tracking-wider font-semibold ${
            isAdmin ? "grid-cols-[120px_1fr_130px_110px_120px_80px]" : "grid-cols-[120px_1fr_130px_110px_120px]"
          }`}
        >
          <span>Date</span>
          <span>Description</span>
          <span>Category</span>
          <span>Type</span>
          <span className="text-right">Amount</span>
          {isAdmin && <span className="text-center">Act</span>}
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <div className="text-3xl mb-2">🔍</div>
            <div className="text-sm">No transactions match your filters</div>
          </div>
        ) : (
          filtered.map((t) => (
            <div
              key={t.id}
              className={`border-b border-white/5 p-4 sm:px-6 sm:py-4 flex flex-col gap-3 sm:grid sm:items-center hover:bg-white/5 transition ${
                isAdmin ? "sm:grid-cols-[120px_1fr_130px_110px_120px_80px]" : "sm:grid-cols-[120px_1fr_130px_110px_120px]"
              }`}
            >
              {/* Mobile View */}
              <div className="flex justify-between sm:hidden text-xs text-slate-400">
                <span>{fmtDate(t.date)}</span>
                <span className={`${t.type === "income" ? "text-green-400" : "text-red-400"} font-semibold`}>
                  {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                </span>
              </div>
              <div className="sm:hidden text-sm font-medium text-slate-200">{t.description}</div>
              <div className="sm:hidden flex justify-between items-center">
                <span className="text-xs px-2 py-1 rounded-md" style={{ background: `${CATEGORY_COLORS[t.category]}22`, color: CATEGORY_COLORS[t.category] }}>
                  {t.category}
                </span>
                <span className={`text-xs font-semibold ${t.type === "income" ? "text-green-400" : "text-slate-400"}`}>
                  {t.type === "income" ? "↑ Income" : "↓ Expense"}
                </span>
              </div>

              {/* Desktop View */}
              <div className="hidden sm:block text-xs text-slate-400">{fmtDate(t.date)}</div>
              <div className="hidden sm:block text-sm font-medium text-slate-200">{t.description}</div>
              <div className="hidden sm:block">
                <span className="text-xs px-2 py-1 rounded-md" style={{ background: `${CATEGORY_COLORS[t.category]}22`, color: CATEGORY_COLORS[t.category] }}>
                  {t.category}
                </span>
              </div>
              <div className={`hidden sm:block text-xs font-semibold ${t.type === "income" ? "text-green-400" : "text-slate-400"}`}>
                {t.type === "income" ? "↑ Income" : "↓ Expense"}
              </div>
              <div className={`hidden sm:block text-right font-bold ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>
                {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
              </div>
              {isAdmin && (
                <div className="hidden sm:flex justify-center">
                  <button onClick={() => handleDelete(t.id)} className="text-slate-400 hover:text-red-400 transition">✕</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}