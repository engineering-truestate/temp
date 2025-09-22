import React, { useState } from "react";
import styles from './ProjectDetails.module.css';
import projectPopupStyles from '../Project_popup/ProjectPopup.module.css';
import { useLocation } from "react-router-dom";
import infoIcon from '/assets/icons/ui/info.svg'
import whiteLock from '/assets/icons/ui/info.svg'; // File no longer exists
import { useDispatch, useSelector } from "react-redux";
import { setShowSignInModal } from "../../slices/modalSlice";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";

const InvestmentOverview = ({
  data,
  isReport,
  headingSize
}) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Use the data prop directly since it's already processed in the parent component
  const processedData = data || [];

  console.log("data in inv overview", data);
  console.log("data length:", data?.length);
  console.log("first item:", data?.[0]);
  console.log("second item:", data?.[1]);
  console.log("isAuthenticated:", isAuthenticated);
  console.log("processedData:", processedData);

  // Early return if no data
  if (!processedData || processedData.length === 0) {
    console.log("No data to render in InvestmentOverview");
    return <div>Loading investment data...</div>;
  }

  return (
    <>
      <div className={`rounded-lg w-full  mb-8 sm:mb-10 ${isReport == true ? 'hidden' : ''}`}>
        <h2 className={`mb-2 ${styles.invtitle} ${headingSize ? `${headingSize}` : 'text-[1.125rem]'}`}>Investment Overview</h2>
        <DisclaimerWithToggle styles={styles} />
        <div className={`${styles.invoverviewmain}`}>
          <div className="lg:block md:block hidden px-4">
            <div className={`mb-2 ${styles.invtext_l}`}>{processedData[0]?.value || "1000000"}</div>

            <div className={`${styles.invtext_lb} flex align-middle`}>
              <span>
                {processedData[0]?.label}
              </span>
              {/* more info icon with tooltip  */}
              <div className={`${projectPopupStyles.tooltip} cursor-pointer`}>
                <img src={infoIcon} className="ml-1 mr-2 mt-[1px]" alt="info" />
                <span className={`${projectPopupStyles.tooltiptext} min-w-[120px]`}>
                  Booking Amount + Total Interest + Total Principal
                </span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className={`mb-2 ${styles.invtext_l} ${styles.profit_g} ${processedData[1]?.value && (processedData[1].value.split("")[0] === '-' ? 'text-[red]' : 'text-[#0E8345]')}`}>
              {!isAuthenticated ? 
                <img onClick={() => dispatch(setShowSignInModal({ showSignInModal: true, redirectUrl: ('/properties') }))} className="mx-auto cursor-pointer" src={whiteLock} /> 
                : processedData[1]?.value || "1000000"
              }
            </div>

            <div className={`${styles.invtext_lb} flex align-middle `}>
              <span>
                {processedData[1]?.label}
              </span>
              {/* more info icon with tooltip  */}
              <div className={`${projectPopupStyles.tooltip} cursor-pointer`}>
                <img src={infoIcon} className="ml-1 mr-2 mt-[1px]" alt="info" />
                <span className={`${projectPopupStyles.tooltiptext} min-w-[120px]`}>
                  Est. Selling Price − Purchase Cost − Total Interest − Transfer/Stamp Registration Charges
                </span>
              </div>
            </div>
          </div>

          <div className={`text-left px-1 sm:px-1 sm:pl-2 ${styles.bcr}  flex flex-col justify-evenly`}>
            <div className="text-gray-700 mb-1 md:hidden flex">
              <span className={`mb-2 ${styles.invtext_r}`}>Total Inv </span>

              {/* more info icon with tooltip  */}
              <div className={`${projectPopupStyles.tooltip} cursor-pointer`}>
                <img src={infoIcon} className="ml-1 mr-2 mt-[2px]" alt="info" />
                <span className={`${projectPopupStyles.tooltiptext}`}>
                  Booking Amount + Total Interest + Total Principal
                </span>
              </div>

              <span className={`${styles.invtext_rg} text-[#0A0B0A]`}>{processedData[0]?.value}</span>
            </div>

            <div className="text-gray-700 mb-3 flex items-center">
              <span className={`${styles.invtext_r}`}>
                {processedData[4]?.label}
              </span>

              {/* more info icon with tooltip  */}
              <div className={`${projectPopupStyles.tooltip} cursor-pointer`}>
                <img src={infoIcon} className="ml-1 mr-2 mt-[2px]" alt="info" />
                <span className={`${projectPopupStyles.tooltiptext} min-w-[120px]`}>
                  Calculates an investment's annualized return over irregular cash flow dates, offering a more precise measure than standard IRR.
                </span>
              </div>

              <span className={`${styles.invtext_rg} ${processedData[4]?.value && (processedData[4].value.split("")[0] === '-' ? 'text-[red]' : 'text-[#0E8345]')}`}>
                {!isAuthenticated ? 
                  <img onClick={() => {
                    dispatch(setShowSignInModal({ showSignInModal: true, redirectUrl: ('/properties') }))
                    logEvent(analytics,`click_property_${processedData[4]?.label}_lock`)
                   }
                  } className="cursor-pointer" src={whiteLock} /> 
                  : processedData[4]?.value || "1%"
                }
              </span>
            </div>

            <div className="text-gray-700 mb-3 flex items-center">
              <span className={`${styles.invtext_r}`}>
                {processedData[5]?.label}
              </span>

              {/* more info icon with tooltip  */}
              <div className={`${projectPopupStyles.tooltip} cursor-pointer`}>
                <img src={infoIcon} className="ml-1 mr-2 mt-[2px]" alt="info" />
                <span className={`${projectPopupStyles.tooltiptext} min-w-[120px]`}>
                  Compares total cash returns to total capital invested (ignores time value of money).
                </span>
              </div>

              <span className={`${styles.invtext_rg} ${processedData[5]?.value && (parseFloat(processedData[5].value) < 1 ? 'text-[red]' : 'text-[#0E8345]')}`}>
                {!isAuthenticated ? 
                  <img onClick={() => dispatch(setShowSignInModal({ showSignInModal: true, redirectUrl: ('/properties') }))} className="cursor-pointer" src={whiteLock} /> 
                  : processedData[5]?.value || "1x"
                }
              </span>
            </div>

            <div className="text-gray-700 flex align-middle">
              <span className={`${styles.invtext_r}`}>
                {processedData[6]?.label}
              </span>

              {/* more info icon with tooltip  */}
              <div className={`${projectPopupStyles.tooltip} cursor-pointer`}>
                <img src={infoIcon} className="ml-1 mr-2 mt-[2px]" alt="info" />
                <span className={`${projectPopupStyles.tooltiptext} min-w-[120px]`}>
                  Shows the annualized growth rate of an investment over time, assuming reinvestment of returns each period.
                </span>
              </div>

              <span className={`${styles.invtext_rg} ${processedData[6]?.value && (processedData[6].value.split("")[0] === '-' ? 'text-[red]' : 'text-[#0E8345]')}`}>
                {!isAuthenticated ? 
                  <img onClick={() => dispatch(setShowSignInModal({ showSignInModal: true, redirectUrl: ('/properties') }))} className="cursor-pointer" src={whiteLock} /> 
                  : processedData[6]?.value || '2%'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const DisclaimerWithToggle = ({ styles }) => {
  const [isTruncated, setIsTruncated] = useState(true); // State to toggle truncation
  const location = useLocation();

  // Determine the disclaimer text based on the route
  const disclaimerText = location.pathname.includes("report")
    ? "Disclaimer: These estimates assume an investment made today. Please consult your investment manager before making any decisions."
    : "Disclaimer: These estimates assume an investment made today with a maximum handover period of 4 years. Variations in cashflows, transfer fees, or timelines may impact returns. Please consult your investment manager before making any decisions.";

  const tooLong = location.pathname.includes("report")
    ? disclaimerText.length > 100
    : disclaimerText.length > 205; // Check if the text is too long to truncate

  const toggleTruncate = () => {
    setIsTruncated(!isTruncated);
  };

  return (
    <div
      className={`mb-4 font-lato text-sm flex gap-2 items-start ${tooLong ? "cursor-pointer" : ""
        }`}
      onClick={tooLong ? toggleTruncate : undefined}
    >
      <span
        className={`text-[16px] italic ${styles?.textClass || "text-gray-700"
          } ${isTruncated ? "truncate" : ""}`}
      >
        {disclaimerText}

        {tooLong && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent parent click from toggling
              toggleTruncate();
            }}
            className="text-blue-500 ml-0 underline focus:outline-none flex whitespace-nowrap"
          >
            {isTruncated ? "See More..." : "See Less"}
          </button>
        )}
      </span>
    </div>
  );
};

export default InvestmentOverview;