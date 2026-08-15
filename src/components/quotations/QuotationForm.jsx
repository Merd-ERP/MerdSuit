function QuotationForm({
  quotation,
  setQuotation,
  projects,
}) {
  return (
    <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-3">

      <input
        type="text"
        placeholder="Client Name"
        value={quotation.client}
        readOnly
        className="border rounded-lg p-2 bg-gray-100"
      />

      <select
        value={quotation.project}
        onChange={(e) => {
          const selectedProject = projects.find(
            (project) => project.name === e.target.value
          );

          setQuotation({
            ...quotation,
            project: selectedProject?.name || "",
            client: selectedProject?.client || "",
            date: quotation.date,
          });
        }}
        className="border rounded-lg p-2"
      >
        <option value="">Select Project</option>

        {projects.map((project) => (
          <option
            key={project.id}
            value={project.name}
          >
            {project.name}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={quotation.date}
        onChange={(e) =>
          setQuotation({
            ...quotation,
            date: e.target.value,
          })
        }
        className="border rounded-lg p-2"
      />

    </div>
  );
}

export default QuotationForm;
