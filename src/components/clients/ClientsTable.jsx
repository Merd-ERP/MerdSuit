import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { getReceipts } from "../../services/receiptService";
import {
  isArchivedRecord,
  recordMayReferenceClient,
  relationshipOptionValue,
} from "../../utils/relationships";
import Card from "../common/Card";
import Button from "../common/Button";
import EmptyClients from "./EmptyClients";

function ClientsTable({ setClientToEdit }) {
  const { clients, setClients, projects, quotations, invoices } = useApp();
  const { showToast } = useToast();

  function removeOrArchiveClient(client) {
    const referenced = [...projects, ...quotations, ...invoices, ...getReceipts()]
      .some((record) => recordMayReferenceClient(record, client, clients));

    if (referenced) {
      setClients((items) => items.map((item) => item.id === client.id
        ? { ...item, archived: true, status: "Archived" }
        : item
      ));
      showToast({
        type: "info",
        title: "Client archived",
        message: "This client is referenced by business records and was archived instead of deleted.",
      });
      return;
    }

    setClients((items) => items.filter((item) => item.id !== client.id));
    showToast({ type: "success", title: "Client deleted", message: "Client deleted successfully" });
  }

  if (clients.length === 0) return <Card><EmptyClients /></Card>;

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead><tr className="border-b text-left"><th className="p-3">Name</th><th>Phone</th><th>Location</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{clients.map((client) => {
            const archived = isArchivedRecord(client);
            return (
              <tr key={relationshipOptionValue(client.id)} className="border-b">
                <td className="p-3">{client.name}</td><td>{client.phone}</td><td>{client.location}</td><td>{client.email}</td><td>{archived ? "Archived" : client.status}</td>
                <td><div className="flex flex-wrap gap-2">{!archived && <Button variant="warning" onClick={() => setClientToEdit(client)}>Edit</Button>}{!archived && <Button variant="danger" onClick={() => removeOrArchiveClient(client)}>Delete</Button>}</div></td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
    </Card>
  );
}

export default ClientsTable;
