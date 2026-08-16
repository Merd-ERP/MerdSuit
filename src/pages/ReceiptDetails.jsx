import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/Mainlayout";
import PageHeader from "../components/common/PageHeader";
import ReceiptDetailsView from "../components/receipts/ReceiptDetails";
import EmptyReceipts from "../components/receipts/EmptyReceipts";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { useToast } from "../context/ToastContext";
import { deleteReceipt, getReceipts } from "../services/receiptService";

function ReceiptDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const receipt = getReceipts().find((item) => String(item.id) === id);
  const company = JSON.parse(localStorage.getItem("company")) || {};
  function handleDelete() { deleteReceipt(receipt.id); showToast({ type: "success", title: "Receipt deleted", message: "Receipt deleted successfully" }); navigate("/receipts"); }
  return <MainLayout>{!receipt ? <EmptyReceipts /> : <><PageHeader title="Receipt Details" subtitle={`Receipt ${receipt.receiptNumber}`} /><ReceiptDetailsView receipt={receipt} company={company} onBack={() => navigate(-1)} onDelete={() => setIsDeleteOpen(true)} /><ConfirmDialog isOpen={isDeleteOpen} title="Delete Receipt?" message={`Are you sure you want to delete receipt ${receipt.receiptNumber}? This action cannot be undone.`} onCancel={() => setIsDeleteOpen(false)} onConfirm={handleDelete} confirmLabel="Delete Receipt" /></>}</MainLayout>;
}

export default ReceiptDetails;
