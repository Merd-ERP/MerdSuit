export const INVENTORY_MOVEMENTS_STORAGE_KEY = "inventoryMovements";

export function readInventoryMovements(storage = localStorage) {
  try {
    const stored = JSON.parse(storage.getItem(INVENTORY_MOVEMENTS_STORAGE_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export function persistInventoryMovements(movements, storage = localStorage) {
  const safeMovements = Array.isArray(movements) ? movements : [];
  storage.setItem(INVENTORY_MOVEMENTS_STORAGE_KEY, JSON.stringify(safeMovements));
}

export function createPurchaseOrderMovementId(purchaseOrderId, inventoryItemId) {
  const purchaseOrderKey = encodeURIComponent(String(purchaseOrderId));
  const inventoryItemKey = encodeURIComponent(String(inventoryItemId));
  return `purchase-order:${purchaseOrderKey}:${inventoryItemKey}`;
}

function encodeTypedId(value) {
  return encodeURIComponent(`${typeof value}:${String(value)}`);
}

export function createInvoiceMovementId(invoiceId, inventoryItemId) {
  return `invoice:${encodeTypedId(invoiceId)}:${encodeTypedId(inventoryItemId)}`;
}

export function createManualMovementId(inventoryItemId) {
  const uniquePart = globalThis.crypto?.randomUUID?.()
    || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `manual:${String(inventoryItemId)}:${uniquePart}`;
}

export function appendUniqueInventoryMovements(currentMovements, newMovements) {
  const current = Array.isArray(currentMovements) ? currentMovements : [];
  const knownIds = new Set(current.map((movement) => String(movement?.id)));
  const additions = (Array.isArray(newMovements) ? newMovements : []).filter((movement) => {
    if (!movement?.id || knownIds.has(String(movement.id))) return false;
    knownIds.add(String(movement.id));
    return true;
  });

  return [...additions, ...current];
}

export function createInventoryMovement({
  id,
  inventoryItem,
  type,
  quantity,
  occurredAt = new Date().toISOString(),
  sourceType,
  sourceId = null,
  sourceReference = "",
  resultingQuantity,
  notes = "",
  user = "Current user",
}) {
  return {
    id,
    inventoryItemId: inventoryItem.id,
    itemNameSnapshot: inventoryItem.name || "Inventory item",
    type,
    quantity: Number(quantity),
    occurredAt,
    sourceType,
    sourceId,
    sourceReference,
    resultingQuantity: Number(resultingQuantity),
    notes,
    user,
  };
}
