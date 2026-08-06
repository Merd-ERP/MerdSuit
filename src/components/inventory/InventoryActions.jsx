import Card from "../common/Card";
import Button from "../common/Button";

function InventoryActions({ onStockIn, onStockOut }) {
  return <Card className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-semibold text-slate-800">Stock Movements</h2><p className="mt-1 text-sm text-slate-500">Record incoming and outgoing inventory.</p></div><div className="flex flex-wrap gap-3"><Button variant="success" onClick={onStockIn}>Stock In</Button><Button variant="warning" onClick={onStockOut}>Stock Out</Button></div></Card>;
}

export default InventoryActions;
