import { relationshipIdsEqual } from "../utils/relationships";

const STORAGE_KEY = "quotations";
const COUNTER_KEY = "quotationNumberCounter";

export function getQuotations() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function saveQuotation(quotation) {
  const quotations = getQuotations();

  quotations.push(quotation);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(quotations)
  );
}

export function updateQuotation(updatedQuotation) {
  const quotations = getQuotations().map((quotation) =>
    relationshipIdsEqual(quotation.id, updatedQuotation.id)
      ? updatedQuotation
      : quotation
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(quotations)
  );
}

export function deleteQuotation(id) {
  const quotations = getQuotations().filter(
    (quotation) => !relationshipIdsEqual(quotation.id, id)
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(quotations)
  );
}

export function generateQuotationNumber(quotations = getQuotations()) {
  const highestStoredSequence = quotations.reduce((highest, quotation) => {
    const match = /^QTN-(?:\d{4}-)?(\d+)$/i.exec(String(quotation.quotationNumber || "").trim());
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  const storedCounter = Number(localStorage.getItem(COUNTER_KEY));
  const nextNumber = Math.max(
    highestStoredSequence,
    Number.isFinite(storedCounter) && storedCounter >= 0 ? storedCounter : 0
  ) + 1;

  localStorage.setItem(COUNTER_KEY, String(nextNumber));
  return `QTN-${new Date().getFullYear()}-${String(nextNumber).padStart(5, "0")}`;
}
