import { useState } from "react";

import MainLayout from "../layouts/MainLayout";

import Card from "../components/common/Card";
import PageHeader from "../components/common/PageHeader";

import InventorySummary from "../components/inventory/InventorySummary";
import InventoryForm from "../components/inventory/InventoryForm";
import InventoryTable from "../components/inventory/InventoryTable";

function Inventory() {
  const [itemToEdit, setItemToEdit] = useState(null);

  return (
    <MainLayout>
      <PageHeader
        title="Inventory"
        subtitle="Manage electrical materials and stock levels"
      />

      <InventorySummary />

      <Card className="mt-6">
        <InventoryForm
          itemToEdit={itemToEdit}
          setItemToEdit={setItemToEdit}
        />

        <hr className="my-8" />

        <InventoryTable
          setItemToEdit={setItemToEdit}
        />
      </Card>
    </MainLayout>
  );
}

export default Inventory;