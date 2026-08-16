import { useState } from "react";

import MainLayout from "../layouts/Mainlayout";

import Card from "../components/common/Card";
import PageHeader from "../components/common/PageHeader";

import SupplierSummary from "../components/suppliers/SupplierSummary";
import SupplierForm from "../components/suppliers/SupplierForm";
import SupplierTable from "../components/suppliers/SupplierTable";

function Suppliers() {
  const [supplierToEdit, setSupplierToEdit] = useState(null);

  return (
    <MainLayout>
      <PageHeader
        title="Suppliers"
        subtitle="Manage your suppliers and vendor information"
      />

      <SupplierSummary />

      <Card className="mt-6">
        <SupplierForm
          supplierToEdit={supplierToEdit}
          setSupplierToEdit={setSupplierToEdit}
        />

        <hr className="my-8" />

        <SupplierTable
          setSupplierToEdit={setSupplierToEdit}
        />
      </Card>
    </MainLayout>
  );
}

export default Suppliers;
