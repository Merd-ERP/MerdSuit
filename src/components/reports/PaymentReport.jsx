import { useApp } from "../../context/AppContext";
import Card from "../common/Card";
import EmptyReport from "./EmptyReport";
import { formatCurrency } from "../../utils/currency";

function PaymentReport() {
  const { invoices = [] } = useApp();
  const payments = invoices.flatMap((invoice) => (invoice.payments || []).map((payment) => ({ ...payment, client: invoice.client })));
  return <Card><h2 className="text-lg font-semibold text-slate-800">Payment Report</h2><div className="mt-4 overflow-x-auto">{payments.length === 0 ? <EmptyReport /> : <table className="w-full min-w-[620px] text-sm"><thead className="border-b border-slate-200 text-left text-slate-500"><tr><th className="p-3">Date</th><th className="p-3">Customer</th><th className="p-3">Method</th><th className="p-3 text-right">Amount</th></tr></thead><tbody>{payments.map((payment) => <tr key={payment.id} className="border-b border-slate-100"><td className="p-3">{payment.date || "—"}</td><td className="p-3">{payment.client || "—"}</td><td className="p-3">{payment.method || "—"}</td><td className="p-3 text-right">{formatCurrency(payment.amount)}</td></tr>)}</tbody></table>}</div></Card>;
}

export default PaymentReport;
