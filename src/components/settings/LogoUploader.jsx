import Card from "../common/Card";
import Button from "../common/Button";
import { MAX_LOGO_FILE_SIZE, SUPPORTED_LOGO_TYPES, isSupportedLogoDataUrl } from "../../utils/companySettings";

function LogoUploader({ logo, error, onLogoChange, onError }) {
  function handleFileChange(event) {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;

    if (!SUPPORTED_LOGO_TYPES.includes(file.type)) {
      onError("Use a PNG or JPEG logo.");
      return;
    }
    if (file.size > MAX_LOGO_FILE_SIZE) {
      onError("Logo must be no larger than 512 KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (isSupportedLogoDataUrl(reader.result)) onLogoChange(reader.result);
      else onError("The selected logo could not be read safely.");
    };
    reader.onerror = () => onError("The selected logo could not be read.");
    reader.readAsDataURL(file);
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-slate-800">Branding</h2>
      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50">
          {logo ? <img src={logo} alt="Company logo" className="h-full w-full object-contain" /> : <span className="px-2 text-center text-sm text-slate-400">No logo</span>}
        </div>
        <div><div className="flex flex-wrap gap-2"><label className="inline-flex cursor-pointer rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-900 focus-within:ring-2 focus-within:ring-slate-500 focus-within:ring-offset-2"><span>{logo ? "Change Logo" : "Upload Company Logo"}</span><input type="file" accept="image/png,image/jpeg" onChange={handleFileChange} className="sr-only" /></label>{logo && <Button variant="secondary" onClick={() => onLogoChange("")}>Remove Logo</Button>}</div><p className="mt-2 text-sm text-slate-500">PNG or JPG, up to 512 KB.</p>{error && <p className="mt-1 text-sm text-red-600">{error}</p>}</div>
      </div>
    </Card>
  );
}

export default LogoUploader;
