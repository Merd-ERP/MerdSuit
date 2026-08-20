function QuotationForm({
  quotation,
  setQuotation,
  clients,
  projects,
}) {
  const selectedClientId = quotation.clientId
    || clients.find((client) => client.name === quotation.client)?.id
    || "";

  function changeClient(clientId) {
    const client = clients.find((item) => String(item.id) === clientId);
    const selectedProject = projects.find((project) => project.name === quotation.project);
    const projectMatchesClient = !selectedProject
      || String(selectedProject.clientId || "") === clientId
      || selectedProject.client === client?.name;

    setQuotation({
      ...quotation,
      clientId: client?.id || "",
      client: client?.name || "",
      project: projectMatchesClient ? quotation.project : "",
    });
  }

  function changeProject(projectName) {
    const selectedProject = projects.find((project) => project.name === projectName);
    if (!selectedProject) {
      setQuotation({ ...quotation, project: "" });
      return;
    }

    const projectClient = clients.find((client) =>
      String(client.id) === String(selectedProject.clientId)
      || client.name === selectedProject.client
    );

    setQuotation({
      ...quotation,
      project: selectedProject.name,
      clientId: projectClient?.id || selectedProject.clientId || quotation.clientId || "",
      client: projectClient?.name || selectedProject.client || quotation.client,
    });
  }

  const availableProjects = selectedClientId || quotation.client
    ? projects.filter((project) =>
        String(project.clientId || "") === String(selectedClientId)
        || project.client === quotation.client
      )
    : projects;

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <select
        value={selectedClientId}
        onChange={(event) => changeClient(event.target.value)}
        className="rounded-lg border p-2"
      >
        <option value="">Select Client</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>{client.name}</option>
        ))}
      </select>

      <select
        value={quotation.project}
        onChange={(event) => changeProject(event.target.value)}
        className="rounded-lg border p-2"
      >
        <option value="">No Project</option>
        {availableProjects.map((project) => (
          <option key={project.id} value={project.name}>{project.name}</option>
        ))}
      </select>

      <input
        type="date"
        value={quotation.date}
        onChange={(event) => setQuotation({
          ...quotation,
          date: event.target.value,
        })}
        className="rounded-lg border p-2"
      />
    </div>
  );
}

export default QuotationForm;
