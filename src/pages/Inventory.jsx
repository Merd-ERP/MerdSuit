import { useState } from "react";
import MainLayout from "../layouts/Mainlayout";
import Card from "../components/common/Card";
import PageHeader from "../components/common/PageHeader";
import { useApp } from "../context/AppContext";
import InventorySummary from "../components/inventory/InventorySummary";
import InventoryForm from "../components/inventory/InventoryForm";
import InventoryTable from "../components/inventory/InventoryTable";
import InventoryActions from "../components/inventory/InventoryActions";
import StockInModal from "../components/inventory/StockInModal";
import StockOutModal from "../components/inventory/StockOutModal";
import StockHistory from "../components/inventory/StockHistory";
import LowStockAlert from "../components/inventory/LowStockAlert";

function Inventory() {
  const { inventory, inventoryMovements, invoices, purchaseOrders, stockIn, stockOut } = useApp();
  const [itemToEdit, setItemToEdit] = useState(null);
  const [isStockInOpen, setIsStockInOpen] = useState(false);
  const [isStockOutOpen, setIsStockOutOpen] = useState(false);

  function saveStockIn(movement) {
    stockIn(movement.item.id, movement.quantity, movement);
    setIsStockInOpen(false);
  }

  function saveStockOut(movement) {
    stockOut(movement.item.id, movement.quantity, movement);
    setIsStockOutOpen(false);
  }

  return <MainLayout><PageHeader title="Inventory" subtitle="Manage electrical materials and stock levels" /><InventorySummary /><InventoryActions onStockIn={() => setIsStockInOpen(true)} onStockOut={() => setIsStockOutOpen(true)} /><LowStockAlert /><Card className="mt-6"><InventoryForm itemToEdit={itemToEdit} setItemToEdit={setItemToEdit} /><hr className="my-8" /><InventoryTable setItemToEdit={setItemToEdit} /></Card><StockHistory history={inventoryMovements} invoices={invoices} purchaseOrders={purchaseOrders} /><StockInModal isOpen={isStockInOpen} inventory={inventory} onClose={() => setIsStockInOpen(false)} onSave={saveStockIn} /><StockOutModal isOpen={isStockOutOpen} inventory={inventory} onClose={() => setIsStockOutOpen(false)} onSave={saveStockOut} /></MainLayout>;
}

export default Inventory;
