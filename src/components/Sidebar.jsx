import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/" },
  { name: "Clients", path: "/clients" },
  { name: "Projects", path: "/projects" },
  { name: "Quotations", path: "/quotations" },
  { name: "Invoices", path: "/invoices" },
  { name: "Receipts", path: "/receipts" }, // NEW
  { name: "Inventory", path: "/inventory" },

  // Procurement
  { name: "Suppliers", path: "/suppliers" },
  { name: "Purchase Orders", path: "/purchase-orders" },

  // Finance
  { name: "Expenses", path: "/expenses" },
  { name: "Reports", path: "/reports" },

  // System
  { name: "Settings", path: "/settings" },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6 shadow-xl">
      <h1 className="text-3xl font-bold mb-10">
        MerdSuite
      </h1>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`block w-full px-4 py-3 rounded-lg transition ${
              location.pathname === item.path
                ? "bg-blue-600 text-white"
                : "hover:bg-slate-700"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;