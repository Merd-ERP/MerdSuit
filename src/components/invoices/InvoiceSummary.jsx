import { getInvoices } from "../../services/invoiceService";
import { formatCurrency } from "../../utils/currency";

function InvoiceSummary() {
  const invoices = getInvoices();

  const totalInvoices = invoices.length;

  const paidInvoices = invoices.filter(
    (invoice) => invoice.status === "Paid"
  );

  const unpaidInvoices = invoices.filter(
    (invoice) => invoice.status === "Unpaid"
  );

  const totalRevenue = paidInvoices.reduce(
    (sum, invoice) => sum + invoice.total,
    0
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">

      <div className="bg-blue-50 rounded-xl p-5 shadow">
        <h3 className="text-gray-500">Invoices</h3>

        <p className="text-3xl font-bold text-blue-700">
          {totalInvoices}
        </p>
      </div>

      <div className="bg-green-50 rounded-xl p-5 shadow">
        <h3 className="text-gray-500">Paid</h3>

        <p className="text-3xl font-bold text-green-700">
          {paidInvoices.length}
        </p>
      </div>

      <div className="bg-red-50 rounded-xl p-5 shadow">
        <h3 className="text-gray-500">Unpaid</h3>

        <p className="text-3xl font-bold text-red-700">
          {unpaidInvoices.length}
        </p>
      </div>

      <div className="bg-yellow-50 rounded-xl p-5 shadow">
        <h3 className="text-gray-500">
          Revenue Received
        </h3>

        <p className="text-2xl font-bold text-yellow-700">
          {formatCurrency(totalRevenue)}
        </p>
      </div>

    </div>
  );
}

export default InvoiceSummary;
