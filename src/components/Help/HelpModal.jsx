import React, { useEffect, useRef } from 'react';
import helpdef from '/assets/images/illustrations/help-default.png';
import InvManagerIcon from "/assets/icons/brands/investment-manager-black.svg";
import closecircle from '/assets/icons/navigation/btn-close.svg';
import styles from './Helpmodal.module.css'; // Assuming you have a CSS file named HelpModal.module.css
import { useNavigate, Link } from 'react-router-dom';
import InvManager from '../../utils/InvManager';
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";
import image from "../../../public/images/tnc.svg"

const HelpModal = ({ closeHelpModal, helpModalRef }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        navigate('/help');
        closeHelpModal();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [navigate, closeHelpModal]);

  const handleNavigate = (path) => {
    closeHelpModal();
    navigate(path);
  }

  return (
    <div ref={helpModalRef} className={`  rounded-lg shadow-lg w-full max-w-[360px] md:max-w-[390px] h-auto max-h-[455px] md:max-h-[539px] p-6 pt-3 absolute md:bottom-10 md:left-[144px] lg:left-[224px] md:z-[9999] ${styles.helpModal}`}>
      <div className={` overflow-y-auto h-full ${styles.modalContent}`}>
        <div className={`flex justify-between items-center border-b pb-2 mb-4 ${styles.modalHeader}`}>
          <h2 className={styles.helpHeading}>Help</h2>
          <img src={closecircle} alt="Close Icon" onClick={closeHelpModal} className="cursor-pointer" />
        </div>
        {/* <div className="flex justify-between items-center mb-4">
          <h4 className={styles.tutorialHeading}>Tutorial</h4>
          <a href="#" className={`${styles.labelSmall} flex items-center space-x-1`}>
            <span>See all</span>
            <img src="/icons-1/Arrow Right.svg" alt="Arrow Right" className="w-4 h-4" />
          </a>
        </div>
        <div className=" space-y-2">
          {[...Array(3)].map((_, index) => (
            <div key={index} className={`flex items-center p-4 border rounded-lg shadow-sm ${styles.card}`}>
              <img src={helpdef} alt="TruEstate" className="w-12 h-12 mr-4" />
              <div>
                <h3 className={styles.cardHeading}>How to use TruEstate?</h3>
                <p className={styles.cardText}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero.
                </p>
              </div>
            </div>
          ))}
        </div> */}
        <div className="mt-6 h-17">
          <Link to={`https://wa.me/${InvManager.phoneNumber}`} target="_blank" className={`cursor-pointer flex justify-between items-center mb-6 ${styles.labelSmall1} hover:underline`}
            onClick={() => {
              logEvent(analytics, "click_inside_help_contact_investment_manager", { Name: "contact_investment_manager", });}
                      }>
            <div className=" flex items-center space-x-2 text-black">
              <img src={InvManagerIcon} alt="Contact IM" className="w-5 h-5" />
              <span>Contact Investment Manager</span>
            </div>
            <img src="../../../public/images/Arrow Right.svg" alt="Arrow Right" className="w-5 h-5" />
          </Link>
          <Link to="/tnc" target="_blank" className={`cursor-pointer flex justify-between items-center mb-6 ${styles.labelSmall1} hover:underline`}
            onClick={() => {
              logEvent(analytics, "click_inside_help_tnc", { Name: "Terms and Conditions", });}
                      }
          >
            <div className=" flex items-center space-x-2">
              <img src="../../../public/images/tnc.svg" alt="Terms and Conditions" className="w-5 h-5" />
              <span>Terms and Conditions</span>
            </div>
            <img src="../../../public/images/Arrow Right.svg" alt="Arrow Right" className="w-5 h-5" />
          </Link>
          <Link to="/privacy" target="_blank" className={`cursor-pointer flex justify-between  items-center ${styles.labelSmall1} hover:underline`}
           onClick={() => {
              logEvent(analytics, "click_inside_help_privacy_policy", { Name: "privacy_policy", });}
                      }
          >
            <div className=" flex items-center space-x-2">
              <img src="../../../public/images/lock.svg" alt="Privacy Policy" className="w-5 h-5" />
              <span>Privacy Policy</span>
            </div>
            <img src="../../../public/images/Arrow Right.svg" alt="Arrow Right" className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
