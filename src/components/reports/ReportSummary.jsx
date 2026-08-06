import { useApp } from "../../context/AppContext";
import SummaryCard from "./SummaryCard";

const currency = (value) =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(value);

function ReportSummary() {
  const { invoices = [], expenses = [] } = useApp();
  const revenue = invoices
    .filter((invoice) => invoice.status === "Paid")
    .reduce((sum, invoice) => sum + (Number(invoice.total) || 0), 0);
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + (Number(expense.amount) || 0),
    0
  );
  const outstanding = invoices.reduce((sum, invoice) => {
    const balance = Number(invoice.balance) || 0;
    return balance > 0 ? sum + balance : sum;
  }, 0);

  return (
    <section aria-label="Report summary" className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard label="Revenue" value={currency(revenue)} accentClass="text-emerald-600" />
      <SummaryCard label="Expenses" value={currency(totalExpenses)} accentClass="text-rose-600" />
      <SummaryCard label="Outstanding" value={currency(outstanding)} accentClass="text-amber-600" />
      <SummaryCard label="Profit" value={currency(revenue - totalExpenses)} accentClass={revenue - totalExpenses >= 0 ? "text-blue-600" : "text-rose-600"} />
    </section>
  );
}

export default ReportSummary;
