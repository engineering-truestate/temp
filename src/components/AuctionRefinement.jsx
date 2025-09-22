import React, { useState, useEffect } from "react";
import { useInstantSearch } from "react-instantsearch";
import projectPopupStyles from "./Project_popup/ProjectPopup.module.css";
import styles from "./MainContent.module.css";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase";
// TruEstate icon moved to public folder
// import truEstateIcon from "../assets/Icons/properties/TruEstateIcon.svg";
// Verified icon moved to public folder
// import verifiedIcon from "../assets/Icons/properties/verifiedIcon.svg";
// Information icon moved to public folder
// import informationIcon from "../assets/Icons/properties/informationIcon.svg";

const AuctionRefinementList = ({ auction = [] }) => {
  const { setIndexUiState } = useInstantSearch();
  const auctionData = auction?.[0] || {};

  const hasRecommended = auctionData.truRecommended === true;
  const hasVerified = auctionData.verified === true;

  const [selectedView, setSelectedView] = useState("all");

  const handleViewChange = (view) => {
    setSelectedView(view);

    if (view === "all") {
      setIndexUiState((prevState) => ({
        ...prevState,
        refinementList: {
          ...prevState.refinementList,
          truRecommended: [],
          verified: [],
        },
        page: 1,
      }));
    } else if (view === "recommended") {
      setIndexUiState((prevState) => ({
        ...prevState,
        refinementList: {
          ...prevState.refinementList,
          truRecommended: ["true"],
          verified: [],
        },
        page: 1,
      }));
    } else if (view === "verified") {
      setIndexUiState((prevState) => ({
        ...prevState,
        refinementList: {
          ...prevState.refinementList,
          verified: ["true"],
          truRecommended: [],
        },
        page: 1,
      }));
    }
  };

  useEffect(() => {
    // Sync from data on first render
    if (hasRecommended) {
      setSelectedView("recommended");
    } else if (hasVerified) {
      setSelectedView("verified");
    } else {
      setSelectedView("all");
    }
  }, []);

  return (
    <div className="flex flex-row border border-gray-300 rounded-lg p-1 sm:mt-0 sm:ml-2 w-[fit-content] gap-1">
      <button
        onClick={() => {
          handleViewChange("all");
          logEvent(analytics, "clicked_properties_all", { Name: "properties_all" });
        }}
        className={`px-2 py-1 rounded ${selectedView === "all" ? styles.btnsty : styles.btnsty1} ${selectedView === "all" ? styles.selected1 : ""}`}
      >
        All
      </button>

      {hasRecommended && (
        <button
          onClick={() => {
            handleViewChange("recommended");
            logEvent(analytics, "clicked_properties_recommended", { Name: "properties_recommended" });
          }}
          className={`px-2 py-1 rounded flex flex-row gap-2 ${selectedView === "recommended" ? styles.btnsty : styles.btnsty1} ${selectedView === "recommended" ? styles.selected1 : ""} ${projectPopupStyles.tooltip}`}
        >
          <img src="/assets/properties/icons/truestate-badge.svg" alt="Recommended" />
          Recommended
          <span className={projectPopupStyles.tooltiptext}>
            These are hand-picked TruEstate properties
          </span>
        </button>
      )}

      {hasVerified && (
        <button
          onClick={() => {
            handleViewChange("verified");
            logEvent(analytics, "clicked_properties_verified", { Name: "properties_verified" });
          }}
          className={`px-2 py-1 rounded flex flex-row gap-2 ${selectedView === "verified" ? styles.btnsty : styles.btnsty1} ${selectedView === "verified" ? styles.selected1 : ""} ${projectPopupStyles.tooltip}`}
        >
          <img src="/assets/properties/icons/verified-icon.svg" alt="Verified" />
          Verified
          <span className={projectPopupStyles.tooltiptext}>
            Verified by TruEstate team with document proof
          </span>
          <img src="/assets/properties/icons/information.svg" alt="Info" />
        </button>
      )}
    </div>
  );
};

export default AuctionRefinementList;
