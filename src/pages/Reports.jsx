import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/common/PageHeader";
import { useApp } from "../context/AppContext";
import ReportsHeader from "../components/reports/ReportsHeader";
import ReportFilters from "../components/reports/ReportFilters";
import ReportSummary from "../components/reports/ReportSummary";
import ReportTabs from "../components/reports/ReportTabs";
import ReportTable from "../components/reports/ReportTable";
import ExportActions from "../components/reports/ExportActions";
import { getReportData, getReportMetrics } from "../components/reports/reportData";
function Reports() { const { expenses, inventory } = useApp(); const [activeTab, setActiveTab] = useState("sales"); const [period, setPeriod] = useState("This Month"); const metrics = getReportMetrics(period, expenses); const report = getReportData(activeTab, period, { expenses, inventory }); return <MainLayout><div id="report-print"><PageHeader title="Reports" subtitle="Review your business performance and financial activity." /><ReportsHeader /><div className="no-print"><ReportFilters selectedFilter={period} onFilterChange={setPeriod} /><ReportTabs activeTab={activeTab} onTabChange={setActiveTab} /></div><p className="print-only mb-4 text-sm text-slate-500">Period: {period}</p><ReportSummary metrics={metrics} /><ReportTable report={report} /></div><ExportActions report={report} period={period} metrics={metrics} /></MainLayout>; }
export default Reports;
