import React from "react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import CustomTooltip from "../common/CustomTooltip";
import { MONTHLY_TREND, CATEGORY_COLORS } from "../../data/mockData";
import { fmt } from "../../utils/format";

export default function ChartsSection({ categoryBreakdown }) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Balance Trend */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600 }}>
              Balance Trend
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748B" }}>6-month overview</p>
          </div>
          {MONTHLY_TREND.length === 0 ? (
            <div className="flex items-center justify-center h-[250px] text-slate-500">No trend data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={MONTHLY_TREND}>
                <defs>
                  <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="income" name="Income" stroke="#10B981" fill="url(#incGrad)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="balance" name="Balance" stroke="#F59E0B" fill="url(#balGrad)" strokeWidth={2.5} dot={{ fill: "#F59E0B", r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Spending Breakdown Pie */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 style={{ margin: "0 0 4px", fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600 }}>Spending</h3>
          <p style={{ margin: "0 0 16px", fontSize: 12, color: "#64748B" }}>By category</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={categoryBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={72} strokeWidth={0}>
                {categoryBreakdown.map((e, i) => (
                  <Cell key={i} fill={CATEGORY_COLORS[e.name] || "#64748B"} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
            {categoryBreakdown.slice(0, 4).map((c) => (
              <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: CATEGORY_COLORS[c.name] || "#64748B", display: "inline-block" }} />
                  <span style={{ color: "#94A3B8" }}>{c.name}</span>
                </div>
                <span style={{ color: "#F1F5F9", fontWeight: 600 }}>{fmt(c.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Bar Comparison */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 style={{ margin: "0 0 4px", fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600 }}>
          Monthly Income vs Expenses
        </h3>
        <p style={{ margin: "0 0 20px", fontSize: 12, color: "#64748B" }}>Side-by-side comparison</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={MONTHLY_TREND} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#EF444480" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}