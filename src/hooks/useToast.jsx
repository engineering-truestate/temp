import { useContext } from 'react';
import { ToastContext } from "../components/Toast/ToastContextProvider.jsx";

export const useToast = () => {
  const context = useContext(ToastContext); // Access the ToastContext
   // Add this log

  if (!context) {
    throw new Error("useToast must be used within a ToastContextProvider");
  }

  return context; // Return the context with addToast and removeToast functions
};
