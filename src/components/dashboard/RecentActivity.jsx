import { useApp } from "../../context/AppContext";
import Card from "../common/Card";
import { formatCurrency } from "../../utils/currency";
import { buildRecentActivities } from "./dashboardAnalytics.js";

function RecentActivity() {
  const {
    invoices,
    purchaseOrders,
    expenses,
    inventoryMovements,
  } = useApp();
  const activities = buildRecentActivities({
    invoices,
    purchaseOrders,
    expenses,
    inventoryMovements,
  });

  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
      {activities.length === 0 ? (
        <div className="mt-4 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">No recent activity.</div>
      ) : (
        <ol className="mt-4 divide-y divide-slate-100">
          {activities.map((activity) => (
            <li key={activity.id} className="flex min-w-0 flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <p className="break-words text-sm font-medium text-slate-700">{activity.description}</p>
                <time className="text-xs text-slate-500" dateTime={new Date(activity.timestamp).toISOString()}>
                  {new Date(activity.timestamp).toLocaleDateString()}
                </time>
              </div>
              {activity.amount > 0 && (
                <span className="break-words text-sm font-semibold text-slate-800">
                  {formatCurrency(activity.amount, { minimumFractionDigits: 2 })}
                </span>
              )}
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}

export default RecentActivity;
