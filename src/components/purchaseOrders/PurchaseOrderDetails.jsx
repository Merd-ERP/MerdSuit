import { useApp } from "../../context/AppContext";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { formatCurrency } from "../../utils/currency";

function PurchaseOrderDetails({ order, onClose }) {
  const { suppliers } = useApp();
  if (!order) return null;
  const supplier = suppliers.find((item) => String(item.id) === String(order.supplierId));
  return <Modal isOpen={Boolean(order)} title={order.orderNumber} onClose={onClose} footer={<Button variant="secondary" onClick={onClose}>Close</Button>}><div className="space-y-4 text-sm"><div className="grid gap-3 sm:grid-cols-2"><p><span className="text-slate-500">Supplier:</span> {supplier?.company || "—"}</p><p><span className="text-slate-500">Date:</span> {order.date || "—"}</p><p><span className="text-slate-500">Status:</span> {order.status}</p><p><span className="text-slate-500">Total:</span> {formatCurrency(order.total)}</p></div><div><h3 className="font-semibold text-slate-800">Items</h3><div className="mt-2 space-y-2">{(order.items || []).map((item, index) => <p key={`${item.inventoryId}-${index}`} className="rounded-lg bg-slate-50 p-3">{item.itemName || "Item"} — {item.quantity} × {formatCurrency(item.price)}</p>)}</div></div>{order.notes && <p><span className="font-semibold text-slate-800">Notes:</span> {order.notes}</p>}</div></Modal>;
}

export default PurchaseOrderDetails;
