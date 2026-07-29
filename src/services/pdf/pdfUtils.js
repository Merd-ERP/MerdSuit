import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Create a new PDF document
 */
export function createPDF() {
  return new jsPDF("p", "mm", "a4");
}

/**
 * Load company information from localStorage
 */
export function getCompany() {
  const company = JSON.parse(localStorage.getItem("company"));

  return (
    company || {
      name: "",
      tagline: "",
      phone: "",
      email: "",
      website: "",
      address: "",
      city: "",
      country: "",
      currency: "GH₵",
      taxNumber: "",
      logo: "",
    }
  );
}

/**
 * Add company header
 */
export function addCompanyHeader(doc) {
  const company = getCompany();

  if (company.logo) {
    try {
      doc.addImage(company.logo, "PNG", 15, 10, 25, 25);
    } catch (err) {
      console.error("Logo error:", err);
    }
  }

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(company.name || "Company Name", 45, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  let y = 24;

  if (company.tagline) {
    doc.text(company.tagline, 45, y);
    y += 5;
  }

  doc.text(
    `${company.phone}   ${company.email}`,
    45,
    y
  );

  y += 5;

  doc.text(
    `${company.address}, ${company.city}, ${company.country}`,
    45,
    y
  );

  doc.line(15, 40, 195, 40);
}

/**
 * Footer
 */
export function addFooter(doc) {
  const pageCount = doc.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    doc.setFontSize(9);

    doc.text(
      `Page ${i} of ${pageCount}`,
      180,
      290,
      {
        align: "right",
      }
    );
  }
}

export { autoTable };