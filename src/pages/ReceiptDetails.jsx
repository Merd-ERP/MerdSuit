import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/common/PageHeader";
import ReceiptDetailsView from "../components/receipts/ReceiptDetails";
import EmptyReceipts from "../components/receipts/EmptyReceipts";
import { getReceipts } from "../services/receiptService";

function ReceiptDetails() { const { id } = useParams(); const navigate = useNavigate(); const receipt = getReceipts().find((item) => String(item.id) === id); const company = JSON.parse(localStorage.getItem("company")) || {}; return <MainLayout>{!receipt ? <EmptyReceipts /> : <><PageHeader title="Receipt Details" subtitle={`Receipt ${receipt.receiptNumber}`} /><ReceiptDetailsView receipt={receipt} company={company} onBack={() => navigate(-1)} /></>}</MainLayout>; }
export default ReceiptDetails;
