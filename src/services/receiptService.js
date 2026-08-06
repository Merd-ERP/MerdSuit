const STORAGE_KEY = "receipts";

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
    receipt.id === updatedReceipt.id
      ? updatedReceipt
      : receipt
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(receipts)
  );
}

export function deleteReceipt(id) {
  const receipts = getReceipts().filter(
    (receipt) => receipt.id !== id
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(receipts)
  );
}

export function generateReceiptNumber() {
  const receipts = getReceipts();

  const year = new Date().getFullYear();

  if (receipts.length === 0) {
    return `RCT-${year}-00001`;
  }

  const lastReceipt =
    receipts[receipts.length - 1];

  const lastPart =
    lastReceipt.receiptNumber.split("-").pop();

  const nextNumber =
    Number(lastPart) + 1;

  return `RCT-${year}-${String(nextNumber).padStart(
    5,
    "0"
  )}`;
}