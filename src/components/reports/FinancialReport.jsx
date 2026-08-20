import {
  DollarSign,
  Receipt,
  Wallet,
  TrendingUp,
} from "lucide-react";

import { useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../utils/currency";
import { getInvoiceAmountPaid } from "../../utils/invoicePayments";

function FinancialReport() {
  const { quotations, invoices, expenses } = useApp();

  const quotationTotal = useMemo(() => {
    return quotations.filter((quotation) => quotation.status !== "Draft").reduce(
      (sum, quotation) => sum + Number(quotation.total || 0),
      0
    );
  }, [quotations]);

  const invoiceTotal = useMemo(() => {
    return invoices.reduce(
      (sum, invoice) => sum + getInvoiceAmountPaid(invoice),
      0
    );
  }, [invoices]);

  const expenseTotal = useMemo(() => {
    return expenses.reduce(
      (sum, expense) => sum + Number(expense.amount || 0),
      0
    );
  }, [expenses]);

  const profit = invoiceTotal - expenseTotal;

  const items = [
    {
      title: "Quotation Value",
      value: quotationTotal,
      icon: Receipt,
      bg: "bg-purple-100",
      iconColor: "text-purple-600",
      valueColor: "text-purple-700",
    },
    {
      title: "Revenue Received",
      value: invoiceTotal,
      icon: DollarSign,
      bg: "bg-green-100",
      iconColor: "text-green-600",
      valueColor: "text-green-700",
    },
    {
      title: "Business Expenses",
      value: expenseTotal,
      icon: Wallet,
      bg: "bg-red-100",
      iconColor: "text-red-600",
      valueColor: "text-red-600",
    },
    {
      title: "Net Profit",
      value: profit,
      icon: TrendingUp,
      bg: profit >= 0 ? "bg-emerald-100" : "bg-red-100",
      iconColor:
        profit >= 0
          ? "text-emerald-600"
          : "text-red-600",
      valueColor:
        profit >= 0
          ? "text-emerald-700"
          : "text-red-700",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Financial Report
        </h2>

        <p className="text-slate-500 mt-1">
          Summary of quotations, invoices,
          expenses and profit.
        </p>
      </div>

      <div className="space-y-4">

        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-center justify-between p-5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
            >
              <div className="flex items-center gap-4">

                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center ${item.bg}`}
                >
                  <Icon
                    size={28}
                    className={item.iconColor}
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-500">
                    Business summary
                  </p>
                </div>

              </div>

              <div
                className={`text-2xl font-bold ${item.valueColor}`}
              >
                {formatCurrency(item.value)}
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default FinancialReport;
