import { useEffect, useState } from "react";

import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";

import Button from "../common/Button";

function SupplierForm({
  supplierToEdit,
  setSupplierToEdit,
}) {
  const {
    addSupplier,
    updateSupplier,
  } = useApp();

  const { showToast } = useToast();

  const initialState = {
    company: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (supplierToEdit) {
      setFormData(supplierToEdit);
    }
  }, [supplierToEdit]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function resetForm() {
    setFormData(initialState);
    setSupplierToEdit(null);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.company.trim()) {
      showToast({
        type: "warning",
        message: "Company name is required.",
      });
      return;
    }

    if (supplierToEdit) {
      updateSupplier(formData);

      showToast({
        type: "success",
        message: "Supplier updated successfully.",
      });
    } else {
      addSupplier({
        ...formData,
        id: Date.now(),
      });

      showToast({
        type: "success",
        message: "Supplier added successfully.",
      });
    }

    resetForm();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <input
          className="border rounded-lg p-3"
          placeholder="Company Name *"
          name="company"
          value={formData.company}
          onChange={handleChange}
        />

        <input
          className="border rounded-lg p-3"
          placeholder="Contact Person"
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleChange}
        />

        <input
          className="border rounded-lg p-3"
          placeholder="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          className="border rounded-lg p-3"
          placeholder="Email Address"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          className="border rounded-lg p-3"
          placeholder="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
        />

        <input
          className="border rounded-lg p-3"
          placeholder="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      <textarea
        className="border rounded-lg p-3 w-full"
        rows={4}
        placeholder="Notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
      />

      <div className="flex gap-3">
        <Button type="submit">
          {supplierToEdit
            ? "Update Supplier"
            : "Add Supplier"}
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={resetForm}
        >
          Clear
        </Button>
      </div>
    </form>
  );
}

export default SupplierForm;