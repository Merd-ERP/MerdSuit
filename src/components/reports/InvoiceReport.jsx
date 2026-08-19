import { useApp } from "../../context/AppContext";
import Card from "../common/Card";
import EmptyReport from "./EmptyReport";
import { formatCurrency } from "../../utils/currency";
import { getInvoiceBalance, getInvoicePaymentStatus } from "../../utils/invoicePayments";

function InvoiceReport() {
  const { invoices = [] } = useApp();
  return <Card><h2 className="text-lg font-semibold text-slate-800">Invoice Report</h2><div className="mt-4 overflow-x-auto">{invoices.length === 0 ? <EmptyReport /> : <table className="w-full min-w-[680px] text-sm"><thead className="border-b border-slate-200 text-left text-slate-500"><tr><th className="p-3">Invoice Number</th><th className="p-3">Customer</th><th className="p-3">Due Date</th><th className="p-3 text-right">Balance</th><th className="p-3">Status</th></tr></thead><tbody>{invoices.map((invoice) => <tr key={invoice.id} className="border-b border-slate-100"><td className="p-3">{invoice.invoiceNumber || "—"}</td><td className="p-3">{invoice.client || "—"}</td><td className="p-3">{invoice.dueDate || "—"}</td><td className="p-3 text-right">{formatCurrency(getInvoiceBalance(invoice))}</td><td className="p-3">{getInvoicePaymentStatus(invoice)}</td></tr>)}</tbody></table>}</div></Card>;
}

export default InvoiceReport;
