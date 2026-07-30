import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useApp } from "../context/AppContext";
import { generateQuotationPDF } from "../services/pdf/quotationPdf";

function QuotationDetails() {
  const { id } = useParams();

  const { quotations } = useApp();
  console.log("Route ID:", id);
console.log("Quotations:", quotations);

  const quotation = quotations.find(
    (q) => q.id.toString() === id
  );

  const company =
    JSON.parse(localStorage.getItem("company")) || {};

  if (!quotation) {
    return (
      <MainLayout>
        <h1 className="text-3xl font-bold p-8">
          Quotation not found
        </h1>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div
        id="quotation-print"
        className="bg-white rounded-xl shadow p-8"
      >
        {/* Header */}
<div className="flex justify-between items-start border-b pb-8 mb-8">

  <div className="flex gap-6 items-start">

    {company.logo && (
      <img
        src={company.logo}
        alt="Company Logo"
        className="w-24 h-24 object-contain rounded-lg border"
      />
    )}

    <div>

      <h1 className="text-4xl font-bold text-slate-900">
        {company.name}
      </h1>

      <p className="text-lg text-slate-600 mb-3">
        {company.tagline}
      </p>

      <div className="space-y-1 text-gray-600">

        <p>{company.address}</p>

        <p>{company.phone}</p>

        <p>{company.email}</p>

        <p>{company.website}</p>

      </div>

    </div>

  </div>

  <div className="text-right">

    <h2 className="text-5xl font-bold text-slate-800">
      QUOTATION
    </h2>

    <p className="text-lg font-semibold mt-2">
      {quotation.quotationNumber}
    </p>

    <div className="mt-4">

      <span
        className={`inline-block px-4 py-2 rounded-full font-semibold ${
          quotation.status === "Converted"
            ? "bg-purple-100 text-purple-700"
            : quotation.status === "Accepted"
            ? "bg-green-100 text-green-700"
            : quotation.status === "Rejected"
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {quotation.status || "Pending"}
      </span>

    </div>

  </div>

</div>

        <hr className="my-8" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

  <div className="bg-slate-50 rounded-xl p-5 shadow-sm">

    <p className="text-sm text-gray-500">
      Client
    </p>

    <h3 className="text-xl font-bold mt-2">
      {quotation.client}
    </h3>

  </div>

  <div className="bg-slate-50 rounded-xl p-5 shadow-sm">

    <p className="text-sm text-gray-500">
      Project
    </p>

    <h3 className="text-xl font-bold mt-2">
      {quotation.project}
    </h3>

  </div>

  <div className="bg-slate-50 rounded-xl p-5 shadow-sm">

    <p className="text-sm text-gray-500">
      Date
    </p>

    <h3 className="text-xl font-bold mt-2">
      {quotation.date || "-"}
    </h3>

  </div>

  <div className="bg-slate-50 rounded-xl p-5 shadow-sm">

    <p className="text-sm text-gray-500">
      Currency
    </p>

    <h3 className="text-xl font-bold mt-2">
      {quotation.currency || "GH₵"}
    </h3>

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

            {quotation.materials?.map((item) => (

              <tr key={item.id}>

                <td className="border p-2">
                  {item.description}
                </td>

                <td className="border p-2 text-center">
                  {item.quantity}
                </td>

                <td className="border p-2 text-right">
                  {(quotation.currency || "GH₵")}{" "}
                  {Number(item.price).toLocaleString()}
                </td>

                <td className="border p-2 text-right">
                  {(quotation.currency || "GH₵")}{" "}
                  {(
                    Number(item.quantity) *
                    Number(item.price)
                  ).toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>
        <div className="mt-10 flex justify-end">

  <div className="w-96 bg-white rounded-xl border shadow-lg p-6">
    <div className="flex justify-between py-2">
      <span>Labour</span>
      <span>
        {quotation.currency || "GH₵"} {Number(quotation.labour || 0).toLocaleString()}
      </span>
    </div>

    <div className="flex justify-between py-2">
      <span>Transport</span>
      <span>
        {quotation.currency || "GH₵"} {Number(quotation.transport || 0).toLocaleString()}
      </span>
    </div>

    <div className="flex justify-between py-2">
      <span>Discount</span>
      <span className="text-red-600">
        -{quotation.currency || "GH₵"} {Number(quotation.discount || 0).toLocaleString()}
      </span>
    </div>

    <hr className="my-4" />

    <div className="flex justify-between text-3xl font-bold text-green-700">
      <span>Grand Total</span>
      <span>
        {quotation.currency || "GH₵"} {Number(quotation.total || 0).toLocaleString()}
      </span>
    </div>

  </div>
  </div>    // End of the financial summary

{/* Action Buttons */}
<div className="flex justify-end gap-4 mt-8">

  <button
    onClick={() => window.history.back()}
    className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg"
  >
    ← Back
  </button>

  <button
    onClick={() => window.print()}
    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
  >
    🖨 Print
  </button>

  <button
    onClick={() => generateQuotationPDF(quotation)}
    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
  >
    📄 Download PDF
  </button>

</div>

</div>  

</MainLayout>
  );
}

export default QuotationDetails;