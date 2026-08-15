import { useRef, useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import Modal from "../common/Modal";
import { useToast } from "../../context/ToastContext";

const BACKUP_VERSION = 1;

const backupFields = {
  clients: "array",
  projects: "array",
  quotations: "array",
  invoices: "array",
  receipts: "array",
  inventory: "array",
  suppliers: "array",
  purchaseOrders: "array",
  expenses: "array",
  company: "object",
};

function readStoredValue(key, type) {
  const rawValue = localStorage.getItem(key);

  if (rawValue === null) {
    return type === "array" ? [] : null;
  }

  return JSON.parse(rawValue);
}

function createBackup() {
  const data = Object.fromEntries(
    Object.entries(backupFields).map(([key, type]) => [
      key,
      readStoredValue(key, type),
    ]),
  );

  return {
    application: "MerdSuite",
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  };
}

function validateBackup(backup) {
  if (!backup || typeof backup !== "object" || Array.isArray(backup)) {
    return "This file is not a valid MerdSuite backup.";
  }

  if (backup.application !== "MerdSuite" || backup.version !== BACKUP_VERSION) {
    return "This backup was not created by a compatible version of MerdSuite.";
  }

  if (!backup.data || typeof backup.data !== "object" || Array.isArray(backup.data)) {
    return "The backup data is missing or invalid.";
  }

  for (const [key, type] of Object.entries(backupFields)) {
    const value = backup.data[key];
    const isValid = type === "array"
      ? Array.isArray(value)
      : value === null || (typeof value === "object" && !Array.isArray(value));

    if (!isValid) {
      return `The ${key} data in this backup is invalid.`;
    }
  }

  return null;
}

function BackupRestore() {
  const fileInputRef = useRef(null);
  const { showToast } = useToast();
  const [restoreError, setRestoreError] = useState("");
  const [pendingBackup, setPendingBackup] = useState(null);
  const [isRestoring, setIsRestoring] = useState(false);

  function handleExport() {
    try {
      const backup = createBackup();
      const date = new Date().toISOString().slice(0, 10);
      const file = new Blob([JSON.stringify(backup, null, 2)], {
        type: "application/json;charset=utf-8",
      });
      const downloadUrl = URL.createObjectURL(file);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = `merdsuite-backup-${date}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);

      showToast({
        title: "Backup exported",
        message: "Your MerdSuite backup file has been downloaded.",
      });
    } catch {
      setRestoreError("Unable to export a backup because stored data is invalid.");
    }
  }

  async function handleFileSelected(event) {
    const [file] = event.target.files || [];
    event.target.value = "";

    if (!file) return;

    try {
      const backup = JSON.parse(await file.text());
      const validationError = validateBackup(backup);

      if (validationError) {
        setRestoreError(validationError);
        return;
      }

      setRestoreError("");
      setPendingBackup(backup);
    } catch {
      setRestoreError("This file is invalid or corrupted. No data has been changed.");
    }
  }

  function confirmRestore() {
    if (!pendingBackup) return;

    setIsRestoring(true);
    const currentValues = Object.fromEntries(
      Object.keys(backupFields).map((key) => [key, localStorage.getItem(key)]),
    );

    try {
      Object.entries(backupFields).forEach(([key]) => {
        const value = pendingBackup.data[key];

        if (key === "company" && value === null) {
          localStorage.removeItem(key);
          return;
        }

        localStorage.setItem(key, JSON.stringify(value));
      });

      window.dispatchEvent(new Event("company-settings-updated"));
      window.location.reload();
    } catch {
      Object.entries(currentValues).forEach(([key, value]) => {
        if (value === null) {
          localStorage.removeItem(key);
          return;
        }

        localStorage.setItem(key, value);
      });
      setIsRestoring(false);
      setPendingBackup(null);
      setRestoreError("Unable to restore this backup. Your existing data was not reloaded.");
    }
  }

  return (
    <Card className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Backup & Restore</h2>
        <p className="mt-1 text-sm text-slate-600">
          Download a complete copy of your MerdSuite data or restore a backup you exported earlier.
        </p>
      </div>

      {restoreError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {restoreError}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-medium text-slate-900">Export Backup</h3>
          <p className="mt-1 text-sm text-slate-600">Save all business records and company settings as a JSON file.</p>
        </div>
        <Button onClick={handleExport} className="w-full sm:w-auto">
          Export Backup
        </Button>
      </div>

      <div className="border-t border-slate-200 pt-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-medium text-slate-900">Restore Backup</h3>
            <p className="mt-1 text-sm text-slate-600">Replace current MerdSuite data with a previously exported backup.</p>
          </div>
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto">
            Restore Backup
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleFileSelected}
          className="sr-only"
          aria-label="Select MerdSuite backup file"
        />
      </div>

      <Modal
        isOpen={Boolean(pendingBackup)}
        title="Restore Backup?"
        onClose={() => !isRestoring && setPendingBackup(null)}
        footer={(
          <>
            <Button variant="secondary" onClick={() => setPendingBackup(null)} disabled={isRestoring}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmRestore} loading={isRestoring}>
              Restore Backup
            </Button>
          </>
        )}
      >
        <p className="text-slate-700">
          Restoring this backup will overwrite all current MerdSuite business data and company settings. This action cannot be undone.
        </p>
      </Modal>
    </Card>
  );
}

export default BackupRestore;
