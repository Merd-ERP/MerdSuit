import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Projects from "./pages/Projects";

function App() {
  return (
    <Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/clients" element={<Clients />} />
  <Route path="/projects" element={<Projects />} />
</Routes>
  );
}

export default App;
