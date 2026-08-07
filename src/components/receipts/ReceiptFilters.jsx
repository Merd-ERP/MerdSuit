import Card from "../common/Card";
import SearchBox from "../common/SearchBox";

function ReceiptFilters({ search, onSearchChange }) { return <Card className="mb-6"><SearchBox value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search receipts by number, invoice, client, or method..." /></Card>; }
export default ReceiptFilters;
