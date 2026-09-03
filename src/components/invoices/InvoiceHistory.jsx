import { useState } from "react";
import { Link } from "react-router-dom";

import {
  getInvoices,
} from "../../services/invoiceService";
import { formatCurrency } from "../../utils/currency";
import { getInvoicePaymentStatus } from "../../utils/invoicePayments";
import { getFinancialRouteToken } from "../../utils/financialIdentity";

function InvoiceHistory() {
  const invoices = getInvoices();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      String(invoice.clientNameSnapshot || invoice.client || "").toLowerCase().includes(search.toLowerCase()) ||
      String(invoice.projectNameSnapshot || invoice.project || "").toLowerCase().includes(search.toLowerCase()) ||
      String(invoice.invoiceNumber || "").toLowerCase().includes(search.toLowerCase());

    const status = getInvoicePaymentStatus(invoice);
    const matchesFilter = filter === "All" || status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="mt-10">

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <h2 className="text-2xl font-bold">
          Saved Invoices
        </h2>

        <div className="flex flex-col gap-3 sm:flex-row">

          <input
            type="text"
            placeholder="Search invoice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border px-4 py-2 sm:w-64"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full rounded-lg border px-4 py-2"
          >
            <option>All</option>
            <option>Paid</option>
            <option>Partially Paid</option>
            <option>Unpaid</option>
          </select>

        </div>

      </div>

      {filteredInvoices.length === 0 ? (

        <p className="text-gray-500">
          No invoices found.
        </p>

      ) : (

        <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-[720px] w-full border-collapse">

          <thead className="bg-gray-100">

            <tr>
              <th className="border p-2">Invoice No.</th>
              <th className="border p-2">Client</th>
              <th className="border p-2">Project</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>

          </thead>

          <tbody>

            {filteredInvoices.map((invoice) => {
              const status = getInvoicePaymentStatus(invoice);
              return (

              <tr key={invoice.id}>

                <td className="border p-2">
                  {invoice.invoiceNumber}
                </td>

                <td className="border p-2">
                  {invoice.client}
                </td>

                <td className="border p-2">
                  {invoice.project}
                </td>

                <td className="border p-2">
                  {formatCurrency(Number.isFinite(Number(invoice.total)) && Number(invoice.total) >= 0 ? Number(invoice.total) : 0)}
                </td>

                <td className="border p-2">
                  {status}
                </td>

                <td className="border p-2">

                  <div className="flex gap-2">

                    <Link
                      to={`/invoice/${getFinancialRouteToken(invoice)}`}
                      className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded"
                    >
                      View
                    </Link>

                    {status !== "Paid" ? (

                      <Link
                        to={`/invoice/${getFinancialRouteToken(invoice)}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      >
                        Record Payment
                      </Link>

                    ) : (

                      <span className="text-green-700 font-semibold self-center">
                        Paid
                      </span>

                    )}

                  </div>

                </td>

              </tr>

              );
            })}

          </tbody>

        </table>
        </div>

      )}

    </div>
  );
}

export default InvoiceHistory;
