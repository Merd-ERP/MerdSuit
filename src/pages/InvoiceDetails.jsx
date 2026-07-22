import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getInvoices } from "../services/invoiceService";

function InvoiceDetails() {
  const { id } = useParams();

  const invoices = getInvoices();

  const invoice = invoices.find(
    (inv) => inv.id.toString() === id
  );
  const company =
  JSON.parse(localStorage.getItem("company")) || {};

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
  className="bg-white rounded-xl shadow p-8"
>

        {/* Header */}
        <div className="flex justify-between items-start mb-8">

          <div>

            <h1 className="text-4xl font-bold">
              {company.name}
            </h1>

            <p className="text-gray-600">
              {company.tagline}
            </p>
            <p className="text-gray-600">
  {company.address}
</p>

<p className="text-gray-600">
  {company.phone}
</p>

<p className="text-gray-600">
  {company.email}
</p>

<p className="text-gray-600">
  {company.website}
</p>

          </div>

          <div className="text-right">

            <h2 className="text-3xl font-bold">
              INVOICE
            </h2>

            <p className="mb-4">
              {invoice.invoiceNumber}
            </p>

            <div className="flex gap-2 justify-end">

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

        <hr className="my-8" />

        {/* Customer Details */}
        <div className="grid grid-cols-2 gap-8">

          <div>

            <h3 className="font-bold mb-2">
              Client
            </h3>

            <p>{invoice.client}</p>

          </div>

          <div>

            <h3 className="font-bold mb-2">
              Project
            </h3>

            <p>{invoice.project}</p>

          </div>

          <div>

            <h3 className="font-bold mb-2">
              Date
            </h3>

            <p>{invoice.date}</p>

          </div>

          <div>

            <h3 className="font-bold mb-2">
              Status
            </h3>

            <p>{invoice.status}</p>

          </div>

        </div>

        <hr className="my-8" />

        {/* Materials */}
        <h2 className="text-2xl font-bold mb-4">
          Materials
        </h2>

        <table className="w-full border border-collapse">

          <thead className="bg-gray-100">

            <tr>

              <th className="border p-2">
                Description
              </th>

              <th className="border p-2">
                Qty
              </th>

              <th className="border p-2">
                Unit Price
              </th>

              <th className="border p-2">
                Total
              </th>

            </tr>

          </thead>

          <tbody>

            {invoice.materials?.map((item) => (

              <tr key={item.id}>

                <td className="border p-2">
                  {item.description}
                </td>

                <td className="border p-2 text-center">
                  {item.quantity}
                </td>

                <td className="border p-2 text-right">
                  GH₵ {item.price.toLocaleString()}
                </td>

                <td className="border p-2 text-right">
                  GH₵ {(item.quantity * item.price).toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {/* Totals */}
        <div className="mt-8 flex justify-end">

          <div className="w-80">

            <div className="flex justify-between py-2">
              <span>Labour</span>
              <span>
                GH₵ {invoice.labour.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span>Transport</span>
              <span>
                GH₵ {invoice.transport.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span>Discount</span>
              <span>
                -GH₵ {invoice.discount.toLocaleString()}
              </span>
            </div>

            <hr className="my-2" />

            <div className="flex justify-between text-2xl font-bold">

              <span>Grand Total</span>

              <span>
                GH₵ {invoice.total.toLocaleString()}
              </span>

            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default InvoiceDetails;