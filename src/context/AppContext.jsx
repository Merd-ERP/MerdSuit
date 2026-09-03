import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  appendUniqueInventoryMovements,
  createInventoryMovement,
  createInvoiceMovementId,
  createManualMovementId,
  createPurchaseOrderMovementId,
  persistInventoryMovements,
  readInventoryMovements,
} from "../utils/inventoryMovements";

const AppContext = createContext();

export function AppProvider({ children }) {
  // ===========================
  // State
  // ===========================

  const [clients, setClients] = useState(
    () => JSON.parse(localStorage.getItem("clients")) || []
  );

  const [projects, setProjects] = useState(
    () => JSON.parse(localStorage.getItem("projects")) || []
  );

  const [quotations, setQuotations] = useState(
    () => JSON.parse(localStorage.getItem("quotations")) || []
  );

  const [invoices, setInvoices] = useState(
    () => JSON.parse(localStorage.getItem("invoices")) || []
  );

  const [inventory, setInventory] = useState(
    () => JSON.parse(localStorage.getItem("inventory")) || []
  );

  const [inventoryMovements, setInventoryMovements] = useState(
    () => readInventoryMovements()
  );

  const [suppliers, setSuppliers] = useState(
    () => JSON.parse(localStorage.getItem("suppliers")) || []
  );

  // NEW
  const [purchaseOrders, setPurchaseOrders] = useState(
    () =>
      JSON.parse(localStorage.getItem("purchaseOrders")) || []
  );
  // Expenses
  const [expenses, setExpenses] = useState(
  () =>
    JSON.parse(localStorage.getItem("expenses")) || []
);
  const receivingOrderIds = useRef(new Set());

  // ===========================
  // Local Storage
  // ===========================

  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("quotations", JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    persistInventoryMovements(inventoryMovements);
  }, [inventoryMovements]);

  useEffect(() => {
    localStorage.setItem("suppliers", JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem(
      "purchaseOrders",
      JSON.stringify(purchaseOrders)
    );
  }, [purchaseOrders]);
  useEffect(() => {
  localStorage.setItem(
    "expenses",
    JSON.stringify(expenses)
  );
}, [expenses]);

  // ===========================
  // Inventory
  // ===========================

  function addInventoryItem(item) {
    setInventory((prev) => [...prev, item]);
  }

  function updateInventoryItem(updatedItem) {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  }

  function deleteInventoryItem(id) {
    setInventory((prev) =>
      prev.filter((item) => item.id !== id)
    );
  }

  function recordInventoryMovements(movements) {
    const nextMovements = appendUniqueInventoryMovements(
      readInventoryMovements(),
      movements,
    );
    persistInventoryMovements(nextMovements);
    setInventoryMovements(nextMovements);
    return nextMovements;
  }

  function updateStockWithMovement(id, quantity, type, details = {}) {
    let storedInventory;
    try {
      const parsedInventory = JSON.parse(localStorage.getItem("inventory"));
      storedInventory = Array.isArray(parsedInventory) ? parsedInventory : inventory;
    } catch {
      storedInventory = inventory;
    }
    const inventoryItem = storedInventory.find((item) => String(item.id) === String(id));
    const movementQuantity = Number(quantity);

    if (!inventoryItem || !Number.isFinite(movementQuantity) || movementQuantity <= 0) {
      return { success: false, message: "Choose an item and enter a positive quantity." };
    }

    const currentQuantity = Number(inventoryItem.quantity) || 0;
    if (type === "Stock Out" && movementQuantity > currentQuantity) {
      return { success: false, message: "Stock out quantity cannot exceed the available quantity." };
    }

    const resultingQuantity = type === "Stock In"
      ? currentQuantity + movementQuantity
      : Math.max(0, currentQuantity - movementQuantity);
    const nextInventory = storedInventory.map((item) =>
      String(item.id) === String(id)
        ? { ...item, quantity: resultingQuantity }
        : item
    );
    const movement = createInventoryMovement({
      id: createManualMovementId(inventoryItem.id),
      inventoryItem,
      type,
      quantity: movementQuantity,
      occurredAt: details.date
        ? `${details.date}T${new Date().toTimeString().slice(0, 8)}`
        : new Date().toISOString(),
      sourceType: details.sourceType || "Manual",
      sourceId: details.sourceId ?? null,
      sourceReference: details.sourceReference
        || details.supplier
        || details.reason
        || "Manual adjustment",
      resultingQuantity,
      notes: details.notes || "",
    });

    localStorage.setItem("inventory", JSON.stringify(nextInventory));
    recordInventoryMovements([movement]);
    setInventory(nextInventory);
    return { success: true, movement };
  }

  function stockIn(id, quantity, details = {}) {
    return updateStockWithMovement(id, quantity, "Stock In", details);
  }

  function stockOut(id, quantity, details = {}) {
    return updateStockWithMovement(id, quantity, "Stock Out", details);
  }
  function deductInventoryFromInvoice(materials, invoice = {}, occurredAt = new Date().toISOString()) {
  const invoiceMaterials = Array.isArray(materials) ? materials : [];
  setInventory((prev) => {
    const invoiceIdentity = invoice.id ?? invoice.invoiceNumber;
    const canRecordMovement = invoiceIdentity !== undefined
      && invoiceIdentity !== null
      && invoiceIdentity !== "";
    const movements = [];
    const nextInventory = prev.map((inventoryItem) => {
      const soldItem = invoiceMaterials.find(
        (material) =>
          String(material?.description || "").trim().toLowerCase() ===
          String(inventoryItem?.name || "").trim().toLowerCase()
      );

      if (!soldItem) return inventoryItem;

      const currentQuantity = Number(inventoryItem.quantity);
      const soldQuantity = Number.isFinite(Number(soldItem.quantity))
        ? Number(soldItem.quantity)
        : 0;
      const resultingQuantity = Math.max(0, currentQuantity - soldQuantity);
      const deductedQuantity = currentQuantity - resultingQuantity;

      if (
        canRecordMovement
        && inventoryItem.id !== undefined
        && inventoryItem.id !== null
        && inventoryItem.id !== ""
        && Number.isFinite(deductedQuantity)
        && deductedQuantity > 0
      ) {
        movements.push(createInventoryMovement({
          id: createInvoiceMovementId(invoiceIdentity, inventoryItem.id),
          inventoryItem,
          type: "Stock Out",
          quantity: deductedQuantity,
          occurredAt,
          sourceType: "Invoice",
          sourceId: invoice.id ?? null,
          sourceReference: invoice.invoiceNumber || String(invoiceIdentity),
          resultingQuantity,
          notes: `Deducted for invoice ${invoice.invoiceNumber || invoiceIdentity}`,
        }));
      }

      return {
        ...inventoryItem,
        quantity: resultingQuantity,
      };
    });
    localStorage.setItem("inventory", JSON.stringify(nextInventory));
    if (movements.length > 0) recordInventoryMovements(movements);
    return nextInventory;
  });
}

  // ===========================
  // Suppliers
  // ===========================

  function addSupplier(supplier) {
    setSuppliers((prev) => [...prev, supplier]);
  }

  function updateSupplier(updatedSupplier) {
    setSuppliers((prev) =>
      prev.map((supplier) =>
        supplier.id === updatedSupplier.id
          ? updatedSupplier
          : supplier
      )
    );
  }

  function deleteSupplier(id) {
    setSuppliers((prev) =>
      prev.filter((supplier) => supplier.id !== id)
    );
  }

  // ===========================
  // Purchase Orders
  // ===========================

  function addPurchaseOrder(order) {
    setPurchaseOrders((prev) => [...prev, order]);
  }

  function updatePurchaseOrder(updatedOrder) {
    setPurchaseOrders((prev) =>
      prev.map((order) =>
        order.id === updatedOrder.id
          ? updatedOrder
          : order
      )
    );
  }

  function deletePurchaseOrder(id) {
    setPurchaseOrders((prev) =>
      prev.filter((order) => order.id !== id)
    );
  }

  function receivePurchaseOrder(orderId) {
    const order = purchaseOrders.find((po) => String(po.id) === String(orderId));
    const orderKey = String(orderId);

    if (!order) return { success: false, message: "Purchase order not found." };
    if (String(order.status).toLowerCase() === "received" || receivingOrderIds.current.has(orderKey)) {
      return { success: false, message: "This purchase order has already been received." };
    }

    const additions = new Map();
    const unmatchedItems = [];

    (order.items || []).forEach((item) => {
      const quantity = Number(item.quantity ?? item.qty ?? item.receivedQuantity);
      const inventoryId = item.inventoryId ?? item.inventoryItemId ?? item.linkedInventoryId ?? item.itemId ?? item.inventory?.id;
      const itemName = item.itemName ?? item.inventoryName ?? item.name ?? item.description ?? item.materialName ?? item.inventory?.name;
      const inventoryItem = inventoryId !== undefined && inventoryId !== ""
        ? inventory.find((entry) => String(entry.id) === String(inventoryId))
        : inventory.find((entry) => String(entry.name || "").trim().toLowerCase() === String(itemName || "").trim().toLowerCase());

      if (!inventoryItem || !Number.isFinite(quantity) || quantity <= 0) {
        unmatchedItems.push(itemName || "an order item");
        return;
      }

      additions.set(
        String(inventoryItem.id),
        (additions.get(String(inventoryItem.id)) || 0) + quantity,
      );
    });

    if (additions.size === 0 || unmatchedItems.length > 0) {
      return {
        success: false,
        message: unmatchedItems.length
          ? `Unable to match ${unmatchedItems.join(", ")} to inventory. Select a linked inventory item before receiving.`
          : "This purchase order has no receivable items.",
      };
    }

    receivingOrderIds.current.add(orderKey);
    const nextInventory = inventory.map((inventoryItem) => {
      const receivedQuantity = additions.get(String(inventoryItem.id));
      return receivedQuantity === undefined
        ? inventoryItem
        : { ...inventoryItem, quantity: (Number(inventoryItem.quantity) || 0) + receivedQuantity };
    });
    const nextPurchaseOrders = purchaseOrders.map((purchaseOrder) =>
      String(purchaseOrder.id) === orderKey
        ? { ...purchaseOrder, status: "Received" }
        : purchaseOrder,
    );
    const occurredAt = new Date().toISOString();
    const purchaseOrderMovements = nextInventory.flatMap((inventoryItem) => {
      const receivedQuantity = additions.get(String(inventoryItem.id));
      if (receivedQuantity === undefined) return [];

      return [createInventoryMovement({
        id: createPurchaseOrderMovementId(order.id, inventoryItem.id),
        inventoryItem,
        type: "Stock In",
        quantity: receivedQuantity,
        occurredAt,
        sourceType: "Purchase Order",
        sourceId: order.id,
        sourceReference: order.orderNumber || String(order.id),
        resultingQuantity: inventoryItem.quantity,
        notes: `Received from purchase order ${order.orderNumber || order.id}`,
      })];
    });
    const nextInventoryMovements = appendUniqueInventoryMovements(
      readInventoryMovements(),
      purchaseOrderMovements,
    );

    // Persist both sides of the receipt transaction immediately using the
    // same keys already used by the context persistence effects.
    localStorage.setItem("inventory", JSON.stringify(nextInventory));
    localStorage.setItem("purchaseOrders", JSON.stringify(nextPurchaseOrders));
    persistInventoryMovements(nextInventoryMovements);
    setInventory(nextInventory);
    setPurchaseOrders(nextPurchaseOrders);
    setInventoryMovements(nextInventoryMovements);

    return { success: true };
  }
// ===========================
// Expenses
// ===========================

function addExpense(expense) {
  setExpenses((prev) => [...prev, expense]);
}

function updateExpense(updatedExpense) {
  setExpenses((prev) =>
    prev.map((expense) =>
      expense.id === updatedExpense.id
        ? updatedExpense
        : expense
    )
  );
}

function deleteExpense(id) {
  setExpenses((prev) =>
    prev.filter((expense) => expense.id !== id)
  );
}
  return (
    <AppContext.Provider
      value={{
        // Clients
        clients,
        setClients,

        // Projects
        projects,
        setProjects,

        // Quotations
        quotations,
        setQuotations,

        // Invoices
        invoices,
        setInvoices,

        // Inventory
        inventory,
        inventoryMovements,
        setInventory,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        stockIn,
        stockOut,
        deductInventoryFromInvoice,
        
        // Suppliers
        suppliers,
        setSuppliers,
        addSupplier,
        updateSupplier,
        deleteSupplier,

        // Purchase Orders
        purchaseOrders,
        setPurchaseOrders,
        addPurchaseOrder,
        updatePurchaseOrder,
        deletePurchaseOrder,
        receivePurchaseOrder,

        // Expenses
        expenses,
        setExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
