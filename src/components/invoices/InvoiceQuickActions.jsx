import { useNavigate } from "react-router-dom";
import Card from "../common/Card";
import Button from "../common/Button";

function InvoiceQuickActions() {
  const navigate = useNavigate();
  return <Card className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-slate-500">Create an invoice by converting an accepted quotation.</p><Button onClick={() => navigate("/quotations")}>View Quotations</Button></Card>;
}

export default InvoiceQuickActions;
