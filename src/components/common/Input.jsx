function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  className = "",
  error = "",
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block mb-2 text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={`min-h-11 w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : "border-slate-300"}`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default Input;
