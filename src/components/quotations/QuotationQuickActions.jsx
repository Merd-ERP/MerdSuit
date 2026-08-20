import Button from "../common/Button";
import SaveQuotationButton from "./SaveQuotationButton";
import { generateQuotationPDF } from "../../services/pdf/quotationPdf";
import { getCompanyCurrency } from "../../utils/currency";
import { useToast } from "../../context/ToastContext";

function QuotationQuickActions({
  quotation,
  materials,
  labour,
  transport,
  discount,
  finalTotal,
  resetForm,
  editingQuotation,
}) {
  const { showToast } = useToast();

  async function generatePdf() {
    if (!quotation.client) {
      showToast({
        type: "warning",
        title: "Client required",
        message: "Link a client and save the quotation before generating a PDF.",
      });
      return;
    }

    if (editingQuotation?.status === "Draft") {
      showToast({
        type: "warning",
        title: "Finalize quotation first",
        message: "Save this draft as a quotation before generating a PDF.",
      });
      return;
    }

    try {
      await generateQuotationPDF({
        ...quotation,
        materials,
        labour,
        transport,
        discount,
        total: finalTotal,
        currency: getCompanyCurrency(),
      });
      showToast({ type: "success", title: "PDF generated", message: "Quotation PDF downloaded successfully." });
    } catch {
      showToast({ type: "error", title: "PDF generation failed", message: "Unable to generate the quotation PDF." });
    }
  }

  const sharedProps = {
    quotation,
    materials,
    labour,
    transport,
    discount,
    finalTotal,
    resetForm,
    editingQuotation,
  };

  return (
    <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-6">
      <Button variant="danger" onClick={generatePdf}>Generate PDF</Button>
      <SaveQuotationButton {...sharedProps} asDraft />
      <SaveQuotationButton {...sharedProps} />
    </div>
  );
}

export default QuotationQuickActions;
