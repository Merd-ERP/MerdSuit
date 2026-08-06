function DashboardHeader() {
  const today = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Business at a glance</h2>
        <p className="text-sm text-slate-500">Track the parts of your business that need attention.</p>
      </div>
      <p className="text-sm font-medium text-slate-500">{today}</p>
    </div>
  );
}

export default DashboardHeader;
