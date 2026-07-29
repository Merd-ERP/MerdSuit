import {
  createPDF,
  addCompanyHeader,
  addFooter,
  autoTable,
} from "./pdfUtils";

export function generateQuotationPDF(quotation) {
  const doc = createPDF();

  addCompanyHeader(doc);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("QUOTATION", 105, 55, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
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
  `${quotation.currency || "GH₵"} ${item.price.toLocaleString()}`,
  `${quotation.currency || "GH₵"} ${(item.quantity * item.price).toLocaleString()}`,
]),
  });

  const finalY = ((doc.lastAutoTable && doc.lastAutoTable.finalY) || 90) + 10;

  doc.setFont("helvetica", "bold");

  doc.text(
    `Grand Total: ${quotation.currency || "GH₵"} ${quotation.total.toLocaleString()}`,
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