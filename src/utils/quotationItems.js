const getItemDescription = (item = {}) =>
  item.description ?? item.name ?? item.item ?? item.service ?? "";

function parseOptionalAmount(value, label) {
  if (value === "" || value === null || value === undefined) return { valid: true, value: 0 };
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0
    ? { valid: true, value: amount }
    : { valid: false, message: `${label} must be a finite amount of zero or more.` };
}

export function validateAndNormalizeQuotationValues({ materials = [], labour = 0, transport = 0, discount = 0, expectedTotal } = {}) {
  if (!Array.isArray(materials)) return { valid: false, message: "Quotation items are invalid." };

  const meaningfulItems = materials.filter(
    (item) => String(getItemDescription(item)).trim().length > 0
  );
  if (meaningfulItems.length === 0) {
    return { valid: false, message: "Add at least one meaningful item or service." };
  }

  const normalizedMaterials = [];
  for (const item of meaningfulItems) {
    const rawQuantity = item.quantity ?? item.qty;
    const rawPrice = item.price ?? item.unitPrice;
    const quantity = Number(rawQuantity);
    const price = Number(rawPrice);
    if (rawQuantity === null || rawQuantity === undefined || String(rawQuantity).trim() === "") {
      return { valid: false, message: "Each item needs a quantity greater than zero." };
    }
    if (rawPrice === null || rawPrice === undefined || String(rawPrice).trim() === "") {
      return { valid: false, message: "Each item needs a valid unit price." };
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      return { valid: false, message: "Each item quantity must be finite and greater than zero." };
    }
    if (!Number.isFinite(price) || price < 0) {
      return { valid: false, message: "Each item unit price must be a finite amount of zero or more." };
    }
    normalizedMaterials.push({
      ...item,
      description: String(getItemDescription(item)).trim(),
      quantity,
      price,
    });
  }

  const normalizedLabour = parseOptionalAmount(labour, "Labour");
  if (!normalizedLabour.valid) return normalizedLabour;
  const normalizedTransport = parseOptionalAmount(transport, "Transport");
  if (!normalizedTransport.valid) return normalizedTransport;
  const normalizedDiscount = parseOptionalAmount(discount, "Discount");
  if (!normalizedDiscount.valid) return normalizedDiscount;

  const materialTotal = normalizedMaterials.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const beforeDiscount = materialTotal + normalizedLabour.value + normalizedTransport.value;
  if (!Number.isFinite(materialTotal) || !Number.isFinite(beforeDiscount)) {
    return { valid: false, message: "Quotation totals must be finite amounts." };
  }
  if (normalizedDiscount.value > beforeDiscount) {
    return { valid: false, message: "Discount cannot exceed the quotation subtotal." };
  }

  const total = beforeDiscount - normalizedDiscount.value;
  if (!Number.isFinite(total) || total < 0) {
    return { valid: false, message: "Grand Total must be a finite amount of zero or more." };
  }
  if (expectedTotal !== undefined) {
    const storedTotal = Number(expectedTotal);
    if (!Number.isFinite(storedTotal) || storedTotal < 0 || Math.abs(storedTotal - total) > 0.01) {
      return { valid: false, message: "The stored Grand Total does not match the quotation values." };
    }
  }

  return { valid: true, materials: normalizedMaterials, materialTotal, labour: normalizedLabour.value, transport: normalizedTransport.value, discount: normalizedDiscount.value, total };
}

export function hasMeaningfulQuotationItems(items = []) {
  return validateAndNormalizeQuotationValues({ materials: items }).valid;
}

export function getSafeQuotationPreview(values = {}) {
  const result = validateAndNormalizeQuotationValues(values);
  return result.valid
    ? result
    : { valid: false, materialTotal: 0, labour: 0, transport: 0, discount: 0, total: 0 };
}
