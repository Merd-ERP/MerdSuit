import MainLayout from "./layouts/Mainlayout";

function Projects() {
  return (
    <MainLayout>
      <h1 className="text-4xl font-bold mb-6">Projects</h1>

      <div className="bg-white rounded-xl shadow p-6">
        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
          + New Project
        </button>

        <p className="mt-6 text-gray-500">
          No projects created yet.
        </p>
      </div>
    </MainLayout>
  );
}

export default Projects;
