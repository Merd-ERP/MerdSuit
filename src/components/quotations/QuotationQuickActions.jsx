import Button from "../common/Button";
import SaveQuotationButton from "./SaveQuotationButton";
import { generateQuotationPDF } from "../../services/pdf/quotationPdf";
import { getCompanyCurrency } from "../../utils/currency";

function QuotationQuickActions({ quotation, materials, labour, transport, discount, finalTotal, resetForm }) {
  function generatePdf() { generateQuotationPDF({ ...quotation, materials, labour, transport, discount, total: finalTotal, currency: getCompanyCurrency() }); }
  return <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-6"><Button variant="danger" onClick={generatePdf}>Generate PDF</Button><SaveQuotationButton quotation={quotation} materials={materials} labour={labour} transport={transport} discount={discount} finalTotal={finalTotal} resetForm={resetForm} /></div>;
}

export default QuotationQuickActions;
