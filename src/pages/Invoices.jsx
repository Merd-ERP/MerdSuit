import MainLayout from "../layouts/MainLayout";
import InvoiceHistory from "../components/invoices/InvoiceHistory";
import InvoiceSummary from "../components/invoices/InvoiceSummary";

function Invoices() {
  return (
    <MainLayout>
      <h1 className="text-4xl font-bold mb-6">
        Invoices
      </h1>

      <div className="bg-white rounded-xl shadow p-6">

  <InvoiceSummary />

  <InvoiceHistory />

</div>
    </MainLayout>
  );
}

export default Invoices;