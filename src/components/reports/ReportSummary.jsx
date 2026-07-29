import { useMemo } from "react";
import { useApp } from "../../context/AppContext";
import StatCard from "../common/StatCard";

import {
  Users,
  FolderKanban,
  FileText,
  Receipt,
  DollarSign,
  Wallet,
  TrendingUp,
  Package,
} from "lucide-react";

function ReportSummary() {
  const {
    clients,
    projects,
    quotations,
    invoices,
    inventory,
    expenses,
  } = useApp();

  const totalRevenue = useMemo(() => {
    return invoices.reduce(
      (sum, invoice) => sum + Number(invoice.total || 0),
      0
    );
  }, [invoices]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce(
      (sum, expense) => sum + Number(expense.amount || 0),
      0
    );
  }, [expenses]);

  const inventoryValue = useMemo(() => {
    return inventory.reduce(
      (sum, item) =>
        sum +
        Number(item.quantity || 0) *
          Number(item.costPrice || 0),
      0
    );
  }, [inventory]);

  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <StatCard
        title="Clients"
        value={clients.length}
        subtitle="Registered clients"
        icon={Users}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
      />

      <StatCard
        title="Projects"
        value={projects.length}
        subtitle="Active projects"
        icon={FolderKanban}
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
      />

      <StatCard
        title="Quotations"
        value={quotations.length}
        subtitle="Prepared quotations"
        icon={FileText}
        iconBg="bg-purple-100"
        iconColor="text-purple-600"
      />

      <StatCard
        title="Invoices"
        value={invoices.length}
        subtitle="Generated invoices"
        icon={Receipt}
        iconBg="bg-green-100"
        iconColor="text-green-600"
      />

      <StatCard
        title="Revenue"
        value={`GH₵ ${totalRevenue.toLocaleString()}`}
        subtitle="Total invoice revenue"
        icon={DollarSign}
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
        valueColor="text-emerald-700"
      />

      <StatCard
        title="Expenses"
        value={`GH₵ ${totalExpenses.toLocaleString()}`}
        subtitle="Business expenses"
        icon={Wallet}
        iconBg="bg-red-100"
        iconColor="text-red-600"
        valueColor="text-red-600"
      />

      <StatCard
        title="Net Profit"
        value={`GH₵ ${netProfit.toLocaleString()}`}
        subtitle="Revenue minus expenses"
        icon={TrendingUp}
        iconBg="bg-green-100"
        iconColor="text-green-700"
        valueColor={
          netProfit >= 0
            ? "text-green-700"
            : "text-red-700"
        }
      />

      <StatCard
        title="Inventory Value"
        value={`GH₵ ${inventoryValue.toLocaleString()}`}
        subtitle="Current stock value"
        icon={Package}
        iconBg="bg-orange-100"
        iconColor="text-orange-600"
        valueColor="text-orange-600"
      />
    </div>
  );
}

export default ReportSummary;