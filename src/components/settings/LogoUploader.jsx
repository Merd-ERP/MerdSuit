import { useState, useEffect } from "react";

function LogoUploader({ logo, onLogoChange }) {
  const [preview, setPreview] = useState(logo || "");

  useEffect(() => {
    setPreview(logo || "");
  }, [logo]);

  function handleFileChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result;

      setPreview(base64);
      onLogoChange(base64);
    };

    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Company Logo
      </h2>

      <div className="flex items-center gap-6">
        <div className="w-32 h-32 border-2 border-dashed rounded-xl flex items-center justify-center overflow-hidden bg-gray-50">
          {preview ? (
            <img
              src={preview}
              alt="Company Logo"
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-gray-400 text-sm text-center px-2">
              No Logo
            </span>
          )}
        </div>

        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block"
          />

          <p className="text-sm text-gray-500 mt-2">
            PNG, JPG or SVG recommended.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LogoUploader;