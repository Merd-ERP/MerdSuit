import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../layouts/Mainlayout";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import { formatCurrency } from "../utils/currency";
import {
  hasRelationshipId,
  relationshipIdsEqual,
  resolveFinancialRoute,
} from "../utils/financialIdentity";

const numericAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

function resolveSupplier(suppliers, supplierId) {
  if (!hasRelationshipId(supplierId)) return null;

  const exactSupplier = suppliers.find((supplier) =>
    relationshipIdsEqual(supplier.id, supplierId)
  );
  if (exactSupplier) return exactSupplier;

  const legacyMatches = suppliers.filter((supplier) =>
    hasRelationshipId(supplier.id) && String(supplier.id) === String(supplierId)
  );
  return legacyMatches.length === 1 ? legacyMatches[0] : null;
}

function PurchaseOrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { purchaseOrders, suppliers, receivePurchaseOrder } = useApp();
  const order = resolveFinancialRoute(purchaseOrders, id);

  if (!order) {
    return (
      <MainLayout>
        <PageHeader title="Purchase Order Details" subtitle="Review a saved purchase order." />
        <Card>
          <EmptyState
            title="Purchase Order not found"
            message="This purchase order may have been deleted or the link is no longer valid."
          />
          <div className="flex justify-center">
            <Button variant="secondary" onClick={() => navigate("/purchase-orders")}>Back to Purchase Orders</Button>
          </div>
        </Card>
      </MainLayout>
    );
  }

  const supplier = resolveSupplier(suppliers, order.supplierId);
  const items = Array.isArray(order.items) ? order.items : [];
  const materialSubtotal = items.reduce((total, item) =>
    total + numericAmount(item.quantity ?? item.qty) * numericAmount(item.price ?? item.unitPrice ?? item.cost), 0
  );
  const transport = numericAmount(order.transport);
  const discount = numericAmount(order.discount);
  const grandTotal = Number.isFinite(Number(order.total))
    ? Number(order.total)
    : materialSubtotal + transport - discount;
  const isReceived = String(order.status || "").toLowerCase() === "received";

  function handleReceive() {
    const result = receivePurchaseOrder(order.id);
    showToast(result.success
      ? {
          type: "success",
          title: "Purchase order received",
          message: "Purchase Order received successfully.",
        }
      : {
          type: "warning",
          title: "Unable to receive",
          message: result.message,
        });
  }

  return (
    <MainLayout>
      <PageHeader
        title="Purchase Order Details"
        subtitle={`Purchase order ${order.orderNumber || "—"}`}
      />

      <Card className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Purchase Order</p>
            <h2 className="mt-1 break-all text-2xl font-bold text-slate-900 sm:text-3xl">
              {order.orderNumber || "Unnumbered purchase order"}
            </h2>
          </div>
          <span className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ${isReceived ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`}>
            {order.status || "Pending"}
          </span>
        </div>

        <dl className="grid gap-4 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div><dt className="font-medium text-slate-500">Supplier</dt><dd className="mt-1 break-words font-semibold text-slate-800">{supplier?.company || order.supplierName || "—"}</dd></div>
          <div><dt className="font-medium text-slate-500">Date</dt><dd className="mt-1 text-slate-800">{order.date || "—"}</dd></div>
          <div><dt className="font-medium text-slate-500">Status</dt><dd className="mt-1 text-slate-800">{order.status || "Pending"}</dd></div>
          {supplier?.contactPerson && <div><dt className="font-medium text-slate-500">Contact</dt><dd className="mt-1 break-words text-slate-800">{supplier.contactPerson}</dd></div>}
          {supplier?.phone && <div><dt className="font-medium text-slate-500">Phone</dt><dd className="mt-1 break-words text-slate-800">{supplier.phone}</dd></div>}
          {supplier?.email && <div><dt className="font-medium text-slate-500">Email</dt><dd className="mt-1 break-all text-slate-800">{supplier.email}</dd></div>}
          {(order.receivedAt || order.receivedDate) && <div><dt className="font-medium text-slate-500">Received</dt><dd className="mt-1 text-slate-800">{order.receivedAt || order.receivedDate}</dd></div>}
        </dl>

        <section aria-labelledby="purchase-order-items-heading">
          <h3 id="purchase-order-items-heading" className="text-lg font-semibold text-slate-900">Order Items</h3>
          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="p-3">Item</th>
                  <th className="p-3 text-right">Quantity</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan="4" className="p-6 text-center text-slate-500">No order items available.</td></tr>
                ) : items.map((item, index) => {
                  const quantity = numericAmount(item.quantity ?? item.qty);
                  const unitPrice = numericAmount(item.price ?? item.unitPrice ?? item.cost);
                  return (
                    <tr key={`${String(item.inventoryId ?? item.itemId ?? "item")}-${index}`} className="border-t border-slate-200 hover:bg-slate-50">
                      <td className="p-3">{item.itemName || item.inventoryName || item.name || item.description || "Item"}</td>
                      <td className="p-3 text-right">{quantity}</td>
                      <td className="p-3 text-right">{formatCurrency(unitPrice)}</td>
                      <td className="p-3 text-right font-medium">{formatCurrency(quantity * unitPrice)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)]">
          <div>
            <h3 className="font-semibold text-slate-900">Notes</h3>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-600">{order.notes || "No notes."}</p>
          </div>
          <dl className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
            <div className="flex justify-between gap-4"><dt>Material subtotal</dt><dd className="font-semibold">{formatCurrency(materialSubtotal)}</dd></div>
            <div className="flex justify-between gap-4"><dt>Transport</dt><dd className="font-semibold">{formatCurrency(transport)}</dd></div>
            <div className="flex justify-between gap-4"><dt>Discount</dt><dd className="font-semibold text-red-600">- {formatCurrency(discount)}</dd></div>
            <div className="flex justify-between gap-4 border-t border-slate-200 pt-3 text-lg font-bold"><dt>Grand Total</dt><dd className="text-blue-600">{formatCurrency(grandTotal)}</dd></div>
          </dl>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
          <Button variant="secondary" className="w-full sm:w-auto" onClick={() => navigate("/purchase-orders")}>Back</Button>
          {!isReceived && <Button variant="success" className="w-full sm:w-auto" onClick={handleReceive}>Receive</Button>}
        </div>
      </Card>
    </MainLayout>
  );
}

export default PurchaseOrderDetailsPage;
