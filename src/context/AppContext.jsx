import { createContext, useContext, useEffect, useState } from "react";

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
  const order = purchaseOrders.find(
    (po) => po.id === orderId
  );

  if (!order) return;

  if (order.status === "Received") return;

  // Update inventory
  setInventory((prevInventory) =>
    prevInventory.map((inventoryItem) => {
      const receivedItem = order.items.find(
        (item) =>
          String(item.inventoryId) ===
          String(inventoryItem.id)
      );

      if (!receivedItem) return inventoryItem;

      return {
        ...inventoryItem,
        quantity:
          Number(inventoryItem.quantity) +
          Number(receivedItem.quantity),
      };
    })
  );

  // Mark purchase order as received
  setPurchaseOrders((prevOrders) =>
    prevOrders.map((po) =>
      po.id === orderId
        ? {
            ...po,
            status: "Received",
          }
        : po
    )
  );
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