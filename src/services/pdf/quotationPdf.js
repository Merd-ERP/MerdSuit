import {
  createPDF,
  addCompanyHeader,
  addFooter,
  autoTable,
  pdfFontName,
  registerPdfFont,
} from "./pdfUtils";
import { formatCurrency } from "../../utils/currency";
import { validateAndNormalizeQuotationValues } from "../../utils/quotationItems";
import { isDraftQuotation } from "../../utils/quotationStatus";

export async function generateQuotationPDF(quotation) {
  if (
    isDraftQuotation(quotation)
    || !String(quotation?.quotationNumber || "").trim()
    || !String(quotation?.clientNameSnapshot || quotation?.client || "").trim()
  ) {
    throw new Error("Only saved, finalized quotations can be exported.");
  }
  const validation = validateAndNormalizeQuotationValues({
    materials: quotation.materials || [],
    labour: quotation.labour,
    transport: quotation.transport,
    discount: quotation.discount,
    expectedTotal: quotation.total,
  });
  if (!validation.valid) throw new Error(validation.message);

  const doc = createPDF();
  await registerPdfFont(doc);

  addCompanyHeader(doc);

  doc.setFont(pdfFontName, "bold");
  doc.setFontSize(18);
  doc.text("QUOTATION", 105, 55, {
    align: "center",
  });

  doc.setFont(pdfFontName, "normal");
  doc.setFontSize(11);

  doc.text(
    `Client: ${quotation.clientNameSnapshot || quotation.client || ""}`,
    15,
    70
  );

  doc.text(
    `Project: ${quotation.projectNameSnapshot || quotation.project || ""}`,
    15,
    77
  );

  doc.text(
    `Date: ${quotation.date}`,
    150,
    70
  );

  autoTable(doc, {
    startY: 90,

    head: [[
      "Description",
      "Qty",
      "Unit Price",
      "Total",
    ]],

 body: validation.materials.map((item) => [
  item.description,
  item.quantity,
  formatCurrency(item.price),
  formatCurrency(item.quantity * item.price),
]),
    styles: { font: pdfFontName },
    headStyles: { font: pdfFontName, fontStyle: "bold" },
  });

  let finalY = ((doc.lastAutoTable && doc.lastAutoTable.finalY) || 90) + 10;

  doc.setFont(pdfFontName, "normal");
  const rows = [
    ["Materials subtotal", validation.materialTotal],
    ...(validation.labour > 0 ? [["Labour", validation.labour]] : []),
    ...(validation.transport > 0 ? [["Transport", validation.transport]] : []),
    ...(validation.discount > 0 ? [["Discount", -validation.discount]] : []),
  ];
  rows.forEach(([label, amount]) => {
    doc.text(label, 135, finalY);
    doc.text(formatCurrency(amount), 195, finalY, { align: "right" });
    finalY += 7;
  });

  doc.setFont(pdfFontName, "bold");
  doc.text(
    `Grand Total: ${formatCurrency(validation.total)}`,
    195,
    finalY,
    {
      align: "right",
    }
  );

  addFooter(doc);

  doc.save(
    `Quotation-${quotation.clientNameSnapshot || quotation.client}.pdf`
  );
}
