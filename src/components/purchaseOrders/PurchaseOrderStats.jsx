import { useApp } from "../../context/AppContext";
import Card from "../common/Card";

function PurchaseOrderStats() {
  const { purchaseOrders } = useApp();
  const pending = purchaseOrders.filter((order) => order.status === "Pending").length;
  const received = purchaseOrders.filter((order) => order.status === "Received").length;
  const totalValue = purchaseOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const stats = [{ label: "Total Orders", value: purchaseOrders.length, color: "text-blue-600" }, { label: "Pending Orders", value: pending, color: "text-amber-600" }, { label: "Received Orders", value: received, color: "text-emerald-600" }, { label: "Total Purchase Value", value: `GH₵ ${totalValue.toLocaleString()}`, color: "text-slate-800" }];
  return <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <Card key={stat.label} className="p-5"><p className="text-sm font-medium text-slate-500">{stat.label}</p><p className={`mt-2 text-2xl font-bold ${stat.color}`}>{stat.value}</p></Card>)}</section>;
}

export default PurchaseOrderStats;
