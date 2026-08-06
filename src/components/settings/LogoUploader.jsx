import Card from "../common/Card";

function LogoUploader({ logo, onLogoChange }) {
  function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => onLogoChange(reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-slate-800">Branding</h2>
      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50">
          {logo ? <img src={logo} alt="Company logo" className="h-full w-full object-contain" /> : <span className="px-2 text-center text-sm text-slate-400">No logo</span>}
        </div>
        <div><label className="inline-flex cursor-pointer rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-900"><span>{logo ? "Change Logo" : "Upload Company Logo"}</span><input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" /></label><p className="mt-2 text-sm text-slate-500">PNG, JPG, or SVG recommended.</p></div>
      </div>
    </Card>
  );
}

export default LogoUploader;
