import { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";

function StockInModal({ isOpen, inventory, onClose, onSave }) {
  const [form, setForm] = useState({ itemId: "", quantity: "", date: new Date().toISOString().slice(0, 10), supplier: "", notes: "" });
  const [error, setError] = useState("");

  function handleSave() {
    const quantity = Number(form.quantity);
    if (!form.itemId || !Number.isFinite(quantity) || quantity <= 0) {
      setError("Choose an item and enter a positive quantity.");
      return;
    }
    const item = inventory.find((inventoryItem) => String(inventoryItem.id) === form.itemId);
    onSave({ ...form, item, quantity, type: "Stock In" });
    setForm({ itemId: "", quantity: "", date: new Date().toISOString().slice(0, 10), supplier: "", notes: "" });
    setError("");
  }

  return <Modal isOpen={isOpen} title="Stock In" onClose={onClose} footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={handleSave}>Save Stock In</Button></>}><div className="space-y-4"><label className="block text-sm font-medium text-slate-700">Item<select value={form.itemId} onChange={(event) => setForm({ ...form, itemId: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 p-3"><option value="">Select item</option>{inventory.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="block text-sm font-medium text-slate-700">Quantity<input type="number" min="1" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label><label className="block text-sm font-medium text-slate-700">Date<input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label><label className="block text-sm font-medium text-slate-700">Supplier (optional)<input value={form.supplier} onChange={(event) => setForm({ ...form, supplier: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label><label className="block text-sm font-medium text-slate-700">Notes<textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} rows="3" className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label>{error && <p className="text-sm text-red-600">{error}</p>}</div></Modal>;
}

export default StockInModal;
