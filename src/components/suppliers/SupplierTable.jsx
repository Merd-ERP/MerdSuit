import { useState } from "react";

import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";

import Button from "../common/Button";
import SearchBox from "../common/SearchBox";
import EmptyState from "../common/EmptyState";

function SupplierTable({ setSupplierToEdit }) {
  const { suppliers, deleteSupplier } = useApp();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");

  const filteredSuppliers = suppliers.filter((supplier) =>
    [
      supplier.company,
      supplier.contactPerson,
      supplier.phone,
      supplier.email,
      supplier.city,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function handleDelete(id) {
    const confirmed = window.confirm(
      "Delete this supplier?"
    );

    if (!confirmed) return;

    deleteSupplier(id);

    showToast({
      type: "success",
      message: "Supplier deleted successfully.",
    });
  }

  if (suppliers.length === 0) {
    return (
      <EmptyState
        title="No Suppliers"
        message="Start by adding your first supplier."
      />
    );
  }

  return (
    <div className="space-y-4">
      <SearchBox
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search suppliers..."
      />

      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">City</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSuppliers.map((supplier) => (
              <tr
                key={supplier.id}
                className="border-t hover:bg-slate-50"
              >
                <td className="p-3 font-medium">
                  {supplier.company}
                </td>

                <td className="p-3">
                  {supplier.contactPerson || "-"}
                </td>

                <td className="p-3">
                  {supplier.phone || "-"}
                </td>

                <td className="p-3">
                  {supplier.email || "-"}
                </td>

                <td className="p-3">
                  {supplier.city || "-"}
                </td>

                <td className="p-3">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="warning"
                      onClick={() =>
                        setSupplierToEdit(supplier)
                      }
                    >
                      Edit
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() =>
                        handleDelete(supplier.id)
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SupplierTable;