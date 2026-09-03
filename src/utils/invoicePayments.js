const toAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

const hasBlankValue = (value) =>
  value === null || value === undefined || (typeof value === "string" && value.trim() === "");

export const roundCurrencyAmount = (value) =>
  Math.round((toAmount(value) + Number.EPSILON) * 100) / 100;

export function getInvoicePayments(invoice = {}) {
  const hasModernPaymentHistory = Number(invoice.paymentHistoryVersion) >= 1;

  if (Array.isArray(invoice.payments) && (invoice.payments.length > 0 || hasModernPaymentHistory)) {
    return invoice.payments;
  }

  const legacyAmountPaid = Math.max(0, roundCurrencyAmount(invoice.amountPaid));
  if (legacyAmountPaid === 0) return [];

  return [{
    id: `legacy-payment-${invoice.id || invoice.invoiceNumber || "invoice"}`,
    amount: legacyAmountPaid,
    date: invoice.date || "",
    method: "",
    reference: "",
    isLegacyPayment: true,
  }];
}

export function getInvoiceAmountPaid(invoice = {}) {
  const recordedAmount = Math.max(0, roundCurrencyAmount(
    getInvoicePayments(invoice).reduce(
      (total, payment) => total + Math.max(0, toAmount(payment?.amount)),
      0,
    ),
  ));
  const invoiceTotal = Math.max(0, roundCurrencyAmount(invoice.total));
  return Math.min(recordedAmount, invoiceTotal);
}

export function getInvoiceBalance(invoice = {}) {
  const total = Math.max(0, roundCurrencyAmount(invoice.total));
  return Math.max(0, roundCurrencyAmount(total - getInvoiceAmountPaid(invoice)));
}

export function getInvoicePaymentStatus(invoice = {}) {
  const total = Math.max(0, roundCurrencyAmount(invoice.total));
  const amountPaid = getInvoiceAmountPaid(invoice);
  const balance = getInvoiceBalance(invoice);

  if (total > 0 && balance === 0) return "Paid";
  if (amountPaid > 0) return "Partially Paid";
  return "Unpaid";
}

export function recalculateInvoicePaymentState(invoice = {}) {
  return {
    ...invoice,
    amountPaid: getInvoiceAmountPaid(invoice),
    balance: getInvoiceBalance(invoice),
    status: getInvoicePaymentStatus(invoice),
  };
}

export function getMaximumEditablePaymentAmount(invoice = {}, paymentId) {
  const otherPaymentsTotal = getInvoicePayments(invoice).reduce(
    (total, payment) => Object.is(payment?.id, paymentId)
      ? total
      : total + Math.max(0, toAmount(payment?.amount)),
    0,
  );

  return Math.max(
    0,
    roundCurrencyAmount(Math.max(0, toAmount(invoice.total)) - otherPaymentsTotal),
  );
}

export function normalizePaymentAmount(value) {
  if (hasBlankValue(value)) {
    return { valid: false, message: "Enter a valid payment amount." };
  }

  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { valid: false, message: "Enter a valid payment amount." };
  }

  const roundedAmount = roundCurrencyAmount(amount);
  if (roundedAmount <= 0 || Math.abs(amount - roundedAmount) > 1e-9) {
    return { valid: false, message: "Payment amounts cannot contain fractions smaller than one cent." };
  }

  return { valid: true, amount: roundedAmount };
}

export function normalizePaymentDate(value) {
  const date = String(value || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { valid: false, message: "Select a valid payment date." };
  }
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    return { valid: false, message: "Select a valid payment date." };
  }
  return { valid: true, date };
}

export function validateInvoicePayment({ invoice, value, date, editingPaymentId } = {}) {
  if (!invoice || invoice.id === null || invoice.id === undefined || invoice.id === "") {
    return { valid: false, message: "Invoice not found." };
  }

  const total = Number(invoice.total);
  if (!Number.isFinite(total) || total <= 0) {
    return { valid: false, message: "This invoice has an invalid total and cannot accept payments." };
  }

  const normalized = normalizePaymentAmount(value);
  if (!normalized.valid) return normalized;
  if (date !== undefined) {
    const normalizedDate = normalizePaymentDate(date);
    if (!normalizedDate.valid) return normalizedDate;
  }

  const maximumAmount = editingPaymentId === undefined
    ? getInvoiceBalance(invoice)
    : getMaximumEditablePaymentAmount(invoice, editingPaymentId);

  if (maximumAmount <= 0) {
    return { valid: false, message: "This invoice is fully paid. No additional payment can be recorded." };
  }
  if (normalized.amount > maximumAmount) {
    return {
      valid: false,
      message: `The maximum payment allowed is ${maximumAmount.toFixed(2)}.`,
      maximumAmount,
    };
  }

  return { valid: true, amount: normalized.amount, maximumAmount };
}

export function applyPaidInventoryTransition(invoice = {}, deductInventory, timestamp = new Date().toISOString()) {
  const normalizedInvoice = recalculateInvoicePaymentState(invoice);
  if (normalizedInvoice.status !== "Paid" || normalizedInvoice.inventoryDeducted) {
    return { invoice: normalizedInvoice, deducted: false };
  }

  if (typeof deductInventory === "function") {
    deductInventory(
      Array.isArray(normalizedInvoice.materials) ? normalizedInvoice.materials : [],
      normalizedInvoice,
      timestamp,
    );
  }
  return {
    invoice: {
      ...normalizedInvoice,
      inventoryDeducted: true,
      inventoryDeductedAt: timestamp,
    },
    deducted: true,
  };
}

export function getInvoicePaymentRows(invoice = {}) {
  let remainingTotal = Math.max(0, roundCurrencyAmount(invoice.total));
  return getInvoicePayments(invoice).filter(Boolean).map((payment) => {
    const normalizedAmount = Math.min(
      remainingTotal,
      Math.max(0, roundCurrencyAmount(payment.amount)),
    );
    remainingTotal = Math.max(0, roundCurrencyAmount(remainingTotal - normalizedAmount));
    return {
      ...payment,
      amount: normalizedAmount,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber || "",
      client: invoice.clientNameSnapshot || invoice.client || "",
      invoiceStatus: getInvoicePaymentStatus(invoice),
    };
  });
}
