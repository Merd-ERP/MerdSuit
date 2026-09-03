import { Link } from "react-router-dom";
import Card from "../common/Card";
import EmptyState from "../common/EmptyState";
import {
  getFinancialRouteToken,
  hasRelationshipId,
  relationshipIdsEqual,
} from "../../utils/financialIdentity";

function formatMovementDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
}

function MovementSource({ movement, invoices, purchaseOrders }) {
  const reference = movement.sourceReference || "—";
  const sourceType = movement.sourceType || "Manual";
  const invoice = sourceType === "Invoice" && hasRelationshipId(movement.sourceId)
    ? invoices.find((record) => relationshipIdsEqual(record.id, movement.sourceId))
    : null;
  const invoiceRouteToken = invoice ? getFinancialRouteToken(invoice) : "";
  const purchaseOrder = sourceType === "Purchase Order" && hasRelationshipId(movement.sourceId)
    ? purchaseOrders.find((record) => relationshipIdsEqual(record.id, movement.sourceId))
    : null;
  const purchaseOrderRouteToken = purchaseOrder ? getFinancialRouteToken(purchaseOrder) : "";
  const route = invoiceRouteToken
    ? `/invoice/${invoiceRouteToken}`
    : purchaseOrderRouteToken
      ? `/purchase-orders/${purchaseOrderRouteToken}`
      : "";

  return (
    <>
      <span className="block font-medium text-slate-700">{sourceType}</span>
      {route ? (
        <Link
          to={route}
          className="inline-block max-w-full break-all rounded-sm text-blue-600 underline decoration-blue-300 underline-offset-2 transition hover:text-blue-800 hover:decoration-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          {reference}
        </Link>
      ) : (
        <span className="block max-w-full break-all text-slate-500">{reference}</span>
      )}
    </>
  );
}

function StockHistory({ history = [], invoices = [], purchaseOrders = [] }) {
  return <Card className="mt-6"><h2 className="text-xl font-semibold text-slate-800">Stock History</h2><div className="mt-4 overflow-x-auto">{history.length === 0 ? <EmptyState title="No stock movements yet." /> : <table className="w-full min-w-[820px] text-sm"><thead className="border-b border-slate-200 text-left text-slate-500"><tr><th className="p-3">Date/Time</th><th className="p-3">Item</th><th className="p-3">Type</th><th className="p-3 text-right">Quantity</th><th className="p-3">Source/Reference</th><th className="p-3 text-right">Resulting Stock</th></tr></thead><tbody>{history.map((movement) => <tr key={movement.id} className="border-b border-slate-100 hover:bg-slate-50"><td className="whitespace-nowrap p-3">{formatMovementDate(movement.occurredAt || movement.date)}</td><td className="p-3">{movement.itemNameSnapshot || movement.itemName || "—"}</td><td className="p-3"><span className={`whitespace-nowrap rounded-full px-2 py-1 text-xs font-medium ${movement.type === "Stock In" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`}>{movement.type || "—"}</span></td><td className="p-3 text-right">{movement.quantity}</td><td className="p-3"><MovementSource movement={movement} invoices={invoices} purchaseOrders={purchaseOrders} /></td><td className="p-3 text-right font-medium">{movement.resultingQuantity ?? "—"}</td></tr>)}</tbody></table>}</div></Card>;
}

export default StockHistory;
