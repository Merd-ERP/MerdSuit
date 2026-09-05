import { useApp } from "../../context/AppContext";
import Card from "../common/Card";
import { formatCurrency } from "../../utils/currency";
import { getMonthlyReceivedRevenue } from "./dashboardAnalytics.js";

function RevenueChart() {
  const { invoices } = useApp();
  const months = getMonthlyReceivedRevenue(invoices);
  const maximumRevenue = Math.max(...months.map((month) => month.total), 0);

  return (
    <Card className="mt-6">
      <h2 className="text-lg font-semibold text-slate-800">Revenue Overview</h2>
      <p className="mt-1 text-sm text-slate-500">Monthly payments received.</p>
      {months.length === 0 ? (
        <div className="mt-5 flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-sm text-slate-500">
          No payment revenue available yet.
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto pb-2">
          <div className="flex h-64 min-w-[420px] items-end gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:gap-5" role="img" aria-label="Monthly payments received chart">
            {months.map((month) => {
              const height = maximumRevenue > 0
                ? Math.max(6, (month.total / maximumRevenue) * 100)
                : 0;
              return (
                <div key={month.key} className="flex min-w-0 flex-1 flex-col items-center justify-end self-stretch">
                  <span className="mb-2 max-w-full break-words text-center text-xs font-semibold text-slate-700">
                    {formatCurrency(month.total, { minimumFractionDigits: 2 })}
                  </span>
                  <div className="flex w-full flex-1 items-end justify-center" aria-hidden="true">
                    <div className="w-full max-w-16 rounded-t-lg bg-emerald-500 transition-all" style={{ height: `${height}%` }} />
                  </div>
                  <span className="mt-2 whitespace-nowrap text-xs text-slate-500">{month.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}

export default RevenueChart;
