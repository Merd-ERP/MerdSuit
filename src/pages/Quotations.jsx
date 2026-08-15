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
  const [labour, setLabour] = useState(""); const [transport, setTransport] = useState(""); const [discount, setDiscount] = useState("");
  const addMaterial = () => setMaterials((items) => [...items, { id: Date.now(), description: "", quantity: 1, price: 0 }]);
  const updateMaterial = (id, field, value) => setMaterials((items) => items.map((item) => item.id === id ? { ...item, [field]: field === "quantity" || field === "price" ? Number(value) : value } : item));
  const deleteMaterial = (id) => setMaterials((items) => items.filter((item) => item.id !== id));
  const materialTotal = materials.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const numericLabour = Number(labour) || 0, numericTransport = Number(transport) || 0, numericDiscount = Number(discount) || 0;
  const finalTotal = materialTotal + numericLabour + numericTransport - numericDiscount;
  function resetForm() { setQuotation({ client: "", project: "", date: "" }); setMaterials([]); setLabour(""); setTransport(""); setDiscount(""); }
  return <MainLayout><PageHeader title="Quotations" subtitle="Create clear estimates for your electrical work." /><QuotationHeader /><QuotationStats /><Card><QuotationForm quotation={quotation} setQuotation={setQuotation} projects={projects} /><QuotationItems materials={materials} addMaterial={addMaterial} updateMaterial={updateMaterial} deleteMaterial={deleteMaterial} /><div className="mt-8 grid gap-4 md:grid-cols-3"><label className="text-sm font-medium text-slate-700">Labour<input type="number" placeholder="Enter labour cost" value={labour} onChange={(event) => setLabour(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label><label className="text-sm font-medium text-slate-700">Transport<input type="number" placeholder="Enter transport cost" value={transport} onChange={(event) => setTransport(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label><label className="text-sm font-medium text-slate-700">Discount<input type="number" placeholder="Enter discount" value={discount} onChange={(event) => setDiscount(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label></div><QuotationSummary materialTotal={materialTotal} labour={numericLabour} transport={numericTransport} discount={numericDiscount} finalTotal={finalTotal} /><QuotationQuickActions quotation={quotation} materials={materials} labour={numericLabour} transport={numericTransport} discount={numericDiscount} finalTotal={finalTotal} resetForm={resetForm} /></Card><Card className="mt-6"><QuotationTable /></Card></MainLayout>;
}
export default Quotations;
