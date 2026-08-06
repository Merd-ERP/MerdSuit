import { useApp } from "../../context/AppContext";
import Card from "../common/Card";
import EmptyInventory from "./EmptyInventory";

function LowStockAlert() {
  const { inventory } = useApp();
  const lowStockItems = inventory.filter((item) => {
    const reorderLevel = Number(item.reorderLevel ?? item.minimumStock) || 0;
    return Number(item.quantity) <= reorderLevel;
  });

  return <Card className="mt-6"><h2 className="text-xl font-semibold text-slate-800">Low Stock Alerts</h2><div className="mt-4 space-y-3">{lowStockItems.length === 0 ? <EmptyInventory message="All inventory items are above their reorder level." /> : lowStockItems.map((item) => { const reorderLevel = item.reorderLevel ?? item.minimumStock ?? 0; return <div key={item.id} className="flex flex-col gap-2 rounded-xl bg-amber-50 p-4 text-amber-900 sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold">{item.name}</p><div className="flex gap-5 text-sm"><span>Current: <strong>{item.quantity}</strong></span><span>Reorder level: <strong>{reorderLevel}</strong></span></div></div>; })}</div></Card>;
}

export default LowStockAlert;
