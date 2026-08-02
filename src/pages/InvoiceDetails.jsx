import { useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import {
  getInvoices,
  updateInvoice,
} from "../services/invoiceService";

function InvoiceDetails() {
  const { id } = useParams();

  const invoices = getInvoices();

  const invoice = invoices.find(
    (inv) => inv.id.toString() === id
  );

  const company =
    JSON.parse(localStorage.getItem("company")) || {};

  const [payment, setPayment] = useState({
    amount: "",
    method: "Cash",
    reference: "",
    date: new Date().toISOString().split("T")[0],
  });

  function savePayment() {
    const amount = Number(payment.amount);

    if (!amount || amount <= 0) {
      alert("Enter a valid payment amount.");
      return;
    }

    const updatedInvoice = {
      ...invoice,
      payments: [
        ...(invoice.payments || []),
        {
          id: Date.now(),
          amount,
          method: payment.method,
          reference: payment.reference,
          date: payment.date,
        },
      ],
    };

    updatedInvoice.amountPaid =
      updatedInvoice.payments.reduce(
        (sum, pay) => sum + Number(pay.amount),
        0
      );

    updatedInvoice.balance =
      updatedInvoice.total -
      updatedInvoice.amountPaid;

    if (updatedInvoice.balance <= 0) {
      updatedInvoice.status = "Paid";
    } else if (updatedInvoice.amountPaid > 0) {
      updatedInvoice.status = "Partially Paid";
    } else {
      updatedInvoice.status = "Unpaid";
    }

    updateInvoice(updatedInvoice);

    window.location.reload();
  }

  if (!invoice) {
    return (
      <MainLayout>
        <h1 className="text-3xl font-bold p-8">
          Invoice not found
        </h1>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div
        id="invoice-print"
        className="bg-white rounded-xl shadow-lg p-8"
      >
        {/* Header */}

        <div className="flex justify-between items-start border-b pb-8 mb-8">

          <div className="flex gap-5">

            {company.logo && (
              <img
                src={company.logo}
                alt="Logo"
                className="w-24 h-24 rounded-lg border object-contain"
              />
            )}

            <div>

              <h1 className="text-4xl font-bold">
                {company.name}
              </h1>

              <p className="text-gray-600">
                {company.tagline}
              </p>

              <p>{company.address}</p>

              <p>{company.phone}</p>

              <p>{company.email}</p>

              <p>{company.website}</p>

            </div>

          </div>

          <div className="text-right">

            <h2 className="text-5xl font-bold">
              INVOICE
            </h2>

            <p className="mt-2 font-semibold">
              {invoice.invoiceNumber}
            </p>

            <span className="inline-block mt-3 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold">
              {invoice.status}
            </span>

            <div className="mt-5 flex gap-2 justify-end">

              <button
                onClick={() => window.print()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Print
              </button>

              <button
                onClick={() => window.history.back()}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                Back
              </button>

            </div>

          </div>

        </div>

        {/* Customer */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          <div className="bg-slate-50 p-5 rounded-xl">

            <p className="text-gray-500">
              Client
            </p>

            <h3 className="font-bold text-xl mt-2">
              {invoice.client}
            </h3>

          </div>

          <div className="bg-slate-50 p-5 rounded-xl">

            <p className="text-gray-500">
              Project
            </p>

            <h3 className="font-bold text-xl mt-2">
              {invoice.project}
            </h3>

          </div>

          <div className="bg-slate-50 p-5 rounded-xl">

            <p className="text-gray-500">
              Date
            </p>

            <h3 className="font-bold text-xl mt-2">
              {invoice.date}
            </h3>

          </div>

          <div className="bg-slate-50 p-5 rounded-xl">

            <p className="text-gray-500">
              Status
            </p>

            <h3 className="font-bold text-xl mt-2">
              {invoice.status}
            </h3>

          </div>

        </div>

        {/* Materials */}

        <h2 className="text-2xl font-bold mb-4">
          Materials
        </h2>

        <table className="w-full border border-collapse mb-10">

          <thead className="bg-slate-100">

            <tr>

              <th className="border p-3">
                Description
              </th>

              <th className="border p-3">
                Qty
              </th>

              <th className="border p-3">
                Unit Price
              </th>

              <th className="border p-3">
                Total
              </th>

            </tr>

          </thead>

          <tbody>

            {invoice.materials?.map((item) => (

              <tr key={item.id}>

                <td className="border p-3">
                  {item.description}
                </td>

                <td className="border p-3 text-center">
                  {item.quantity}
                </td>

                <td className="border p-3 text-right">
                  GH₵ {Number(item.price).toLocaleString()}
                </td>

                <td className="border p-3 text-right">
                  GH₵{" "}
                  {(
                    Number(item.price) *
                    Number(item.quantity)
                  ).toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>
                {/* Totals */}

        <div className="flex justify-end mb-10">

          <div className="w-96 bg-white rounded-xl border shadow-lg p-6">

            <div className="flex justify-between py-2">
              <span>Labour</span>
              <span>
                GH₵ {Number(invoice.labour || 0).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span>Transport</span>
              <span>
                GH₵ {Number(invoice.transport || 0).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span>Discount</span>
              <span>
                -GH₵ {Number(invoice.discount || 0).toLocaleString()}
              </span>
            </div>

            <hr className="my-3" />

            <div className="flex justify-between font-semibold">
              <span>Total Paid</span>
              <span>
                GH₵ {Number(invoice.amountPaid || 0).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between font-semibold mt-2">
              <span>Balance</span>
              <span className="text-red-600">
                GH₵{" "}
                {Number(
                  invoice.balance ??
                    invoice.total - (invoice.amountPaid || 0)
                ).toLocaleString()}
              </span>
            </div>

            <hr className="my-3" />

            <div className="flex justify-between text-2xl font-bold">

              <span>Grand Total</span>

              <span>
                GH₵ {Number(invoice.total).toLocaleString()}
              </span>

            </div>

          </div>

        </div>

        {/* Record Payment */}

        <div className="border rounded-xl p-6 bg-slate-50 mb-10">

          <h2 className="text-2xl font-bold mb-6">
            Record Payment
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="number"
              placeholder="Amount"
              value={payment.amount}
              onChange={(e) =>
                setPayment({
                  ...payment,
                  amount: e.target.value,
                })
              }
              className="border rounded-lg p-3"
            />

            <select
              value={payment.method}
              onChange={(e) =>
                setPayment({
                  ...payment,
                  method: e.target.value,
                })
              }
              className="border rounded-lg p-3"
            >
              <option>Cash</option>
              <option>Mobile Money</option>
              <option>Bank Transfer</option>
              <option>Cheque</option>
            </select>

            <input
              type="text"
              placeholder="Reference"
              value={payment.reference}
              onChange={(e) =>
                setPayment({
                  ...payment,
                  reference: e.target.value,
                })
              }
              className="border rounded-lg p-3"
            />

            <input
              type="date"
              value={payment.date}
              onChange={(e) =>
                setPayment({
                  ...payment,
                  date: e.target.value,
                })
              }
              className="border rounded-lg p-3"
            />

          </div>

          <button
            onClick={savePayment}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            Save Payment
          </button>

        </div>

        {/* Payment History */}

        <div>

          <h2 className="text-2xl font-bold mb-4">
            Payment History
          </h2>

          {(invoice.payments || []).length === 0 ? (

            <p className="text-gray-500">
              No payments recorded.
            </p>

          ) : (

            <table className="w-full border border-collapse">

              <thead className="bg-slate-100">

                <tr>

                  <th className="border p-3">
                    Date
                  </th>

                  <th className="border p-3">
                    Method
                  </th>

                  <th className="border p-3">
                    Reference
                  </th>

                  <th className="border p-3">
                    Amount
                  </th>

                </tr>

              </thead>

              <tbody>

                {invoice.payments.map((pay) => (

                  <tr key={pay.id}>

                    <td className="border p-3">
                      {pay.date}
                    </td>

                    <td className="border p-3">
                      {pay.method}
                    </td>

                    <td className="border p-3">
                      {pay.reference || "-"}
                    </td>

                    <td className="border p-3 text-right">
                      GH₵ {Number(pay.amount).toLocaleString()}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </MainLayout>
  );
}

export default InvoiceDetails;