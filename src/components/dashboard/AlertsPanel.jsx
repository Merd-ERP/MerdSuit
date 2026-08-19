import { useApp } from "../../context/AppContext";
import Card from "../common/Card";
import { getInvoiceBalance } from "../../utils/invoicePayments";

function AlertsPanel() {
  const { inventory, invoices, projects } = useApp();
  const lowStockCount = inventory.filter(
    (item) => Number(item.quantity) <= Number(item.minimumStock)
  ).length;
  const outstandingCount = invoices.filter((invoice) => getInvoiceBalance(invoice) > 0).length;
  const nearingCompletionCount = projects.filter(
    (project) => project.status === "Nearing Completion"
  ).length;
  const alerts = [
    lowStockCount > 0 && `${lowStockCount} low stock item${lowStockCount === 1 ? "" : "s"} need attention.`,
    outstandingCount > 0 && `${outstandingCount} outstanding invoice${outstandingCount === 1 ? "" : "s"} need follow-up.`,
    nearingCompletionCount > 0 && `${nearingCompletionCount} project${nearingCompletionCount === 1 ? " is" : "s are"} nearing completion.`,
  ].filter(Boolean);

  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-800">Alerts</h2>
      <div className="mt-4 space-y-3">
        {alerts.length === 0 ? (
          <p className="rounded-xl bg-emerald-50 p-5 text-sm text-emerald-700">Everything looks good.</p>
        ) : (
          alerts.map((alert) => (
            <p key={alert} className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">{alert}</p>
          ))
        )}
      </div>
    </Card>
  );
}

export default AlertsPanel;
