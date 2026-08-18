import { useEffect, useState } from "react";
import MainLayout from "../layouts/Mainlayout";
import { useToast } from "../context/ToastContext";

const defaultCompany = {
  companyName: "IbraMerd Electricals",
  slogan: "Commercial Electrical Contractors",
  address: "",
  city: "",
  phone: "",
  email: "",
  website: "",
  taxNumber: "",
  logo: "",
};

function CompanyProfile() {
  const { showToast } = useToast();
  const [company, setCompany] = useState(defaultCompany);

  useEffect(() => {
    const saved = localStorage.getItem("company");

    if (saved) {
      setCompany(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    setCompany({
      ...company,
      [e.target.name]: e.target.value,
    });
  };

  const saveCompany = () => {
    localStorage.setItem(
      "company",
      JSON.stringify(company)
    );

    showToast({
      type: "success",
      title: "Company profile saved",
      message: "Company profile saved successfully.",
    });
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">

        <div>
          <h1 className="text-4xl font-bold">
            Company Profile
          </h1>

          <p className="text-slate-500 mt-2">
            Update your business information once.
            Every quotation, invoice and report
            will use these details automatically.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 grid md:grid-cols-2 gap-5">

          <input
            className="border rounded-lg p-3"
            name="companyName"
            placeholder="Company Name"
            value={company.companyName}
            onChange={handleChange}
          />

          <input
            className="border rounded-lg p-3"
            name="slogan"
            placeholder="Business Slogan"
            value={company.slogan}
            onChange={handleChange}
          />

          <input
            className="border rounded-lg p-3"
            name="phone"
            placeholder="Phone"
            value={company.phone}
            onChange={handleChange}
          />

          <input
            className="border rounded-lg p-3"
            name="email"
            placeholder="Email"
            value={company.email}
            onChange={handleChange}
          />

          <input
            className="border rounded-lg p-3"
            name="website"
            placeholder="Website"
            value={company.website}
            onChange={handleChange}
          />

          <input
            className="border rounded-lg p-3"
            name="taxNumber"
            placeholder="Tax Number"
            value={company.taxNumber}
            onChange={handleChange}
          />

          <input
            className="border rounded-lg p-3 md:col-span-2"
            name="address"
            placeholder="Address"
            value={company.address}
            onChange={handleChange}
          />

          <input
            className="border rounded-lg p-3 md:col-span-2"
            name="city"
            placeholder="City"
            value={company.city}
            onChange={handleChange}
          />

        </div>

        <div className="flex justify-end">
          <button
            onClick={saveCompany}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Save Company Profile
          </button>
        </div>

      </div>
    </MainLayout>
  );
}

export default CompanyProfile;
