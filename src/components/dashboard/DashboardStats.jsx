import { useApp } from "../../context/AppContext";
import StatCard from "./StatCard";
import { formatCurrency } from "../../utils/currency";
import {
  getInvoiceAmountPaid,
  getInvoiceBalance,
} from "../../utils/invoicePayments";

function DashboardStats() {
  const { clients, projects, invoices } = useApp();

  const activeProjects = projects.filter(
    (project) => project.status !== "Completed"
  ).length;
  const revenue = invoices.reduce(
    (sum, invoice) => sum + getInvoiceAmountPaid(invoice),
    0,
  );
  const outstanding = invoices.reduce(
    (sum, invoice) => {
      const balance = getInvoiceBalance(invoice);
      return balance > 0 ? sum + balance : sum;
    }, 0);

  return (
    <section aria-label="Business summary" className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total Clients" value={clients.length} />
      <StatCard label="Active Projects" value={activeProjects} accentClass="text-indigo-600" />
      <StatCard label="Revenue" value={formatCurrency(revenue, { minimumFractionDigits: 2 })} accentClass="text-emerald-600" />
      <StatCard label="Outstanding Payments" value={formatCurrency(outstanding, { minimumFractionDigits: 2 })} accentClass="text-amber-600" />
    </section>
  );
}

export default DashboardStats;
