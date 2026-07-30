import {
  saveInvoice,
  generateInvoiceNumber,
} from "./invoiceService";

export function convertQuotationToInvoice(quotation) {
  const invoice = {
    id: Date.now(),
    invoiceNumber: generateInvoiceNumber(),

    client: quotation.client,
    project: quotation.project,
    date: new Date().toISOString().split("T")[0],

    materials: quotation.materials,
    labour: quotation.labour,
    transport: quotation.transport,
    discount: quotation.discount,

    total: quotation.total,

    status: "Unpaid",

    quotationNumber: quotation.quotationNumber,
  };

  saveInvoice(invoice);

  return invoice;
}