import { createContext, useContext, useEffect, useRef, useState } from "react";

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

  function stockIn(id, quantity) {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                Number(item.quantity) + Number(quantity),
            }
          : item
      )
    );
  }

  function stockOut(id, quantity) {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(
                0,
                Number(item.quantity) - Number(quantity)
              ),
            }
          : item
      )
    );
  }
  function deductInventoryFromInvoice(materials) {
  setInventory((prev) =>
    prev.map((inventoryItem) => {
      const soldItem = materials.find(
        (material) =>
          material.description.trim().toLowerCase() ===
          inventoryItem.name.trim().toLowerCase()
      );

      if (!soldItem) return inventoryItem;

      return {
        ...inventoryItem,
        quantity: Math.max(
          0,
          Number(inventoryItem.quantity) -
            Number(soldItem.quantity)
        ),
      };
    })
  );
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

    // Persist both sides of the receipt transaction immediately using the
    // same keys already used by the context persistence effects.
    localStorage.setItem("inventory", JSON.stringify(nextInventory));
    localStorage.setItem("purchaseOrders", JSON.stringify(nextPurchaseOrders));
    setInventory(nextInventory);
    setPurchaseOrders(nextPurchaseOrders);

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
