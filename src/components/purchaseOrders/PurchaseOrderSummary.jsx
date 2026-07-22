import { useApp } from "../../context/AppContext";

function PurchaseOrderSummary() {
  const { purchaseOrders } = useApp();

  const totalOrders = purchaseOrders.length;

  const pendingOrders = purchaseOrders.filter(
    (order) => order.status === "Pending"
  ).length;

  const receivedOrders = purchaseOrders.filter(
    (order) => order.status === "Received"
  ).length;

  const totalValue = purchaseOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-sm text-gray-500">
          Total Orders
        </h3>

        <p className="text-3xl font-bold mt-2">
          {totalOrders}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-sm text-gray-500">
          Pending Orders
        </h3>

        <p className="text-3xl font-bold mt-2 text-yellow-600">
          {pendingOrders}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-sm text-gray-500">
          Received Orders
        </h3>

        <p className="text-3xl font-bold mt-2 text-green-600">
          {receivedOrders}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-sm text-gray-500">
          Total Purchase Value
        </h3>

        <p className="text-3xl font-bold mt-2">
          GH₵ {totalValue.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default PurchaseOrderSummary;