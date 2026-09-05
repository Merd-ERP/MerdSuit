import { companySettingsEqual, validateCompanySettings } from "./companySettings.js";

export const BACKUP_VERSION = 1;
export const COLLECTION_KEYS = [
  "clients",
  "projects",
  "quotations",
  "invoices",
  "receipts",
  "inventory",
  "inventoryMovements",
  "suppliers",
  "purchaseOrders",
  "expenses",
];
export const COUNTER_KEYS = [
  "quotationNumberCounter",
  "invoiceNumberCounter",
  "receiptNumberCounter",
];
export const RESTORE_KEYS = [...COLLECTION_KEYS, ...COUNTER_KEYS, "company"];

const isRecord = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const typedId = (value) => value === null || value === undefined ? "" : `${typeof value}:${String(value)}`;

function parseStoredJson(storage, key, fallback) {
  const raw = storage.getItem(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`Stored ${key} data is malformed and could not be exported.`);
  }
}

function parseCounter(value, key, { allowMissing = false } = {}) {
  if ((value === undefined || value === null || value === "") && allowMissing) return 0;
  if (typeof value === "string" && !value.trim()) throw new Error(`The ${key} value is invalid.`);
  const counter = typeof value === "number" ? value : Number(value);
  if (!Number.isSafeInteger(counter) || counter < 0) {
    throw new Error(`The ${key} value is invalid.`);
  }
  return counter;
}

function sequenceFromNumber(value) {
  const match = /^[A-Z][A-Z0-9-]{1,9}-(?:\d{4}-)?(\d+)$/i.exec(String(value || "").trim());
  return match ? Number(match[1]) : 0;
}

function highestSequence(records, field) {
  return records.reduce((highest, record) => Math.max(highest, sequenceFromNumber(record?.[field])), 0);
}

function rejectDuplicateNumbers(records, field, label) {
  const seen = new Set();
  for (const record of records) {
    const number = String(record?.[field] || "").trim().toUpperCase();
    if (!number || sequenceFromNumber(number) === 0) continue;
    if (seen.has(number)) throw new Error(`The backup contains duplicate ${label} number ${number}.`);
    seen.add(number);
  }
}

function validateFiniteField(record, field, label, { allowNegative = false } = {}) {
  const value = record[field];
  if (value === undefined || value === "") return;
  if (value === null) throw new Error(`${label} contains an invalid ${field} value.`);
  const number = Number(value);
  if (!Number.isFinite(number) || (!allowNegative && number < 0)) {
    throw new Error(`${label} contains an invalid ${field} value.`);
  }
}

function validateItems(record, label) {
  const items = record.materials ?? record.items;
  if (items === undefined) return;
  if (!Array.isArray(items)) throw new Error(`${label} items must be an array.`);
  items.forEach((item) => {
    if (!isRecord(item)) throw new Error(`${label} contains an invalid item.`);
    validateFiniteField(item, "quantity", label);
    validateFiniteField(item, "price", label);
    validateFiniteField(item, "unitPrice", label);
    validateFiniteField(item, "total", label);
  });
}

