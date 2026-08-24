const toAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

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
  return Math.max(0, roundCurrencyAmount(
    getInvoicePayments(invoice).reduce(
      (total, payment) => total + Math.max(0, toAmount(payment.amount)),
      0,
    ),
  ));
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
    (total, payment) => payment.id === paymentId
      ? total
      : total + Math.max(0, toAmount(payment.amount)),
    0,
  );

  return Math.max(
    0,
    roundCurrencyAmount(Math.max(0, toAmount(invoice.total)) - otherPaymentsTotal),
  );
}

export function getInvoicePaymentRows(invoice = {}) {
  return getInvoicePayments(invoice).map((payment) => ({
    ...payment,
    invoiceId: invoice.id,
    invoiceNumber: invoice.invoiceNumber || "",
    client: invoice.client || "",
    invoiceStatus: getInvoicePaymentStatus(invoice),
  }));
}
