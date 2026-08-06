import { useState, useEffect } from "react";

import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";

import Button from "../common/Button";

function InventoryForm({ itemToEdit, setItemToEdit }) {
  const { addInventoryItem, updateInventoryItem } = useApp();
  const { showToast } = useToast();

  const [editingId, setEditingId] = useState(null);

  const [item, setItem] = useState({
    name: "",
    category: "Cable",
    supplier: "",
    unit: "pcs",
    quantity: "",
    minimumStock: "",
    costPrice: "",
    sellingPrice: "",
  });

  useEffect(() => {
    if (!itemToEdit) return;

    setEditingId(itemToEdit.id);

    setItem({
      name: itemToEdit.name,
      category: itemToEdit.category,
      supplier: itemToEdit.supplier,
      unit: itemToEdit.unit,
      quantity: itemToEdit.quantity,
      minimumStock: itemToEdit.minimumStock,
      costPrice: itemToEdit.costPrice,
      sellingPrice: itemToEdit.sellingPrice,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [itemToEdit]);

  function resetForm() {
    setItem({
      name: "",
      category: "Cable",
      supplier: "",
      unit: "pcs",
      quantity: "",
      minimumStock: "",
      costPrice: "",
      sellingPrice: "",
    });

    setEditingId(null);
    setItemToEdit(null);
  }

  function handleSave() {
    if (item.name.trim() === "") {
      showToast({
        type: "warning",
        title: "Missing Information",
        message: "Please enter an item name.",
      });
      return;
    }

    const inventoryItem = {
      id: editingId || Date.now(),
      ...item,
      quantity: Number(item.quantity),
      minimumStock: Number(item.minimumStock),
      costPrice: Number(item.costPrice),
      sellingPrice: Number(item.sellingPrice),
    };

    if (editingId) {
      updateInventoryItem(inventoryItem);

      showToast({
        type: "success",
        title: "Updated",
        message: "Inventory item updated successfully.",
      });
    } else {
      addInventoryItem(inventoryItem);

      showToast({
        type: "success",
        title: "Saved",
        message: "Inventory item added successfully.",
      });
    }

    resetForm();
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {editingId ? "Edit Inventory Item" : "Add Inventory Item"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <input
          className="border rounded-lg p-2"
          placeholder="Item Name"
          value={item.name}
          onChange={(e) =>
            setItem({
              ...item,
              name: e.target.value,
            })
          }
        />

        <select
          className="border rounded-lg p-2"
          value={item.category}
          onChange={(e) =>
            setItem({
              ...item,
              category: e.target.value,
            })
          }
        >
          <option>Cable</option>
          <option>Lighting</option>
          <option>Protection</option>
          <option>Switches</option>
          <option>Accessories</option>
          <option>Conduit</option>
          <option>Distribution Board</option>
          <option>Tools</option>
          <option>Consumables</option>
        </select>

        <input
          className="border rounded-lg p-2"
          placeholder="Supplier"
          value={item.supplier}
          onChange={(e) =>
            setItem({
              ...item,
              supplier: e.target.value,
            })
          }
        />

        <input
          className="border rounded-lg p-2"
          placeholder="Unit"
          value={item.unit}
          onChange={(e) =>
            setItem({
              ...item,
              unit: e.target.value,
            })
          }
        />

        <input
          className="border rounded-lg p-2"
          type="number"
          placeholder="Quantity"
          value={item.quantity}
          onChange={(e) =>
            setItem({
              ...item,
              quantity: e.target.value,
            })
          }
        />

        <input
          className="border rounded-lg p-2"
          type="number"
          placeholder="Minimum Stock"
          value={item.minimumStock}
          onChange={(e) =>
            setItem({
              ...item,
              minimumStock: e.target.value,
            })
          }
        />

        <input
          className="border rounded-lg p-2"
          type="number"
          placeholder="Cost Price"
          value={item.costPrice}
          onChange={(e) =>
            setItem({
              ...item,
              costPrice: e.target.value,
            })
          }
        />

        <input
          className="border rounded-lg p-2"
          type="number"
          placeholder="Selling Price"
          value={item.sellingPrice}
          onChange={(e) =>
            setItem({
              ...item,
              sellingPrice: e.target.value,
            })
          }
        />

      </div>

      <Button
        className="mt-6"
        variant={editingId ? "warning" : "primary"}
        onClick={handleSave}
      >
        {editingId ? "Update Item" : "Save Item"}
      </Button>
    </div>
  );
}

export default InventoryForm;