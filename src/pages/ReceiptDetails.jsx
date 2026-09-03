import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/Mainlayout";
import PageHeader from "../components/common/PageHeader";
import ReceiptDetailsView from "../components/receipts/ReceiptDetails";
import EmptyReceipts from "../components/receipts/EmptyReceipts";
import { getReceipts } from "../services/receiptService";
import { resolveFinancialRoute } from "../utils/financialIdentity";

function ReceiptDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const receipt = resolveFinancialRoute(getReceipts(), id);
  const currentCompany = JSON.parse(localStorage.getItem("company")) || {};
  const company = receipt?.company && Object.keys(receipt.company).length > 0
    ? receipt.company
    : currentCompany;
  return <MainLayout>{!receipt ? <EmptyReceipts /> : <><PageHeader title="Receipt Details" subtitle={`Receipt ${receipt.receiptNumber || "—"}`} /><ReceiptDetailsView receipt={receipt} company={company} onBack={() => navigate(-1)} /></>}</MainLayout>;
}

export default ReceiptDetails;
