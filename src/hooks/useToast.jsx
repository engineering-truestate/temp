// 4. Updated useToast Hook
import { useContext } from 'react';
import { ToastContext } from "../components/Toast/ToastContextProvider.jsx";

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastContextProvider");
  }

  return context;
};