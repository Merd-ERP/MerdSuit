import { createContext, useContext, useState } from "react";
import Toast from "../components/common/Toast";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  function showToast({
    type = "success",
    title,
    message,
  }) {
    setToast({
      show: true,
      type,
      title,
      message,
    });
  }

  function hideToast() {
    setToast((prev) => ({
      ...prev,
      show: false,
    }));
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <Toast
        show={toast.show}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}