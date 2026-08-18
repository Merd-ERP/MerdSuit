import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
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
  const { showToast } = useToast();

  function handleSave() {
    if (!quotation.client || !quotation.project) {
      showToast({
        type: "warning",
        title: "Client and project required",
        message: "Please select a client and project.",
      });
      return;
    }

    if (materials.length === 0) {
      showToast({
        type: "warning",
        title: "Materials required",
        message: "Please add at least one material.",
      });
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

    showToast({
      type: "success",
      title: "Quotation saved",
      message: "Quotation saved successfully.",
    });

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
