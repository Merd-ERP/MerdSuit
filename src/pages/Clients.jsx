import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";

function Clients() {
  const [clients, setClients] = useState(() => {
  const savedClients = localStorage.getItem("clients");

  return savedClients ? JSON.parse(savedClients) : [];
});

  const [client, setClient] = useState({
    name: "",
    phone: "",
    location: "",
    email: "",
  });

  function addClient() {
  if (client.name.trim() === "") return;

  setClients([
    ...clients,
    {
      id: Date.now(),
      ...client,
      status: "Active",
    },
  ]);

  setClient({
    name: "",
    phone: "",
    location: "",
    email: "",
  });
}

function deleteClient(id) {
  const updatedClients = clients.filter(
    (client) => client.id !== id
  );

  setClients(updatedClients);
}

useEffect(() => {
  localStorage.setItem("clients", JSON.stringify(clients));
}, [clients]);
  return (
    <MainLayout>
      <h1 className="text-4xl font-bold mb-6">Clients</h1>

      <div className="bg-white rounded-xl shadow p-6">

        <div className="grid grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Client Name"
            value={client.name}
            onChange={(e) =>
              setClient({ ...client, name: e.target.value })
            }
            className="border rounded-lg px-4 py-2"
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={client.phone}
            onChange={(e) =>
              setClient({ ...client, phone: e.target.value })
            }
            className="border rounded-lg px-4 py-2"
          />

          <input
            type="text"
            placeholder="Location"
            value={client.location}
            onChange={(e) =>
              setClient({ ...client, location: e.target.value })
            }
            className="border rounded-lg px-4 py-2"
          />

          <input
            type="email"
            placeholder="Email"
            value={client.email}
            onChange={(e) =>
              setClient({ ...client, email: e.target.value })
            }
            className="border rounded-lg px-4 py-2"
          />

        </div>

        <button
          onClick={addClient}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Client
        </button>

        <div className="mt-8 overflow-x-auto">

          {clients.length === 0 ? (

            <p className="text-gray-500">
              No clients added yet.
            </p>

          ) : (

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left py-3">Name</th>
                  <th className="text-left">Phone</th>
                  <th className="text-left">Location</th>
                  <th className="text-left">Email</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Actions</th>

                </tr>

              </thead>

              <tbody>

                {clients.map((client) => (

                  <tr key={client.id} className="border-b">

                    <td className="py-3">{client.name}</td>
                    <td>{client.phone}</td>
                    <td>{client.location}</td>
                    <td>{client.email}</td>

                    <td>

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">

                        {client.status}

                      </span>

                    </td>
                    <td>
  <td>
  <button
  onClick={() => deleteClient(client.id)}
    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
  >
    Delete
  </button>
</td>
</td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </MainLayout>
  );
}

export default Clients;