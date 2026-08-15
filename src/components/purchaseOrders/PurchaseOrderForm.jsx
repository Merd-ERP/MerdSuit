import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import Card from "../common/Card";
import Button from "../common/Button";
import PurchaseOrderItems from "./PurchaseOrderItems";
import PurchaseOrderSummary from "./PurchaseOrderSummary";

const createEmptyOrder = () => ({ supplierId: "", orderNumber: `PO-${Date.now()}`, date: new Date().toISOString().split("T")[0], status: "Pending", items: [], transport: "", discount: "", notes: "" });

function PurchaseOrderForm({ orderToEdit, setOrderToEdit }) {
  const { suppliers, inventory, addPurchaseOrder, updatePurchaseOrder } = useApp();
  const { showToast } = useToast();
  const [order, setOrder] = useState(() => orderToEdit || createEmptyOrder());
  const editingId = orderToEdit?.id;
  const materialTotal = useMemo(() => order.items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.price), 0), [order.items]);
  const grandTotal = materialTotal + (Number(order.transport) || 0) - (Number(order.discount) || 0);

  function updateOrder(field, value) { setOrder((currentOrder) => ({ ...currentOrder, [field]: value })); }
  function addItem() { setOrder((currentOrder) => ({ ...currentOrder, items: [...currentOrder.items, { inventoryId: "", itemName: "", quantity: 1, price: 0 }] })); }
  function removeItem(index) { setOrder((currentOrder) => ({ ...currentOrder, items: currentOrder.items.filter((_, itemIndex) => itemIndex !== index) })); }
  function updateItem(index, field, value) { setOrder((currentOrder) => { const items = [...currentOrder.items]; const item = { ...items[index], [field]: value }; if (field === "inventoryId") { const selected = inventory.find((inventoryItem) => String(inventoryItem.id) === String(value)); if (selected) Object.assign(item, { inventoryId: selected.id, itemName: selected.name, price: Number(selected.costPrice) || 0 }); } items[index] = item; return { ...currentOrder, items }; }); }
  function resetForm() { setOrderToEdit(null); setOrder(createEmptyOrder()); }
  function handleSave() { if (!order.supplierId) { showToast({ type: "warning", title: "Supplier Required", message: "Please select a supplier." }); return; } if (order.items.length === 0) { showToast({ type: "warning", title: "No Items", message: "Please add at least one inventory item." }); return; } if (order.items.some((item) => !item.inventoryId || Number(item.quantity) <= 0)) { showToast({ type: "warning", title: "Invalid Items", message: "Each order item needs a linked inventory item and a positive quantity." }); return; } const purchaseOrder = { ...order, id: editingId || Date.now(), transport: Number(order.transport) || 0, discount: Number(order.discount) || 0, total: grandTotal }; if (editingId) { updatePurchaseOrder(purchaseOrder); showToast({ type: "success", title: "Updated", message: "Purchase Order updated successfully." }); } else { addPurchaseOrder(purchaseOrder); showToast({ type: "success", title: "Saved", message: "Purchase Order created successfully." }); } resetForm(); }

  return <div id="purchase-order-form"><Card className="mb-6"><h2 className="text-2xl font-bold text-slate-800">{editingId ? "Edit Purchase Order" : "Create Purchase Order"}</h2><div className="mt-6 grid gap-4 md:grid-cols-3"><select className="rounded-lg border border-slate-300 p-3" value={order.supplierId} onChange={(event) => updateOrder("supplierId", event.target.value ? Number(event.target.value) : "")}><option value="">Select Supplier</option>{suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.company}</option>)}</select><input className="rounded-lg border border-slate-300 bg-slate-50 p-3" value={order.orderNumber} readOnly /><input className="rounded-lg border border-slate-300 p-3" type="date" value={order.date} onChange={(event) => updateOrder("date", event.target.value)} /></div><div className="mt-6"><PurchaseOrderItems items={order.items} inventory={inventory} onAddItem={addItem} onRemoveItem={removeItem} onUpdateItem={updateItem} /></div><div className="mt-6 grid gap-4 md:grid-cols-2"><label className="text-sm font-medium text-slate-700">Transport Cost<input className="mt-1 w-full rounded-lg border border-slate-300 p-3" type="number" placeholder="Enter transport cost" value={Number(order.transport) === 0 ? "" : order.transport} onChange={(event) => updateOrder("transport", event.target.value)} /></label><label className="text-sm font-medium text-slate-700">Discount<input className="mt-1 w-full rounded-lg border border-slate-300 p-3" type="number" placeholder="Enter discount" value={Number(order.discount) === 0 ? "" : order.discount} onChange={(event) => updateOrder("discount", event.target.value)} /></label></div><textarea className="mt-4 w-full rounded-lg border border-slate-300 p-3" rows="4" placeholder="Notes..." value={order.notes} onChange={(event) => updateOrder("notes", event.target.value)} /><PurchaseOrderSummary materialTotal={materialTotal} transport={Number(order.transport) || 0} discount={Number(order.discount) || 0} grandTotal={grandTotal} /><div className="mt-6 flex gap-3"><Button variant={editingId ? "warning" : "primary"} onClick={handleSave}>{editingId ? "Update Purchase Order" : "Save Purchase Order"}</Button>{editingId && <Button variant="secondary" onClick={resetForm}>Cancel</Button>}</div></Card></div>;
}

export default PurchaseOrderForm;
