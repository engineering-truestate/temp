import React from 'react';
import Danger from '/assets/icons/status/warning.svg';
import styles from './requirement.module.css';

const RequirementSubmitAlert = ({ isOpen, onClose, onContinue, continuing }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]">
        <div className="bg-[#FAFAFA] p-6 rounded-lg sm:max-w-sm max-w-[300px] w-full text-left">
          <div className="mb-4">
            <img src={Danger} />
          </div>
          <div className="mb-4">
            <h2 className="text-base font-bold mb-2 font-montserrat">Submit Form ?</h2>
            <h3 className="text-sm font-lato">You can't edit this later.</h3>
          </div>
          <div className="flex justify-between mt-6">
            <button className={`bg-transparent border py-2 px-6 rounded ${styles.cancelbtn}`} onClick={onClose}>Go Back</button>
            <button className={`py-2 px-10 md:px-20 rounded ${styles.continuebtn}`} onClick={onContinue} disabled={continuing}>{!continuing ? "Continue" : "Submiting"}</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default RequirementSubmitAlert;
