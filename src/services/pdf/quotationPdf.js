import {
  createPDF,
  addCompanyHeader,
  addFooter,
  autoTable,
  pdfFontName,
  registerPdfFont,
} from "./pdfUtils";
import { formatCurrency } from "../../utils/currency";

export async function generateQuotationPDF(quotation) {
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
    `Client: ${quotation.client}`,
    15,
    70
  );

  doc.text(
    `Project: ${quotation.project}`,
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

 body: quotation.materials.map((item) => [
  item.description,
  item.quantity,
  formatCurrency(item.price),
  formatCurrency(item.quantity * item.price),
]),
    styles: { font: pdfFontName },
    headStyles: { font: pdfFontName, fontStyle: "bold" },
  });

  const finalY = ((doc.lastAutoTable && doc.lastAutoTable.finalY) || 90) + 10;

  doc.setFont(pdfFontName, "bold");

  doc.text(
    `Grand Total: ${formatCurrency(quotation.total)}`,
    150,
    finalY,
    {
      align: "right",
    }
  );

  addFooter(doc);

  doc.save(
    `Quotation-${quotation.client}.pdf`
  );
}
