import { useState } from "react";
import MainLayout from "../layouts/Mainlayout";
import PageHeader from "../components/common/PageHeader";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import { getReceipts } from "../services/receiptService";
import { recordMayReferenceProject } from "../utils/relationships";
import ConfirmDialog from "../components/common/ConfirmDialog";
import ProjectsHeader from "../components/projects/ProjectsHeader";
import ProjectsStats from "../components/projects/ProjectsStats";
import ProjectForm from "../components/projects/ProjectForm";
import ProjectsTable from "../components/projects/ProjectsTable";

function Projects() {
  const { projects, setProjects, quotations, invoices, expenses } = useApp();
  const { showToast } = useToast();
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);

  function deleteProject() {
    const referenced = [...quotations, ...invoices, ...getReceipts(), ...expenses]
      .some((record) => recordMayReferenceProject(record, projectToDelete, projects));

    if (referenced) {
      setProjects((items) => items.map((item) => item.id === projectToDelete.id
        ? { ...item, archived: true, status: "Archived" }
        : item
      ));
      showToast({
        type: "info",
        title: "Project archived",
        message: "This project is referenced by business records and was archived instead of deleted.",
      });
    } else {
      setProjects((items) => items.filter((item) => item.id !== projectToDelete.id));
      showToast({ type: "success", title: "Project deleted", message: "Project deleted successfully" });
    }
    setProjectToDelete(null);
  }

  return (
    <MainLayout>
      <PageHeader title="Projects" subtitle="Manage electrical projects and their client relationships." />
      <ProjectsHeader />
      <ProjectsStats />
      <ProjectForm key={projectToEdit?.id ?? "new"} projectToEdit={projectToEdit} setProjectToEdit={setProjectToEdit} />
      <ProjectsTable setProjectToEdit={setProjectToEdit} onDelete={setProjectToDelete} />
      <ConfirmDialog isOpen={Boolean(projectToDelete)} title="Delete Project?" message={`Are you sure you want to delete project ${projectToDelete?.name || ""}? Referenced projects will be archived to preserve business history.`} onCancel={() => setProjectToDelete(null)} onConfirm={deleteProject} confirmLabel="Delete Project" />
    </MainLayout>
  );
}

export default Projects;
