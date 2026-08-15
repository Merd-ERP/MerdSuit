export const DEFAULT_CURRENCY = "GH₵";

export function getCompanyCurrency() {
  try {
    const company = JSON.parse(localStorage.getItem("company"));
    return company?.currency || DEFAULT_CURRENCY;
  } catch {
    return DEFAULT_CURRENCY;
  }
}

export function formatCurrency(value, { currency = getCompanyCurrency(), minimumFractionDigits = 0, maximumFractionDigits = 2 } = {}) {
  const amount = Number(value) || 0;
  const formatted = amount.toLocaleString("en-GB", { minimumFractionDigits, maximumFractionDigits });
  return `${currency} ${formatted}`;
}
