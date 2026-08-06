import { useState } from "react";

const filters = ["Today", "This Week", "This Month", "This Year", "Custom Range"];

function ReportFilters() {
  const [selectedFilter, setSelectedFilter] = useState("This Month");

  return (
    <div className="mb-6 flex flex-wrap gap-2" aria-label="Report date range">
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => setSelectedFilter(filter)}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
            selectedFilter === filter
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white text-slate-600 shadow hover:bg-slate-50"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

export default ReportFilters;
