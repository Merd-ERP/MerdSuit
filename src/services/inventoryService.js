const STORAGE_KEY = "inventory";

export function getInventory() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function saveItem(item) {
  const inventory = getInventory();

  inventory.push(item);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(inventory)
  );
}

export function updateItem(updatedItem) {
  const inventory = getInventory().map((item) =>
    item.id === updatedItem.id
      ? updatedItem
      : item
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(inventory)
  );
}

export function deleteItem(id) {
  const inventory = getInventory().filter(
    (item) => item.id !== id
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(inventory)
  );
}