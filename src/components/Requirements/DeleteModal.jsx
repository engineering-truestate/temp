import React, { useState } from 'react';
import Danger from '/assets/icons/status/warning.svg';
import styles from './requirement.module.css';
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";

const DeleteModal = ({ isOpen, onClose, onContinue, deleting }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-[#FAFAFA] p-6 rounded-lg sm:max-w-sm max-w-[300px] text-left">
          <div className="mb-4">
            <img src={Danger} />
          </div>
          <div className="mb-4">
            <h2 className="text-base font-bold mb-2 font-montserrat">Delete Requirement ?</h2>
            <h3 className="text-sm font-lato">Your requirement will be permanently deleted.</h3>
          </div>
          <div className="flex justify-between mt-6 gap-[16px]">
            <button 
                className={`bg-transparent border py-2 px-6 rounded ${styles.cancelbtn}`} 
                onClick={onClose}
            >
                Cancel
            </button>
            <button 
                className={`py-2 px-10 md:px-20 rounded ${styles.continuebtn}`} 
                onClick={onContinue}
              disabled={deleting}
               onClickCapture={()=>{logEvent(analytics, "click_delete_requirement", {Name: "delete_requirement", });}}
            > 
                {!deleting ? "Delete" : "Deleting..."} 
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default DeleteModal;
