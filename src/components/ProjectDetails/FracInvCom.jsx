import React, { useState, useEffect } from "react";
import styles from "./ProjectDetails.module.css";
import projectPopupStyles from "../Project_popup/ProjectPopup.module.css";
import { useLocation } from "react-router-dom";
import infoIcon from "/assets/icons/ui/info.svg";
// import whiteLock from "/icons-1/lock-white.svg"; // File no longer exists
import { useDispatch, useSelector } from "react-redux";
import { setShowSignInModal } from "../../slices/modalSlice";
import calender from "/assets/icons/ui/info.svg"; // File not found
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";
import truEstimateSymbol from "/assets/icons/brands/truestate-logo-alt.svg"; // File not found
import FractionalInvestment from "./FractionalInvestmentGant";
import { red } from "@mui/material/colors";
//import { useLocation } from "react-router-dom";

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

  return (
    <>
      <div className={`rounded-lg w-full  mb-[36px] sm:mb-9}`}>
        {data[0]?.value &&
          data[0]?.value !== "NA" &&
          data[2]?.value &&
          data[2]?.value !== "NA" && (
            <>
              <h2
                className={`mb-0.8 ${styles.invtitle} ${
                  headingSize ? headingSize : "text-[1.125rem]"
                }`}
              >
                {/* Group Investment */}
                Partial Buy-In Investment Option
              </h2>
              {/* <p className="text-black text-[12px]">Buy a high-value auction property with other buyers to get democratized access to lucrative deals.</p> */}
              <p className="text-black text-[14px] font-[Lato]">
  Buy a high-value auction property with other buyers to get democratized access to lucrative deals.
</p>

              <span className={`${styles.finvtext_lb} mb-2 mr-[8px]`}>
                {data[0]?.label}:
              </span>
              <span className={`${styles.invtext_l} mb-2`}>
                {data[0]?.value}
              </span>

              <FractionalInvestment
                seatsFilled={data[1]?.value}
                totalSeats={data[2]?.value}
                lastDate={data[3]?.value}
              />
            </>
          )}
        {!isMobile ? (
          <div
            className={`flex row gap-2 ${styles.invoverviewmain}`}
            style={{ background: "var(--Secondary-Secondary100, #FFFBE9)" }}
          >
            <div className="flex flex-col pl-4 py-3.5">
              <div>
                {/* Label row: icon + label centered horizontally */}
                <div
                  className={`${styles.invtext_lb} flex items-center justify-center mb-1`}
                >
                  <span className="text-center pr-1.5">{data[4]?.label}</span>
                  <div
                    className={`${projectPopupStyles.tooltip} cursor-pointer`}
                  >
                    <img src={infoIcon} alt="info" />
                    <span
                      className={`${projectPopupStyles.tooltiptext} min-w-[120px]`}
                    >
                      Minimum price set for the auction.
                    </span>
                  </div>
                </div>

                {/* Bold value */}
                <div className={`mb-1.5 ${styles.invtext_l} text-center`}>
                  {data[4]?.value !== "NA" ? `₹${data[4]?.value} Cr` : "NA"}
                </div>

                {/* Per sq ft value */}
                <div className="text-[14px] text-gray-800 text-center font-lato">
                  {data[4]?.value === "NA" || data[11]?.value === "NA" ? "NA" : `₹${Number((parseFloat(data[4]?.value) * 10000000 / data[11]?.value).toFixed(0)).toLocaleString("en-IN")}
 /Sq ft`}
                </div>
              </div>
            </div>

            <div className={` flex pl-4 py-3.5 justify-start `}>
              <div>
                {/* Label row: use justify-start instead of centering */}
                <div className={`${styles.invtext_lb} flex justify-start`}>
                  {/* Add text-left so the label itself is left-aligned */}
                  <img
                    className="pr-0.5 h-4 w-4"
                    src={truEstimateSymbol}
                    alt="T"
                  />
                  <span className="text-left">{data[6]?.label}</span>
                </div>

                {/* Value line: add text-left so it’s explicitly left-aligned */}
                <div className={`mb-1.5 ${styles.invtext_l} text-center`}>
                  {data[6]?.value != "NA" ? `₹${data[6]?.value} Cr` : "NA"}
                </div>
                <div
                  className={`text-[14px] text-gray-800 text-center font-lato`}
                >
                 {data[6]?.value === "NA" || data[11]?.value === "NA" ? "NA" : `₹${Number((parseFloat(data[6]?.value) * 10000000 / data[11]?.value).toFixed(0)).toLocaleString("en-IN")}
 /Sq ft`}

                </div>
              </div>
            </div>
            <div className={` flex pl-4 py-3.5 justify-start `}>
              <div>
                {/* Label row: use justify-start instead of centering */}
                <div className={`${styles.invtext_lb} flex justify-start`}>
                  {/* Add text-left so the label itself is left-aligned */}
                  <span className="text-left pr-1.5">{data[7]?.label}</span>
                  <div
                    className={`${projectPopupStyles.tooltip} cursor-pointer`}
                  >
                    <img src={infoIcon} alt="info" />
                    <span
                      className={`${projectPopupStyles.tooltiptext} min-w-[120px]`}
                    >
                      The price at which the property is likely to be sold.
                    </span>
                  </div>
                </div>

                {/* Value line: add text-left so it’s explicitly left-aligned */}
                <div className={`mb-1.5 ${styles.invtext_l} text-center`}>
                  {data[7]?.value != "NA" ? `₹${data[7]?.value} Cr` : "NA"}
                </div>
                <div
                  className={`text-[14px] text-gray-800 text-center font-lato`}
                >
                  {data[7]?.value === "NA" || data[11]?.value === "NA" ? "NA" : `₹${Number((parseFloat(data[7]?.value) * 10000000 / data[11]?.value).toFixed(0)).toLocaleString("en-IN")} /Sq ft`}

                </div>
              </div>
            </div>
            <div className={` flex pl-4 py-3.5 justify-start `}>
              <div>
                {/* Label row: use justify-start instead of centering */}
                <div className={`${styles.invtext_lb} flex justify-start`}>
                  {/* Add text-left so the label itself is left-aligned */}
                  <span className="text-center">{data[5]?.label}</span>
                </div>

                {/* Value line: add text-left so it’s explicitly left-aligned */}
                <div
                  className={`mb-1.5 ${styles.invtext_l} ${
                    data[5]?.value &&
                    (parseFloat(data[5].value) < 0
                      ? "text-[red]"
                      : "text-[#0E8345]")
                  } text-center`}
                >
                  {data[5]?.value === "NA" ? "NA" : `${data[5]?.value < 0 ? "-₹" : "+₹"}${Math.abs(data[5]?.value)} Cr`}

                </div>
                <div
                  className={`text-[14px] text-gray-800 text-center font-lato`}
                >
                  {`Exp Return: ${data[8]?.value}`}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <div
              className={`${styles.invoverviewmain} flex pl-4 py-3.5 justify-start `}
              style={{ background: "var(--Secondary-Secondary100, #FFFBE9)" }}
            >
              <div>
                {/* Label row: use justify-start instead of centering */}
                <div className={`${styles.invtext_lb} flex justify-start`}>
                  {/* Add text-left so the label itself is left-aligned */}
                  <span className="text-left">{data[4]?.label}</span>
                  <img
                    className="pr-0.5 h-4 w-4 my-0.5"
                    src={infoIcon}
                    alt="T"
                  />
                </div>

                {/* Value line: add text-left so it’s explicitly left-aligned */}
                <div className={`mb-1.5 ${styles.invtext_l} text-left`}>
                  {data[4]?.value != "NA" ? `₹${data[4]?.value} Cr` : "NA"}
                </div>
                <div
                  className={`text-[14px] text-gray-800 text-left font-lato`}
                >
                  {data[4]?.value === "NA" || data[11]?.value === "NA" ? "NA" : `₹${Number((parseFloat(data[4]?.value) * 10000000 / data[11]?.value).toFixed(0)).toLocaleString("en-IN")}
 /Sq ft`}

                </div>
              </div>
            </div>
            <div
              className={`${styles.invoverviewmain} flex pl-4 py-3.5 justify-start `}
              style={{ background: "var(--Secondary-Secondary100, #FFFBE9)" }}
            >
              <div>
                {/* Label row: use justify-start instead of centering */}
                <div
                  className={`${styles.invtext_lb} mb-[7px] flex justify-start`}
                >
                  {/* Add text-left so the label itself is left-aligned */}
                  <img
                    className="pr-0.5 h-4 w-4"
                    src={truEstimateSymbol}
                    alt="T"
                  />
                  <span className="text-left">{data[6]?.label?data[6]?.label:"NA"}</span>
                </div>

                {/* Value line: add text-left so it’s explicitly left-aligned */}
                <div className={`mb-1.5 ${styles.invtext_l} text-left`}>
                  {data[6]?.value != "NA" ? `₹${data[6]?.value} Cr` : "NA"}
                </div>
                <div
                  className={`text-[14px] text-gray-800 text-left font-lato`}
                >
                  {data[6]?.value === "NA" || data[11]?.value === "NA" ? "NA" : `₹${Number((parseFloat(data[6]?.value) * 10000000 / data[11]?.value).toFixed(0)).toLocaleString("en-IN")}
 /Sq ft`}

                </div>
              </div>
            </div>
            <div
              className={`${styles.invoverviewmain} flex pl-4 py-3.5 justify-start `}
              style={{ background: "var(--Secondary-Secondary100, #FFFBE9)" }}
            >
              <div>
                {/* Label row: use justify-start instead of centering */}
                <div className={`${styles.invtext_lb} flex justify-start`}>
                  {/* Add text-left so the label itself is left-aligned */}
                  <span className="text-left">{data[7]?.label}</span>
                  <img
                    className="pr-0.5 h-4 w-4 my-0.5"
                    src={infoIcon}
                    alt="T"
                  />
                </div>

                {/* Value line: add text-left so it’s explicitly left-aligned */}
                <div className={`mb-1.5 ${styles.invtext_l} text-left`}>
                  {data[7]?.value != "NA" ? `₹${data[7]?.value} Cr` : "NA"}
                </div>
                <div
                  className={`text-[14px] text-gray-800 text-left font-lato`}
                >
                  {data[7]?.value === "NA" || data[11]?.value === "NA" ? "NA" : `₹${Number((parseFloat(data[7]?.value) * 10000000 / data[11]?.value).toFixed(0)).toLocaleString("en-IN")}
 /Sq ft`}

                </div>
              </div>
            </div>
            <div
              className={`${styles.invoverviewmain} flex pl-4 py-3.5 justify-start `}
              style={{ background: "var(--Secondary-Secondary100, #FFFBE9)" }}
            >
              <div>
                {/* Label row: use justify-start instead of centering */}
                <div className={`${styles.invtext_lb} flex justify-start`}>
                  {/* Add text-left so the label itself is left-aligned */}
                  <span className="text-left">{data[5]?.label}</span>
                </div>

                {/* Value line: add text-left so it’s explicitly left-aligned */}
                <div
                  className={`mb-1.5 ${styles.invtext_l} ${
                    data[5]?.value &&
                    (parseFloat(data[5].value) < 0
                      ? "text-[red]"
                      : "text-[#0E8345]")
                  } text-left`}
                >
                  {data[5]?.value === "NA" ? "NA" : `${data[5] < 0 ? "-₹" : "+₹"}${Math.abs(data[5]?.value)} Cr`}

                </div>
                <div
                  className={`text-[14px] text-gray-800 text-left font-lato`}
                >
                  {`Exp Return: ${data[8]?.value}`}
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          className={`flex flex-wrap justify-between items-center w-full mt-3 font-lato text-[14px] ${styles.header}`}
        >
          {/* EMD Submission Block */}
          <div className="flex items-center gap-[6px] w-full sm:w-auto">
            <img src={calender} alt="calendar" className="w-4 h-4" />
            <span style={{ fontWeight: "900", color: "#DE1135" }}>
              EMD Submission Till:
            </span>
            <span style={{ fontWeight: "900", color: "#DE1135" }}>
              {data[9]?.value}
            </span>
          </div>

          {/* Auction Date Block */}
          <div className="flex items-center gap-[6px] w-full sm:w-auto mt-2 sm:mt-0">
            <img src={calender} alt="calendar" className="w-4 h-4" />
            <span className="text-gray-600" style={{ fontWeight: "600" }}>
              Auction Date:
            </span>
            <span className="text-black" style={{ fontWeight: "600" }}>
              {data[10]?.value}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default FractionalIvestmentCom;
