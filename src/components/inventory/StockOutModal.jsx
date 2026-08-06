import { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";

function StockOutModal({ isOpen, inventory, onClose, onSave }) {
  const [form, setForm] = useState({ itemId: "", quantity: "", reason: "Project", notes: "" });
  const [error, setError] = useState("");

  function handleSave() {
    const quantity = Number(form.quantity);
    const item = inventory.find((inventoryItem) => String(inventoryItem.id) === form.itemId);
    if (!item || !Number.isFinite(quantity) || quantity <= 0) {
      setError("Choose an item and enter a positive quantity.");
      return;
    }
    if (quantity > Number(item.quantity)) {
      setError("Stock out quantity cannot exceed the available quantity.");
      return;
    }
    onSave({ ...form, item, quantity, date: new Date().toISOString().slice(0, 10), type: "Stock Out" });
    setForm({ itemId: "", quantity: "", reason: "Project", notes: "" });
    setError("");
  }

  return <Modal isOpen={isOpen} title="Stock Out" onClose={onClose} footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button variant="warning" onClick={handleSave}>Save Stock Out</Button></>}><div className="space-y-4"><label className="block text-sm font-medium text-slate-700">Item<select value={form.itemId} onChange={(event) => setForm({ ...form, itemId: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 p-3"><option value="">Select item</option>{inventory.map((item) => <option key={item.id} value={item.id}>{item.name} ({item.quantity} available)</option>)}</select></label><label className="block text-sm font-medium text-slate-700">Quantity<input type="number" min="1" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label><label className="block text-sm font-medium text-slate-700">Reason<select value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 p-3"><option>Project</option><option>Sale</option><option>Damaged</option><option>Adjustment</option><option>Other</option></select></label><label className="block text-sm font-medium text-slate-700">Notes<textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} rows="3" className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label>{error && <p className="text-sm text-red-600">{error}</p>}</div></Modal>;
}

export default StockOutModal;
