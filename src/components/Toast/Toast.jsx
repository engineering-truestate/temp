
import './ToastStyles.css';
import dangerIcon from "../../../public/images/danger.png";
import checkCircleIcon from "../../../public/images/check-circle.png";
import close from "../../../public/images/x.png";

const Toast = ({ heading, description, id, type, removeToast }) => {
  console.log("Toast component rendered with type:", type); // Debug log

  // Function to get the appropriate icon based on the type
  const getIcon = () => {
    switch (type) {
      case "success":
        return checkCircleIcon;
      case "error":
        return dangerIcon;
      case "loading":
        return null; // We'll use a spinner instead
      default:
        return checkCircleIcon;
    }
  };

  const renderIcon = () => {
    if (type === "loading") {
      return <div className="loading-spinner"></div>;
    } else {
      return <img src={getIcon()} alt={type} />;
    }
  };

  return (
    <div className={`toast ${type}`}>
      {/* Icon section */}
      <div className="toast-icon">
        {renderIcon()}
      </div>

      {/* Content section */}
      <div className="toast-content">
        <h4 className="toast-heading">{heading}</h4>
        <p className="toast-description">{description}</p>
      </div>

      {/* Close Button - hide for loading toasts */}
      {type !== "loading" && (
        <button className="toast-close" onClick={() => removeToast(id)}>
          <img src={close} alt="close" />
        </button>
      )}
    </div>
  );
};

export default Toast;