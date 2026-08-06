import { useState } from "react";
import CompanyInfo from "./CompanyInfo";
import ContactInfo from "./ContactInfo";
import LogoUploader from "./LogoUploader";
import BankingDetails from "./BankingDetails";
import DocumentDefaults from "./DocumentDefaults";
import Currency from "./Currency";

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
  bankName: "",
  bankAccountName: "",
  bankAccountNumber: "",
  bankBranch: "",
  invoicePrefix: "INV",
  quotationPrefix: "QUO",
  paymentTerms: "30",
};

function CompanySettingsForm() {
  const [company, setCompany] = useState(() => {
    const savedCompany = localStorage.getItem("company");
    return savedCompany
      ? { ...defaultCompany, ...JSON.parse(savedCompany) }
      : defaultCompany;
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setCompany((currentCompany) => ({ ...currentCompany, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
  }

  function handleLogoChange(logo) {
    setCompany((currentCompany) => ({ ...currentCompany, logo }));
  }

  function handleSave() {
    const nextErrors = {
      name: company.name.trim() ? "" : "Company name is required.",
      phone: company.phone.trim() ? "" : "Phone number is required.",
    };

    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.phone) return;

    localStorage.setItem("company", JSON.stringify(company));
    setSaved(true);
  }

  return (
    <div className="space-y-6">
      {saved && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Company settings saved successfully.
        </div>
      )}

      <CompanyInfo company={company} errors={errors} onChange={handleChange} />
      <ContactInfo company={company} errors={errors} onChange={handleChange} />
      <LogoUploader logo={company.logo} onLogoChange={handleLogoChange} />
      <BankingDetails company={company} onChange={handleChange} />
      <DocumentDefaults company={company} onChange={handleChange} />
      <Currency company={company} onChange={handleChange} />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}

export default CompanySettingsForm;
