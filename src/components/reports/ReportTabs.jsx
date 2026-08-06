const tabs = [
  { id: "sales", label: "Sales" },
  { id: "invoices", label: "Invoices" },
  { id: "payments", label: "Payments" },
  { id: "expenses", label: "Expenses" },
  { id: "inventory", label: "Inventory" },
];

function ReportTabs({ activeTab, onTabChange }) {
  return (
    <div className="mb-6 overflow-x-auto border-b border-slate-200">
      <div className="flex min-w-max gap-2" role="tablist" aria-label="Report types">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ReportTabs;
