import Card from "../common/Card";
import SearchBox from "../common/SearchBox";

function PurchaseOrderFilters({ search, status, onSearchChange, onStatusChange }) {
  return <Card className="mb-6"><div className="grid gap-4 md:grid-cols-2"><SearchBox value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search purchase orders..." /><select value={status} onChange={(event) => onStatusChange(event.target.value)} className="rounded-lg border border-slate-300 p-3"><option>All</option><option>Pending</option><option>Received</option></select></div></Card>;
}

export default PurchaseOrderFilters;
