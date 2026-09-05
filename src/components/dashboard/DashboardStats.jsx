import { useApp } from "../../context/AppContext";
import StatCard from "./StatCard";
import { formatCurrency } from "../../utils/currency";
import {
  getOutstandingBalance,
  getReceivedRevenue,
} from "../../utils/financialMetrics.js";
import {
  getActiveClientCount,
  getActiveProjectCount,
} from "./dashboardAnalytics.js";

function DashboardStats() {
  const { clients, projects, invoices } = useApp();

  const activeClients = getActiveClientCount(clients);
  const activeProjects = getActiveProjectCount(projects);
  const revenue = getReceivedRevenue(invoices);
  const outstanding = getOutstandingBalance(invoices);

  return (
    <section aria-label="Business summary" className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Active Clients" value={activeClients} />
      <StatCard label="Active Projects" value={activeProjects} accentClass="text-indigo-600" />
      <StatCard label="Revenue" value={formatCurrency(revenue, { minimumFractionDigits: 2 })} accentClass="text-emerald-600" />
      <StatCard label="Outstanding Payments" value={formatCurrency(outstanding, { minimumFractionDigits: 2 })} accentClass="text-amber-600" />
    </section>
  );
}

export default DashboardStats;
