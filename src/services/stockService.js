import {
  getInventory,
  updateItem,
} from "./inventoryService";

/**
 * Deduct stock after a sale/invoice.
 * soldItems should contain:
 * [
 *   {
 *     description: "1.5mm Cable",
 *     quantity: 2
 *   }
 * ]
 */
export function deductStock(soldItems) {
  const inventory = getInventory();

  soldItems.forEach((soldItem) => {
    const item = inventory.find(
      (inv) =>
        inv.name.trim().toLowerCase() ===
        soldItem.description.trim().toLowerCase()
    );

    if (!item) return;

    const updatedItem = {
      ...item,
      quantity: Math.max(
        0,
        item.quantity - Number(soldItem.quantity)
      ),
    };

    updateItem(updatedItem);
  });
}