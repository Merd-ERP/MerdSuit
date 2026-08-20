import {
  saveInvoice,
  generateInvoiceNumber,
} from "./invoiceService";

export function convertQuotationToInvoice(quotation) {
  if (quotation.status === "Draft" || !quotation.client) {
    throw new Error("A draft quotation must be linked to a client and finalized before conversion.");
  }

  const invoice = {
    id: Date.now(),
    invoiceNumber: generateInvoiceNumber(),

    client: quotation.client,
    project: quotation.project || "",
    date: new Date().toISOString().split("T")[0],

    materials: quotation.materials,
    labour: quotation.labour,
    transport: quotation.transport,
    discount: quotation.discount,
    total: quotation.total,

    // Payment Information
    payments: [],
    amountPaid: 0,
    balance: quotation.total,
    status: "Unpaid",

    // Reference
    quotationNumber: quotation.quotationNumber,
  };

  saveInvoice(invoice);

  return invoice;
}
