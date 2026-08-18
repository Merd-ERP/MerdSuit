import { createContext, useCallback, useContext, useState } from "react";
import Toast from "../components/common/Toast";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    id: 0,
    show: false,
    type: "success",
    title: "",
    message: "",
    duration: 3000,
  });

  const showToast = useCallback(({
    type = "success",
    title = "",
    message = "",
    duration = 3000,
  }) => {
    setToast((currentToast) => ({
      id: currentToast.id + 1,
      show: true,
      type,
      title,
      message,
      duration,
    }));
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({
      ...prev,
      show: false,
    }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <Toast
        id={toast.id}
        show={toast.show}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        duration={toast.duration}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
