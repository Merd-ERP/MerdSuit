import { useState } from "react";
import MainLayout from "../layouts/Mainlayout";
import PageHeader from "../components/common/PageHeader";
import ClientsHeader from "../components/clients/ClientsHeader";
import ClientsStats from "../components/clients/ClientsStats";
import ClientForm from "../components/clients/ClientForm";
import ClientsTable from "../components/clients/ClientsTable";
function Clients() { const [clientToEdit, setClientToEdit] = useState(null); return <MainLayout><PageHeader title="Clients" subtitle="Manage customer records for projects and documents." /><ClientsHeader /><ClientsStats /><ClientForm key={clientToEdit?.id || "new"} clientToEdit={clientToEdit} setClientToEdit={setClientToEdit} /><ClientsTable setClientToEdit={setClientToEdit} /></MainLayout>; }
export default Clients;
