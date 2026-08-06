function EmptyReport() {
  return (
    <div className="rounded-xl bg-slate-50 px-6 py-12 text-center">
      <p className="font-medium text-slate-700">No report data available.</p>
      <p className="mt-1 text-sm text-slate-500">
        Create invoices, payments or expenses to populate this report.
      </p>
    </div>
  );
}

export default EmptyReport;
