import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import Card from "../common/Card";
import Button from "../common/Button";

const emptyProject = { name: "", client: "", clientId: "", location: "", budget: "", status: "Planning", description: "" };
function ProjectForm({ projectToEdit, setProjectToEdit }) {
  const { clients, setProjects } = useApp(); const { showToast } = useToast();
  const [project, setProject] = useState(() => projectToEdit || emptyProject); const editingId = projectToEdit?.id;
  function changeClient(clientId) { const client = clients.find((item) => String(item.id) === clientId); setProject({ ...project, clientId: clientId ? Number(clientId) : "", client: client?.name || "" }); }
  function reset() { setProject(emptyProject); setProjectToEdit(null); }
  function save() { if (!project.name.trim()) return; const record = { ...project, id: editingId || Date.now() }; if (editingId) { setProjects((items) => items.map((item) => item.id === editingId ? record : item)); showToast({ type: "success", title: "Project updated", message: "Project updated successfully" }); } else { setProjects((items) => [...items, record]); showToast({ type: "success", title: "Project saved", message: "Project added successfully" }); } reset(); }
  const selectedClientId = project.clientId || clients.find((item) => item.name === project.client)?.id || "";
  return <Card className="mb-6"><h2 className="text-xl font-semibold">{editingId ? "Edit Project" : "Add Project"}</h2><div className="mt-4 grid gap-4 md:grid-cols-2"><input placeholder="Project Name" value={project.name} onChange={(event) => setProject({ ...project, name: event.target.value })} className="rounded-lg border p-3" /><select value={selectedClientId} onChange={(event) => changeClient(event.target.value)} className="rounded-lg border p-3"><option value="">Select Client</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select><input placeholder="Location" value={project.location} onChange={(event) => setProject({ ...project, location: event.target.value })} className="rounded-lg border p-3" /><input placeholder="Budget" value={project.budget} onChange={(event) => setProject({ ...project, budget: event.target.value })} className="rounded-lg border p-3" /><select value={project.status} onChange={(event) => setProject({ ...project, status: event.target.value })} className="rounded-lg border p-3"><option>Planning</option><option>Ongoing</option><option>Completed</option><option>On Hold</option></select><textarea placeholder="Description / Project Details" value={project.description || ""} onChange={(event) => setProject({ ...project, description: event.target.value })} className="min-h-24 rounded-lg border p-3" /></div><div className="mt-4 flex flex-wrap gap-3"><Button onClick={save}>{editingId ? "Update Project" : "Add Project"}</Button>{editingId && <Button variant="secondary" onClick={reset}>Cancel</Button>}</div></Card>;
}
export default ProjectForm;
