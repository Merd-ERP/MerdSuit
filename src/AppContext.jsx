import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [invoices, setInvoices] = useState([]);

  return (
    <AppContext.Provider
      value={{
        clients,
        setClients,
        projects,
        setProjects,
        quotations,
        setQuotations,
        invoices,
        setInvoices,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}