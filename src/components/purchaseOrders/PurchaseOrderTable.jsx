import { useState } from "react";

import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";

import Button from "../common/Button";
import SearchBox from "../common/SearchBox";
import EmptyState from "../common/EmptyState";

function PurchaseOrderTable({ setOrderToEdit }) {
  const {
    purchaseOrders,
    suppliers,
    deletePurchaseOrder,
    receivePurchaseOrder,
  } = useApp();

  const { showToast } = useToast();

  const [search, setSearch] = useState("");

  const filteredOrders = purchaseOrders.filter((order) => {
    const supplier = suppliers.find(
      (s) => String(s.id) === String(order.supplierId)
    );

    const supplierName = supplier?.company || "";
    const searchText = search.toLowerCase();

    return (
      order.orderNumber.toLowerCase().includes(searchText) ||
      supplierName.toLowerCase().includes(searchText) ||
      order.status.toLowerCase().includes(searchText)
    );
  });

  function handleDelete(id) {
    const confirmed = window.confirm(
      "Delete this purchase order?"
    );

    if (!confirmed) return;

    deletePurchaseOrder(id);

    showToast({
      type: "success",
      title: "Deleted",
      message: "Purchase Order deleted successfully.",
    });
  }

  function handleReceive(id) {
    receivePurchaseOrder(id);

    showToast({
      type: "success",
      title: "Received",
      message: "Purchase Order received successfully.",
    });
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Purchase Orders
      </h2>

      <SearchBox
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search Purchase Orders..."
      />

      {filteredOrders.length === 0 ? (
        <EmptyState
          title="No Purchase Orders"
          message="Create your first purchase order."
        />
      ) : (
        <div className="overflow-x-auto mt-5">
          <table className="w-full border-collapse border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">PO No.</th>
                <th className="border p-2">Supplier</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Items</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => {
                const supplier = suppliers.find(
                  (s) =>
                    String(s.id) ===
                    String(order.supplierId)
                );

                return (
                  <tr key={order.id}>
                    <td className="border p-2">
                      {order.orderNumber}
                    </td>

                    <td className="border p-2">
                      {supplier?.company || "-"}
                    </td>

                    <td className="border p-2">
                      {order.date}
                    </td>

                    <td className="border p-2 text-center">
                      {order.items.length}
                    </td>

                    <td className="border p-2">
                      {order.status === "Received" ? (
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                          Received
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="border p-2">
                      GH₵{" "}
                      {Number(order.total).toLocaleString()}
                    </td>

                    <td className="border p-2">
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          variant="warning"
                          onClick={() =>
                            setOrderToEdit(order)
                          }
                        >
                          Edit
                        </Button>

                        {order.status !== "Received" && (
                          <Button
                            variant="success"
                            onClick={() =>
                              handleReceive(order.id)
                            }
                          >
                            Receive
                          </Button>
                        )}

                        <Button
                          variant="danger"
                          onClick={() =>
                            handleDelete(order.id)
                          }
                        >
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
    </div>
  );
}

export default PurchaseOrderTable;