import { getInvoices } from "../../services/invoiceService";
import { formatCurrency } from "../../utils/currency";
import {
  getInvoicePaymentStatus,
} from "../../utils/invoicePayments";
import {
  getNormalizedPaymentRows,
  getOutstandingBalance,
  getReceivedRevenue,
  safeRecordArray,
} from "../../utils/financialMetrics.js";

export const money = (value) => formatCurrency(value, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numeric = (value) => {
  const amount = Number(value);
  return (Number.isFinite(amount) ? amount : 0).toFixed(2);
};

export function inPeriod(date, period) {
  if (period === "All Time") return true;
  if (!date) return false;

  const value = new Date(`${date}T00:00:00`);
  if (Number.isNaN(value.getTime())) return false;

  const now = new Date();
  const target = new Date(
    now.getFullYear(),
    now.getMonth() + (period === "Last Month" ? -1 : 0),
    1,
  );

  return value.getFullYear() === target.getFullYear()
    && value.getMonth() === target.getMonth();
}

export function getReportMetrics(period, expenses = []) {
  const allInvoices = safeRecordArray(getInvoices());
  const filteredExpenses = safeRecordArray(expenses).filter((expense) => inPeriod(expense.date, period));

  const revenue = getReceivedRevenue(allInvoices, (payment) => inPeriod(payment.date, period));
  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + (Number(expense.amount) || 0),
    0,
  );
  const outstanding = getOutstandingBalance(allInvoices, (invoice) => inPeriod(invoice.date, period));

  return { revenue, totalExpenses, outstanding, profit: revenue - totalExpenses };
}

export function getReportData(tab, period, { expenses = [], inventory = [] }) {
  const allInvoices = safeRecordArray(getInvoices());
  const invoices = allInvoices.filter((invoice) => inPeriod(invoice.date, period));
  const payments = getNormalizedPaymentRows(allInvoices).filter((payment) => inPeriod(payment.date, period));

  if (tab === "sales") {
    const rawRows = payments.map((payment) => [
      payment.date || "",
      payment.invoiceNumber,
      payment.client,
      numeric(payment.amount),
      payment.invoiceStatus,
    ]);
    return {
      title: "Sales Report",
      headers: ["Date", "Invoice", "Customer", "Amount", "Status"],
      rawRows,
      rows: rawRows.map((row) => [...row.slice(0, 3), money(row[3]), row[4]]),
    };
  }

  if (tab === "invoices") {
    const rawRows = invoices.map((invoice) => [
      invoice.invoiceNumber || "",
      invoice.client || "",
      invoice.dueDate || "",
      numeric(getOutstandingBalance([invoice])),
      getInvoicePaymentStatus(invoice),
    ]);
    return {
      title: "Invoice Report",
      headers: ["Invoice Number", "Customer", "Due Date", "Balance", "Status"],
      rawRows,
      rows: rawRows.map((row) => [...row.slice(0, 3), money(row[3]), row[4]]),
    };
  }

  if (tab === "payments") {
    const rawRows = payments.map((payment) => [
      payment.date || "",
      payment.invoiceNumber,
      payment.client,
      payment.method || "",
      numeric(payment.amount),
    ]);
    return {
      title: "Payment Report",
      headers: ["Date", "Invoice", "Customer", "Method", "Amount"],
      rawRows,
      rows: rawRows.map((row) => [...row.slice(0, 4), money(row[4])]),
    };
  }

  if (tab === "expenses") {
    const rawRows = safeRecordArray(expenses)
      .filter((expense) => inPeriod(expense.date, period))
      .map((expense) => [
        expense.date || "",
        expense.category || "",
        expense.description || "",
        numeric(expense.amount),
      ]);
    return {
      title: "Expense Report",
      headers: ["Date", "Category", "Description", "Amount"],
      rawRows,
      rows: rawRows.map((row) => [...row.slice(0, 3), money(row[3])]),
    };
  }

  const rawRows = safeRecordArray(inventory).map((item) => {
    const quantity = Number(item.quantity) || 0;
    const unitCost = Number(item.costPrice) || 0;
    return [item.name || "", String(quantity), numeric(unitCost), numeric(quantity * unitCost)];
  });
  return {
    title: "Inventory Report",
    headers: ["Item", "Quantity", "Unit Cost", "Stock Value"],
    rawRows,
    rows: rawRows.map((row) => [row[0], row[1], money(row[2]), money(row[3])]),
  };
}
