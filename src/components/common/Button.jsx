function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  loading = false,
  ariaLabel,
}) {
  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white",

    secondary:
      "bg-gray-200 hover:bg-gray-300 text-gray-800",

    success:
      "bg-green-600 hover:bg-green-700 text-white",

    warning:
      "bg-yellow-500 hover:bg-yellow-600 text-white",

    danger:
      "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      className={`
        px-4
        min-h-10 py-2
        rounded-xl
        font-medium
        transition
        duration-200 shadow-sm hover:shadow
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
    >
        {loading ? "Loading..." : children}
    </button>
  );
}

export default Button;
