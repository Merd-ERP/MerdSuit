import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/common/PageHeader";
import CompanySettingsForm from "../components/settings/CompanySettingsForm";

function Settings() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl">
        <PageHeader
          title="Company Settings"
          subtitle="Manage the information used across your business documents."
        />
        <CompanySettingsForm />
      </div>
    </MainLayout>
  );
}

export default Settings;
