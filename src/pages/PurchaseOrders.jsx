import { useState } from "react";

import MainLayout from "../layouts/MainLayout";

import Card from "../components/common/Card";
import PageHeader from "../components/common/PageHeader";

import PurchaseOrderSummary from "../components/purchaseOrders/PurchaseOrderSummary";
import PurchaseOrderForm from "../components/purchaseOrders/PurchaseOrderForm";
import PurchaseOrderTable from "../components/purchaseOrders/PurchaseOrderTable";

function PurchaseOrders() {
  const [orderToEdit, setOrderToEdit] = useState(null);

  return (
    <MainLayout>
      <PageHeader
        title="Purchase Orders"
        subtitle="Create, receive and manage supplier purchase orders"
      />

      <PurchaseOrderSummary />

      <Card className="mt-6">
        <PurchaseOrderForm
          orderToEdit={orderToEdit}
          setOrderToEdit={setOrderToEdit}
        />

        <hr className="my-8" />

        <PurchaseOrderTable
          setOrderToEdit={setOrderToEdit}
        />
      </Card>
    </MainLayout>
  );
}

export default PurchaseOrders;