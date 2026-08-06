import Card from "../common/Card";

function ContactInfo({ company, errors, onChange }) {
  return (
    <Card>
      <h2 className="text-xl font-semibold text-slate-800">Contact Information</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">Phone Number<input name="phone" value={company.phone} onChange={onChange} className="mt-1 w-full rounded-lg border border-slate-300 p-3" />{errors.phone && <span className="mt-1 block text-sm text-red-600">{errors.phone}</span>}</label>
        <label className="text-sm font-medium text-slate-700">Email Address<input name="email" type="email" value={company.email} onChange={onChange} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label>
        <label className="text-sm font-medium text-slate-700 md:col-span-2">Website<input name="website" value={company.website} onChange={onChange} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label>
      </div>
    </Card>
  );
}

export default ContactInfo;
