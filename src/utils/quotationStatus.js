export const normalizeQuotationStatus = (status) =>
  String(status || "Pending").trim().toLowerCase();

export const hasQuotationStatus = (quotation, status) =>
  normalizeQuotationStatus(quotation?.status) === normalizeQuotationStatus(status);

export const isDraftQuotation = (quotation) => hasQuotationStatus(quotation, "Draft");
export const isConvertedQuotation = (quotation) => hasQuotationStatus(quotation, "Converted");
