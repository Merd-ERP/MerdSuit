import MainLayout from "../layouts/MainLayout";

import ReportSummary from "../components/reports/ReportSummary";
import FinancialReport from "../components/reports/FinancialReport";
import InventoryReport from "../components/reports/InventoryReport";
import ClientReport from "../components/reports/ClientReport";
import BusinessAnalytics from "../components/reports/BusinessAnalytics";

function Reports() {
  return (
    <MainLayout>
      <div className="space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            Reports Dashboard
          </h1>

          <p className="text-slate-500 mt-2">
            Monitor your business performance,
            financial health and customer activity
            from one place.
          </p>
        </div>

        {/* Summary */}
        <ReportSummary />

        {/* Financial */}
        <FinancialReport />

        {/* Inventory */}
        <InventoryReport />

        {/* Client */}
        <ClientReport />

        {/* Business Analytics */}
        <BusinessAnalytics />

      </div>
    </MainLayout>
  );
}

export default Reports;