import {
  getInvoices,
  saveInvoice,
  generateInvoiceNumber,
} from "./invoiceService";

export function convertQuotationToInvoice(quotation) {
  if (quotation.status === "Draft" || !quotation.client) {
    throw new Error("A draft quotation must be linked to a client and finalized before conversion.");
  }

  const existingInvoice = getInvoices().find((invoice) => {
    const matchesId = quotation.id !== undefined
      && quotation.id !== null
      && invoice.sourceQuotationId !== undefined
      && invoice.sourceQuotationId !== null
      && String(invoice.sourceQuotationId) === String(quotation.id);
    const matchesNumber = quotation.quotationNumber
      && invoice.quotationNumber === quotation.quotationNumber;

    return matchesId || matchesNumber;
  });

  if (existingInvoice) {
    return { invoice: existingInvoice, created: false };
  }

  if (quotation.status === "Converted") {
    throw new Error("This quotation is marked as converted, but its invoice could not be found.");
  }

  const invoice = {
    id: Date.now(),
    invoiceNumber: generateInvoiceNumber(),

    clientId: quotation.clientId ?? "",
    client: quotation.clientNameSnapshot || quotation.client,
    clientNameSnapshot: quotation.clientNameSnapshot || quotation.client,
    projectId: quotation.projectId ?? "",
    project: quotation.projectNameSnapshot || quotation.project || "",
    projectNameSnapshot: quotation.projectNameSnapshot || quotation.project || "",
    date: new Date().toISOString().split("T")[0],

    materials: quotation.materials,
    labour: quotation.labour,
    transport: quotation.transport,
    discount: quotation.discount,
    total: quotation.total,

    // Payment Information
    payments: [],
    paymentHistoryVersion: 1,
    amountPaid: 0,
    balance: quotation.total,
    status: "Unpaid",

    // Reference
    sourceQuotationId: quotation.id,
    quotationNumber: quotation.quotationNumber,
  };

  saveInvoice(invoice);

  return { invoice, created: true };
}
