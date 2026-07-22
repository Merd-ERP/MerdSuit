import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Projects from "./pages/Projects";
import Quotations from "./pages/Quotations";
import Invoices from "./pages/Invoices";
import InvoiceDetails from "./pages/InvoiceDetails";
import Inventory from "./pages/Inventory";
import Suppliers from "./pages/Suppliers";
import Settings from "./pages/Settings";
import PurchaseOrders from "./pages/PurchaseOrders";

function App() {
  return (
    <Routes>
      {/* Dashboard */}
      <Route path="/" element={<Dashboard />} />

      {/* Clients */}
      <Route path="/clients" element={<Clients />} />

      {/* Projects */}
      <Route path="/projects" element={<Projects />} />

      {/* Quotations */}
      <Route path="/quotations" element={<Quotations />} />

      {/* Invoices */}
      <Route path="/invoices" element={<Invoices />} />
      <Route
        path="/invoice/:id"
        element={<InvoiceDetails />}
      />

      {/* Inventory */}
      <Route
        path="/inventory"
        element={<Inventory />}
      />

      {/* Suppliers */}
      <Route
        path="/suppliers"
        element={<Suppliers />}
      />
      {/* Purchase Orders */}
<Route
  path="/purchase-orders"
  element={<PurchaseOrders />}
/>

      {/* Settings */}
      <Route
        path="/settings"
        element={<Settings />}
      />

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;