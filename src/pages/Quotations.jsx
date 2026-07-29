import { useState } from "react";
import MainLayout from "../layouts/MainLayout";

import QuotationForm from "../components/quotations/QuotationForm";
import MaterialsTable from "../components/quotations/MaterialsTable";
import SummaryCard from "../components/quotations/SummaryCard";
import SaveQuotationButton from "../components/quotations/SaveQuotationButton";
import QuotationHistory from "../components/quotations/QuotationHistory";
import { generateQuotationPDF } from "../services/pdf/quotationPdf";

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

  const [labour, setLabour] = useState("");
  const [transport, setTransport] = useState("");
  const [discount, setDiscount] = useState("");

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
    Number(labour || 0) +
    Number(transport || 0) -
    Number(discount || 0);

  function resetForm() {
    setQuotation({
      client: "",
      project: "",
      date: "",
    });

    setMaterials([]);
    setLabour("");
    setTransport("");
    setDiscount("");
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
            placeholder="Labour Cost (GH₵)"
            value={labour}
            onChange={(e) => setLabour(e.target.value)}
            className="border rounded-lg p-3"
          />

          <input
            type="number"
            placeholder="Transport Cost (GH₵)"
            value={transport}
            onChange={(e) => setTransport(e.target.value)}
            className="border rounded-lg p-3"
          />

          <input
            type="number"
            placeholder="Discount (GH₵)"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="border rounded-lg p-3"
          />

        </div>

        <SummaryCard
          materialTotal={materialTotal}
          labour={Number(labour || 0)}
          transport={Number(transport || 0)}
          discount={Number(discount || 0)}
          finalTotal={finalTotal}
        />

        <div className="mt-10 flex justify-end gap-4 border-t pt-6">

          <button
  onClick={() =>
    generateQuotationPDF({
      ...quotation,
      materials,
      labour: Number(labour || 0),
      transport: Number(transport || 0),
      discount: Number(discount || 0),
      total: finalTotal,
      currency: "GH₵",
    })
  }
  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
>
  📄 Generate PDF
</button>

          <SaveQuotationButton
            quotation={quotation}
            materials={materials}
            labour={Number(labour || 0)}
            transport={Number(transport || 0)}
            discount={Number(discount || 0)}
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