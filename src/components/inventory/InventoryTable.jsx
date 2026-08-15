import { useState } from "react";

import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";

import Button from "../common/Button";
import SearchBox from "../common/SearchBox";
import EmptyState from "../common/EmptyState";
import ConfirmDialog from "../common/ConfirmDialog";
import { formatCurrency } from "../../utils/currency";

function InventoryTable({ setItemToEdit }) {
  const { inventory, deleteInventoryItem } = useApp();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [itemToDelete, setItemToDelete] = useState(null);

  const filteredInventory = inventory.filter((item) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      item.name.toLowerCase().includes(searchText) ||
      item.category.toLowerCase().includes(searchText) ||
      item.supplier.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All" || item.category === category;

    return matchesSearch && matchesCategory;
  });

  function handleDelete() {
    deleteInventoryItem(itemToDelete.id);

    showToast({
      type: "success",
      title: "Deleted",
      message: "Inventory item deleted successfully",
    });

    setItemToDelete(null);
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Inventory List
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <SearchBox
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Item, Supplier or Category..."
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg p-3"
        >
          <option>All</option>
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
      </div>

      {filteredInventory.length === 0 ? (
        <EmptyState
          title="No Inventory"
          message="No inventory items found."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Item</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Supplier</th>
                <th className="border p-2">Unit</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Minimum</th>
                <th className="border p-2">Cost Price</th>
                <th className="border p-2">Selling Price</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.id}>
                  <td className="border p-2">{item.name}</td>

                  <td className="border p-2">
                    {item.category}
                  </td>

                  <td className="border p-2">
                    {item.supplier}
                  </td>

                  <td className="border p-2">
                    {item.unit}
                  </td>

                  <td
                    className={`border p-2 ${
                      item.quantity <= item.minimumStock
                        ? "bg-red-50 text-red-600 font-bold"
                        : ""
                    }`}
                  >
                    {item.quantity}
                  </td>

                  <td className="border p-2">
                    {item.minimumStock}
                  </td>

                  <td className="border p-2">
                    {formatCurrency(item.costPrice)}
                  </td>

                  <td className="border p-2">
                    {formatCurrency(item.sellingPrice)}
                  </td>

                  <td className="border p-2">
                    <div className="flex gap-2">
                      <Button
                        variant="warning"
                        onClick={() => setItemToEdit(item)}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() => setItemToDelete(item)}
                      >
                        Delete
                      </Button>
      </div>

      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        title="Delete Inventory Item?"
        message={`Are you sure you want to delete ${itemToDelete?.name || "this item"}? This action cannot be undone.`}
        onCancel={() => setItemToDelete(null)}
        onConfirm={handleDelete}
        confirmLabel="Delete Item"
      />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default InventoryTable;
