function EmptyState({
  title = "Nothing here yet",
  message = "",
}) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📦</div>

      <h3 className="text-xl font-semibold mb-2">
        {title}
      </h3>

      {message && (
        <p className="text-gray-500">
          {message}
        </p>
      )}
    </div>
  );
}

export default EmptyState;