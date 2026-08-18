import Button from "../common/Button";
import SaveQuotationButton from "./SaveQuotationButton";
import { generateQuotationPDF } from "../../services/pdf/quotationPdf";
import { getCompanyCurrency } from "../../utils/currency";
import { useToast } from "../../context/ToastContext";

function QuotationQuickActions({ quotation, materials, labour, transport, discount, finalTotal, resetForm }) {
  const { showToast } = useToast();

  async function generatePdf() {
    try {
      await generateQuotationPDF({ ...quotation, materials, labour, transport, discount, total: finalTotal, currency: getCompanyCurrency() });
      showToast({ type: "success", title: "PDF generated", message: "Quotation PDF downloaded successfully." });
    } catch {
      showToast({ type: "error", title: "PDF generation failed", message: "Unable to generate the quotation PDF." });
    }
  }
  return <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-6"><Button variant="danger" onClick={generatePdf}>Generate PDF</Button><SaveQuotationButton quotation={quotation} materials={materials} labour={labour} transport={transport} discount={discount} finalTotal={finalTotal} resetForm={resetForm} /></div>;
}

export default QuotationQuickActions;
