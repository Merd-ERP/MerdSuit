import { useState } from "react";
import { Link } from "react-router-dom";

import {
  getInvoices,
  updateInvoice,
} from "../../services/invoiceService";

function InvoiceHistory() {
  const invoices = getInvoices();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  function markAsPaid(invoice) {
    updateInvoice({
      ...invoice,
      status: "Paid",
    });

    alert("Invoice marked as Paid.");

    window.location.reload();
  }

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.client.toLowerCase().includes(search.toLowerCase()) ||
      invoice.project.toLowerCase().includes(search.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || invoice.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="mt-10">

      <div className="flex justify-between items-center mb-4">

        <h2 className="text-2xl font-bold">
          Saved Invoices
        </h2>

        <div className="flex gap-3">

          <input
            type="text"
            placeholder="Search invoice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option>All</option>
            <option>Paid</option>
            <option>Unpaid</option>
          </select>

        </div>

      </div>

      {filteredInvoices.length === 0 ? (

        <p className="text-gray-500">
          No invoices found.
        </p>

      ) : (

        <table className="w-full border-collapse border">

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

            {filteredInvoices.map((invoice) => (

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
                  GH₵ {invoice.total.toLocaleString()}
                </td>

                <td className="border p-2">
                  {invoice.status}
                </td>

                <td className="border p-2">

                  <div className="flex gap-2">

                    <Link
                      to={`/invoice/${invoice.id}`}
                      className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded"
                    >
                      View
                    </Link>

                    {invoice.status === "Unpaid" ? (

                      <button
                        onClick={() => markAsPaid(invoice)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      >
                        Mark Paid
                      </button>

                    ) : (

                      <span className="text-green-700 font-semibold self-center">
                        Paid
                      </span>

                    )}

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>
  );
}

export default InvoiceHistory;