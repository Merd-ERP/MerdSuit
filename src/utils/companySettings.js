export const COMPANY_STORAGE_KEY = "company";
export const COMPANY_SETTINGS_EVENT = "company-settings-updated";
export const SUPPORTED_CURRENCIES = ["GH₵", "$", "£", "€"];
export const MAX_LOGO_FILE_SIZE = 512 * 1024;
export const SUPPORTED_LOGO_TYPES = ["image/png", "image/jpeg"];

export const DEFAULT_COMPANY_SETTINGS = Object.freeze({
  name: "",
  tagline: "",
  address: "",
  city: "",
  country: "Ghana",
  phone: "",
  email: "",
  website: "",
  currency: "GH₵",
  taxNumber: "",
  logo: "",
  bankName: "",
  bankAccountName: "",
  bankAccountNumber: "",
  bankBranch: "",
  invoicePrefix: "INV",
  quotationPrefix: "QTN",
  paymentTerms: "30",
});

const TEXT_LIMITS = {
  name: 120,
  tagline: 180,
  address: 240,
  city: 100,
  country: 100,
  phone: 50,
  email: 160,
  website: 200,
  taxNumber: 80,
  bankName: 120,
  bankAccountName: 120,
  bankAccountNumber: 80,
  bankBranch: 120,
};

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const isRecord = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const textValue = (value, fallback = "") => typeof value === "string" ? value : fallback;

export function normalizeDocumentPrefix(value, fallback) {
  const prefix = textValue(value).trim().toUpperCase();
  return /^[A-Z][A-Z0-9-]{1,9}$/.test(prefix) ? prefix : fallback;
}

export function normalizeCompanySettings(value) {
  const source = isRecord(value) ? value : {};
  const legacyName = textValue(source.companyName);
  const legacyTagline = textValue(source.slogan);
  const normalized = { ...source, ...DEFAULT_COMPANY_SETTINGS };

  Object.keys(TEXT_LIMITS).forEach((key) => {
    normalized[key] = textValue(source[key], DEFAULT_COMPANY_SETTINGS[key]);
  });

  normalized.name = textValue(source.name, legacyName);
  normalized.tagline = textValue(source.tagline, legacyTagline);
  normalized.logo = textValue(source.logo);
  normalized.currency = textValue(source.currency, DEFAULT_COMPANY_SETTINGS.currency);
  normalized.invoicePrefix = textValue(source.invoicePrefix, DEFAULT_COMPANY_SETTINGS.invoicePrefix);
  normalized.quotationPrefix = textValue(source.quotationPrefix, DEFAULT_COMPANY_SETTINGS.quotationPrefix);
  normalized.paymentTerms = typeof source.paymentTerms === "number"
    ? String(source.paymentTerms)
    : textValue(source.paymentTerms, DEFAULT_COMPANY_SETTINGS.paymentTerms);

  return normalized;
}

export function parseCompanySettings(rawValue) {
  if (rawValue === null || rawValue === undefined || rawValue === "") {
    return { company: normalizeCompanySettings(null), validJson: true, hasStoredCompany: false };
  }

  try {
    const parsed = JSON.parse(rawValue);
    return {
      company: normalizeCompanySettings(parsed),
      validJson: isRecord(parsed),
      hasStoredCompany: isRecord(parsed),
    };
  } catch {
    return { company: normalizeCompanySettings(null), validJson: false, hasStoredCompany: false };
  }
}

export function readCompanySettings(storage = localStorage) {
  try {
    return parseCompanySettings(storage.getItem(COMPANY_STORAGE_KEY)).company;
  } catch {
    return normalizeCompanySettings(null);
  }
}

export function isSupportedLogoDataUrl(value) {
  if (value === "") return true;
  if (typeof value !== "string" || value.length > Math.ceil(MAX_LOGO_FILE_SIZE * 1.4)) return false;
  return /^data:image\/png;base64,iVBORw0KGgo[A-Za-z0-9+/=\s]*$/.test(value)
    || /^data:image\/jpeg;base64,\/9j\/[A-Za-z0-9+/=\s]*$/.test(value);
}

