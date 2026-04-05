import React from "react";
import SummaryCard from "../common/SummaryCard";
import { fmt } from "../../utils/format";
import { MONTHLY_TREND } from "../../data/mockData";

export default function SummarySection({ balance, totalIncome, totalExpenses }) {
  const marIncome = MONTHLY_TREND[5].income;
  const febIncome = MONTHLY_TREND[4].income;
  const incomeGrowth = (((marIncome - febIncome) / febIncome) * 100).toFixed(1);

  return (
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
  );
}