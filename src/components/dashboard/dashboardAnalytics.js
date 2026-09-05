import { getNormalizedPaymentRows, safeRecordArray } from "../../utils/financialMetrics.js";
import { isArchivedRecord } from "../../utils/relationships.js";

const eventId = (type, value, fallback) =>
  `${type}:${typeof value}:${String(value ?? fallback)}`;

function parseTimestamp(value) {
  if (!value) return null;
  const text = String(value).trim();
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(text) ? `${text}T00:00:00` : text);
  const timestamp = date.getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function getActiveClientCount(clients) {
  return safeRecordArray(clients).filter((client) => !isArchivedRecord(client)).length;
}

export function getActiveProjectCount(projects) {
  return safeRecordArray(projects).filter((project) => {
    const status = String(project.status || "").trim().toLowerCase();
    return status !== "completed" && !isArchivedRecord(project);
  }).length;
}

export function getLowStockCount(inventory) {
  return safeRecordArray(inventory).filter((item) => {
    const quantity = Number(item.quantity);
    const reorderLevel = Number(item.reorderLevel ?? item.minimumStock);
    return Number.isFinite(quantity)
      && Number.isFinite(reorderLevel)
      && quantity <= reorderLevel;
  }).length;
}

export function buildRecentActivities({
  invoices,
  purchaseOrders,
  expenses,
  inventoryMovements,
  limit = 6,
} = {}) {
  const activities = [];

  getNormalizedPaymentRows(invoices).forEach((payment) => {
    const timestamp = parseTimestamp(payment.date);
    if (timestamp === null) return;
    activities.push({
      id: eventId("payment", payment.id, `${payment.invoiceId}:${payment.date}`),
      timestamp,
      description: `Payment received${payment.invoiceNumber ? ` for ${payment.invoiceNumber}` : ""}`,
      amount: Number(payment.amount) || 0,
    });
  });

  safeRecordArray(invoices).forEach((invoice) => {
    const timestamp = parseTimestamp(invoice.createdAt || invoice.date);
    if (timestamp === null) return;
    activities.push({
      id: eventId("invoice", invoice.id, `${invoice.invoiceNumber}:${timestamp}`),
      timestamp,
      description: `Invoice ${invoice.invoiceNumber || "created"} created`,
    });
  });

  safeRecordArray(purchaseOrders).forEach((order) => {
    const receivedTimestamp = order.receivedAt || order.receivedDate;
    const timestamp = parseTimestamp(receivedTimestamp);
    if (timestamp === null || String(order.status || "").toLowerCase() !== "received") return;
    activities.push({
      id: eventId("purchase-order", order.id, `${order.orderNumber}:${timestamp}`),
      timestamp,
      description: `Purchase order ${order.orderNumber || "received"} received`,
    });
  });

  safeRecordArray(expenses).forEach((expense) => {
    const timestamp = parseTimestamp(expense.createdAt || expense.date);
    if (timestamp === null) return;
    activities.push({
      id: eventId("expense", expense.id, `${expense.description}:${timestamp}`),
      timestamp,
      description: expense.description
        ? `Expense recorded: ${expense.description}`
        : "Expense recorded",
      amount: Number(expense.amount) || 0,
    });
  });

  safeRecordArray(inventoryMovements).forEach((movement) => {
    const timestamp = parseTimestamp(movement.occurredAt);
    if (timestamp === null) return;
    activities.push({
      id: eventId("inventory", movement.id, `${movement.inventoryItemId}:${timestamp}`),
      timestamp,
      description: `${movement.type || "Stock movement"}: ${movement.itemNameSnapshot || movement.itemName || "Inventory item"}`,
    });
  });

  return activities
    .sort((left, right) => right.timestamp - left.timestamp)
    .slice(0, Math.max(0, Number(limit) || 0))
    .map((activity, index) => ({
      ...activity,
      id: `${activity.id}:${activity.timestamp}:${index}`,
    }));
}

export function getMonthlyReceivedRevenue(invoices, limit = 6) {
  const totals = new Map();

  getNormalizedPaymentRows(invoices).forEach((payment) => {
    const date = String(payment.date || "").trim();
    const match = date.match(/^(\d{4})-(\d{2})/);
    const amount = Number(payment.amount);
    if (!match || !Number.isFinite(amount) || amount <= 0) return;

    const month = Number(match[2]);
    if (month < 1 || month > 12) return;
    const key = `${match[1]}-${match[2]}`;
    totals.set(key, (totals.get(key) || 0) + amount);
  });

  return [...totals.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(-Math.max(0, Number(limit) || 0))
    .map(([key, total]) => {
      const [year, month] = key.split("-").map(Number);
      return {
        key,
        label: new Intl.DateTimeFormat("en", { month: "short", year: "2-digit", timeZone: "UTC" })
          .format(new Date(Date.UTC(year, month - 1, 1))),
        total,
      };
    });
}
