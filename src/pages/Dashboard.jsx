import MainLayout from "../layouts/MainLayout";

function Dashboard() {
  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">Clients</h2>
          <p className="text-3xl font-bold">0</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">Projects</h2>
          <p className="text-3xl font-bold">0</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">Revenue</h2>
          <p className="text-3xl font-bold">GH₵ 0.00</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">Pending Quotes</h2>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
