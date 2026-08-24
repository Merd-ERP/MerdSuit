import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { getUpdatedNameAliases, relationshipIdsEqual } from "../../utils/relationships";
import Card from "../common/Card";
import Button from "../common/Button";

function ClientForm({ clientToEdit, setClientToEdit }) {
  const { setClients } = useApp();
  const { showToast } = useToast();
  const [client, setClient] = useState(() => clientToEdit || { name: "", phone: "", location: "", email: "" });
  const editingId = clientToEdit?.id;
  const isEditing = editingId !== undefined && editingId !== null;
  function reset() { setClient({ name: "", phone: "", location: "", email: "" }); setClientToEdit(null); }
  function save() { if (!client.name.trim()) return; if (isEditing) { setClients((items) => items.map((item) => relationshipIdsEqual(item.id, editingId) ? { ...item, ...client, id: editingId, nameAliases: getUpdatedNameAliases(item, client.name) } : item)); showToast({ type: "success", title: "Client updated", message: "Client updated successfully" }); } else { setClients((items) => [...items, { id: Date.now(), ...client, status: "Active" }]); showToast({ type: "success", title: "Client saved", message: "Client added successfully" }); } reset(); }
  return <Card className="mb-6"><h2 className="text-xl font-semibold">{isEditing ? "Edit Client" : "Add Client"}</h2><div className="mt-4 grid gap-4 md:grid-cols-2">{[["name", "Client Name", "text"], ["phone", "Phone Number", "text"], ["location", "Location", "text"], ["email", "Email", "email"]].map(([name, placeholder, type]) => <input key={name} type={type} placeholder={placeholder} value={client[name]} onChange={(event) => setClient({ ...client, [name]: event.target.value })} className="rounded-lg border p-3" />)}</div><div className="mt-4 flex flex-wrap gap-3"><Button onClick={save}>{isEditing ? "Update Client" : "Add Client"}</Button>{isEditing && <Button variant="secondary" onClick={reset}>Cancel</Button>}</div></Card>;
}

export default ClientForm;
