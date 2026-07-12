
import { Link } from "react-router-dom";
const menuItems = [
  "Dashboard",
  "Clients",
  "Projects",
  "Quotations",
  "Invoices",
  "Inventory",
  "Expenses",
  "Reports",
  "Settings",
];

function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-10">MerdSuite</h1>

      <nav className="space-y-2">
        {menuItems.map((item) => (
  <Link
    key={item}
    to={item === "Dashboard" ? "/" : `/${item.toLowerCase()}`}
    className="block w-full px-4 py-3 rounded-lg hover:bg-slate-700 transition"
  >
    {item}
  </Link>
))}
      </nav>
    </aside>
  );
}

export default Sidebar;
