import SaveQuotationButton from "./SaveQuotationButton";

function QuotationQuickActions({
  quotation,
  materials,
  labour,
  transport,
  discount,
  resetForm,
  editingQuotation,
}) {
  const sharedProps = {
    quotation,
    materials,
    labour,
    transport,
    discount,
    resetForm,
    editingQuotation,
  };

  return (
    <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-6">
      <SaveQuotationButton {...sharedProps} asDraft />
      <SaveQuotationButton {...sharedProps} />
    </div>
  );
}

export default QuotationQuickActions;
