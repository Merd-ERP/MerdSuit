import { useNavigate } from "react-router-dom";
import Card from "../common/Card";
import Button from "../common/Button";
function ReceiptQuickActions() { const navigate = useNavigate(); return <Card className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-slate-500">Receipts are generated automatically when a payment is recorded.</p><Button onClick={() => navigate("/invoices")}>Record a Payment</Button></Card>; }
export default ReceiptQuickActions;
