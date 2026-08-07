import Card from "../common/Card";
import Button from "../common/Button";

function QuickActions({ onNewOrder }) {
  return <Card className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-semibold text-slate-800">Quick Actions</h2><p className="mt-1 text-sm text-slate-500">Create a purchase order for materials from a supplier.</p></div><Button onClick={onNewOrder}>New Purchase Order</Button></Card>;
}

export default QuickActions;
