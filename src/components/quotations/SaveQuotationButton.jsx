import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { generateQuotationNumber } from "../../services/quotationService";
import Button from "../common/Button";
import { hasMeaningfulQuotationItems } from "../../utils/quotationItems";

function SaveQuotationButton({
  quotation,
  materials,
  labour,
  transport,
  discount,
  finalTotal,
  resetForm,
  editingQuotation,
  asDraft = false,
}) {
  const { setQuotations } = useApp();
  const { showToast } = useToast();

  function handleSave() {
    const hasValidItems = hasMeaningfulQuotationItems(materials);

    if (asDraft && !hasValidItems) {
      showToast({
        type: "warning",
        title: "Item required",
        message: "Add at least one item before saving this draft.",
      });
      return;
    }

    if (!asDraft && !quotation.client) {
      showToast({
        type: "warning",
        title: "Client required",
        message: "Please select a client before saving the quotation.",
      });
      return;
    }

    if (!asDraft && !hasValidItems) {
      showToast({
        type: "warning",
        title: "Item required",
        message: "Add at least one item before saving this quotation.",
      });
      return;
    }

    const savedQuotation = {
      ...(editingQuotation || {}),
      id: editingQuotation?.id || Date.now(),
      quotationNumber: editingQuotation?.quotationNumber || generateQuotationNumber(),
      ...quotation,
      materials,
      labour: Number(labour || 0),
      transport: Number(transport || 0),
      discount: Number(discount || 0),
      total: finalTotal,
      status: asDraft ? "Draft" : "Pending",
      createdAt: editingQuotation?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setQuotations((currentQuotations) => editingQuotation
      ? currentQuotations.map((item) =>
          item.id === editingQuotation.id ? savedQuotation : item
        )
      : [...currentQuotations, savedQuotation]
    );

    showToast({
      type: "success",
      title: asDraft ? "Draft saved" : "Quotation saved",
      message: asDraft
        ? "Quotation draft saved successfully."
        : "Quotation saved successfully.",
    });

    resetForm();
  }

  return (
    <Button
      onClick={handleSave}
      variant={asDraft ? "secondary" : "primary"}
      className="px-6 py-3 font-semibold"
    >
      {asDraft ? "Save Draft" : "Save Quotation"}
    </Button>
  );
}

export default SaveQuotationButton;
