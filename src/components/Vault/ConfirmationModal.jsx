const warningIcon = '/assets/ui/icons/caution.svg';
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";


const ConfirmationModal = ({ isOpen, onConfirm, onCancel, title="Want to leave this page?", message, submitLabel="Continue" }) => {
  if (!isOpen) return null; // Only render if isOpen is true

  return (
    <div className="fixed inset-0 z-[999] flex justify-center items-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <div className="flex flex-col gap-2">
          <img src={warningIcon} alt="Success" className="w-6 h-6" />
          <h2 className="text-[16px] font-montserrat font-bold">{title}</h2>
        </div>
        <p className="font-lato leading-[21px] text-[#433F3E] font-medium mb-4 max-w-[300px] text-[14px] mt-[6px]">
          {message || "You have unsaved changes in the form. Any unsaved data will be lost."}
        </p>
        <div className="flex gap-2 justify-between text-[14px]">
          <button
            className="px-4 py-2 w-full border-[1px] border-[#153E3B] text-[#153E3B] rounded-[4px] font-lato text-[14px] font-semibold leading-[21px]"
            onClick={() => {
              onCancel()
              logEvent(analytics, "click_inside_vault_form_drop", {Name: "form dropped",});
            }
            }
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 w-full bg-[#153E3B] text-[#FAFBFC] rounded-[4px] font-lato text-[14px] font-semibold leading-[21px]"
            onClick={onConfirm}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
