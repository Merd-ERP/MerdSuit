import Sidebar from "../components/Sidebar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
    </div>
  );
}

export default MainLayout;
