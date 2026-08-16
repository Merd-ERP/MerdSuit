import { useState } from "react";
import MainLayout from "../layouts/Mainlayout";
import PageHeader from "../components/common/PageHeader";
import PurchaseOrdersHeader from "../components/purchaseOrders/PurchaseOrdersHeader";
import PurchaseOrderStats from "../components/purchaseOrders/PurchaseOrderStats";
import QuickActions from "../components/purchaseOrders/QuickActions";
import PurchaseOrderForm from "../components/purchaseOrders/PurchaseOrderForm";
import PurchaseOrderFilters from "../components/purchaseOrders/PurchaseOrderFilters";
import PurchaseOrderTable from "../components/purchaseOrders/PurchaseOrderTable";
import PurchaseOrderDetails from "../components/purchaseOrders/PurchaseOrderDetails";

function PurchaseOrders() {
  const [orderToEdit, setOrderToEdit] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  function startNewOrder() {
    setOrderToEdit(null);
    document.getElementById("purchase-order-form")?.scrollIntoView({ behavior: "smooth" });
  }

  return <MainLayout><PageHeader title="Purchase Orders" subtitle="Create, receive and manage supplier purchase orders" /><PurchaseOrdersHeader /><PurchaseOrderStats /><QuickActions onNewOrder={startNewOrder} /><PurchaseOrderForm key={orderToEdit?.id || "new"} orderToEdit={orderToEdit} setOrderToEdit={setOrderToEdit} /><PurchaseOrderFilters search={search} status={status} onSearchChange={setSearch} onStatusChange={setStatus} /><PurchaseOrderTable search={search} status={status} setOrderToEdit={setOrderToEdit} onViewOrder={setSelectedOrder} /><PurchaseOrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} /></MainLayout>;
}

export default PurchaseOrders;
