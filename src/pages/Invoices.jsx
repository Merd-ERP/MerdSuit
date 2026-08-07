import MainLayout from "../layouts/MainLayout";
import Card from "../components/common/Card";
import PageHeader from "../components/common/PageHeader";
import InvoiceHeader from "../components/invoices/InvoiceHeader";
import InvoiceStats from "../components/invoices/InvoiceStats";
import InvoiceQuickActions from "../components/invoices/InvoiceQuickActions";
import InvoiceTable from "../components/invoices/InvoiceTable";

function Invoices() {
  return <MainLayout><PageHeader title="Invoices" subtitle="Track invoice status and customer payments." /><InvoiceHeader /><InvoiceStats /><InvoiceQuickActions /><Card><InvoiceTable /></Card></MainLayout>;
}

export default Invoices;
