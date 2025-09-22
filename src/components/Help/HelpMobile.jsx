import React, { useEffect } from 'react';
import styles from './HelpMobile.module.css'; // Import the CSS module
import { useNavigate, Link } from 'react-router-dom';
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";
import helpdef from '/assets/images/illustrations/help-default.png'; // Updated path
import InvManagerIcon from "/assets/icons/brands/investment-manager-black.svg";
import InvManager from '../../utils/InvManager';


const HelpMobile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        navigate('/properties');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [navigate]);

  return (
    <div className={styles.outerContainer}>
      <div className={styles.innerContainer}>
        {/* <div className={styles.header}>
          <h4 className={styles.tutorialHeading}>Tutorial</h4>
          <a href="#" className={`flex items-center space-x-1 ${styles.seeAll}`}>
            <span>See all</span>
            <img src="/icons-1/Arrow Right.svg" alt="Arrow Right" className="w-4 h-4" />
            </a>
        </div>
        {[...Array(4)].map((_, index) => (
          <div key={index} className={`${styles.card} `}>
           <img src={helpdef} alt="Tutorial Image" className={styles.cardImage} />
            <div className={`${styles.textContainer} `}>
              <h3 className={`${styles.cardHeading}  `}>How to use TruEstate?</h3>
              <p className={`${styles.cardText}  `}>
                Morem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero.
              </p>
            </div>
          </div>
        ))} */}
        <div className="flex flex-col gap-[24px] mt-[-8px]">
          <Link to={`https://wa.me/${InvManager.phoneNumber}`} target="_blank" className='h-fit rounded-[8px] border-[1px] p-[12px] gap-[10px] border-[#B5B3B3]'
            onClick={() => {
              logEvent(analytics, "click_inside_help_contact_investment_manager", { Name: "contact_investment_manager", });}
                          }
           >
            <div className={`${styles.linkItem} flex items-center justify-between cursor-pointer`}>
              <div className="flex items-center space-x-2">
                <img src={InvManagerIcon} alt="Contact IM" className="w-5 h-5" />
                <span>Contact Inv. Manager</span>
              </div>
              <img src="/icons-1/Arrow Right.svg" alt="Arrow Right" className="w-4 h-4" />
            </div>
          </Link>
          <Link to="/tnc" target="_blank" className='h-fit rounded-[8px] border-[1px] p-[12px] gap-[10px] border-[#B5B3B3]'
            onClick={() => {
                          logEvent(analytics, "click_inside_help_tnc", { Name: "Terms and Conditions", });}
                                  }
          >
            <div className={`${styles.linkItem} flex items-center justify-between cursor-pointer`}>
              <div className="flex items-center space-x-2">
                <img src="/icons-1/tnc.svg" alt="Terms and Conditions" className="w-5 h-5" />
                <span>Terms and Conditions</span>
              </div>
              <img src="/icons-1/Arrow Right.svg" alt="Arrow Right" className="w-4 h-4" />
            </div>
          </Link>
          <Link to="/privacy" target="_blank" className='h-fit rounded-[8px] border-[1px] p-[12px] gap-[10px] border-[#B5B3B3]'
           onClick={() => {
                        logEvent(analytics, "click_inside_help_privacy_policy", { Name: "privacy_policy", });}
                                }>
            <div className={`${styles.linkItem} flex items-center justify-between cursor-pointer`}>
              <div className="flex items-center space-x-2">
                <img src="/icons-1/lock.svg" alt="Privacy Policy" className="w-5 h-5" />
                <span>Privacy Policy</span>
              </div>
              <img src="/icons-1/Arrow Right.svg" alt="Arrow Right" className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HelpMobile;
