import { useEffect } from "react";

function Toast({
  show,
  type = "success",
  title,
  message,
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    warning: "bg-yellow-500",
    info: "bg-blue-600",
  };

  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  return (
    <div className="fixed top-5 right-5 z-50 animate-fade-in">
      <div
        className={`text-white rounded-xl shadow-xl px-5 py-4 min-w-[320px] ${colors[type]}`}
      >
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <span className="text-xl">
              {icons[type]}
            </span>

            <div>
              <h3 className="font-bold">
                {title}
              </h3>

              <p className="text-sm mt-1">
                {message}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white ml-3"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toast;