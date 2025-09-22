import React from "react";
import infoIcon from "/assets/icons/ui/info.svg";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";

const InvestmentAlertModal = ({
  isOpen,
  setIsOpen,
  title = "Want to leave this page?",
  message,
  submitLabel = "Continue",
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    // Close modal only if the click is on the backdrop, not the content
    if (e.target.id === "modal-backdrop") {
      setIsOpen(false);
    }
  };

  return (
    <div
      id="modal-backdrop"
      className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 px-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <div className="flex flex-col gap-2">
          <img src={infoIcon} alt="Success" className="w-6 h-6" />
          <h2 className="text-[16px] font-montserrat font-bold">{title}</h2>
        </div>
        <p className="font-lato leading-[21px] text-[#433F3E] font-medium mb-4 max-w-[300px] text-[14px] mt-[6px]">
          {message ||
            "You have unsaved changes in the form. Any unsaved data will be lost."}
        </p>
        <div className="flex gap-2 justify-between text-[14px]">
          <button
            className="px-4 py-2 w-full bg-[#153E3B] text-[#FAFBFC] rounded-[4px] font-lato text-[14px] font-semibold leading-[21px]"
            onClick={() => {
              setIsOpen(false) 
              logEvent(analytics, `click_inside_vault_back_to_vault`, { Name: `vaultinvestment_back_to_vault` });
            }}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentAlertModal;
