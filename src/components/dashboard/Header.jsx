import React from "react";

export default function Header({ role, setRole, activeTab, setActiveTab, isAdmin, setShowModal }) {
  const TABS = ["overview", "transactions", "insights"];

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 sm:px-6 h-auto md:h-16 py-3 md:py-0 border-b border-white/10 backdrop-blur bg-[#080D1A]/90 sticky top-0 z-50 gap-3">
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 32, height: 32,
              background: "linear-gradient(135deg, #F59E0B, #F97316)",
              borderRadius: 8, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 16,
            }}
          >
            ₹
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em" }}>
            FinFlow
          </span>
        </div>

        <div className="flex flex-wrap gap-2 bg-white/5 rounded-xl p-1 w-full md:w-auto justify-center">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "6px 18px", borderRadius: 8, border: "none",
                background: activeTab === tab ? "rgba(255,255,255,0.1)" : "transparent",
                color: activeTab === tab ? "#F1F5F9" : "#64748B",
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                fontSize: 13, fontWeight: 600, textTransform: "capitalize", transition: "all 0.15s",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-between md:justify-end w-full md:w-auto">
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "6px 12px" }}>
            <span style={{ fontSize: 12, color: "#64748B" }}>Role:</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ background: "transparent", border: "none", color: role === "admin" ? "#F59E0B" : "#94A3B8", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", outline: "none" }}
            >
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              style={{ padding: "8px 18px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #F59E0B, #F97316)", color: "#0A0F1E", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}
            >
              + Add
            </button>
          )}
        </div>
      </div>

      {role === "viewer" && (
        <div style={{ background: "rgba(99,102,241,0.1)", borderBottom: "1px solid rgba(99,102,241,0.2)", padding: "8px 32px", fontSize: 12, color: "#818CF8", display: "flex", alignItems: "center", gap: 8 }}>
          👁 Viewer mode — you can explore data but cannot add or delete transactions.
        </div>
      )}
    </>
  );
}