function validateCollectionRecords(data) {
  COLLECTION_KEYS.forEach((key) => {
    data[key].forEach((record) => {
      if (!isRecord(record)) throw new Error(`The ${key} collection contains an invalid record.`);
    });
  });

  data.quotations.forEach((record) => {
    validateItems(record, "A quotation");
    ["labour", "transport", "discount", "total"].forEach((field) => validateFiniteField(record, field, "A quotation"));
  });

  data.invoices.forEach((record) => {
    validateItems(record, "An invoice");
    ["labour", "transport", "discount", "total", "amountPaid", "balance"].forEach((field) => validateFiniteField(record, field, "An invoice"));
    if (record.payments !== undefined && !Array.isArray(record.payments)) throw new Error("An invoice payment history must be an array.");
    (record.payments || []).forEach((payment) => {
      if (!isRecord(payment)) throw new Error("An invoice contains an invalid payment record.");
      validateFiniteField(payment, "amount", "A payment");
    });
    const invoiceTotal = Number(record.total ?? 0);
    const paidTotal = (record.payments || []).reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0);
    if (Number.isFinite(invoiceTotal) && paidTotal > invoiceTotal + 1e-9) {
      throw new Error("An invoice payment history exceeds its invoice total.");
    }
  });

  data.receipts.forEach((record) => validateFiniteField(record, "amount", "A receipt"));
  data.inventory.forEach((record) => {
    ["quantity", "price", "unitPrice", "reorderLevel", "minimumStock"].forEach((field) => validateFiniteField(record, field, "An inventory item"));
  });
  data.inventoryMovements.forEach((record) => {
    validateFiniteField(record, "quantity", "An inventory movement");
    validateFiniteField(record, "resultingQuantity", "An inventory movement");
  });
  data.purchaseOrders.forEach((record) => {
    validateItems(record, "A purchase order");
    ["transport", "discount", "subtotal", "total", "grandTotal"].forEach((field) => validateFiniteField(record, field, "A purchase order"));
  });
  data.expenses.forEach((record) => validateFiniteField(record, "amount", "An expense"));

  rejectDuplicateNumbers(data.quotations, "quotationNumber", "quotation");
  rejectDuplicateNumbers(data.invoices, "invoiceNumber", "invoice");
  rejectDuplicateNumbers(data.receipts, "receiptNumber", "receipt");

  const invoiceById = new Map(data.invoices.map((invoice) => [typedId(invoice.id), invoice]).filter(([key]) => key));
  const invoicesByNumber = new Map();
  data.invoices.forEach((invoice) => {
    const number = String(invoice.invoiceNumber || "").trim();
    if (!number) return;
    const matches = invoicesByNumber.get(number) || [];
    matches.push(invoice);
    invoicesByNumber.set(number, matches);
  });

  data.receipts.forEach((receipt) => {
    if (receipt.paymentId === undefined || receipt.paymentId === null) return;
    const hasInvoiceId = receipt.invoiceId !== undefined && receipt.invoiceId !== null && receipt.invoiceId !== "";
    const invoice = hasInvoiceId ? invoiceById.get(typedId(receipt.invoiceId)) : null;
    const legacyMatches = invoicesByNumber.get(String(receipt.invoiceNumber || "").trim()) || [];
    const resolvedInvoice = hasInvoiceId ? invoice : (legacyMatches.length === 1 ? legacyMatches[0] : null);
    if (!resolvedInvoice) throw new Error("A receipt references a payment but its invoice cannot be resolved safely.");
    const paymentMatches = (resolvedInvoice.payments || []).filter((payment) => typedId(payment?.id) === typedId(receipt.paymentId));
    if (paymentMatches.length !== 1) throw new Error("A receipt payment reference is missing or ambiguous.");
    if (Number(receipt.amount) !== Number(paymentMatches[0].amount)) {
      throw new Error("A receipt amount does not match its linked payment.");
    }
    for (const field of ["method", "reference", "date"]) {
      if (receipt[field] !== undefined && String(receipt[field] || "") !== String(paymentMatches[0][field] || "")) {
        throw new Error(`A receipt ${field} does not match its linked payment.`);
      }
    }
  });
}

function reconcileCounters(data, counters) {
  return {
    quotationNumberCounter: Math.max(counters.quotationNumberCounter, highestSequence(data.quotations, "quotationNumber")),
    invoiceNumberCounter: Math.max(
      counters.invoiceNumberCounter,
      highestSequence(data.invoices, "invoiceNumber"),
      highestSequence(data.receipts, "invoiceNumber"),
    ),
    receiptNumberCounter: Math.max(counters.receiptNumberCounter, highestSequence(data.receipts, "receiptNumber")),
  };
}

