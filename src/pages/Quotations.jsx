import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Card from "../components/common/Card";
import PageHeader from "../components/common/PageHeader";
import QuotationHeader from "../components/quotations/QuotationHeader";
import QuotationStats from "../components/quotations/QuotationStats";
import QuotationForm from "../components/quotations/QuotationForm";
import QuotationItems from "../components/quotations/QuotationItems";
import QuotationSummary from "../components/quotations/QuotationSummary";
import QuotationQuickActions from "../components/quotations/QuotationQuickActions";
import QuotationTable from "../components/quotations/QuotationTable";

function Quotations() {
  const [projects] = useState(() => JSON.parse(localStorage.getItem("projects")) || []);
  const [quotation, setQuotation] = useState({ client: "", project: "", date: "" });
  const [materials, setMaterials] = useState([]);
  const [labour, setLabour] = useState("");
  const [transport, setTransport] = useState("");
  const [discount, setDiscount] = useState("");
  const addMaterial = () => setMaterials((currentMaterials) => [...currentMaterials, { id: Date.now(), description: "", quantity: 1, price: 0 }]);
  const updateMaterial = (id, field, value) => setMaterials((currentMaterials) => currentMaterials.map((material) => material.id === id ? { ...material, [field]: field === "quantity" || field === "price" ? Number(value) : value } : material));
  const deleteMaterial = (id) => setMaterials((currentMaterials) => currentMaterials.filter((material) => material.id !== id));
  const materialTotal = materials.reduce((sum, material) => sum + material.quantity * material.price, 0);
  const numericLabour = Number(labour) || 0;
  const numericTransport = Number(transport) || 0;
  const numericDiscount = Number(discount) || 0;
  const finalTotal = materialTotal + numericLabour + numericTransport - numericDiscount;
  function resetForm() { setQuotation({ client: "", project: "", date: "" }); setMaterials([]); setLabour(""); setTransport(""); setDiscount(""); }
  return <MainLayout><PageHeader title="Quotations" subtitle="Create clear estimates for your electrical work." /><QuotationHeader /><QuotationStats /><Card><QuotationForm quotation={quotation} setQuotation={setQuotation} projects={projects} /><QuotationItems materials={materials} addMaterial={addMaterial} updateMaterial={updateMaterial} deleteMaterial={deleteMaterial} /><div className="mt-8 grid gap-4 md:grid-cols-3"><input type="number" placeholder="Labour Cost (GH₵)" value={labour} onChange={(event) => setLabour(event.target.value)} className="rounded-lg border border-slate-300 p-3" /><input type="number" placeholder="Transport Cost (GH₵)" value={transport} onChange={(event) => setTransport(event.target.value)} className="rounded-lg border border-slate-300 p-3" /><input type="number" placeholder="Discount (GH₵)" value={discount} onChange={(event) => setDiscount(event.target.value)} className="rounded-lg border border-slate-300 p-3" /></div><QuotationSummary materialTotal={materialTotal} labour={numericLabour} transport={numericTransport} discount={numericDiscount} finalTotal={finalTotal} /><QuotationQuickActions quotation={quotation} materials={materials} labour={numericLabour} transport={numericTransport} discount={numericDiscount} finalTotal={finalTotal} resetForm={resetForm} /></Card><Card className="mt-6"><QuotationTable /></Card></MainLayout>;
}

export default Quotations;
