import { useState } from "react";
import MainLayout from "../layouts/MainLayout";

import QuotationForm from "../components/quotations/QuotationForm";
import MaterialsTable from "../components/quotations/MaterialsTable";
import SummaryCard from "../components/quotations/SummaryCard";
import SaveQuotationButton from "../components/quotations/SaveQuotationButton";
import QuotationHistory from "../components/quotations/QuotationHistory";

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
    setMaterials(
      materials.filter((material) => material.id !== id)
    );
  }

  const materialTotal = materials.reduce(
    (sum, material) =>
      sum + material.quantity * material.price,
    0
  );

  const finalTotal =
    materialTotal +
    Number(labour) +
    Number(transport) -
    Number(discount);

  function resetForm() {
    setQuotation({
      client: "",
      project: "",
      date: "",
    });

    setMaterials([]);
    setLabour(0);
    setTransport(0);
    setDiscount(0);
  }

  return (
    <MainLayout>
      <h1 className="text-4xl font-bold mb-6">
        Quotations
      </h1>

      <div className="bg-white rounded-xl shadow p-6">

        <QuotationForm
          quotation={quotation}
          setQuotation={setQuotation}
          projects={projects}
        />

        <MaterialsTable
          materials={materials}
          addMaterial={addMaterial}
          updateMaterial={updateMaterial}
          deleteMaterial={deleteMaterial}
        />

        <div className="grid grid-cols-3 gap-4 mt-8">

          <input
            type="number"
            placeholder="Labour Cost"
            value={labour}
            onChange={(e) => setLabour(Number(e.target.value))}
            className="border rounded-lg p-2"
          />

          <input
            type="number"
            placeholder="Transport Cost"
            value={transport}
            onChange={(e) => setTransport(Number(e.target.value))}
            className="border rounded-lg p-2"
          />

          <input
            type="number"
            placeholder="Discount"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="border rounded-lg p-2"
          />

        </div>

        <SummaryCard
          materialTotal={materialTotal}
          labour={labour}
          transport={transport}
          discount={discount}
          finalTotal={finalTotal}
        />

        <div className="mt-8 flex justify-end">

          <SaveQuotationButton
            quotation={quotation}
            materials={materials}
            labour={labour}
            transport={transport}
            discount={discount}
            finalTotal={finalTotal}
            resetForm={resetForm}
          />

        </div>

        <QuotationHistory />

      </div>
    </MainLayout>
  );
}

export default Quotations;