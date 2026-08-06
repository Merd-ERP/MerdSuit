import Card from "../common/Card";
import EmptyInventory from "./EmptyInventory";

function StockHistory({ history = [] }) {
  return <Card className="mt-6"><h2 className="text-xl font-semibold text-slate-800">Stock History</h2><div className="mt-4 overflow-x-auto">{history.length === 0 ? <EmptyInventory message="No stock movements recorded yet." /> : <table className="w-full min-w-[720px] text-sm"><thead className="border-b border-slate-200 text-left text-slate-500"><tr><th className="p-3">Date</th><th className="p-3">Item</th><th className="p-3">Movement Type</th><th className="p-3 text-right">Quantity</th><th className="p-3">User</th><th className="p-3">Notes</th></tr></thead><tbody>{history.map((movement) => <tr key={movement.id} className="border-b border-slate-100"><td className="p-3">{movement.date}</td><td className="p-3">{movement.itemName}</td><td className="p-3"><span className={`rounded-full px-2 py-1 text-xs font-medium ${movement.type === "Stock In" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`}>{movement.type}</span></td><td className="p-3 text-right">{movement.quantity}</td><td className="p-3">{movement.user || "Current user"}</td><td className="p-3">{movement.notes || "—"}</td></tr>)}</tbody></table>}</div></Card>;
}

export default StockHistory;
