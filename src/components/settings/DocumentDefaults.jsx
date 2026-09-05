import Card from "../common/Card";

function DocumentDefaults({ company, errors = {}, onChange }) {
  return <Card><h2 className="text-xl font-semibold text-slate-800">Document Defaults</h2><div className="mt-5 grid gap-4 md:grid-cols-3"><label className="text-sm font-medium text-slate-700">Invoice Prefix<input name="invoicePrefix" value={company.invoicePrefix} onChange={onChange} maxLength={10} className="mt-1 w-full rounded-lg border border-slate-300 p-3" />{errors.invoicePrefix && <span className="mt-1 block text-sm text-red-600">{errors.invoicePrefix}</span>}</label><label className="text-sm font-medium text-slate-700">Quotation Prefix<input name="quotationPrefix" value={company.quotationPrefix} onChange={onChange} maxLength={10} className="mt-1 w-full rounded-lg border border-slate-300 p-3" />{errors.quotationPrefix && <span className="mt-1 block text-sm text-red-600">{errors.quotationPrefix}</span>}</label><label className="text-sm font-medium text-slate-700">Payment Terms (days)<input name="paymentTerms" type="number" min="0" max="3650" step="1" value={company.paymentTerms} onChange={onChange} className="mt-1 w-full rounded-lg border border-slate-300 p-3" />{errors.paymentTerms && <span className="mt-1 block text-sm text-red-600">{errors.paymentTerms}</span>}</label></div></Card>;
}

export default DocumentDefaults;
