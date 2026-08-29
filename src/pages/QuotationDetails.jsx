import { useParams } from "react-router-dom";
import MainLayout from "../layouts/Mainlayout";
import { useApp } from "../context/AppContext";
import { generateQuotationPDF } from "../services/pdf/quotationPdf";
import { formatCurrency, getCompanyCurrency } from "../utils/currency";
import { useToast } from "../context/ToastContext";
import { resolveQuotationRoute } from "../utils/quotationIdentity";
import { hasQuotationStatus, isDraftQuotation } from "../utils/quotationStatus";
import { validateAndNormalizeQuotationValues } from "../utils/quotationItems";

function QuotationDetails() {
  const { id } = useParams();
  const { showToast } = useToast();

  const { quotations } = useApp();

  const quotation = resolveQuotationRoute(quotations, id);

  const company =
    JSON.parse(localStorage.getItem("company")) || {};

  function canIssueQuotation() {
    if (isDraftQuotation(quotation) || !String(quotation?.clientNameSnapshot || quotation?.client || "").trim() || !String(quotation?.quotationNumber || "").trim()) {
      showToast({
        type: "warning",
        title: "Finalize quotation first",
        message: "Link a client and save this draft as a quotation before issuing it.",
      });
      return false;
    }
    const validation = validateAndNormalizeQuotationValues({
      materials: quotation.materials,
      labour: quotation.labour,
      transport: quotation.transport,
      discount: quotation.discount,
      expectedTotal: quotation.total,
    });
    if (!validation.valid) {
      showToast({
        type: "warning",
        title: "Quotation cannot be issued",
        message: validation.message,
      });
      return false;
    }
    return true;
  }

  async function downloadPdf() {
    if (!canIssueQuotation()) return;

    try {
      await generateQuotationPDF(quotation);
      showToast({
        type: "success",
        title: "PDF generated",
        message: "Quotation PDF downloaded successfully.",
      });
    } catch {
      showToast({
        type: "error",
        title: "PDF generation failed",
        message: "Unable to generate the quotation PDF.",
      });
    }
  }

  function printQuotation() {
    if (!canIssueQuotation()) return;
    window.print();
  }

  if (!quotation) {
    return (
      <MainLayout>
        <h1 className="text-3xl font-bold p-8">
          Quotation not found
        </h1>
      </MainLayout>
    );
  }

  const customerDocumentValidation = validateAndNormalizeQuotationValues({
    materials: quotation.materials,
    labour: quotation.labour,
    transport: quotation.transport,
    discount: quotation.discount,
    expectedTotal: quotation.total,
  });
  const canShowCustomerDocumentActions = !isDraftQuotation(quotation)
    && Boolean(String(quotation.clientNameSnapshot || quotation.client || "").trim())
    && Boolean(String(quotation.quotationNumber || "").trim())
    && customerDocumentValidation.valid;

  return (
    <MainLayout>
      <div
        id="quotation-print"
        className="bg-white rounded-xl shadow p-4 sm:p-8"
      >
        {/* Header */}
<div className="quotation-print-header flex flex-col items-start gap-6 border-b pb-8 mb-8 lg:flex-row lg:justify-between">

  <div className="flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:gap-6">

    {company.logo && (
      <img
        src={company.logo}
        alt="Company Logo"
        className="w-24 h-24 object-contain rounded-lg border"
      />
    )}

    <div className="min-w-0 break-words">

      <h1 className="break-words text-3xl font-bold text-slate-900 sm:text-4xl">
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

  <div className="w-full min-w-0 lg:w-auto lg:text-right">

    <h2 className="text-4xl font-bold text-slate-800 sm:text-5xl">
      QUOTATION
    </h2>

    <p className="text-lg font-semibold mt-2">
      {quotation.quotationNumber}
    </p>

    <div className="mt-4">

      <span
        className={`inline-block px-4 py-2 rounded-full font-semibold ${
          hasQuotationStatus(quotation, "Converted")
            ? "bg-purple-100 text-purple-700"
            : hasQuotationStatus(quotation, "Accepted")
            ? "bg-green-100 text-green-700"
            : hasQuotationStatus(quotation, "Rejected")
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {quotation.status || "Pending"}
      </span>

    </div>

  </div>

</div>

        <hr className="quotation-print-separator my-8" />

        <div className="quotation-print-customer grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

  <div className="bg-slate-50 rounded-xl p-5 shadow-sm">

    <p className="text-sm text-gray-500">
      Client
    </p>

    <h3 className="text-xl font-bold mt-2">
      {quotation.clientNameSnapshot || quotation.client || "Not linked"}
    </h3>

  </div>

  <div className="bg-slate-50 rounded-xl p-5 shadow-sm">

    <p className="text-sm text-gray-500">
      Project
    </p>

    <h3 className="text-xl font-bold mt-2">
      {quotation.projectNameSnapshot || quotation.project || "—"}
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
      {getCompanyCurrency()}
    </h3>

  </div>

</div>

        <hr className="quotation-print-separator my-8" />

        {/* Materials */}

        <h2 className="quotation-print-materials-title text-2xl font-bold mb-4">
          Materials
        </h2>

        <table className="quotation-print-materials w-full border border-collapse">

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

            {(quotation.materials || []).map((item) => (

              <tr key={item.id}>

                <td className="border p-2">
                  {item.description}
                </td>

                <td className="border p-2 text-center">
                  {item.quantity}
                </td>

                <td className="border p-2 text-right">
                  {formatCurrency(item.price)}
                </td>

                <td className="border p-2 text-right">
                  {formatCurrency(Number(item.quantity) * Number(item.price))}
                </td>

              </tr>

            ))}

          </tbody>

        </table>
        <div className="quotation-print-totals mt-10 flex justify-end">

  <div className="w-96 bg-white rounded-xl border shadow-lg p-6">
    {Number(quotation.labour) > 0 && <div className="flex justify-between py-2">
      <span>Labour</span>
      <span>
        {formatCurrency(quotation.labour)}
      </span>
    </div>}

    {Number(quotation.transport) > 0 && <div className="flex justify-between py-2">
      <span>Transport</span>
      <span>
        {formatCurrency(quotation.transport)}
      </span>
    </div>}

    {Number(quotation.discount) > 0 && <div className="flex justify-between py-2">
      <span>Discount</span>
      <span className="text-red-600">
        -{formatCurrency(quotation.discount)}
      </span>
    </div>}

    <hr className="my-4" />

    <div className="flex justify-between text-3xl font-bold text-green-700">
      <span>Grand Total</span>
      <span>
        {formatCurrency(quotation.total)}
      </span>
    </div>

  </div>
  </div>

{/* Action Buttons */}
<div className="no-print mt-8 flex flex-wrap justify-start gap-4 lg:justify-end">

  <button
    onClick={() => window.history.back()}
    className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg"
  >
    ← Back
  </button>

  {canShowCustomerDocumentActions && <button
    onClick={printQuotation}
    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
  >
    🖨 Print
  </button>}

  {canShowCustomerDocumentActions && <button
    onClick={downloadPdf}
    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
  >
    📄 Download PDF
  </button>}

</div>

</div>  

</MainLayout>
  );
}

export default QuotationDetails;
