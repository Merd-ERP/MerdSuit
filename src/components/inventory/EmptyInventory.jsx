import EmptyState from "../common/EmptyState";

function EmptyInventory({ message = "No inventory data available." }) {
  return <EmptyState title="No Inventory" message={message} />;
}

export default EmptyInventory;
