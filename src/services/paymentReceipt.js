import {
  saveReceipt,
  generateReceiptNumber,
} from "./receiptService";

export function createPaymentReceipt(invoice, payment) {
  const receipt = {
    id: Date.now(),
    receiptNumber: generateReceiptNumber(),

    invoiceId: invoice.id,
    invoiceNumber: invoice.invoiceNumber,

    client: invoice.client,
    project: invoice.project,

    date: payment.date,
    method: payment.method,
    reference: payment.reference,

    amount: payment.amount,

    company:
      JSON.parse(localStorage.getItem("company")) || {},
  };

  saveReceipt(receipt);

  return receipt;
}