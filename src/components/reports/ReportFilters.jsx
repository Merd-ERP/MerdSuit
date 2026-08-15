const filters = ["This Month", "Last Month", "All Time"];

function ReportFilters({ selectedFilter, onFilterChange }) {

  return (
    <div className="mb-6 flex flex-wrap gap-2" aria-label="Report date range">
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => onFilterChange(filter)}
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
