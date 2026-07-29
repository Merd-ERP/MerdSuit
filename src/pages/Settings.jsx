import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import LogoUploader from "../components/settings/LogoUploader";

const defaultCompany = {
  name: "",
  tagline: "",
  address: "",
  city: "",
  country: "Ghana",
  phone: "",
  email: "",
  website: "",
  currency: "GH₵",
  taxNumber: "",
  logo: "",
};

function Settings() {
  const [company, setCompany] = useState(defaultCompany);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("company");

    if (stored) {
      setCompany({
        ...defaultCompany,
        ...JSON.parse(stored),
      });
    }
  }, []);

  function handleChange(e) {
    setCompany({
      ...company,
      [e.target.name]: e.target.value,
    });
  }

  function saveCompany() {
    localStorage.setItem("company", JSON.stringify(company));

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          Company Settings
        </h1>

        <p className="text-gray-500 mb-8">
          Manage the information that appears on quotations,
          invoices, reports and purchase orders.
        </p>

        {saved && (
          <div className="mb-6 rounded-lg bg-green-100 text-green-700 px-4 py-3">
            Company information saved successfully.
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-8 space-y-8">

  <LogoUploader
    logo={company.logo}
    onLogoChange={(logo) =>
      setCompany({
        ...company,
        logo,
      })
    }
  />

  {/* Company Information */}

  <div>
            <h2 className="text-xl font-semibold mb-4">
              Company Information
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <input
                name="name"
                placeholder="Company Name"
                value={company.name}
                onChange={handleChange}
                className="border rounded-lg p-3"
              />

              <input
                name="tagline"
                placeholder="Business Slogan"
                value={company.tagline}
                onChange={handleChange}
                className="border rounded-lg p-3"
              />

            </div>
          </div>

          {/* Contact */}

          <div>
            <h2 className="text-xl font-semibold mb-4">
              Contact Information
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <input
                name="phone"
                placeholder="Phone Number"
                value={company.phone}
                onChange={handleChange}
                className="border rounded-lg p-3"
              />

              <input
                name="email"
                placeholder="Email Address"
                value={company.email}
                onChange={handleChange}
                className="border rounded-lg p-3"
              />

              <input
                name="website"
                placeholder="Website"
                value={company.website}
                onChange={handleChange}
                className="border rounded-lg p-3 md:col-span-2"
              />

            </div>
          </div>

          {/* Address */}

          <div>
            <h2 className="text-xl font-semibold mb-4">
              Business Address
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <input
                name="address"
                placeholder="Street Address"
                value={company.address}
                onChange={handleChange}
                className="border rounded-lg p-3 md:col-span-2"
              />

              <input
                name="city"
                placeholder="City"
                value={company.city}
                onChange={handleChange}
                className="border rounded-lg p-3"
              />

              <input
                name="country"
                placeholder="Country"
                value={company.country}
                onChange={handleChange}
                className="border rounded-lg p-3"
              />

            </div>
          </div>

          {/* Business Details */}

          <div>
            <h2 className="text-xl font-semibold mb-4">
              Business Details
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <select
                name="currency"
                value={company.currency}
                onChange={handleChange}
                className="border rounded-lg p-3"
              >
                <option>GH₵</option>
                <option>$</option>
                <option>£</option>
                <option>€</option>
              </select>

              <input
                name="taxNumber"
                placeholder="Tax / VAT Number"
                value={company.taxNumber}
                onChange={handleChange}
                className="border rounded-lg p-3"
              />

            </div>
          </div>

          <button
            onClick={saveCompany}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Save Company Settings
          </button>

        </div>
      </div>
    </MainLayout>
  );
}

export default Settings;