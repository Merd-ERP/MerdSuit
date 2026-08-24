import { useApp } from "../../context/AppContext";
import { isArchivedRecord } from "../../utils/relationships";
import Card from "../common/Card";

function ProjectsStats() {
  const { projects } = useApp();
  const activeProjects = projects.filter((project) => !isArchivedRecord(project));
  return <Card className="mb-6"><p className="text-sm text-slate-500">Total Projects</p><p className="mt-2 text-2xl font-bold text-blue-600">{activeProjects.length}</p></Card>;
}

export default ProjectsStats;
