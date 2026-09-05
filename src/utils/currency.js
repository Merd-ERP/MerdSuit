import { DEFAULT_COMPANY_SETTINGS, SUPPORTED_CURRENCIES, readCompanySettings } from "./companySettings";

export const DEFAULT_CURRENCY = "GH₵";

export function getCompanyCurrency() {
  const currency = readCompanySettings().currency;
  return SUPPORTED_CURRENCIES.includes(currency) ? currency : DEFAULT_COMPANY_SETTINGS.currency;
}

export function formatCurrency(value, { currency = getCompanyCurrency(), minimumFractionDigits = 0, maximumFractionDigits = 2 } = {}) {
  const amount = Number(value) || 0;
  const formatted = amount.toLocaleString("en-GB", { minimumFractionDigits, maximumFractionDigits });
  return `${currency} ${formatted}`;
}
