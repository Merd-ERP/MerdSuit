import { useApp } from "../../context/AppContext";
import StatCard from "./StatCard";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(value);

const asNumber = (value) => Number(value) || 0;

function DashboardStats() {
  const { clients, projects, invoices } = useApp();

  const activeProjects = projects.filter(
    (project) => project.status !== "Completed"
  ).length;
  const revenue = invoices
    .filter((invoice) => invoice.status === "Paid")
    .reduce((sum, invoice) => sum + asNumber(invoice.total), 0);
  const outstanding = invoices.reduce(
    (sum, invoice) => {
      const balance = asNumber(invoice.balance);
      return balance > 0 ? sum + balance : sum;
    }, 0);

  return (
    <section aria-label="Business summary" className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total Clients" value={clients.length} />
      <StatCard label="Active Projects" value={activeProjects} accentClass="text-indigo-600" />
      <StatCard label="Revenue" value={formatCurrency(revenue)} accentClass="text-emerald-600" />
      <StatCard label="Outstanding Payments" value={formatCurrency(outstanding)} accentClass="text-amber-600" />
    </section>
  );
}

export default DashboardStats;
