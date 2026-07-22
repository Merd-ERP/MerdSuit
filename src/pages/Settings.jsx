import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";

function Settings() {
  const [company, setCompany] = useState({
    name: "",
    tagline: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("company"));

    if (saved) {
      setCompany(saved);
    }
  }, []);

  function saveCompany() {
    localStorage.setItem(
      "company",
      JSON.stringify(company)
    );

    alert("Company information saved successfully.");
  }

  return (
    <MainLayout>
      <h1 className="text-4xl font-bold mb-6">
        Company Settings
      </h1>

      <div className="bg-white rounded-xl shadow p-6">

        <div className="grid grid-cols-2 gap-4">

          <input
            placeholder="Company Name"
            value={company.name}
            onChange={(e) =>
              setCompany({
                ...company,
                name: e.target.value,
              })
            }
            className="border rounded-lg p-2"
          />

          <input
            placeholder="Tagline"
            value={company.tagline}
            onChange={(e) =>
              setCompany({
                ...company,
                tagline: e.target.value,
              })
            }
            className="border rounded-lg p-2"
          />

          <input
            placeholder="Phone"
            value={company.phone}
            onChange={(e) =>
              setCompany({
                ...company,
                phone: e.target.value,
              })
            }
            className="border rounded-lg p-2"
          />

          <input
            placeholder="Email"
            value={company.email}
            onChange={(e) =>
              setCompany({
                ...company,
                email: e.target.value,
              })
            }
            className="border rounded-lg p-2"
          />

          <input
            placeholder="Website"
            value={company.website}
            onChange={(e) =>
              setCompany({
                ...company,
                website: e.target.value,
              })
            }
            className="border rounded-lg p-2"
          />

          <input
            placeholder="Address"
            value={company.address}
            onChange={(e) =>
              setCompany({
                ...company,
                address: e.target.value,
              })
            }
            className="border rounded-lg p-2"
          />

        </div>

        <button
          onClick={saveCompany}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Save Company
        </button>

      </div>
    </MainLayout>
  );
}

export default Settings;