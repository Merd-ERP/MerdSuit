import SummaryCard from "./SummaryCard";
import { money } from "./reportData";
function ReportSummary({ metrics }) { return <section aria-label="Report summary" className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4"><SummaryCard label="Revenue" value={money(metrics.revenue)} accentClass="text-emerald-600" /><SummaryCard label="Expenses" value={money(metrics.totalExpenses)} accentClass="text-rose-600" /><SummaryCard label="Outstanding" value={money(metrics.outstanding)} accentClass="text-amber-600" /><SummaryCard label="Profit" value={money(metrics.profit)} accentClass={metrics.profit >= 0 ? "text-blue-600" : "text-rose-600"} /></section>; }
export default ReportSummary;
