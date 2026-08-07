import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/common/PageHeader";
import ReceiptHeader from "../components/receipts/ReceiptHeader";
import ReceiptStats from "../components/receipts/ReceiptStats";
import ReceiptFilters from "../components/receipts/ReceiptFilters";
import ReceiptQuickActions from "../components/receipts/ReceiptQuickActions";
import ReceiptTable from "../components/receipts/ReceiptTable";
import { getReceipts } from "../services/receiptService";

function ReceiptHistory() { const receipts = getReceipts(); const [search, setSearch] = useState(""); const filteredReceipts = receipts.filter((receipt) => [receipt.receiptNumber, receipt.invoiceNumber, receipt.client, receipt.method].some((value) => (value || "").toLowerCase().includes(search.toLowerCase()))); return <MainLayout><PageHeader title="Receipt History" subtitle="Review payment receipts issued to your customers." /><ReceiptHeader /><ReceiptStats receipts={receipts} /><ReceiptQuickActions /><ReceiptFilters search={search} onSearchChange={setSearch} /><ReceiptTable receipts={filteredReceipts} /></MainLayout>; }
export default ReceiptHistory;
