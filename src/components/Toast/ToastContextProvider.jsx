import { createContext, useReducer } from "react";
import { toastReducer } from "./toastReducer.jsx";

export const ToastContext = createContext();

const initialState = {
  toasts: [],
};

export const ToastContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  // Function to add a toast
  const addToast = (message, type = "success", heading, description) => {
    const id = Math.random().toString(36).substring(2, 9);
    dispatch({
      type: "ADD_TOAST",
      payload: { id, message, type, heading, description },
    });

    // Don't auto-remove loading toasts
    if (type !== "loading") {
      setTimeout(() => {
        removeToast(id);
      }, 3000);
    }

    return id; // Return the ID so it can be updated later
  };

  // Function to update an existing toast
  const updateToast = (id, updates) => {
    dispatch({
      type: "UPDATE_TOAST",
      payload: { id, updates }
    });

    // If updating to non-loading type, set auto-remove timer
    if (updates.type && updates.type !== "loading") {
      setTimeout(() => {
        removeToast(id);
      }, 3000);
    }
  };

  // Function to remove a toast
  const removeToast = (id) => {
    dispatch({ type: "REMOVE_TOAST", payload: id });
  };

  const value = {
    addToast,
    updateToast,
    removeToast,
    toasts: state.toasts,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};