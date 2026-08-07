import { useApp } from "../../context/AppContext";
import Card from "../common/Card";

function QuotationStats() {
  const { quotations } = useApp();
  const accepted = quotations.filter((quotation) => quotation.status === "Accepted").length;
  const total = quotations.reduce((sum, quotation) => sum + (Number(quotation.total) || 0), 0);
  const stats = [{ label: "Total Quotations", value: quotations.length, color: "text-blue-600" }, { label: "Accepted", value: accepted, color: "text-emerald-600" }, { label: "Quotation Value", value: `GH₵ ${total.toLocaleString()}`, color: "text-slate-800" }];
  return <section className="mb-6 grid gap-4 sm:grid-cols-3">{stats.map((stat) => <Card key={stat.label} className="p-5"><p className="text-sm font-medium text-slate-500">{stat.label}</p><p className={`mt-2 text-2xl font-bold ${stat.color}`}>{stat.value}</p></Card>)}</section>;
}

export default QuotationStats;
