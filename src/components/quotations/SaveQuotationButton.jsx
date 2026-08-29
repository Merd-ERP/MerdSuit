import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { generateQuotationNumber } from "../../services/quotationService.js";
import Button from "../common/Button";
import { validateAndNormalizeQuotationValues } from "../../utils/quotationItems";
import { isArchivedRecord, relationshipIdsEqual, resolveClient, resolveProject } from "../../utils/relationships";

function SaveQuotationButton({
  quotation,
  materials,
  labour,
  transport,
  discount,
  resetForm,
  editingQuotation,
  asDraft = false,
}) {
  const { clients, projects, quotations, setQuotations } = useApp();
  const { showToast } = useToast();

  function handleSave() {
    const currentClient = resolveClient(quotation, clients);
    const currentProject = resolveProject(quotation, projects);
    const validation = validateAndNormalizeQuotationValues({ materials, labour, transport, discount });

    if (asDraft && !validation.valid) {
      showToast({
        type: "warning",
        title: "Quotation needs attention",
        message: validation.message === "Add at least one meaningful item or service."
          ? "Add at least one item before saving this draft."
          : validation.message,
      });
      return;
    }

    if (!asDraft && !currentClient) {
      showToast({
        type: "warning",
        title: "Client required",
        message: "Please select a client before saving the quotation.",
      });
      return;
    }

    if (!asDraft && isArchivedRecord(currentClient)) {
      showToast({
        type: "warning",
        title: "Restore client first",
        message: "Restore the archived client before finalizing this quotation.",
      });
      return;
    }

    if (!asDraft && currentProject && isArchivedRecord(currentProject)) {
      showToast({
        type: "warning",
        title: "Restore or remove project",
        message: "Restore the archived project or remove it before finalizing this quotation.",
      });
      return;
    }

    if (!asDraft && !validation.valid) {
      showToast({
        type: "warning",
        title: "Quotation needs attention",
        message: validation.message === "Add at least one meaningful item or service."
          ? "Add at least one item before saving this quotation."
          : validation.message,
      });
      return;
    }

    const quotationNumber = editingQuotation?.quotationNumber || generateQuotationNumber(quotations);

    const savedQuotation = {
      ...(editingQuotation || {}),
      id: editingQuotation?.id ?? Date.now(),
      quotationNumber,
      ...quotation,
      clientId: currentClient?.id ?? "",
      client: currentClient?.name || quotation.clientNameSnapshot || quotation.client || "",
      clientNameSnapshot: currentClient?.name || quotation.clientNameSnapshot || quotation.client || "",
      projectId: currentProject?.id ?? "",
      project: currentProject?.name || quotation.projectNameSnapshot || quotation.project || "",
      projectNameSnapshot: currentProject?.name || quotation.projectNameSnapshot || quotation.project || "",
      materials: validation.materials,
      labour: validation.labour,
      transport: validation.transport,
      discount: validation.discount,
      total: validation.total,
      status: asDraft ? "Draft" : "Pending",
      createdAt: editingQuotation?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setQuotations((currentQuotations) => editingQuotation
      ? currentQuotations.map((item) =>
          relationshipIdsEqual(item.id, editingQuotation.id) ? savedQuotation : item
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
