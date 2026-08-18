import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import Card from "../common/Card";
import Button from "../common/Button";
import ConfirmDialog from "../common/ConfirmDialog";
import EmptyPurchaseOrders from "./EmptyPurchaseOrders";
import { formatCurrency } from "../../utils/currency";

function PurchaseOrderTable({ search, status, setOrderToEdit, onViewOrder }) {
  const {
    purchaseOrders,
    suppliers,
    deletePurchaseOrder,
    receivePurchaseOrder,
  } = useApp();
  const { showToast } = useToast();
  const [orderToDelete, setOrderToDelete] = useState(null);

  const filteredOrders = purchaseOrders.filter((order) => {
    const supplier = suppliers.find(
      (item) => String(item.id) === String(order.supplierId),
    );
    const query = search.toLowerCase();
    const matchesQuery =
      (order.orderNumber || "").toLowerCase().includes(query) ||
      (supplier?.company || "").toLowerCase().includes(query) ||
      (order.status || "").toLowerCase().includes(query);

    return matchesQuery && (status === "All" || order.status === status);
  });

  function handleDelete() {
    if (!orderToDelete) return;

    deletePurchaseOrder(orderToDelete.id);
    showToast({
      type: "success",
      title: "Purchase order deleted",
      message: "Purchase Order deleted successfully.",
    });
    setOrderToDelete(null);
  }

  function handleReceive(id) {
    const result = receivePurchaseOrder(id);
    showToast(
      result.success
        ? {
            type: "success",
            title: "Purchase order received",
            message: "Purchase Order received successfully.",
          }
        : {
            type: "warning",
            title: "Unable to receive",
            message: result.message,
          },
    );
  }

  return (
    <>
      <Card>
        <h2 className="text-xl font-semibold text-slate-800">Purchase Orders</h2>
        {filteredOrders.length === 0 ? (
          <EmptyPurchaseOrders />
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[850px] text-sm">
              <thead className="border-b border-slate-200 text-left text-slate-500">
                <tr>
                  <th className="p-3">PO No.</th>
                  <th className="p-3">Supplier</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-center">Items</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Total</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const supplier = suppliers.find(
                    (item) => String(item.id) === String(order.supplierId),
                  );

                  return (
                    <tr key={order.id} className="border-b border-slate-100">
                      <td className="p-3">{order.orderNumber}</td>
                      <td className="p-3">{supplier?.company || "—"}</td>
                      <td className="p-3">{order.date}</td>
                      <td className="p-3 text-center">{order.items?.length || 0}</td>
                      <td className="p-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            order.status === "Received"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">{formatCurrency(order.total)}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-2">
                          <Button variant="secondary" onClick={() => onViewOrder(order)}>
                            View
                          </Button>
                          <Button variant="warning" onClick={() => setOrderToEdit(order)}>
                            Edit
                          </Button>
                          {order.status !== "Received" && (
                            <Button variant="success" onClick={() => handleReceive(order.id)}>
                              Receive
                            </Button>
                          )}
                          <Button variant="danger" onClick={() => setOrderToDelete(order)}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ConfirmDialog
        isOpen={Boolean(orderToDelete)}
        title="Delete Purchase Order?"
        message={`Are you sure you want to delete purchase order ${orderToDelete?.orderNumber || ""}? This action cannot be undone.`}
        onCancel={() => setOrderToDelete(null)}
        onConfirm={handleDelete}
        confirmLabel="Delete Purchase Order"
      />
    </>
  );
}

export default PurchaseOrderTable;
