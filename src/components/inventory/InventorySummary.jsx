import { getInventory } from "../../services/inventoryService";
import { formatCurrency } from "../../utils/currency";

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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

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
          {formatCurrency(inventoryValue)}
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
