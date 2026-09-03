import {
  getInvoicePayments,
  normalizePaymentAmount,
  recalculateInvoicePaymentState,
} from "../utils/invoicePayments";
import { getReceipts } from "./receiptService";
import { hasRelationshipId, relationshipIdsEqual } from "../utils/financialIdentity";

const STORAGE_KEY = "invoices";
const COUNTER_KEY = "invoiceNumberCounter";

export function getInvoices() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function assertModernPaymentIntegrity(invoice = {}) {
  if (!Array.isArray(invoice.payments) || Number(invoice.paymentHistoryVersion) < 1) return;

  let totalPaid = 0;
  for (const payment of invoice.payments) {
    const normalized = normalizePaymentAmount(payment?.amount);
    if (!normalized.valid) throw new Error(normalized.message);
    totalPaid += normalized.amount;
  }

  const invoiceTotal = Number(invoice.total);
  if (!Number.isFinite(invoiceTotal) || invoiceTotal < 0 || totalPaid > invoiceTotal + 1e-9) {
    throw new Error("Invoice payments cannot exceed the invoice total.");
  }
}

export function saveInvoice(invoice) {
  const invoices = getInvoices();
  assertModernPaymentIntegrity(invoice);

  invoices.push(recalculateInvoicePaymentState(invoice));

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(invoices)
  );
}

export function updateInvoice(updatedInvoice) {
  assertModernPaymentIntegrity(updatedInvoice);
  const normalizedInvoice = recalculateInvoicePaymentState(updatedInvoice);
  const invoices = getInvoices().map((invoice) =>
    relationshipIdsEqual(invoice.id, updatedInvoice.id)
      ? normalizedInvoice
      : invoice
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(invoices)
  );
}

export function deleteInvoice(id) {
  if (!hasRelationshipId(id)) {
    throw new Error("This invoice has no stable ID and cannot be deleted safely.");
  }
  const currentInvoices = getInvoices();
  const invoiceToDelete = currentInvoices.find((invoice) => relationshipIdsEqual(invoice.id, id));
  if (!invoiceToDelete) return currentInvoices;

  const hasPayments = getInvoicePayments(invoiceToDelete).length > 0;
  const hasLinkedReceipts = getReceipts().some(
    (receipt) => (hasRelationshipId(receipt.invoiceId)
      && relationshipIdsEqual(receipt.invoiceId, id))
      || (invoiceToDelete.invoiceNumber
        && receipt.invoiceNumber === invoiceToDelete.invoiceNumber)
  );
  if (hasPayments || hasLinkedReceipts) {
    throw new Error("Invoices with payment or receipt history cannot be deleted.");
  }

  const invoices = getInvoices().filter(
    (invoice) => !relationshipIdsEqual(invoice.id, id)
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(invoices)
  );

  return invoices;
}

export function generateInvoiceNumber(invoices = getInvoices()) {
  const historicalNumbers = [
    ...invoices.map((invoice) => invoice.invoiceNumber),
    ...getReceipts().map((receipt) => receipt.invoiceNumber),
  ];
  const highestStoredSequence = historicalNumbers.reduce((highest, invoiceNumber) => {
    const match = /^INV-(?:\d{4}-)?(\d+)$/i.exec(String(invoiceNumber || "").trim());
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  const storedCounter = Number(localStorage.getItem(COUNTER_KEY));
  const nextNumber = Math.max(
    highestStoredSequence,
    Number.isFinite(storedCounter) && storedCounter >= 0 ? storedCounter : 0
  ) + 1;

  localStorage.setItem(COUNTER_KEY, String(nextNumber));
  return `INV-${new Date().getFullYear()}-${String(nextNumber).padStart(5, "0")}`;
}
