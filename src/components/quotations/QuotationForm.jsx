import {
  isArchivedRecord,
  findByRelationshipOptionValue,
  getClientOptionLabel,
  getProjectOptionLabel,
  relationshipIdsEqual,
  relationshipOptionValue,
  resolveClient,
  resolveProject,
} from "../../utils/relationships";

function QuotationForm({ quotation, setQuotation, clients, projects }) {
  const selectedClient = resolveClient(quotation, clients);
  const selectedProject = resolveProject(quotation, projects);
  const selectedClientId = relationshipOptionValue(selectedClient?.id);
  const selectedProjectId = relationshipOptionValue(selectedProject?.id);

  const availableClients = clients.filter(
    (client) => !isArchivedRecord(client) || relationshipIdsEqual(client.id, selectedClient?.id)
  );
  const availableProjects = projects.filter((project) => {
    const isSelectedProject = relationshipIdsEqual(project.id, selectedProject?.id);
    if (isArchivedRecord(project) && !isSelectedProject) {
      return false;
    }

    const projectClient = resolveClient(project, clients);
    if (projectClient && isArchivedRecord(projectClient) && !isSelectedProject) {
      return false;
    }
    if (!selectedClient) return true;

    return projectClient
      ? relationshipIdsEqual(projectClient.id, selectedClient.id)
      : false;
  });

  function changeClient(clientOptionValue) {
    const client = findByRelationshipOptionValue(clients, clientOptionValue);
    const projectClient = selectedProject ? resolveClient(selectedProject, clients) : null;
    const keepProject = !selectedProject
      || (client && projectClient && relationshipIdsEqual(client.id, projectClient.id));

    setQuotation({
      ...quotation,
      clientId: client?.id ?? "",
      client: client?.name || "",
      clientNameSnapshot: client?.name || "",
      projectId: keepProject ? selectedProject?.id ?? "" : "",
      project: keepProject ? selectedProject?.name || "" : "",
      projectNameSnapshot: keepProject ? selectedProject?.name || "" : "",
    });
  }

  function changeProject(projectOptionValue) {
    const project = findByRelationshipOptionValue(projects, projectOptionValue);
    if (!project) {
      setQuotation({
        ...quotation,
        projectId: "",
        project: "",
        projectNameSnapshot: "",
      });
      return;
    }

    const projectClient = resolveClient(project, clients);
    setQuotation({
      ...quotation,
      projectId: project.id,
      project: project.name,
      projectNameSnapshot: project.name,
      clientId: projectClient?.id ?? quotation.clientId ?? "",
      client: projectClient?.name || quotation.clientNameSnapshot || quotation.client || "",
      clientNameSnapshot: projectClient?.name || quotation.clientNameSnapshot || quotation.client || "",
    });
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <select value={selectedClientId} onChange={(event) => changeClient(event.target.value)} className="rounded-lg border p-2">
        <option value="">Select Client</option>
        {availableClients.map((client) => <option key={relationshipOptionValue(client.id)} value={relationshipOptionValue(client.id)}>{getClientOptionLabel(client)}</option>)}
      </select>

      <select value={selectedProjectId} onChange={(event) => changeProject(event.target.value)} className="rounded-lg border p-2">
        <option value="">No Project</option>
        {availableProjects.map((project) => <option key={relationshipOptionValue(project.id)} value={relationshipOptionValue(project.id)}>{getProjectOptionLabel(project, clients)}</option>)}
      </select>

      <input type="date" value={quotation.date} onChange={(event) => setQuotation({ ...quotation, date: event.target.value })} className="rounded-lg border p-2" />
    </div>
  );
}

export default QuotationForm;
