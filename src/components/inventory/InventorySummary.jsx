import { getInventory } from "../../services/inventoryService";

function InventorySummary() {
  const inventory = getInventory();

  const totalItems = inventory.length;

  const inventoryValue = inventory.reduce(
    (sum, item) => sum + item.quantity * item.costPrice,
    0
  );

  const lowStock = inventory.filter(
    (item) => item.quantity <= item.minimumStock
  );

  return (
    <div className="grid grid-cols-3 gap-6">

      <div className="bg-blue-50 rounded-xl shadow p-6">

        <h3 className="text-gray-500">
          Total Items
        </h3>

        <p className="text-3xl font-bold text-blue-700">
          {totalItems}
        </p>

      </div>

      <div className="bg-green-50 rounded-xl shadow p-6">

        <h3 className="text-gray-500">
          Inventory Value
        </h3>

        <p className="text-3xl font-bold text-green-700">
          GH₵ {inventoryValue.toLocaleString()}
        </p>

      </div>

      <div className="bg-red-50 rounded-xl shadow p-6">

        <h3 className="text-gray-500">
          Low Stock
        </h3>

        <p className="text-3xl font-bold text-red-700">
          {lowStock.length}
        </p>

      </div>

    </div>
  );
}

export default InventorySummary;