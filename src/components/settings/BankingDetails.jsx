import Card from "../common/Card";

function BankingDetails({ company, onChange }) {
  return <Card><h2 className="text-xl font-semibold text-slate-800">Banking Details</h2><div className="mt-5 grid gap-4 md:grid-cols-2"><label className="text-sm font-medium text-slate-700">Bank Name<input name="bankName" value={company.bankName} onChange={onChange} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label><label className="text-sm font-medium text-slate-700">Account Name<input name="bankAccountName" value={company.bankAccountName} onChange={onChange} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label><label className="text-sm font-medium text-slate-700">Account Number<input name="bankAccountNumber" value={company.bankAccountNumber} onChange={onChange} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label><label className="text-sm font-medium text-slate-700">Branch<input name="bankBranch" value={company.bankBranch} onChange={onChange} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label></div></Card>;
}

export default BankingDetails;
