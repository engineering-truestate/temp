import React from "react";
import styles from "./ProjectDetails.module.css";
import projectPopupStyles from "../Project_popup/ProjectPopup.module.css";
import truEstimateSymbol from "/assets/icons/features/valuation-report.svg";
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
  return (
    <div
      className={`border-hidden   ${styles.headq}  mb-9 sm:mb-9  ${
        isReport == true ? "mt-0" : "sm:mt-9 mt-9 lg:mt-12"
      } `}
    >
      <h1 className={`${styles.heading} mb-4 `}>{toCapitalizedWords(title)}</h1>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-2 gap-4">
        {details &&
          details.length > 0 &&
          details.map((detail, index) => (
            <div
              key={index}
              className=""
              onClick={() => {
                if (isAuthenticated === true) {
                  logEvent(analytics, `click_property_${detail.label}`);
                }
              }}
            >
              {/* label  */}
              <div className={`flex gap-[4px] ${styles.heading1}`}>
                {/* truestate icon  */}
                {(detail.label === "TruEstimate" ||
                  detail.label === "Est. Price in 4 Yrs" ||
                  detail.label === "TruGrowth" ||
                  detail.label === "TruValue" || 
                detail.label === "Rec. Bid Price") && (
                  <img src={truEstimateSymbol} alt="T" />
                )}

                {/* label text  */}
                {detail.label}

                {/* info icon and hover text  */}
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

              {/* value  */}
              <div className={styles.heading1val}>
                {!detail.value && !isAuthenticated ? (
                  <img
                    onClick={() => {
                      dispatch(
                        setShowSignInModal({
                          showSignInModal: true,
                          redirectUrl: ('/properties'),
                        })
                      );
                      logEvent(
                        analytics,
                        `click_property_${detail.label}_lock`
                      );
                    }}
                    className="mt-2 cursor-pointer"
                    src={lockIcon}
                  />
                ) : typeof detail?.value === "string" &&
                  detail.value !== "N/A" ? (
                  toCapitalizedWords(detail.value)
                ) : (
                  detail.value
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Overview;
