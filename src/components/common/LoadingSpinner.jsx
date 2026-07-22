function LoadingSpinner({
  text = "Loading...",
  size = "md",
}) {
  const sizes = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div
        className={`animate-spin rounded-full border-4 border-blue-600 border-t-transparent ${sizes[size]}`}
      ></div>

      <p className="mt-3 text-gray-600">{text}</p>
    </div>
  );
}

export default LoadingSpinner;