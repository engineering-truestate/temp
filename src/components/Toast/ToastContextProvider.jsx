import { createContext, useReducer } from "react";
import { toastReducer } from "./toastReducer.jsx"; // Assuming you have this reducer

export const ToastContext = createContext(); // Create the context

const initialState = {
  toasts: [], // Initialize with an empty toasts array
};

// Context provider component
export const ToastContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  // Function to add a toast
  const addToast = (message, type = "success" , heading , description) => {
    const id = Math.random().toString(36).substring(2, 9); // Generate a unique ID for each toast
    dispatch({
      type: "ADD_TOAST",
      payload: { id, message, type , heading , description },
    });

    // Automatically remove the toast after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  // Function to remove a toast
  const removeToast = (id) => {
    dispatch({ type: "REMOVE_TOAST", payload: id });
  };

  // Initialize the value **before using it**
  const value = {
    addToast,
    removeToast,
    toasts: state.toasts, // Pass down the current toasts
  };

  // Log the value for debugging purposes
  

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};
