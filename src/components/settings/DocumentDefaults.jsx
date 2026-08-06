import Card from "../common/Card";

function DocumentDefaults({ company, onChange }) {
  return <Card><h2 className="text-xl font-semibold text-slate-800">Document Defaults</h2><div className="mt-5 grid gap-4 md:grid-cols-3"><label className="text-sm font-medium text-slate-700">Invoice Prefix<input name="invoicePrefix" value={company.invoicePrefix} onChange={onChange} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label><label className="text-sm font-medium text-slate-700">Quotation Prefix<input name="quotationPrefix" value={company.quotationPrefix} onChange={onChange} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label><label className="text-sm font-medium text-slate-700">Payment Terms (days)<input name="paymentTerms" type="number" min="0" value={company.paymentTerms} onChange={onChange} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label></div></Card>;
}

export default DocumentDefaults;
