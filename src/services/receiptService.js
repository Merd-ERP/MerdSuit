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

export function updateReceiptForPayment(invoiceId, payment) {
  if (payment?.id === undefined || payment?.id === null) return false;

  let updated = false;
  const receipts = getReceipts().map((receipt) => {
    const isMatchingReceipt = receipt.paymentId !== undefined
      && receipt.paymentId !== null
      && String(receipt.paymentId) === String(payment.id)
      && String(receipt.invoiceId) === String(invoiceId);

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
    const isMatchingReceipt = receipt.paymentId !== undefined
      && receipt.paymentId !== null
      && String(receipt.paymentId) === String(paymentId)
      && String(receipt.invoiceId) === String(invoiceId);

    return !isMatchingReceipt;
  });

  if (remainingReceipts.length === receipts.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(remainingReceipts));
  return true;
}
