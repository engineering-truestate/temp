import React from "react";
import styles from "./ProjectDetails.module.css";
import projectPopupStyles from "../Project_popup/ProjectPopup.module.css";
import truEstimateSymbol from "../../../public/assets/icons/brands/truestate-logo-alt.svg";
import infoIcon from "/assets/icons/ui/info.svg";
import lockIcon from "/assets/icons/features/vault.svg";
import { toCapitalizedWords } from "../../utils/common";
import { useDispatch, useSelector } from "react-redux";
import { setShowSignInModal } from "../../slices/modalSlice";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";

const Overview = ({
  title,
  details,
  project,
  isReport,
  labelsWithMoreInfo,
}) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const hasValidValue = (detail) => {
    if (!detail.value) return false;
    if (detail.value === "N/A" || detail.value === "NA") return false;
    if (typeof detail.value === "string" && detail.value.trim() === "")
      return false;
    return true;
  };

  // Filter details to only include those with valid values
  const validDetails = details?.filter(hasValidValue) || [];

  return (
    <div
      className={`border-hidden ${styles.headq} mb-9 sm:mb-9 ${
        isReport == true ? "mt-0" : "sm:mt-9 mt-9 lg:mt-12"
      } `}
    >
      <h1 className={`${styles.heading} mb-4 `}>{toCapitalizedWords(title)}</h1>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-2 gap-4">
        {validDetails.length > 0 &&
          validDetails.map((detail, index) => (
            <div
              key={index}
              className="py-1"
              onClick={() => {
                if (isAuthenticated === true) {
                  logEvent(analytics, `click_property_${detail.label}`);
                }
              }}
            >
              {/* label */}
              <div className={`flex gap-[4px] ${styles.heading1}`}>
                {/* truestate icon */}
                {(detail.label === "TruEstimate" ||
                  detail.label === "Est. Price in 4 Yrs" ||
                  detail.label === "TruGrowth" ||
                  detail.label === "TruValue" ||
                  detail.label === "Rec. Bid Price") && (
                  <img src={truEstimateSymbol} alt="T" />
                )}

                {/* label text */}
                <p className="font-montserrat text-xs font-medium text-[#433F3E] leading-[150%]">
                  {detail.label}
                </p>

                {/* info icon and hover text */}
                {labelsWithMoreInfo &&
                  Object.keys(labelsWithMoreInfo).includes(detail.label) && (
                    <div
                      className={`${projectPopupStyles.tooltip} cursor-pointer`}
                    >
                      <img src={infoIcon} alt="info" />
                      <span
                        className={`${projectPopupStyles.tooltiptext} min-w-[120px]`}
                      >
                        {labelsWithMoreInfo[detail?.label]}
                      </span>
                    </div>
                  )}
              </div>

              {/* value */}
              <div className={styles.heading1val}>
                <p className="font-lato text-sm font-bold text-[#2B2928] leading-[150%]">
                  {typeof detail?.value === "string"
                    ? toCapitalizedWords(detail.value)
                    : detail.value}
                  {detail.label === "TruEstimate" && " / Sqft"}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Overview;
