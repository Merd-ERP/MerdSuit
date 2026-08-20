export function hasMeaningfulQuotationItems(items = []) {
  return items.some((item) => {
    const description = item.description
      || item.name
      || item.item
      || item.service
      || "";
    const quantity = item.quantity ?? item.qty ?? 1;

    return String(description).trim().length > 0
      && Number.isFinite(Number(quantity))
      && Number(quantity) > 0;
  });
}
