import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import CustomTooltip from "../common/CustomTooltip";
import { MONTHLY_TREND, CATEGORY_COLORS } from "../../data/mockData";
import { fmt } from "../../utils/format";

export default function InsightsSection({ categoryBreakdown, totalIncome, totalExpenses, balance }) {
  const marIncome = MONTHLY_TREND[5].income;
  const febIncome = MONTHLY_TREND[4].income;
  const incomeGrowth = (((marIncome - febIncome) / febIncome) * 100).toFixed(1);
  const topCategory = categoryBreakdown[0];

  const insightCards = [
    {
      title: "Top Spending Category", icon: "🏠",
      color: CATEGORY_COLORS[topCategory?.name] || "#F59E0B",
      main: topCategory?.name || "—",
      sub: topCategory ? `${fmt(topCategory.value)} spent` : "No data",
    },
    { title: "Income Growth", icon: "📈", color: "#10B981", main: `+${incomeGrowth}%`, sub: "vs previous month" },
    {
      title: "Savings Rate", icon: "💰", color: "#F59E0B",
      main: `${((balance / totalIncome) * 100).toFixed(1)}%`,
      sub: `${fmt(balance)} saved of ${fmt(totalIncome)}`,
    },
  ];

  const momItems = [
    { label: "Income", feb: MONTHLY_TREND[4].income, mar: MONTHLY_TREND[5].income, color: "#10B981" },
    { label: "Expenses", feb: MONTHLY_TREND[4].expenses, mar: MONTHLY_TREND[5].expenses, color: "#EF4444" },
    { label: "Net Saved", feb: MONTHLY_TREND[4].balance, mar: MONTHLY_TREND[5].balance, color: "#F59E0B" },
  ];

  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {insightCards.map((card) => (
          <div
            key={card.title}
            style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${card.color}30`, borderRadius: 16, padding: "24px 28px", position: "relative", overflow: "hidden" }}
          >
            <div style={{ position: "absolute", top: -20, right: -20, fontSize: 80, opacity: 0.06 }}>{card.icon}</div>
            <div style={{ fontSize: 12, color: "#64748B", marginBottom: 12, letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 600 }}>{card.title}</div>
            <div style={{ fontSize: 34, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: card.color, letterSpacing: "-0.02em" }}>{card.main}</div>
            <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 6 }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Spending Breakdown Bars */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "24px 28px" }}>
        <h3 style={{ margin: "0 0 4px", fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600 }}>Spending Breakdown</h3>
        <p style={{ margin: "0 0 24px", fontSize: 12, color: "#64748B" }}>How your money is distributed</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {categoryBreakdown.map((c) => {
            const pct = ((c.value / totalExpenses) * 100).toFixed(1);
            return (
              <div key={c.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: "#94A3B8", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: CATEGORY_COLORS[c.name] || "#64748B", display: "inline-block" }} />
                    {c.name}
                  </span>
                  <span style={{ color: "#E2E8F0", fontWeight: 600 }}>
                    {fmt(c.value)} <span style={{ color: "#64748B", fontWeight: 400 }}>({pct}%)</span>
                  </span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: CATEGORY_COLORS[c.name] || "#64748B", borderRadius: 3, transition: "width 0.8s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Month-over-Month */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 lg:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-1">Month-over-Month</h3>
        <p className="text-xs text-slate-500 mb-4 sm:mb-5">Feb vs Mar comparison</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {momItems.map((m) => {
            const delta = (((m.mar - m.feb) / m.feb) * 100).toFixed(1);
            const up = m.mar >= m.feb;
            return (
              <div key={m.label} className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5">
                <div className="text-[11px] sm:text-xs text-slate-500 uppercase tracking-wider mb-3">{m.label}</div>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="text-[10px] text-slate-500 mb-1">Feb</div>
                    <div className="text-sm sm:text-base font-semibold text-slate-400">{fmt(m.feb)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 mb-1">Mar</div>
                    <div className="text-sm sm:text-base font-semibold" style={{ color: m.color }}>{fmt(m.mar)}</div>
                  </div>
                </div>
                <div className={`text-xs sm:text-sm font-semibold ${up ? "text-green-400" : "text-red-400"}`}>
                  {up ? "▲" : "▼"} {Math.abs(delta)}% {up ? "increase" : "decrease"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}