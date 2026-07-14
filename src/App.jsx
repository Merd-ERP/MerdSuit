import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Projects from "./pages/Projects";
import Quotations from "./pages/Quotations";
import Invoices from "./pages/Invoices";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/quotations" element={<Quotations />} />
      <Route path="/invoices" element={<Invoices />} />
    </Routes>
  );
}

export default App;