import {
  getInvoiceBalance,
  getInvoicePaymentRows,
} from "./invoicePayments.js";

export const safeRecordArray = (records) =>
  Array.isArray(records)
    ? records.filter((record) => record && typeof record === "object" && !Array.isArray(record))
    : [];

export function getNormalizedPaymentRows(invoices) {
  return safeRecordArray(invoices).flatMap((invoice) => getInvoicePaymentRows(invoice));
}

export function getReceivedRevenue(invoices, includePayment = () => true) {
  return getNormalizedPaymentRows(invoices).reduce((total, payment) => {
    if (!includePayment(payment)) return total;
    const amount = Number(payment.amount);
    return total + (Number.isFinite(amount) && amount > 0 ? amount : 0);
  }, 0);
}

export function getOutstandingBalance(invoices, includeInvoice = () => true) {
  return safeRecordArray(invoices).reduce(
    (total, invoice) => includeInvoice(invoice) ? total + getInvoiceBalance(invoice) : total,
    0,
  );
}
