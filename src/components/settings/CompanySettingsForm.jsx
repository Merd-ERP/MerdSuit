import { useState } from "react";
import { useToast } from "../../context/ToastContext";
import CompanyInfo from "./CompanyInfo";
import ContactInfo from "./ContactInfo";
import LogoUploader from "./LogoUploader";
import BankingDetails from "./BankingDetails";
import DocumentDefaults from "./DocumentDefaults";
import Currency from "./Currency";
import Button from "../common/Button";
import {
  COMPANY_SETTINGS_EVENT,
  readCompanySettings,
  validateCompanySettings,
} from "../../utils/companySettings";

function CompanySettingsForm() {
  const { showToast } = useToast();
  const [company, setCompany] = useState(() => readCompanySettings());
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setCompany((currentCompany) => ({ ...currentCompany, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
  }

  function handleLogoChange(logo, error = "") {
    setCompany((currentCompany) => ({ ...currentCompany, logo }));
    setErrors((currentErrors) => ({ ...currentErrors, logo: error }));
  }

  function handleLogoError(error) {
    setErrors((currentErrors) => ({ ...currentErrors, logo: error }));
  }

  function handleSave() {
    const validation = validateCompanySettings(company);
    setErrors(validation.errors);
    if (!validation.valid) {
      showToast({ type: "warning", title: "Check company settings", message: "Correct the highlighted fields before saving." });
      return;
    }

    try {
      localStorage.setItem("company", JSON.stringify(validation.company));
      setCompany(validation.company);
      window.dispatchEvent(new Event(COMPANY_SETTINGS_EVENT));
      showToast({
        type: "success",
        title: "Settings saved",
        message: "Company settings saved successfully.",
      });
    } catch {
      showToast({
        type: "error",
        title: "Settings not saved",
        message: "MerdSuite could not save these settings. Check available browser storage and try again.",
      });
    }
  }

  return (
    <div className="space-y-6">
      <CompanyInfo company={company} errors={errors} onChange={handleChange} />
      <ContactInfo company={company} errors={errors} onChange={handleChange} />
      <LogoUploader logo={company.logo} error={errors.logo} onLogoChange={handleLogoChange} onError={handleLogoError} />
      <BankingDetails company={company} onChange={handleChange} />
      <DocumentDefaults company={company} errors={errors} onChange={handleChange} />
      <Currency company={company} error={errors.currency} onChange={handleChange} />

      <div className="flex justify-end">
        <Button type="button" onClick={handleSave}>
          Save Settings
        </Button>
      </div>
    </div>
  );
}

export default CompanySettingsForm;
