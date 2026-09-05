import { useRef, useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import Modal from "../common/Modal";
import { useToast } from "../../context/ToastContext";
import { COMPANY_SETTINGS_EVENT, readCompanySettings } from "../../utils/companySettings";
import { applyRestorePayload, backupCompanyDiffers, buildRestorePayload, createBackupFromStorage, preflightBackup } from "../../utils/backup";

function BackupRestore() {
  const fileInputRef = useRef(null);
  const { showToast } = useToast();
  const [pendingRestore, setPendingRestore] = useState(null);
  const [companyConfirmation, setCompanyConfirmation] = useState(null);
  const [isRestoring, setIsRestoring] = useState(false);

  function handleExport() {
    try {
      const backup = createBackupFromStorage();
      const date = new Date().toISOString().slice(0, 10);
      const file = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json;charset=utf-8" });
      const downloadUrl = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `merdsuite-backup-${date}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
      showToast({ type: "success", title: "Backup exported", message: "Your MerdSuite backup file has been downloaded." });
    } catch (error) {
      showToast({ type: "error", title: "Backup export failed", message: error.message || "Stored data could not be exported safely." });
    }
  }

  async function handleFileSelected(event) {
    const [file] = event.target.files || [];
    event.target.value = "";
    if (!file) return;
    try {
      const preflight = preflightBackup(JSON.parse(await file.text()));
      if (!preflight.valid) {
        showToast({ type: "error", title: "Invalid backup file", message: `${preflight.error} No data has been changed.` });
        return;
      }
      setPendingRestore(preflight);
    } catch {
      showToast({ type: "error", title: "Invalid backup file", message: "This file is invalid or corrupted. No data has been changed." });
    }
  }

  function proceedAfterGeneralConfirmation() {
    if (!pendingRestore) return;
    if (backupCompanyDiffers(pendingRestore, readCompanySettings())) {
      setCompanyConfirmation(pendingRestore);
      setPendingRestore(null);
      return;
    }
    performRestore(pendingRestore, false);
  }

  function performRestore(preflight, includeCompany) {
    setIsRestoring(true);
    let payload;
    try {
      payload = buildRestorePayload(preflight, { includeCompany, storage: localStorage });
    } catch (error) {
      setIsRestoring(false);
      showToast({ type: "error", title: "Restore failed", message: error.message });
      return;
    }

    try {
      applyRestorePayload(localStorage, payload);
      if (includeCompany) window.dispatchEvent(new Event(COMPANY_SETTINGS_EVENT));
      window.location.reload();
    } catch (error) {
      setIsRestoring(false);
      setPendingRestore(null);
      setCompanyConfirmation(null);
      showToast({
        type: "error",
        title: "Restore failed",
        message: error.rollbackSucceeded
          ? "The restore could not be completed. Existing data was restored to its previous state."
          : "The restore and automatic rollback could not be completed. Export any accessible data before retrying.",
      });
    }
  }

  return (
    <Card className="space-y-5">
      <div><h2 className="text-lg font-semibold text-slate-900">Backup & Restore</h2><p className="mt-1 text-sm text-slate-600">Download a complete copy of your MerdSuite data or restore a backup you exported earlier.</p></div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-medium text-slate-900">Export Backup</h3><p className="mt-1 text-sm text-slate-600">Save business records, company settings, and document counters as a JSON file.</p></div><Button onClick={handleExport} className="w-full sm:w-auto">Export Backup</Button></div>
      <div className="border-t border-slate-200 pt-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-medium text-slate-900">Restore Backup</h3><p className="mt-1 text-sm text-slate-600">Restore validated business data. Your company profile is preserved unless you approve replacing it separately.</p></div><Button variant="secondary" onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto">Restore Backup</Button></div><input ref={fileInputRef} type="file" accept="application/json,.json" onChange={handleFileSelected} className="sr-only" aria-label="Select MerdSuite backup file" /></div>

      <Modal isOpen={Boolean(pendingRestore)} title="Restore Business Data?" onClose={() => !isRestoring && setPendingRestore(null)} footer={<><Button variant="secondary" onClick={() => setPendingRestore(null)} disabled={isRestoring}>Cancel</Button><Button variant="danger" onClick={proceedAfterGeneralConfirmation} loading={isRestoring}>Continue Restore</Button></>}>
        <p className="text-slate-700">This validated backup will overwrite current business records and document counters. Your current company profile will be preserved unless a separate confirmation asks you to replace it.</p>
      </Modal>

      <Modal isOpen={Boolean(companyConfirmation)} title="Replace Company Profile?" onClose={() => !isRestoring && setCompanyConfirmation(null)} footer={<><Button variant="secondary" onClick={() => performRestore(companyConfirmation, false)} disabled={isRestoring}>Preserve Current Profile</Button><Button variant="danger" onClick={() => performRestore(companyConfirmation, true)} loading={isRestoring}>Replace Company Profile</Button></>}>
        <div className="space-y-3 text-slate-700"><p>This backup contains different company settings for <strong>{companyConfirmation?.company?.name || "an unnamed company"}</strong>.</p><p>Replacing the profile changes current Settings. Historical documents with saved company snapshots remain unchanged.</p></div>
      </Modal>
    </Card>
  );
}

export default BackupRestore;
