import { useMemo } from "react";
import { Package, AlertTriangle, Boxes, CircleOff } from "lucide-react";
import { useApp } from "../../context/AppContext";
import StatCard from "../common/StatCard";

function InventoryReport() {
  const { inventory } = useApp();

  const totalItems = inventory.length;

  const totalQuantity = useMemo(() => {
    return inventory.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );
  }, [inventory]);

  const inventoryValue = useMemo(() => {
    return inventory.reduce(
      (sum, item) =>
        sum +
        Number(item.quantity || 0) *
          Number(item.costPrice || 0),
      0
    );
  }, [inventory]);

  const lowStock = inventory.filter(
    (item) =>
      Number(item.quantity) > 0 &&
      Number(item.quantity) <= Number(item.minimumStock)
  ).length;

  const outOfStock = inventory.filter(
    (item) => Number(item.quantity) === 0
  ).length;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-5">
        Inventory Report
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Inventory Items"
          value={totalItems}
          subtitle="Products in inventory"
          icon={Package}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatCard
          title="Stock Quantity"
          value={totalQuantity}
          subtitle="Total units available"
          icon={Boxes}
          iconBg="bg-indigo-100"
          iconColor="text-indigo-600"
        />

        <StatCard
          title="Low Stock"
          value={lowStock}
          subtitle="Needs replenishment"
          icon={AlertTriangle}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
          valueColor="text-yellow-700"
        />

        <StatCard
          title="Out of Stock"
          value={outOfStock}
          subtitle="Unavailable items"
          icon={CircleOff}
          iconBg="bg-red-100"
          iconColor="text-red-600"
          valueColor="text-red-600"
        />

      </div>

      <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-800">
          Inventory Value
        </h3>

        <p className="text-4xl font-bold text-orange-600 mt-3">
          GH₵ {inventoryValue.toLocaleString()}
        </p>

        <p className="text-sm text-slate-500 mt-2">
          Estimated value based on current stock and cost price.
        </p>
      </div>
    </div>
  );
}

export default InventoryReport;