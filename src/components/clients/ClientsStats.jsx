import { useApp } from "../../context/AppContext";
import { isArchivedRecord } from "../../utils/relationships";
import Card from "../common/Card";

function ClientsStats() {
  const { clients } = useApp();
  const activeClients = clients.filter((client) => !isArchivedRecord(client));

  return (
    <Card className="mb-6">
      <p className="text-sm text-slate-500">Total Clients</p>
      <p className="mt-2 text-2xl font-bold text-blue-600">{activeClients.length}</p>
    </Card>
  );
}

export default ClientsStats;
