import Card from "../common/Card";

function CompanyInfo({ company, errors, onChange }) {
  return (
    <Card>
      <h2 className="text-xl font-semibold text-slate-800">Company Profile</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">Company Name<input name="name" value={company.name} onChange={onChange} className="mt-1 w-full rounded-lg border border-slate-300 p-3" />{errors.name && <span className="mt-1 block text-sm text-red-600">{errors.name}</span>}</label>
        <label className="text-sm font-medium text-slate-700">Business Slogan<input name="tagline" value={company.tagline} onChange={onChange} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label>
        <label className="text-sm font-medium text-slate-700 md:col-span-2">Street Address<input name="address" value={company.address} onChange={onChange} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label>
        <label className="text-sm font-medium text-slate-700">City<input name="city" value={company.city} onChange={onChange} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label>
        <label className="text-sm font-medium text-slate-700">Country<input name="country" value={company.country} onChange={onChange} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label>
        <label className="text-sm font-medium text-slate-700 md:col-span-2">Tax / VAT Number<input name="taxNumber" value={company.taxNumber} onChange={onChange} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label>
      </div>
    </Card>
  );
}

export default CompanyInfo;
