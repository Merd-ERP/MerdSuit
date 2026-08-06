import Card from "../common/Card";

function Currency({ company, onChange }) {
  return <Card><h2 className="text-xl font-semibold text-slate-800">Currency</h2><label className="mt-5 block text-sm font-medium text-slate-700">Default Currency<select name="currency" value={company.currency} onChange={onChange} className="mt-1 w-full max-w-md rounded-lg border border-slate-300 p-3"><option value="GH₵">Ghana Cedi (GH₵)</option><option value="$">US Dollar ($)</option><option value="£">British Pound (£)</option><option value="€">Euro (€)</option></select></label></Card>;
}

export default Currency;
