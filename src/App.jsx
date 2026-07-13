import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Projects from "./pages/Projects";
import Quotations from "./pages/Quotations";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/quotations" element={<Quotations />} />
    </Routes>
  );
}

export default App;