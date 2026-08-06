import { useApp } from "../../context/AppContext";
import Card from "../common/Card";
import EmptyReport from "./EmptyReport";

function SalesReport() {
  const { invoices = [] } = useApp();
  const sales = invoices.filter((invoice) => invoice.status === "Paid");

  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-800">Sales Report</h2>
      <div className="mt-4 overflow-x-auto">
        {sales.length === 0 ? <EmptyReport /> : (
          <table className="w-full min-w-[680px] text-sm">
            <thead className="border-b border-slate-200 text-left text-slate-500"><tr><th className="p-3">Date</th><th className="p-3">Invoice</th><th className="p-3">Customer</th><th className="p-3 text-right">Amount</th><th className="p-3">Status</th></tr></thead>
            <tbody>{sales.map((sale) => <tr key={sale.id} className="border-b border-slate-100"><td className="p-3">{sale.date || "—"}</td><td className="p-3">{sale.invoiceNumber || "—"}</td><td className="p-3">{sale.client || "—"}</td><td className="p-3 text-right">GH₵ {(Number(sale.total) || 0).toLocaleString()}</td><td className="p-3">{sale.status || "—"}</td></tr>)}</tbody>
          </table>
        )}
      </div>
    </Card>
  );
}

export default SalesReport;
