import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/" }, { name: "Clients", path: "/clients" }, { name: "Projects", path: "/projects" }, { name: "Quotations", path: "/quotations" }, { name: "Invoices", path: "/invoices" }, { name: "Receipts", path: "/receipts" }, { name: "Inventory", path: "/inventory" }, { name: "Suppliers", path: "/suppliers" }, { name: "Purchase Orders", path: "/purchase-orders" }, { name: "Expenses", path: "/expenses" }, { name: "Reports", path: "/reports" }, { name: "Settings", path: "/settings" },
];

function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const navigation = <nav aria-label="Primary navigation" className="space-y-2">{menuItems.map((item) => <Link key={item.name} to={item.path} onClick={() => setIsOpen(false)} aria-current={location.pathname === item.path ? "page" : undefined} className={`block rounded-xl px-4 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-300 ${location.pathname === item.path ? "bg-blue-600 text-white" : "text-slate-200 hover:bg-slate-700 hover:text-white"}`}>{item.name}</Link>)}</nav>;
  return <><header className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white shadow lg:hidden"><h1 className="text-xl font-bold">MerdSuite</h1><button type="button" aria-label="Open navigation menu" aria-expanded={isOpen} onClick={() => setIsOpen(true)} className="rounded-lg p-2 text-2xl focus:outline-none focus:ring-2 focus:ring-blue-300">☰</button></header>{isOpen && <div className="fixed inset-0 z-50 bg-slate-950/50 lg:hidden" onClick={() => setIsOpen(false)}><aside className="h-full w-72 max-w-[85vw] overflow-y-auto bg-slate-900 p-5 text-white shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="mb-6 flex items-center justify-between"><h1 className="text-2xl font-bold">MerdSuite</h1><button type="button" aria-label="Close navigation menu" onClick={() => setIsOpen(false)} className="rounded-lg p-2 text-2xl focus:outline-none focus:ring-2 focus:ring-blue-300">×</button></div>{navigation}</aside></div>}<aside className="hidden w-64 shrink-0 bg-slate-900 p-6 text-white shadow-xl lg:block"><h1 className="mb-10 text-3xl font-bold">MerdSuite</h1>{navigation}</aside></>;
}

export default Sidebar;
