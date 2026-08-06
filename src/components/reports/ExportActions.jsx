import Card from "../common/Card";

function ExportActions() {
  return (
    <Card className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><h2 className="text-lg font-semibold text-slate-800">Export Reports</h2><p className="mt-1 text-sm text-slate-500">Export options will be available soon.</p></div>
      <div className="flex flex-wrap gap-2"><button type="button" className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800">Print</button><button type="button" className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700">Export PDF</button><button type="button" className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700">Export CSV</button></div>
    </Card>
  );
}

export default ExportActions;
