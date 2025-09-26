import React, { useState, useEffect } from "react";
import styles from "./ProjectDetails.module.css";
import projectPopupStyles from "../Project_popup/ProjectPopup.module.css";
import { useLocation } from "react-router-dom";
import infoIcon from "/assets/icons/ui/info.svg";
import { useDispatch, useSelector } from "react-redux";
import { setShowSignInModal } from "../../slices/modalSlice";
import calender from "/assets/icons/ui/info.svg";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";
import truEstimateSymbol from "/assets/icons/brands/truestate-logo-alt.svg";
import FractionalInvestment from "./FractionalInvestmentGant";
import { red } from "@mui/material/colors";

const FractionalIvestmentCom = ({ data, isReport, headingSize }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 769);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 769);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to check if a field has a valid value
  const hasValidValue = (item) => {
    if (!item || !item.value) return false;
    if (item.value === "N/A" || item.value === "NA") return false;
    if (typeof item.value === 'string' && item.value.trim() === '') return false;
    return true;
  };

  // Check if main investment section should be displayed
  const shouldShowInvestmentSection = hasValidValue(data?.[0]) && hasValidValue(data?.[2]);

  return (
    <>
      <div className={`rounded-lg w-full mb-[36px] sm:mb-9`}>
        {shouldShowInvestmentSection && (
          <>
            <h2
              className={`mb-0.8 ${styles.invtitle} ${
                headingSize ? headingSize : "text-[1.125rem]"
              }`}
            >
              Partial Buy-In Investment Option
            </h2>
            
            <p className="text-black text-[14px] font-[Lato]">
              Buy a high-value auction property with other buyers to get democratized access to lucrative deals.
            </p>

            {hasValidValue(data?.[0]) && (
              <>
                <span className={`${styles.finvtext_lb} mb-2 mr-[8px]`}>
                  {data[0]?.label}:
                </span>
                <span className={`${styles.invtext_l} mb-2`}>
                  {data[0]?.value}
                </span>
              </>
            )}

            <FractionalInvestment
              seatsFilled={data?.[1]?.value}
              totalSeats={data?.[2]?.value}
              lastDate={data?.[3]?.value}
            />
          </>
        )}

        {/* Desktop Layout */}
        {!isMobile ? (
          <div
            className={`flex row gap-2 ${styles.invoverviewmain}`}
            style={{ background: "var(--Secondary-Secondary100, #FFFBE9)" }}
          >
            {/* Reserve Price */}
            {hasValidValue(data?.[4]) && (
              <div className="flex flex-col pl-4 py-3.5">
                <div>
                  <div className={`${styles.invtext_lb} flex items-center justify-center mb-1`}>
                    <span className="text-center pr-1.5">{data[4]?.label}</span>
                    <div className={`${projectPopupStyles.tooltip} cursor-pointer`}>
                      <img src={infoIcon} alt="info" />
                      <span className={`${projectPopupStyles.tooltiptext} min-w-[120px]`}>
                        Minimum price set for the auction.
                      </span>
                    </div>
                  </div>
                  <div className={`mb-1.5 ${styles.invtext_l} text-center`}>
                    ₹{data[4]?.value} Cr
                  </div>
                  {hasValidValue(data?.[11]) && (
                    <div className="text-[14px] text-gray-800 text-center font-lato">
                      ₹{Number((parseFloat(data[4]?.value) * 10000000 / data[11]?.value).toFixed(0)).toLocaleString("en-IN")} /Sq ft
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TruEstimate */}
            {hasValidValue(data?.[6]) && (
              <div className="flex pl-4 py-3.5 justify-start">
                <div>
                  <div className={`${styles.invtext_lb} flex justify-start`}>
                    <img className="pr-0.5 h-4 w-4" src={truEstimateSymbol} alt="T" />
                    <span className="text-left">{data[6]?.label}</span>
                  </div>
                  <div className={`mb-1.5 ${styles.invtext_l} text-center`}>
                    ₹{data[6]?.value} Cr
                  </div>
                  {hasValidValue(data?.[11]) && (
                    <div className="text-[14px] text-gray-800 text-center font-lato">
                      ₹{Number((parseFloat(data[6]?.value) * 10000000 / data[11]?.value).toFixed(0)).toLocaleString("en-IN")} /Sq ft
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Expected Sale Price */}
            {hasValidValue(data?.[7]) && (
              <div className="flex pl-4 py-3.5 justify-start">
                <div>
                  <div className={`${styles.invtext_lb} flex justify-start`}>
                    <span className="text-left pr-1.5">{data[7]?.label}</span>
                    <div className={`${projectPopupStyles.tooltip} cursor-pointer`}>
                      <img src={infoIcon} alt="info" />
                      <span className={`${projectPopupStyles.tooltiptext} min-w-[120px]`}>
                        The price at which the property is likely to be sold.
                      </span>
                    </div>
                  </div>
                  <div className={`mb-1.5 ${styles.invtext_l} text-center`}>
                    ₹{data[7]?.value} Cr
                  </div>
                  {hasValidValue(data?.[11]) && (
                    <div className="text-[14px] text-gray-800 text-center font-lato">
                      ₹{Number((parseFloat(data[7]?.value) * 10000000 / data[11]?.value).toFixed(0)).toLocaleString("en-IN")} /Sq ft
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profit/Loss */}
            {hasValidValue(data?.[5]) && (
              <div className="flex pl-4 py-3.5 justify-start">
                <div>
                  <div className={`${styles.invtext_lb} flex justify-start`}>
                    <span className="text-center">{data[5]?.label}</span>
                  </div>
                  <div
                    className={`mb-1.5 ${styles.invtext_l} ${
                      parseFloat(data[5].value) < 0 ? "text-[red]" : "text-[#0E8345]"
                    } text-center`}
                  >
                    {data[5]?.value < 0 ? "-₹" : "+₹"}{Math.abs(data[5]?.value)} Cr
                  </div>
                  {hasValidValue(data?.[8]) && (
                    <div className="text-[14px] text-gray-800 text-center font-lato">
                      Exp Return: {data[8]?.value}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Mobile Layout */
          <div className="grid grid-cols-2 gap-2">
            {/* Reserve Price - Mobile */}
            {hasValidValue(data?.[4]) && (
              <div
                className={`${styles.invoverviewmain} flex pl-4 py-3.5 justify-start`}
                style={{ background: "var(--Secondary-Secondary100, #FFFBE9)" }}
              >
                <div>
                  <div className={`${styles.invtext_lb} flex justify-start`}>
                    <span className="text-left">{data[4]?.label}</span>
                    <img className="pr-0.5 h-4 w-4 my-0.5" src={infoIcon} alt="T" />
                  </div>
                  <div className={`mb-1.5 ${styles.invtext_l} text-left`}>
                    ₹{data[4]?.value} Cr
                  </div>
                  {hasValidValue(data?.[11]) && (
                    <div className="text-[14px] text-gray-800 text-left font-lato">
                      ₹{Number((parseFloat(data[4]?.value) * 10000000 / data[11]?.value).toFixed(0)).toLocaleString("en-IN")} /Sq ft
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TruEstimate - Mobile */}
            {hasValidValue(data?.[6]) && (
              <div
                className={`${styles.invoverviewmain} flex pl-4 py-3.5 justify-start`}
                style={{ background: "var(--Secondary-Secondary100, #FFFBE9)" }}
              >
                <div>
                  <div className={`${styles.invtext_lb} mb-[7px] flex justify-start`}>
                    <img className="pr-0.5 h-4 w-4" src={truEstimateSymbol} alt="T" />
                    <span className="text-left">{data[6]?.label}</span>
                  </div>
                  <div className={`mb-1.5 ${styles.invtext_l} text-left`}>
                    ₹{data[6]?.value} Cr
                  </div>
                  {hasValidValue(data?.[11]) && (
                    <div className="text-[14px] text-gray-800 text-left font-lato">
                      ₹{Number((parseFloat(data[6]?.value) * 10000000 / data[11]?.value).toFixed(0)).toLocaleString("en-IN")} /Sq ft
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Expected Sale Price - Mobile */}
            {hasValidValue(data?.[7]) && (
              <div
                className={`${styles.invoverviewmain} flex pl-4 py-3.5 justify-start`}
                style={{ background: "var(--Secondary-Secondary100, #FFFBE9)" }}
              >
                <div>
                  <div className={`${styles.invtext_lb} flex justify-start`}>
                    <span className="text-left">{data[7]?.label}</span>
                    <img className="pr-0.5 h-4 w-4 my-0.5" src={infoIcon} alt="T" />
                  </div>
                  <div className={`mb-1.5 ${styles.invtext_l} text-left`}>
                    ₹{data[7]?.value} Cr
                  </div>
                  {hasValidValue(data?.[11]) && (
                    <div className="text-[14px] text-gray-800 text-left font-lato">
                      ₹{Number((parseFloat(data[7]?.value) * 10000000 / data[11]?.value).toFixed(0)).toLocaleString("en-IN")} /Sq ft
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profit/Loss - Mobile */}
            {hasValidValue(data?.[5]) && (
              <div
                className={`${styles.invoverviewmain} flex pl-4 py-3.5 justify-start`}
                style={{ background: "var(--Secondary-Secondary100, #FFFBE9)" }}
              >
                <div>
                  <div className={`${styles.invtext_lb} flex justify-start`}>
                    <span className="text-left">{data[5]?.label}</span>
                  </div>
                  <div
                    className={`mb-1.5 ${styles.invtext_l} ${
                      parseFloat(data[5].value) < 0 ? "text-[red]" : "text-[#0E8345]"
                    } text-left`}
                  >
                    {data[5]?.value < 0 ? "-₹" : "+₹"}{Math.abs(data[5]?.value)} Cr
                  </div>
                  {hasValidValue(data?.[8]) && (
                    <div className="text-[14px] text-gray-800 text-left font-lato">
                      Exp Return: {data[8]?.value}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Date Information */}
        <div
          className={`flex flex-wrap justify-between items-center w-full mt-3 font-lato text-[14px] ${styles.header}`}
        >
          {/* EMD Submission Block */}
          {hasValidValue(data?.[9]) && (
            <div className="flex items-center gap-[6px] w-full sm:w-auto">
              <img src={calender} alt="calendar" className="w-4 h-4" />
              <span style={{ fontWeight: "900", color: "#DE1135" }}>
                EMD Submission Till:
              </span>
              <span style={{ fontWeight: "900", color: "#DE1135" }}>
                {data[9]?.value}
              </span>
            </div>
          )}

          {/* Auction Date Block */}
          {hasValidValue(data?.[10]) && (
            <div className="flex items-center gap-[6px] w-full sm:w-auto mt-2 sm:mt-0">
              <img src={calender} alt="calendar" className="w-4 h-4" />
              <span className="text-gray-600" style={{ fontWeight: "600" }}>
                Auction Date:
              </span>
              <span className="text-black" style={{ fontWeight: "600" }}>
                {data[10]?.value}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FractionalIvestmentCom;