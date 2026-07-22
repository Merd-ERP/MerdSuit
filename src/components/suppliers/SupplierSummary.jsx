import { useApp } from "../../context/AppContext";

function SupplierSummary() {
  const { suppliers } = useApp();

  const totalSuppliers = suppliers.length;

  const suppliersWithEmail = suppliers.filter(
    (supplier) => supplier.email?.trim() !== ""
  ).length;

  const suppliersWithPhone = suppliers.filter(
    (supplier) => supplier.phone?.trim() !== ""
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-sm text-gray-500">Total Suppliers</h3>
        <p className="text-3xl font-bold mt-2">{totalSuppliers}</p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-sm text-gray-500">
          Suppliers with Phone
        </h3>
        <p className="text-3xl font-bold mt-2">
          {suppliersWithPhone}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-sm text-gray-500">
          Suppliers with Email
        </h3>
        <p className="text-3xl font-bold mt-2">
          {suppliersWithEmail}
        </p>
      </div>
    </div>
  );
}

export default SupplierSummary;