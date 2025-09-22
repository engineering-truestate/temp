import React from "react";
import Toast from "./Toast.jsx"; // Make sure you import your Toast component


const ToastsContainer = ({ toasts, removeToast }) => {

   

  return (
    <div className="toasts-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          removeToast={removeToast}
          heading={toast.heading}
          description={toast.description}
        />
      ))}
    </div>
  );
};

export default ToastsContainer;
