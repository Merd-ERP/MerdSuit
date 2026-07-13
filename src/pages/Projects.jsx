import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";

function Projects() {
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem("projects");
    return savedProjects ? JSON.parse(savedProjects) : [];
  });

  const [project, setProject] = useState({
    name: "",
    client: "",
    location: "",
    budget: "",
    status: "Planning",
  });

  function addProject() {
    if (project.name.trim() === "") return;

    setProjects([
      ...projects,
      {
        id: Date.now(),
        ...project,
      },
    ]);

    setProject({
      name: "",
      client: "",
      location: "",
      budget: "",
      status: "Planning",
    });
  }

  function deleteProject(id) {
    const updatedProjects = projects.filter(
      (project) => project.id !== id
    );

    setProjects(updatedProjects);
  }

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  return (
    <MainLayout>
      <h1 className="text-4xl font-bold mb-6">Projects</h1>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Project Name"
            value={project.name}
            onChange={(e) =>
              setProject({ ...project, name: e.target.value })
            }
            className="border rounded-lg p-2"
          />

          <input
            placeholder="Client Name"
            value={project.client}
            onChange={(e) =>
              setProject({ ...project, client: e.target.value })
            }
            className="border rounded-lg p-2"
          />

          <input
            placeholder="Location"
            value={project.location}
            onChange={(e) =>
              setProject({ ...project, location: e.target.value })
            }
            className="border rounded-lg p-2"
          />

          <input
            placeholder="Budget"
            value={project.budget}
            onChange={(e) =>
              setProject({ ...project, budget: e.target.value })
            }
            className="border rounded-lg p-2"
          />

          <select
            value={project.status}
            onChange={(e) =>
              setProject({ ...project, status: e.target.value })
            }
            className="border rounded-lg p-2"
          >
            <option>Planning</option>
            <option>Ongoing</option>
            <option>Completed</option>
            <option>On Hold</option>
          </select>
        </div>

        <button
          onClick={addProject}
          className="mt-5 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Project
        </button>

        <div className="mt-8 overflow-x-auto">
          {projects.length === 0 ? (
            <p className="text-gray-500">No projects added yet.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Project</th>
                  <th className="text-left">Client</th>
                  <th className="text-left">Location</th>
                  <th className="text-left">Budget</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b">
                    <td className="py-3">{project.name}</td>
                    <td>{project.client}</td>
                    <td>{project.location}</td>
                    <td>{project.budget}</td>

                    <td>
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                        {project.status}
                      </span>
                    </td>

                    <td>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Projects;