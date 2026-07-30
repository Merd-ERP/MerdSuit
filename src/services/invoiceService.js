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

  const year = new Date().getFullYear();

  if (invoices.length === 0) {
    return `INV-${year}-00001`;
  }

  const lastInvoice = invoices[invoices.length - 1];

  const lastPart = lastInvoice.invoiceNumber.split("-").pop();

  const nextNumber = Number(lastPart) + 1;

  return `INV-${year}-${String(nextNumber).padStart(5, "0")}`;
}