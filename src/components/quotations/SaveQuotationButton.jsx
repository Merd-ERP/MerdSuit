import { useApp } from "../../context/AppContext";
import { generateQuotationNumber } from "../../services/quotationService";

function SaveQuotationButton({
  quotation,
  materials,
  labour,
  transport,
  discount,
  finalTotal,
  resetForm,
}) {
  const { quotations, setQuotations } = useApp();

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
      labour: Number(labour || 0),
      transport: Number(transport || 0),
      discount: Number(discount || 0),
      total: finalTotal,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    setQuotations([...quotations, newQuotation]);

    alert("✅ Quotation saved successfully!");

    resetForm();
  }

  return (
    <button
      onClick={handleSave}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
    >
      💾 Save Quotation
    </button>
  );
}

export default SaveQuotationButton;