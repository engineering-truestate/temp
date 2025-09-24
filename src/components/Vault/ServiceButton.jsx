import React, { useState } from "react";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../../firebase.js";
import { raiseRequest } from "../../../slices/apis/vault.js";
import { useToast } from "../../../hooks/useToast.jsx";
import ServiceConfirmationModal from "./ServiceConfirmationModal";

const ServiceButton = ({ service, project, userPhoneNumber, clickedServices, setClickedServices }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { addToast } = useToast();

  const isServiceClicked = clickedServices.some(
    (clickedService) => clickedService.name === service.title
  );

  const handleRaiseRequest = async () => {
    try {
      logEvent(analytics, "vault_service_button_click", { name: service.title });
      
      const result = await raiseRequest(service.title, project, userPhoneNumber);
      
      if (result.success) {
        setClickedServices((prev) => [
          ...prev,
          { name: service.title, status: "pending" },
        ]);
        addToast("Update Successful", "success", `Scheduled for ${service.title}`);
      } else {
        addToast("Error", "error", result.message);
      }
    } catch (error) {
      console.error("Error in handleRaiseRequest:", error);
      addToast("Error", "error", error.message);
    } finally {
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      <button
        onClick={() => !isServiceClicked && setShowConfirmModal(true)}
        className={`rounded px-6 py-2 flex items-center gap-2 hover:bg-gray-100 transition border border-gray-300 ${
          isServiceClicked ? "opacity-50 pointer-events-none" : ""
        }`}
        disabled={isServiceClicked}
      >
        <img src={service.icon} alt={service.title} className="w-4 h-4" />
        <span className="font-lato text-[0.875rem] font-medium">{service.title}</span>
      </button>

      <ServiceConfirmationModal
        isOpen={showConfirmModal}
        serviceTitle={service.title}
        onConfirm={handleRaiseRequest}
        onCancel={() => setShowConfirmModal(false)}
      />
    </>
  );
};

export default ServiceButton;