import { useState } from "react";
import MainLayout from "../layouts/Mainlayout";
import Card from "../components/common/Card";
import PageHeader from "../components/common/PageHeader";
import QuotationHeader from "../components/quotations/QuotationHeader";
import QuotationStats from "../components/quotations/QuotationStats";
import QuotationForm from "../components/quotations/QuotationForm";
import QuotationItems from "../components/quotations/QuotationItems";
import QuotationSummary from "../components/quotations/QuotationSummary";
import QuotationQuickActions from "../components/quotations/QuotationQuickActions";
import QuotationTable from "../components/quotations/QuotationTable";
import { useApp } from "../context/AppContext";
import { getSafeQuotationPreview } from "../utils/quotationItems";

function Quotations() {
  const { clients, projects } = useApp();
  const [quotation, setQuotation] = useState({ clientId: "", client: "", clientNameSnapshot: "", projectId: "", project: "", projectNameSnapshot: "", date: "" });
  const [editingQuotation, setEditingQuotation] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [labour, setLabour] = useState(""); const [transport, setTransport] = useState(""); const [discount, setDiscount] = useState("");
  const addMaterial = () => setMaterials((items) => [...items, { id: Date.now(), description: "", quantity: 1, price: "" }]);
  const updateMaterial = (id, field, value) => setMaterials((items) => items.map((item) => item.id === id ? { ...item, [field]: value } : item));
  const deleteMaterial = (id) => setMaterials((items) => items.filter((item) => item.id !== id));
  const preview = getSafeQuotationPreview({ materials, labour, transport, discount });
  function resetForm() { setQuotation({ clientId: "", client: "", clientNameSnapshot: "", projectId: "", project: "", projectNameSnapshot: "", date: "" }); setMaterials([]); setLabour(""); setTransport(""); setDiscount(""); setEditingQuotation(null); }
  function editQuotation(savedQuotation) { setEditingQuotation(savedQuotation); setQuotation({ clientId: savedQuotation.clientId ?? "", client: savedQuotation.client || "", clientNameSnapshot: savedQuotation.clientNameSnapshot || savedQuotation.client || "", projectId: savedQuotation.projectId ?? "", project: savedQuotation.project || "", projectNameSnapshot: savedQuotation.projectNameSnapshot || savedQuotation.project || "", date: savedQuotation.date || "" }); setMaterials(savedQuotation.materials || []); setLabour(savedQuotation.labour || ""); setTransport(savedQuotation.transport || ""); setDiscount(savedQuotation.discount || ""); window.scrollTo({ top: 0, behavior: "smooth" }); }
  return <MainLayout><PageHeader title="Quotations" subtitle="Create clear estimates for your electrical work." /><QuotationHeader /><QuotationStats /><Card>{editingQuotation && <div className="mb-6 rounded-xl bg-blue-50 p-4 text-sm font-medium text-blue-800">Editing draft {editingQuotation.quotationNumber}</div>}<QuotationForm quotation={quotation} setQuotation={setQuotation} clients={clients} projects={projects} /><QuotationItems materials={materials} addMaterial={addMaterial} updateMaterial={updateMaterial} deleteMaterial={deleteMaterial} /><div className="mt-8 grid gap-4 md:grid-cols-3"><label className="text-sm font-medium text-slate-700">Labour<input type="number" min="0" placeholder="Enter labour cost" value={labour} onChange={(event) => setLabour(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label><label className="text-sm font-medium text-slate-700">Transport<input type="number" min="0" placeholder="Enter transport cost" value={transport} onChange={(event) => setTransport(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label><label className="text-sm font-medium text-slate-700">Discount<input type="number" min="0" placeholder="Enter discount" value={discount} onChange={(event) => setDiscount(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label></div><QuotationSummary materialTotal={preview.materialTotal} labour={preview.labour} transport={preview.transport} discount={preview.discount} finalTotal={preview.total} /><QuotationQuickActions quotation={quotation} materials={materials} labour={labour} transport={transport} discount={discount} resetForm={resetForm} editingQuotation={editingQuotation} /></Card><Card className="mt-6"><QuotationTable onEdit={editQuotation} /></Card></MainLayout>;
}
export default Quotations;
