import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { convertQuotationToInvoice } from "../../services/quotationToInvoice";
import { generateQuotationPDF } from "../../services/pdf/quotationPdf";
import { formatCurrency } from "../../utils/currency";
import {
  getClientDisplayName,
  getProjectDisplayName,
  relationshipIdsEqual,
  relationshipOptionValue,
} from "../../utils/relationships";
import { getQuotationRouteToken } from "../../utils/quotationIdentity";
import { isConvertedQuotation, isDraftQuotation, normalizeQuotationStatus } from "../../utils/quotationStatus";
import ConfirmDialog from "../common/ConfirmDialog";

function QuotationHistory({ onEdit }) {
  const {
    quotations,
    clients,
    projects,
    setQuotations,
    setInvoices,
  } = useApp();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [quotationToDelete, setQuotationToDelete] = useState(null);
  const [convertingQuotationId, setConvertingQuotationId] = useState(null);
  const conversionsInProgress = useRef(new Set());

  const filteredQuotations = quotations.filter((quotation) => {
    const text = search.toLowerCase();
    const useCurrentNames = isDraftQuotation(quotation);
    const clientName = getClientDisplayName(quotation, clients, { current: useCurrentNames });
    const projectName = getProjectDisplayName(quotation, projects, { current: useCurrentNames });

    return (
      clientName.toLowerCase().includes(text) ||
      projectName.toLowerCase().includes(text) ||
      (quotation.quotationNumber || "").toLowerCase().includes(text)
    );
  });

  function deleteQuotation() {
    if (!quotationToDelete) return;
    setQuotations((prev) =>
      prev.filter((quotation) => !relationshipIdsEqual(quotation.id, quotationToDelete.id))
    );
    showToast({
      type: "success",
      title: "Quotation deleted",
      message: "Quotation deleted successfully.",
    });
    setQuotationToDelete(null);
  }

  function convertQuotation(quotation) {
    const hasClient = Boolean(String(quotation.clientNameSnapshot || quotation.client || "").trim());
    if (isDraftQuotation(quotation) || !hasClient) {
      showToast({
        type: "warning",
        title: "Finalize quotation first",
        message: "Link a client and save this draft as a quotation before converting it.",
      });
      return;
    }

    const quotationKey = relationshipOptionValue(quotation.id) || quotation.quotationNumber;
    if (conversionsInProgress.current.has(quotationKey)) {
      return;
    }

    conversionsInProgress.current.add(quotationKey);
    setConvertingQuotationId(quotationKey);

    try {
      const { invoice, created } = convertQuotationToInvoice(quotation);

      setInvoices((prev) => prev.some((item) => relationshipIdsEqual(item.id, invoice.id))
        ? prev
        : [...prev, invoice]
      );

      setQuotations((prev) =>
        prev.map((item) =>
          relationshipIdsEqual(item.id, quotation.id)
            ? {
                ...item,
                status: "Converted",
              }
            : item
        )
      );

      showToast(created ? {
        type: "success",
        title: "Quotation converted",
        message: "Quotation converted successfully.",
      } : {
        type: "info",
        title: "Already converted",
        message: "This quotation has already been converted.",
      });
    } catch (error) {
      showToast({
        type: "error",
        title: "Conversion failed",
        message: error.message || "Unable to convert this quotation.",
      });
    } finally {
      conversionsInProgress.current.delete(quotationKey);
      setConvertingQuotationId(null);
    }
  }

  async function downloadQuotationPdf(quotation) {
    const hasClient = Boolean(String(quotation.clientNameSnapshot || quotation.client || "").trim());
    if (isDraftQuotation(quotation) || !hasClient || !String(quotation.quotationNumber || "").trim()) {
      showToast({
        type: "warning",
        title: "Finalize quotation first",
        message: "Link a client and save this draft as a quotation before generating a PDF.",
      });
      return;
    }

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

  function getStatusBadge(status) {
    switch (normalizeQuotationStatus(status)) {
      case "draft":
        return (
          <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-semibold">
            Draft
          </span>
        );

      case "accepted":
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
            Accepted
          </span>
        );

      case "rejected":
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
            Rejected
          </span>
        );

      case "converted":
        return (
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
            Converted
          </span>
        );

      case "sent":
        return (
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
            Sent
          </span>
        );

      default:
        return (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
            Pending
          </span>
        );
    }
  }

  return (
    <>
    <div className="mt-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">
          Saved Quotations
        </h2>

        <input
          type="text"
          placeholder="Search quotation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border px-4 py-2 sm:w-72"
        />
      </div>

      {filteredQuotations.length === 0 ? (
        <div className="border-2 border-dashed rounded-xl p-10 text-center text-gray-500">
          No quotations found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-[850px] w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3">Quotation No.</th>
              <th className="border p-3">Client</th>
              <th className="border p-3">Project</th>
              <th className="border p-3">Date</th>
              <th className="border p-3">Total</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredQuotations.map((quotation) => {
              const useCurrentNames = isDraftQuotation(quotation);
              const clientName = getClientDisplayName(quotation, clients, { current: useCurrentNames });
              const projectName = getProjectDisplayName(quotation, projects, { current: useCurrentNames });
              return (
              <tr
                key={relationshipOptionValue(quotation.id) || quotation.quotationNumber}
                className="hover:bg-gray-50"
              >
                <td className="border p-3 font-semibold">
                  {quotation.quotationNumber}
                </td>

                <td className="border p-3">
                  {clientName || "Not linked"}
                </td>

                <td className="border p-3">
                  {projectName || "—"}
                </td>

                <td className="border p-3">
                  {quotation.date || "-"}
                </td>

                <td className="border p-3 text-right">
                  {formatCurrency(quotation.total, { minimumFractionDigits: 2 })}
                </td>

                <td className="border p-3 text-center">
                  {getStatusBadge(quotation.status)}
                </td>

                <td className="border p-3">
                  <div className="flex flex-wrap gap-2 justify-center">
                   <Link
  to={`/quotation/${getQuotationRouteToken(quotation)}`}
  className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded"
>
  View
</Link>

                    {isDraftQuotation(quotation) && (
                      <button
                        onClick={() => onEdit(quotation)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                    )}

                    {!isDraftQuotation(quotation)
                      && String(quotation.clientNameSnapshot || quotation.client || "").trim()
                      && String(quotation.quotationNumber || "").trim() && <button
  onClick={() => downloadQuotationPdf(quotation)}
  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
>
  PDF
</button>}

                    <button
                      onClick={() => convertQuotation(quotation)}
                      disabled={isConvertedQuotation(quotation) || isDraftQuotation(quotation) || !String(quotation.clientNameSnapshot || quotation.client || "").trim() || convertingQuotationId === (relationshipOptionValue(quotation.id) || quotation.quotationNumber)}
                      className={`px-3 py-1 rounded text-white ${
                        isConvertedQuotation(quotation) || isDraftQuotation(quotation) || !String(quotation.clientNameSnapshot || quotation.client || "").trim() || convertingQuotationId === (relationshipOptionValue(quotation.id) || quotation.quotationNumber)
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {convertingQuotationId === (relationshipOptionValue(quotation.id) || quotation.quotationNumber) ? "Converting..." : "Convert"}
                    </button>

                    <button
                      onClick={() =>
                        setQuotationToDelete(quotation)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
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
    <ConfirmDialog
      isOpen={Boolean(quotationToDelete)}
      title="Delete Quotation?"
      message={`Are you sure you want to delete quotation ${quotationToDelete?.quotationNumber || ""}? This action cannot be undone.`}
      onCancel={() => setQuotationToDelete(null)}
      onConfirm={deleteQuotation}
      confirmLabel="Delete Quotation"
    />
    </>
  );
}

export default QuotationHistory;
