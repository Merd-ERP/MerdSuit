import { useState } from "react";
import MainLayout from "../layouts/MainLayout";

function Quotations() {
  const [projects] = useState(() => {
    const savedProjects = localStorage.getItem("projects");
    return savedProjects ? JSON.parse(savedProjects) : [];
  });

  const [quotation, setQuotation] = useState({
    client: "",
    project: "",
    date: "",
  });

  const [materials, setMaterials] = useState([]);

  const [labour, setLabour] = useState(0);
  const [transport, setTransport] = useState(0);
  const [discount, setDiscount] = useState(0);

  function addMaterial() {
    setMaterials([
      ...materials,
      {
        id: Date.now(),
        description: "",
        quantity: 1,
        price: 0,
      },
    ]);
  }

  function updateMaterial(id, field, value) {
    setMaterials(
      materials.map((material) =>
        material.id === id
          ? {
              ...material,
              [field]:
                field === "quantity" || field === "price"
                  ? Number(value)
                  : value,
            }
          : material
      )
    );
  }

  function deleteMaterial(id) {
    setMaterials(materials.filter((material) => material.id !== id));
  }

  const materialTotal = materials.reduce(
    (sum, material) => sum + material.quantity * material.price,
    0
  );

  const finalTotal =
    materialTotal +
    Number(labour) +
    Number(transport) -
    Number(discount);

  return (
    <MainLayout>
      <h1 className="text-4xl font-bold mb-6">
        Quotations
      </h1>

      <div className="bg-white rounded-xl shadow p-6">

        {/* Quotation Details */}

        <div className="grid grid-cols-3 gap-4 mb-8">

          <input
            placeholder="Client Name"
            value={quotation.client}
            onChange={(e) =>
              setQuotation({
                ...quotation,
                client: e.target.value,
              })
            }
            className="border rounded-lg p-2"
          />

          <select
            value={quotation.project}
            onChange={(e) => {
              const selected = projects.find(
                (p) => p.name === e.target.value
              );

              setQuotation({
                ...quotation,
                project: selected?.name || "",
                client: selected?.client || "",
              });
            }}
            className="border rounded-lg p-2"
          >
            <option value="">Select Project</option>

            {projects.map((project) => (
              <option key={project.id} value={project.name}>
                {project.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={quotation.date}
            onChange={(e) =>
              setQuotation({
                ...quotation,
                date: e.target.value,
              })
            }
            className="border rounded-lg p-2"
          />

        </div>

        {/* Materials */}

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-2xl font-bold">
            Materials
          </h2>

          <button
            onClick={addMaterial}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            + Add Material
          </button>

        </div>

        {materials.length === 0 && (
          <p className="text-gray-500 mb-4">
            No materials added yet.
          </p>
        )}

        {materials.map((material) => (
          <div
            key={material.id}
            className="grid grid-cols-5 gap-4 mb-3"
          >

            <input
              placeholder="Material"
              value={material.description}
              onChange={(e) =>
                updateMaterial(
                  material.id,
                  "description",
                  e.target.value
                )
              }
              className="border rounded-lg p-2"
            />

            <input
              type="number"
              placeholder="Qty"
              value={material.quantity}
              onChange={(e) =>
                updateMaterial(
                  material.id,
                  "quantity",
                  e.target.value
                )
              }
              className="border rounded-lg p-2"
            />

            <input
              type="number"
              placeholder="Unit Price"
              value={material.price}
              onChange={(e) =>
                updateMaterial(
                  material.id,
                  "price",
                  e.target.value
                )
              }
              className="border rounded-lg p-2"
            />

            <input
              value={material.quantity * material.price}
              readOnly
              className="border rounded-lg p-2 bg-gray-100"
            />

            <button
              onClick={() => deleteMaterial(material.id)}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Delete
            </button>

          </div>
        ))}

        {/* Extra Costs */}

        <div className="grid grid-cols-3 gap-4 mt-8">

          <input
            type="number"
            placeholder="Labour Cost"
            value={labour}
            onChange={(e) => setLabour(e.target.value)}
            className="border rounded-lg p-2"
          />

          <input
            type="number"
            placeholder="Transport Cost"
            value={transport}
            onChange={(e) => setTransport(e.target.value)}
            className="border rounded-lg p-2"
          />

          <input
            type="number"
            placeholder="Discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="border rounded-lg p-2"
          />

        </div>

        {/* Summary */}

        <div className="flex justify-end mt-8">

          <div className="w-96 bg-gray-50 rounded-xl shadow p-6">

            <div className="flex justify-between mb-2">
              <span>Materials</span>
              <span>GH₵ {materialTotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Labour</span>
              <span>GH₵ {Number(labour).toLocaleString()}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Transport</span>
              <span>GH₵ {Number(transport).toLocaleString()}</span>
            </div>

            <div className="flex justify-between mb-2 text-red-600">
              <span>Discount</span>
              <span>- GH₵ {Number(discount).toLocaleString()}</span>
            </div>

            <hr className="my-3" />

            <div className="flex justify-between text-2xl font-bold text-green-700">
              <span>Grand Total</span>
              <span>GH₵ {finalTotal.toLocaleString()}</span>
            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default Quotations;