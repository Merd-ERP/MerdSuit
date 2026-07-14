import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [clients, setClients] = useState(() => {
    return JSON.parse(localStorage.getItem("clients")) || [];
  });

  const [projects, setProjects] = useState(() => {
    return JSON.parse(localStorage.getItem("projects")) || [];
  });

  const [quotations, setQuotations] = useState(() => {
    return JSON.parse(localStorage.getItem("quotations")) || [];
  });

  const [invoices, setInvoices] = useState(() => {
    return JSON.parse(localStorage.getItem("invoices")) || [];
  });

  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("quotations", JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

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