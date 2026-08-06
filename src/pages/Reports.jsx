import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/common/PageHeader";
import ReportsHeader from "../components/reports/ReportsHeader";
import ReportFilters from "../components/reports/ReportFilters";
import ReportSummary from "../components/reports/ReportSummary";
import ReportTabs from "../components/reports/ReportTabs";
import SalesReport from "../components/reports/SalesReport";
import InvoiceReport from "../components/reports/InvoiceReport";
import PaymentReport from "../components/reports/PaymentReport";
import ExpenseReport from "../components/reports/ExpenseReport";
import InventoryReport from "../components/reports/InventoryReport";
import ExportActions from "../components/reports/ExportActions";

const reports = {
  sales: SalesReport,
  invoices: InvoiceReport,
  payments: PaymentReport,
  expenses: ExpenseReport,
  inventory: InventoryReport,
};

function Reports() {
  const [activeTab, setActiveTab] = useState("sales");
  const ActiveReport = reports[activeTab];

  return (
    <MainLayout>
      <PageHeader
        title="Reports"
        subtitle="Review your business performance and financial activity."
      />

      <ReportsHeader />
      <ReportFilters />
      <ReportSummary />
      <ReportTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <ActiveReport />
      <ExportActions />
    </MainLayout>
  );
}

export default Reports;
