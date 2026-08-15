import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Card from "../common/Card";
import Button from "../common/Button";
import { money } from "./reportData";
import regularPdfFontUrl from "../../assets/fonts/SegoeUI.ttf?url";
import boldPdfFontUrl from "../../assets/fonts/SegoeUI-Bold.ttf?url";

const csvCell = (value) => `"${String(value).replaceAll('"', '""')}"`;
const pdfFontName = "MerdSuiteUnicode";
let pdfFontData;

function excelSafeDate(value) {
  const date = String(value || "");

  // Keep ISO dates visible as text when Excel/WPS opens the CSV instead of
  // applying a narrow, locale-specific date format that displays ########.
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? `="${date}"` : value;
}

async function fontAsBase64(fontUrl) {
  const response = await fetch(fontUrl);
  const bytes = new Uint8Array(await response.arrayBuffer());
  let binary = "";

  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }

  return window.btoa(binary);
}

async function registerPdfFont(doc) {
  pdfFontData ??= Promise.all([fontAsBase64(regularPdfFontUrl), fontAsBase64(boldPdfFontUrl)]);
  const [regular, bold] = await pdfFontData;

  doc.addFileToVFS("SegoeUI.ttf", regular);
  doc.addFileToVFS("SegoeUI-Bold.ttf", bold);
  doc.addFont("SegoeUI.ttf", pdfFontName, "normal");
  doc.addFont("SegoeUI-Bold.ttf", pdfFontName, "bold");
  doc.setFont(pdfFontName, "normal");
}

function ExportActions({ report, period, metrics }) {
  function printReport() {
    window.print();
  }

  function exportCsv() {
    const content = `\uFEFF${[report.headers, ...report.rawRows]
      .map((row, rowIndex) => row
        .map((value, columnIndex) => csvCell(
          rowIndex > 0 && /date/i.test(report.headers[columnIndex]) ? excelSafeDate(value) : value,
        ))
        .join(","))
      .join("\r\n")}`;
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${report.title.toLowerCase().replaceAll(" ", "-")}-${period.toLowerCase().replaceAll(" ", "-")}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function exportPdf() {
    const company = JSON.parse(localStorage.getItem("company")) || {};
    const doc = new jsPDF("p", "mm", "a4");
    await registerPdfFont(doc);
    const width = doc.internal.pageSize.getWidth();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, width, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text(company.name || "MerdSuite", 14, 15);
    doc.setFontSize(10);
    doc.text(`${report.title} • ${period}`, 14, 23);
    doc.setTextColor(15, 23, 42);
    autoTable(doc, {
      startY: 38,
      body: [["Revenue", money(metrics.revenue)], ["Expenses", money(metrics.totalExpenses)], ["Outstanding", money(metrics.outstanding)], ["Profit", money(metrics.profit)]],
      theme: "grid",
      styles: { font: pdfFontName, fontSize: 9, cellPadding: 3 },
      columnStyles: { 0: { fontStyle: "bold", fillColor: [241, 245, 249] }, 1: { halign: "right" } },
      margin: { left: 14, right: 14 },
    });
    const startY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(report.title, 14, startY);
    autoTable(doc, {
      startY: startY + 5,
      head: [report.headers],
      body: report.rows,
      theme: "grid",
      styles: { font: pdfFontName, fontSize: 8, cellPadding: 2, overflow: "linebreak" },
      headStyles: { font: pdfFontName, fontStyle: "bold", fillColor: [30, 64, 175], textColor: 255 },
      margin: { left: 14, right: 14 },
    });
    doc.save(`${report.title.toLowerCase().replaceAll(" ", "-")}-${period.toLowerCase().replaceAll(" ", "-")}.pdf`);
  }

  return <Card className="no-print mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-semibold text-slate-800">Export Reports</h2><p className="mt-1 text-sm text-slate-500">Print or download the selected report.</p></div><div className="flex flex-wrap gap-2"><Button variant="secondary" onClick={printReport}>Print</Button><Button variant="danger" onClick={exportPdf}>Export PDF</Button><Button variant="success" onClick={exportCsv}>Export CSV</Button></div></Card>;
}

export default ExportActions;
