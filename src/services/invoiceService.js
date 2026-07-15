const STORAGE_KEY = "invoices";

export function getInvoices() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function saveInvoice(invoice) {
  const invoices = getInvoices();

  invoices.push(invoice);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(invoices)
  );
}

export function updateInvoice(updatedInvoice) {
  const invoices = getInvoices().map((invoice) =>
    invoice.id === updatedInvoice.id
      ? updatedInvoice
      : invoice
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(invoices)
  );
}

export function deleteInvoice(id) {
  const invoices = getInvoices().filter(
    (invoice) => invoice.id !== id
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(invoices)
  );
}

export function generateInvoiceNumber() {
  const invoices = getInvoices();

  const nextNumber = invoices.length + 1;

  return `INV-${String(nextNumber).padStart(5, "0")}`;
}