export function createBackupFromStorage(storage = localStorage) {
  const data = {};
  COLLECTION_KEYS.forEach((key) => {
    const value = parseStoredJson(storage, key, []);
    if (!Array.isArray(value)) throw new Error(`Stored ${key} data must be an array before it can be exported.`);
    data[key] = value;
  });

  const rawCompany = storage.getItem("company");
  if (rawCompany === null) data.company = null;
  else {
    data.company = parseStoredJson(storage, "company", null);
    if (!isRecord(data.company)) throw new Error("Stored company data is malformed and could not be exported.");
    const companyValidation = validateCompanySettings(data.company);
    if (!companyValidation.valid) throw new Error("Stored company settings are invalid and could not be exported safely.");
    data.company = companyValidation.company;
  }

  const suppliedCounters = Object.fromEntries(COUNTER_KEYS.map((key) => [
    key,
    parseCounter(storage.getItem(key), key, { allowMissing: true }),
  ]));
  Object.assign(data, reconcileCounters(data, suppliedCounters));

  return { application: "MerdSuite", version: BACKUP_VERSION, exportedAt: new Date().toISOString(), data };
}

export function preflightBackup(backup) {
  try {
    if (!isRecord(backup)) throw new Error("This file is not a valid MerdSuite backup.");
    if (backup.application !== "MerdSuite" || backup.version !== BACKUP_VERSION) {
      throw new Error("This backup was not created by a compatible version of MerdSuite.");
    }
    if (!isRecord(backup.data)) throw new Error("The backup data is missing or invalid.");

    const data = {};
    COLLECTION_KEYS.forEach((key) => {
      const value = key === "inventoryMovements" && backup.data[key] === undefined ? [] : backup.data[key];
      if (!Array.isArray(value)) throw new Error(`The ${key} data in this backup is invalid.`);
      data[key] = value;
    });
    validateCollectionRecords(data);

    const counters = Object.fromEntries(COUNTER_KEYS.map((key) => [
      key,
      parseCounter(backup.data[key], key, { allowMissing: true }),
    ]));
    Object.assign(data, reconcileCounters(data, counters));

    let company = null;
    if (backup.data.company !== undefined && backup.data.company !== null) {
      const validation = validateCompanySettings(backup.data.company);
      if (!validation.valid) throw new Error("The company settings in this backup are invalid.");
      company = validation.company;
    }

    return { valid: true, data, company, error: null };
  } catch (error) {
    return { valid: false, data: null, company: null, error: error.message };
  }
}

export function buildRestorePayload(preflight, { includeCompany = false, storage } = {}) {
  if (!preflight?.valid) throw new Error("Backup preflight must pass before preparing a restore.");
  const payload = {};
  COLLECTION_KEYS.forEach((key) => { payload[key] = JSON.stringify(preflight.data[key]); });
  COUNTER_KEYS.forEach((key) => {
    const currentCounter = (() => {
      try {
        return parseCounter(storage?.getItem(key), key, { allowMissing: true });
      } catch {
        return 0;
      }
    })();
    payload[key] = String(Math.max(preflight.data[key], currentCounter));
  });
  if (includeCompany && preflight.company) payload.company = JSON.stringify(preflight.company);
  return payload;
}

export function applyRestorePayload(storage, payload) {
  const affectedKeys = Object.keys(payload);
  const currentValues = Object.fromEntries(affectedKeys.map((key) => [key, storage.getItem(key)]));
  try {
    affectedKeys.forEach((key) => storage.setItem(key, payload[key]));
    return { restored: true, rollbackSucceeded: true };
  } catch (writeError) {
    let rollbackSucceeded = true;
    try {
      affectedKeys.forEach((key) => {
        const previousValue = currentValues[key];
        if (previousValue === null) storage.removeItem(key);
        else storage.setItem(key, previousValue);
      });
    } catch {
      rollbackSucceeded = false;
    }
    const error = new Error("The restore could not be written to browser storage.");
    error.cause = writeError;
    error.rollbackSucceeded = rollbackSucceeded;
    throw error;
  }
}

export function backupCompanyDiffers(preflight, currentCompany) {
  return Boolean(preflight?.company) && !companySettingsEqual(preflight.company, currentCompany);
}
