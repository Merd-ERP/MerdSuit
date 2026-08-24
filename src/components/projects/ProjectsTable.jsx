import { useApp } from "../../context/AppContext";
import { getClientDisplayName, isArchivedRecord, relationshipOptionValue } from "../../utils/relationships";
import Card from "../common/Card";
import Button from "../common/Button";
import EmptyProjects from "./EmptyProjects";

function ProjectsTable({ setProjectToEdit, onDelete, onRestore }) {
  const { clients, projects } = useApp();
  if (projects.length === 0) return <Card><EmptyProjects /></Card>;

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead><tr className="border-b text-left"><th className="p-3">Project</th><th>Client</th><th>Location</th><th>Budget</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{projects.map((project) => {
            const archived = isArchivedRecord(project);
            return (
              <tr className="border-b" key={relationshipOptionValue(project.id)}>
                <td className="p-3">{project.name}</td>
                <td>{getClientDisplayName(project, clients, { current: true }) || "—"}</td>
                <td>{project.location}</td>
                <td>{project.budget}</td>
                <td className="max-w-48 truncate" title={project.description}>{project.description || "—"}</td>
                <td>{archived ? "Archived" : project.status}</td>
                <td><div className="flex flex-wrap gap-2">{archived ? <Button variant="secondary" onClick={() => onRestore(project)}>Restore</Button> : <><Button variant="warning" onClick={() => setProjectToEdit(project)}>Edit</Button><Button variant="danger" onClick={() => onDelete(project)}>Delete</Button></>}</div></td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
    </Card>
  );
}

export default ProjectsTable;
