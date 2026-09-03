import {
  getReceipts,
  saveReceipt,
  generateReceiptNumber,
} from "./receiptService";
import {
  createFinancialId,
  hasRelationshipId,
  relationshipIdsEqual,
} from "../utils/financialIdentity";

export function createPaymentReceipt(invoice, payment) {
  if (!hasRelationshipId(invoice?.id) || !hasRelationshipId(payment?.id)) {
    throw new Error("A stable invoice and payment ID are required to issue a receipt.");
  }

  const existingReceipt = getReceipts().find(
    (receipt) => relationshipIdsEqual(receipt.invoiceId, invoice.id)
      && relationshipIdsEqual(receipt.paymentId, payment.id)
  );
  if (existingReceipt) return existingReceipt;

  const company = JSON.parse(localStorage.getItem("company")) || {};
  const receipt = {
    id: createFinancialId("receipt"),
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

    currency: company.currency || "",
    company,
  };

  saveReceipt(receipt);

  return receipt;
}
