import { hasRelationshipId, relationshipIdsEqual } from "../utils/financialIdentity";

const STORAGE_KEY = "receipts";
const COUNTER_KEY = "receiptNumberCounter";

export function getReceipts() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function saveReceipt(receipt) {
  const receipts = getReceipts();

  receipts.push(receipt);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(receipts)
  );
}

export function updateReceipt(updatedReceipt) {
  const receipts = getReceipts().map((receipt) =>
    relationshipIdsEqual(receipt.id, updatedReceipt.id)
      ? updatedReceipt
      : receipt
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(receipts)
  );
}

export function deleteReceipt(id) {
  if (!hasRelationshipId(id)) return false;
  throw new Error("Issued receipts cannot be deleted independently. Delete the linked payment instead.");
}

export function generateReceiptNumber(receipts = getReceipts()) {
  const highestStoredSequence = receipts.reduce((highest, receipt) => {
    const match = /^RCT-(?:\d{4}-)?(\d+)$/i.exec(String(receipt.receiptNumber || "").trim());
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  const storedCounter = Number(localStorage.getItem(COUNTER_KEY));
  const nextNumber = Math.max(
    highestStoredSequence,
    Number.isFinite(storedCounter) && storedCounter >= 0 ? storedCounter : 0
  ) + 1;

  localStorage.setItem(COUNTER_KEY, String(nextNumber));
  return `RCT-${new Date().getFullYear()}-${String(nextNumber).padStart(5, "0")}`;
}

export function updateReceiptForPayment(invoiceId, payment) {
  if (payment?.id === undefined || payment?.id === null) return false;

  let updated = false;
  const receipts = getReceipts().map((receipt) => {
    const isMatchingReceipt = hasRelationshipId(receipt.paymentId)
      && relationshipIdsEqual(receipt.paymentId, payment.id)
      && relationshipIdsEqual(receipt.invoiceId, invoiceId);

    if (!isMatchingReceipt) return receipt;

    updated = true;
    return {
      ...receipt,
      amount: payment.amount,
      method: payment.method,
      reference: payment.reference,
      date: payment.date,
    };
  });

  if (updated) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(receipts));
  }

  return updated;
}

export function deleteReceiptForPayment(invoiceId, paymentId) {
  if (paymentId === undefined || paymentId === null) return false;

  const receipts = getReceipts();
  const remainingReceipts = receipts.filter((receipt) => {
    const isMatchingReceipt = hasRelationshipId(receipt.paymentId)
      && relationshipIdsEqual(receipt.paymentId, paymentId)
      && relationshipIdsEqual(receipt.invoiceId, invoiceId);

    return !isMatchingReceipt;
  });

  if (remainingReceipts.length === receipts.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(remainingReceipts));
  return true;
}
