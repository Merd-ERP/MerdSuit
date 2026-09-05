import { useApp } from "../../context/AppContext";
import Card from "../common/Card";
import { getInvoiceBalance } from "../../utils/invoicePayments";
import { safeRecordArray } from "../../utils/financialMetrics.js";
import { getLowStockCount } from "./dashboardAnalytics.js";

function AlertsPanel() {
  const { inventory, invoices } = useApp();
  const lowStockCount = getLowStockCount(inventory);
  const outstandingCount = safeRecordArray(invoices)
    .filter((invoice) => getInvoiceBalance(invoice) > 0).length;
  const alerts = [
    lowStockCount > 0 && `${lowStockCount} low stock item${lowStockCount === 1 ? "" : "s"} need attention.`,
    outstandingCount > 0 && `${outstandingCount} outstanding invoice${outstandingCount === 1 ? " needs" : "s need"} follow-up.`,
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
