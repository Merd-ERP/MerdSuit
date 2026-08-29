import {
  getInvoices,
  saveInvoice,
  generateInvoiceNumber,
} from "./invoiceService";
import { getQuotations } from "./quotationService.js";
import { hasRelationshipId, relationshipIdsEqual } from "../utils/relationships";
import { validateAndNormalizeQuotationValues } from "../utils/quotationItems";
import { isConvertedQuotation, isDraftQuotation } from "../utils/quotationStatus";

function createInvoiceId() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `invoice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function convertQuotationToInvoice(quotation) {
  const clientSnapshot = String(quotation.clientNameSnapshot || quotation.client || "").trim();
  const quotationNumber = String(quotation.quotationNumber || "").trim();
  if (isDraftQuotation(quotation) || !clientSnapshot) {
    throw new Error("A draft quotation must be linked to a client and finalized before conversion.");
  }
  if (!quotationNumber) {
    throw new Error("A saved quotation number is required before conversion.");
  }

  if (!hasRelationshipId(quotation.id)) {
    throw new Error("This quotation has no stable source ID and cannot be converted safely.");
  }

  const invoices = getInvoices();
  const existingInvoice = invoices.find(
    (invoice) => hasRelationshipId(invoice.sourceQuotationId)
      && relationshipIdsEqual(invoice.sourceQuotationId, quotation.id)
  );

  if (existingInvoice) {
    return { invoice: existingInvoice, created: false };
  }

  const legacyMatches = quotationNumber
    ? invoices.filter((invoice) => !hasRelationshipId(invoice.sourceQuotationId)
      && invoice.quotationNumber === quotationNumber)
    : [];
  if (legacyMatches.length > 0) {
    const sourceMatches = getQuotations().filter(
      (item) => item.quotationNumber === quotationNumber
    );
    const sourceIsUnambiguous = sourceMatches.length === 1
      && relationshipIdsEqual(sourceMatches[0].id, quotation.id);
    if (!sourceIsUnambiguous) {
      throw new Error("The legacy quotation-number reference is ambiguous; conversion was stopped safely.");
    }
  }
  if (legacyMatches.length > 1) {
    throw new Error("Multiple legacy invoices match this quotation number; conversion was stopped safely.");
  }
  if (legacyMatches.length === 1) {
    return { invoice: legacyMatches[0], created: false };
  }

  if (isConvertedQuotation(quotation)) {
    throw new Error("This quotation is marked as converted, but its invoice could not be found.");
  }

  const validation = validateAndNormalizeQuotationValues({
    materials: quotation.materials,
    labour: quotation.labour,
    transport: quotation.transport,
    discount: quotation.discount,
    expectedTotal: quotation.total,
  });
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  const invoice = {
    id: createInvoiceId(),
    invoiceNumber: generateInvoiceNumber(),

    clientId: quotation.clientId ?? "",
    client: clientSnapshot,
    clientNameSnapshot: clientSnapshot,
    projectId: quotation.projectId ?? "",
    project: quotation.projectNameSnapshot || quotation.project || "",
    projectNameSnapshot: quotation.projectNameSnapshot || quotation.project || "",
    date: new Date().toISOString().split("T")[0],

    materials: validation.materials,
    labour: validation.labour,
    transport: validation.transport,
    discount: validation.discount,
    total: validation.total,

    // Payment Information
    payments: [],
    paymentHistoryVersion: 1,
    amountPaid: 0,
    balance: validation.total,
    status: "Unpaid",

    // Reference
    sourceQuotationId: quotation.id,
    quotationNumber,
  };

  saveInvoice(invoice);

  return { invoice, created: true };
}
