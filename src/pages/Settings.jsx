import MainLayout from "../layouts/Mainlayout";
import PageHeader from "../components/common/PageHeader";
import CompanySettingsForm from "../components/settings/CompanySettingsForm";
import BackupRestore from "../components/settings/BackupRestore";

function Settings() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl">
        <PageHeader
          title="Company Settings"
          subtitle="Manage the information used across your business documents."
        />
        <CompanySettingsForm />
        <div className="mt-6">
          <BackupRestore />
        </div>
      </div>
    </MainLayout>
  );
}

export default Settings;
