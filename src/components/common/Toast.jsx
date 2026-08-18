import { useEffect } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";

function Toast({
  id,
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
  }, [id, show, duration, onClose]);

  if (!show) return null;

  const variants = {
    success: {
      Icon: CheckCircle2,
      icon: "bg-emerald-100 text-emerald-700",
      border: "border-emerald-200",
      defaultTitle: "Success",
    },
    error: {
      Icon: CircleAlert,
      icon: "bg-red-100 text-red-700",
      border: "border-red-200",
      defaultTitle: "Error",
    },
    warning: {
      Icon: TriangleAlert,
      icon: "bg-amber-100 text-amber-700",
      border: "border-amber-200",
      defaultTitle: "Warning",
    },
    info: {
      Icon: Info,
      icon: "bg-blue-100 text-blue-700",
      border: "border-blue-200",
      defaultTitle: "Information",
    },
  };

  const variant = variants[type] || variants.info;
  const Icon = variant.Icon;

  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-[100] sm:left-auto sm:right-5 sm:top-5 sm:w-full sm:max-w-sm">
      <div
        role={type === "error" || type === "warning" ? "alert" : "status"}
        aria-live={type === "error" || type === "warning" ? "assertive" : "polite"}
        className={`toast-enter pointer-events-auto w-full rounded-xl border bg-white p-4 text-slate-800 shadow-xl ${variant.border}`}
      >
        <div className="flex items-start gap-3">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${variant.icon}`}>
            <Icon aria-hidden="true" className="h-5 w-5" />
          </span>

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900">
              {title || variant.defaultTitle}
            </h3>

            {message && (
              <p className="mt-1 break-words text-sm text-slate-600">
                {message}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification"
            className="-mr-1 -mt-1 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toast;
