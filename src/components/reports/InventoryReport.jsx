import { useApp } from "../../context/AppContext";
import Card from "../common/Card";
import EmptyReport from "./EmptyReport";
import { formatCurrency } from "../../utils/currency";

function InventoryReport() {
  const { inventory = [] } = useApp();
  return <Card><h2 className="text-lg font-semibold text-slate-800">Inventory Report</h2><div className="mt-4 overflow-x-auto">{inventory.length === 0 ? <EmptyReport /> : <table className="w-full min-w-[620px] text-sm"><thead className="border-b border-slate-200 text-left text-slate-500"><tr><th className="p-3">Item</th><th className="p-3 text-right">Quantity</th><th className="p-3 text-right">Unit Cost</th><th className="p-3 text-right">Stock Value</th></tr></thead><tbody>{inventory.map((item) => { const quantity = Number(item.quantity) || 0; const unitCost = Number(item.costPrice) || 0; return <tr key={item.id} className="border-b border-slate-100"><td className="p-3">{item.name || "—"}</td><td className="p-3 text-right">{quantity}</td><td className="p-3 text-right">{formatCurrency(unitCost)}</td><td className="p-3 text-right">{formatCurrency(quantity * unitCost)}</td></tr>; })}</tbody></table>}</div></Card>;
}

export default InventoryReport;
