import { useApp } from "../../context/AppContext";
import Card from "../common/Card";
import { formatCurrency } from "../../utils/currency";
import { hasQuotationStatus, isDraftQuotation } from "../../utils/quotationStatus";

function QuotationStats() {
  const { quotations } = useApp();
  const finalizedQuotations = quotations.filter((quotation) => !isDraftQuotation(quotation));
  const accepted = finalizedQuotations.filter((quotation) => hasQuotationStatus(quotation, "Accepted")).length;
  const total = finalizedQuotations.reduce((sum, quotation) => sum + (Number(quotation.total) || 0), 0);
  const stats = [{ label: "Total Quotations", value: finalizedQuotations.length, color: "text-blue-600" }, { label: "Accepted", value: accepted, color: "text-emerald-600" }, { label: "Quotation Value", value: formatCurrency(total), color: "text-slate-800" }];
  return <section className="mb-6 grid gap-4 sm:grid-cols-3">{stats.map((stat) => <Card key={stat.label} className="p-5"><p className="text-sm font-medium text-slate-500">{stat.label}</p><p className={`mt-2 text-2xl font-bold ${stat.color}`}>{stat.value}</p></Card>)}</section>;
}

export default QuotationStats;
