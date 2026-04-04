import React from "react";

export default function SummaryCard({ label, value, sub, color, icon, trend }) {
  return (
    <div className="relative flex flex-col gap-2 p-4 sm:p-5 lg:p-6 rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]">

      {/* Gradient overlay */}
      <div
        className="absolute top-0 right-0 w-[90px] sm:w-[110px] h-[90px] sm:h-[110px] rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at 80% 20%, ${color}18, transparent 70%)`,
        }}
      />

      {/* Header */}
      <div className="flex justify-between items-start">
        <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <span className="text-lg sm:text-xl">{icon}</span>
      </div>

      {/* Value */}
      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-100 tracking-tight leading-tight">
        {value}
      </div>

      {/* Sub text */}
      {sub && (
        <div
          className={`text-[11px] sm:text-xs flex items-center gap-1 ${
            trend > 0
              ? "text-green-500"
              : trend < 0
              ? "text-red-500"
              : "text-slate-500"
          }`}
        >
          {trend > 0 ? "▲" : trend < 0 ? "▼" : ""} {sub}
        </div>
      )}
    </div>
  );
}