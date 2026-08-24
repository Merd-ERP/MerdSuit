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
    paymentId: payment.id,

    clientId: invoice.clientId ?? "",
    client: invoice.clientNameSnapshot || invoice.client,
    clientNameSnapshot: invoice.clientNameSnapshot || invoice.client,
    projectId: invoice.projectId ?? "",
    project: invoice.projectNameSnapshot || invoice.project || "",
    projectNameSnapshot: invoice.projectNameSnapshot || invoice.project || "",

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
