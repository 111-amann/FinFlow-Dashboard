import React from "react";
import { fmt } from "../utils/format";

export default function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-[#0F1729] border border-white/10 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm max-w-[200px] sm:max-w-[260px] break-words shadow-lg">

      <div className="text-slate-400 mb-1 truncate">
        {label}
      </div>

      {payload.map((p, i) => (
        <div
          key={i}
          className="flex items-center gap-2"
          style={{ color: p.color }}
        >
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: p.color }}
          />
          <span className="flex-1 break-words">
            {p.name}:{" "}
            <strong className="text-slate-100">
              {typeof p.value === "number" ? fmt(p.value) : p.value}
            </strong>
          </span>
        </div>
      ))}
    </div>
  );
}