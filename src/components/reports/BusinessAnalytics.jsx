import { useMemo } from "react";
import { useApp } from "../../context/AppContext";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function BusinessAnalytics() {
  const { invoices, expenses } = useApp();

  const chartData = useMemo(() => {
    const revenue = invoices.reduce(
      (sum, invoice) => sum + Number(invoice.total || 0),
      0
    );

    const expense = expenses.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    return [
      {
        name: "Business",
        Revenue: revenue,
        Expenses: expense,
        Profit: revenue - expense,
      },
    ];
  }, [invoices, expenses]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Business Analytics
        </h2>

        <p className="text-slate-500">
          Revenue, expenses and profit overview.
        </p>
      </div>

      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="Revenue"
              stroke="#16a34a"
              strokeWidth={3}
            />

            <Line
              type="monotone"
              dataKey="Expenses"
              stroke="#dc2626"
              strokeWidth={3}
            />

            <Line
              type="monotone"
              dataKey="Profit"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BusinessAnalytics;