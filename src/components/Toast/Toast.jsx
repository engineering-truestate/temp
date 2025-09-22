import React from "react";
import './ToastStyles.css'; // Import the updated CSS
import dangerIcon from "../../../public/images/danger.png";
import checkCircleIcon from "../../../public/images/check-circle.png";
import close from "../../../public/images/x.png";

const Toast = ({ heading, description, id, type, removeToast }) => {
  // Function to get the appropriate icon based on the type
  const getIcon = () => {
    switch (type) {
      case "success":
        return checkCircleIcon;
      case "error":
        return dangerIcon;
      default:
        return checkCircleIcon; // Default to success icon
    }
  };

  return (
    <div className={`toast ${type}`}>
      {/* Icon section */}
      <div className="toast-icon">
        <img src={getIcon()} alt={type} />
      </div>

      {/* Content section */}
      <div className="toast-content">
        <h4 className="toast-heading">{heading}</h4>
        <p className="toast-description">{description}</p>
      </div>

      {/* Close Button */}
      <button className="toast-close" onClick={() => removeToast(id)}>
        <img src={close}></img>
      </button>
    </div>
  );
};

export default Toast;
