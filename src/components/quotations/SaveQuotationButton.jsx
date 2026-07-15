import {
  saveQuotation,
  generateQuotationNumber,
} from "../../services/quotationService";

function SaveQuotationButton({
  quotation,
  materials,
  labour,
  transport,
  discount,
  finalTotal,
  resetForm,
}) {
  function handleSave() {
    if (!quotation.client || !quotation.project) {
      alert("Please select a client and project.");
      return;
    }

    if (materials.length === 0) {
      alert("Please add at least one material.");
      return;
    }

    const newQuotation = {
      id: Date.now(),
      quotationNumber: generateQuotationNumber(),
      ...quotation,
      materials,
      labour: Number(labour),
      transport: Number(transport),
      discount: Number(discount),
      total: finalTotal,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    saveQuotation(newQuotation);

    alert("Quotation saved successfully!");

    resetForm();
  }

  return (
    <button
      onClick={handleSave}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
    >
      Save Quotation
    </button>
  );
}

export default SaveQuotationButton;