export function validateCompanySettings(value, { requireIdentity = true } = {}) {
  if (!isRecord(value)) {
    return { valid: false, errors: { form: "Company settings must be a valid object." } };
  }

  const errors = {};
  const sourceName = hasOwn(value, "name") ? value.name : value.companyName;
  const sourceTagline = hasOwn(value, "tagline") ? value.tagline : value.slogan;
  const typedFields = { ...TEXT_LIMITS, tagline: 180, logo: Math.ceil(MAX_LOGO_FILE_SIZE * 1.4) };

  Object.entries(typedFields).forEach(([key, maximum]) => {
    const sourceValue = key === "name" ? sourceName : key === "tagline" ? sourceTagline : value[key];
    if (sourceValue !== undefined && sourceValue !== null && typeof sourceValue !== "string") {
      errors[key] = `${key === "name" ? "Company name" : key} must be text.`;
    } else if (typeof sourceValue === "string" && sourceValue.trim().length > maximum) {
      errors[key] = `${key === "name" ? "Company name" : key} is too long.`;
    }
  });

  const company = normalizeCompanySettings(value);
  const name = company.name.trim();
  const phone = company.phone.trim();
  const email = company.email.trim();
  const paymentTermsText = company.paymentTerms.trim();
  const paymentTerms = Number(company.paymentTerms);

  if (requireIdentity && !name) errors.name = "Company name is required.";
  if (requireIdentity && !phone) errors.phone = "Phone number is required.";
  if (phone && !/^[+()\d][\d\s()+.-]{4,49}$/.test(phone)) errors.phone = "Enter a valid phone number.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  if (!SUPPORTED_CURRENCIES.includes(company.currency)) errors.currency = "Select a supported currency.";
  if (!paymentTermsText || !Number.isInteger(paymentTerms) || paymentTerms < 0 || paymentTerms > 3650) {
    errors.paymentTerms = "Payment terms must be a whole number from 0 to 3650.";
  }
  if (normalizeDocumentPrefix(company.invoicePrefix, "") === "") errors.invoicePrefix = "Use 2–10 letters, numbers, or hyphens.";
  if (normalizeDocumentPrefix(company.quotationPrefix, "") === "") errors.quotationPrefix = "Use 2–10 letters, numbers, or hyphens.";
  if (!isSupportedLogoDataUrl(company.logo)) errors.logo = "Use a PNG or JPEG logo no larger than 512 KB.";

  if (Object.keys(errors).length > 0) return { valid: false, errors };

  const normalized = { ...value };
  Object.keys(TEXT_LIMITS).forEach((key) => {
    normalized[key] = company[key].trim();
  });
  normalized.name = name;
  normalized.tagline = company.tagline.trim();
  normalized.companyName = name;
  normalized.slogan = normalized.tagline;
  normalized.logo = company.logo;
  normalized.currency = company.currency;
  normalized.invoicePrefix = normalizeDocumentPrefix(company.invoicePrefix, DEFAULT_COMPANY_SETTINGS.invoicePrefix);
  normalized.quotationPrefix = normalizeDocumentPrefix(company.quotationPrefix, DEFAULT_COMPANY_SETTINGS.quotationPrefix);
  normalized.paymentTerms = String(paymentTerms);

  return { valid: true, errors: {}, company: normalized };
}

export function getCompanySnapshot(storage = localStorage) {
  const company = readCompanySettings(storage);
  return {
    name: company.name,
    tagline: company.tagline,
    address: company.address,
    city: company.city,
    country: company.country,
    phone: company.phone,
    email: company.email,
    website: company.website,
    currency: SUPPORTED_CURRENCIES.includes(company.currency) ? company.currency : DEFAULT_COMPANY_SETTINGS.currency,
    taxNumber: company.taxNumber,
    logo: isSupportedLogoDataUrl(company.logo) ? company.logo : "",
    bankName: company.bankName,
    bankAccountName: company.bankAccountName,
    bankAccountNumber: company.bankAccountNumber,
    bankBranch: company.bankBranch,
  };
}

export function companySettingsEqual(first, second) {
  const comparable = (value) => {
    const company = normalizeCompanySettings(value);
    return {
      ...getCompanySnapshot({ getItem: () => JSON.stringify(company) }),
      invoicePrefix: normalizeDocumentPrefix(company.invoicePrefix, DEFAULT_COMPANY_SETTINGS.invoicePrefix),
      quotationPrefix: normalizeDocumentPrefix(company.quotationPrefix, DEFAULT_COMPANY_SETTINGS.quotationPrefix),
      paymentTerms: company.paymentTerms,
    };
  };
  return JSON.stringify(comparable(first)) === JSON.stringify(comparable(second));
}
