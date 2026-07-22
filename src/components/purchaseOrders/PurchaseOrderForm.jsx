import { useEffect, useMemo, useState } from "react";

import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";

import Button from "../common/Button";

function PurchaseOrderForm({
  orderToEdit,
  setOrderToEdit,
}) {
  const {
    suppliers,
    inventory,
    addPurchaseOrder,
    updatePurchaseOrder,
  } = useApp();

  const { showToast } = useToast();

  const emptyOrder = {
    supplierId: "",
    orderNumber: "",
    date: new Date().toISOString().split("T")[0],
    status: "Pending",
    items: [],
    transport: 0,
    discount: 0,
    notes: "",
  };

  const [editingId, setEditingId] = useState(null);
  const [order, setOrder] = useState(emptyOrder);

  useEffect(() => {
    if (!orderToEdit) return;

    setEditingId(orderToEdit.id);
    setOrder(orderToEdit);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [orderToEdit]);

  useEffect(() => {
    if (!editingId && order.orderNumber === "") {
      setOrder((prev) => ({
        ...prev,
        orderNumber: `PO-${Date.now()}`,
      }));
    }
  }, [editingId]);

  function resetForm() {
    setEditingId(null);
    setOrderToEdit(null);

    setOrder({
      ...emptyOrder,
      orderNumber: `PO-${Date.now()}`,
    });
  }

  function addItem() {
    setOrder((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          inventoryId: "",
          itemName: "",
          quantity: 1,
          price: 0,
        },
      ],
    }));
  }

  function removeItem(index) {
    setOrder((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }

  function updateItem(index, field, value) {
    const updatedItems = [...order.items];

    updatedItems[index][field] = value;

    if (field === "inventoryId") {
      const selected = inventory.find(
        (item) => item.id === Number(value)
      );

      if (selected) {
        updatedItems[index] = {
          ...updatedItems[index],
          inventoryId: selected.id,
          itemName: selected.name,
          price: Number(selected.costPrice),
        };
      }
    }

    setOrder({
      ...order,
      items: updatedItems,
    });
  }

  const materialTotal = useMemo(() => {
    return order.items.reduce(
      (sum, item) =>
        sum +
        Number(item.quantity) *
          Number(item.price),
      0
    );
  }, [order.items]);

  const grandTotal = useMemo(() => {
    return (
      materialTotal +
      Number(order.transport) -
      Number(order.discount)
    );
  }, [
    materialTotal,
    order.transport,
    order.discount,
  ]);

  function handleSave() {
    if (!order.supplierId) {
      showToast({
        type: "warning",
        title: "Supplier Required",
        message: "Please select a supplier.",
      });

      return;
    }

    if (order.items.length === 0) {
      showToast({
        type: "warning",
        title: "No Items",
        message:
          "Please add at least one inventory item.",
      });

      return;
    }

    const purchaseOrder = {
      id: editingId || Date.now(),
      ...order,
      transport: Number(order.transport),
      discount: Number(order.discount),
      total: grandTotal,
    };

    if (editingId) {
      updatePurchaseOrder(purchaseOrder);

      showToast({
        type: "success",
        title: "Updated",
        message:
          "Purchase Order updated successfully.",
      });
    } else {
      addPurchaseOrder(purchaseOrder);

      showToast({
        type: "success",
        title: "Saved",
        message:
          "Purchase Order created successfully.",
      });
    }

    resetForm();
  }
    return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {editingId ? "Edit Purchase Order" : "Create Purchase Order"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          className="border rounded-lg p-2"
          value={order.supplierId}
         onChange={(e) =>
  setOrder({
    ...order,
    supplierId: e.target.value
      ? Number(e.target.value)
      : "",
  })
}
        >
          <option value="">Select Supplier</option>

          {suppliers.map((supplier) => (
  <option
    key={supplier.id}
    value={supplier.id}
  >
    {supplier.company}
  </option>
))}
        </select>

        <input
          className="border rounded-lg p-2"
          value={order.orderNumber}
          readOnly
        />

        <input
          className="border rounded-lg p-2"
          type="date"
          value={order.date}
          onChange={(e) =>
            setOrder({
              ...order,
              date: e.target.value,
            })
          }
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">
          Order Items
        </h3>

        <Button
          variant="secondary"
          onClick={addItem}
        >
          + Add Item
        </Button>
      </div>

      {order.items.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3"
        >
          <select
            className="border rounded-lg p-2"
            value={item.inventoryId}
            onChange={(e) =>
              updateItem(
                index,
                "inventoryId",
                e.target.value
              )
            }
          >
            <option value="">
              Select Inventory Item
            </option>

            {inventory.map((inv) => (
              <option
                key={inv.id}
                value={inv.id}
              >
                {inv.name}
              </option>
            ))}
          </select>

          <input
            className="border rounded-lg p-2"
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) =>
              updateItem(
                index,
                "quantity",
                Number(e.target.value)
              )
            }
          />

          <input
            className="border rounded-lg p-2 bg-gray-100"
            value={item.price}
            readOnly
          />

          <input
            className="border rounded-lg p-2 bg-gray-100"
            value={(
              item.quantity * item.price
            ).toFixed(2)}
            readOnly
          />

          <Button
            variant="danger"
            onClick={() =>
              removeItem(index)
            }
          >
            Remove
          </Button>
        </div>
      ))}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <input
          className="border rounded-lg p-2"
          type="number"
          placeholder="Transport Cost"
          value={order.transport}
          onChange={(e) =>
            setOrder({
              ...order,
              transport: Number(e.target.value),
            })
          }
        />

        <input
          className="border rounded-lg p-2"
          type="number"
          placeholder="Discount"
          value={order.discount}
          onChange={(e) =>
            setOrder({
              ...order,
              discount: Number(e.target.value),
            })
          }
        />
      </div>

      <textarea
        className="border rounded-lg p-2 w-full mt-4"
        rows="4"
        placeholder="Notes..."
        value={order.notes}
        onChange={(e) =>
          setOrder({
            ...order,
            notes: e.target.value,
          })
        }
      />

      <div className="mt-6 border-t pt-6">
        <h3 className="text-xl font-bold mb-2">
          Order Summary
        </h3>

        <p>
          Material Total:
          <strong>
            {" "}
            GH₵ {materialTotal.toFixed(2)}
          </strong>
        </p>

        <p>
          Transport:
          <strong>
            {" "}
            GH₵ {Number(order.transport).toFixed(2)}
          </strong>
        </p>

        <p>
          Discount:
          <strong>
            {" "}
            GH₵ {Number(order.discount).toFixed(2)}
          </strong>
        </p>

        <p className="text-2xl font-bold mt-3">
          Grand Total:
          <span className="text-blue-600">
            {" "}
            GH₵ {grandTotal.toFixed(2)}
          </span>
        </p>
      </div>

      <div className="flex gap-3 mt-8">
        <Button
          variant={editingId ? "warning" : "primary"}
          onClick={handleSave}
        >
          {editingId
            ? "Update Purchase Order"
            : "Save Purchase Order"}
        </Button>

        {editingId && (
          <Button
            variant="secondary"
            onClick={resetForm}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}

export default PurchaseOrderForm;