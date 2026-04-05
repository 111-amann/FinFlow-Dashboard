import React, { useState } from "react";
import { ALL_CATEGORIES } from "../../data/mockData";

export default function AddTransactionModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    category: "Food",
    amount: "",
    type: "expense",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.description || !form.amount) return;

    onAdd({
      ...form,
      id: Date.now(),
      amount:
        form.type === "expense"
          ? -Math.abs(+form.amount)
          : +Math.abs(+form.amount),
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#0F1729] border border-white/10 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 sm:p-6 flex flex-col gap-5 shadow-xl">

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-semibold text-slate-100">
          Add Transaction
        </h2>

        {/* Inputs */}
        {[
          { label: "Date", key: "date", type: "date" },
          { label: "Description", key: "description", type: "text" },
          { label: "Amount (₹)", key: "amount", type: "number" },
        ].map((f) => (
          <div key={f.key} className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500 uppercase tracking-wider">
              {f.label}
            </label>
            <input
              type={f.type}
              value={form[f.key]}
              onChange={(e) => set(f.key, e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition"
            />
          </div>
        ))}

        {/* Type buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          {["expense", "income"].map((t) => (
            <button
              key={t}
              onClick={() => set("type", t)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                form.type === t
                  ? t === "income"
                    ? "bg-green-500/20 text-green-500 border border-green-500"
                    : "bg-red-500/20 text-red-500 border border-red-500"
                  : "border border-white/10 text-slate-400 hover:bg-white/5"
              }`}
            >
              {t === "income" ? "↑ Income" : "↓ Expense"}
            </button>
          ))}
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-500 uppercase tracking-wider">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40"
          >
            {ALL_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            onClick={onClose}
            className="w-full py-2 border border-white/10 rounded-lg text-slate-400 hover:bg-white/5 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold hover:opacity-90 active:scale-[0.98] transition"
          >
            Add Transaction
          </button>
        </div>
      </div>
    </div>
  );
}