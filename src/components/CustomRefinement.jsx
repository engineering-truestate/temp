import { useState, useEffect } from "react";
import { useInstantSearch } from "react-instantsearch";
import projectPopupStyles from "./Project_popup/ProjectPopup.module.css";
import styles from "./MainContent.module.css";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase";
// TruEstate icon moved to public folder
// import truEstateIcon from "../assets/Icons/properties/TruEstateIcon.svg";
// Verified icon moved to public folder
// import verifiedIcon from "../assets/Icons/properties/verifiedIcon.svg";
import { useRefinementList } from "react-instantsearch";

const CustomRefinementList = ({ attribute, type = "all" }) => {
  const attribute1 = { value: attribute };
  const { items } = useRefinementList({ attribute: attribute });
  const { items: recommendedItems } = useRefinementList({
    attribute: "truRecommended",
  });
  const { items: verifiedItems } = useRefinementList({
    attribute: "truVerified",
  });

  const { indexUiState, setIndexUiState } = useInstantSearch();

  const [selectedView, setSelectedView] = useState("all");

  const handleViewChange = (view) => {
    setSelectedView(view);

    if (view === "all") {
      setIndexUiState((prevState) => ({
        ...prevState,
        refinementList: {
          ...prevState.refinementList,
          recommended: [],
          truRecommended: [],
          truVerified: [],
        },
        page: 1,
      }));
    } else if (view === "recommended") {
      setIndexUiState((prevState) => ({
        ...prevState,
        refinementList: {
          ...prevState.refinementList,
          truVerified: [],
          recommended: type == "all" ? ["true"] : [],
          truRecommended: type == "Auction" ? ["true"] : [],
        },
        page: 1,
      }));
    } else if (view === "verified") {
      setIndexUiState((prevState) => ({
        ...prevState,
        refinementList: {
          ...prevState.refinementList,
          recommended: [],
          truRecommended: [],
          "truVerified": ["true"],
        },
        page: 1,
      }));
    }
  };

  // Check URL state and set current tab to "all" if no filters are active
  useEffect(() => {
    const refinementList = indexUiState.refinementList || {};

    const isTruRecommendedActive =
      refinementList.truRecommended?.includes("true");
    const isRecommendedActive = refinementList.recommended?.includes("true");
    const isAuctionRecommended =
      refinementList["truRecommended"]?.includes("true");
    const isVerifiedActive = refinementList["truVerified"]?.includes("true");

    if (isTruRecommendedActive || isRecommendedActive || isAuctionRecommended) {
      setSelectedView("recommended");
    } else if (isVerifiedActive) {
      setSelectedView("verified");
    } else {
      setSelectedView("all");
    }
  }, [indexUiState.refinementList]); // Only once on mount

  return (
    <div className="flex flex-row border border-gray-400 rounded-lg pt-1 pb-1 pl-1 pr-1 vs:pt-0.5 vs:pb-0.5 sr:pt-0.5 sr:pb-0.5 sl:pt-0.5 sl:pb-0.5 md:pb-0.5 md:pt-0.5 sm:mt-0 sm:ml-2 w-[fit-content] gap-1">
      <button
        onClick={() => {
          handleViewChange("all");
          logEvent(analytics, "clicked_properties_all", {
            Name: "properties_all",
          });
        }}
        className={`px-2 my-0.5 rounded ${
          selectedView === "all" ? styles.btnsty : styles.btnsty1
        } ${selectedView === "all" ? styles.selected1 : ""}`}
      >
        All
      </button>

      <button
        onClick={() => {
          handleViewChange("recommended");
          if (type === "Auction") {
            logEvent(analytics, "clicked_properties_recommended_auction", {
              Name: "properties_recommended",
            });
          } else if (type === "BDA") {
            logEvent(analytics, "clicked_properties_recommended_bda", {
              Name: "properties_recommended_bda",
            });
          } else {
            logEvent(analytics, "clicked_properties_recommended", {
              Name: "properties_recommended",
            });
          }
        }}
        className={`px-2 my-0.5 py-0.5 lg:py-1 rounded flex flex-row gap-2 ${
          selectedView === "recommended" ? styles.btnsty : styles.btnsty1
        } ${selectedView === "recommended" ? styles.selected1 : ""} ${
          projectPopupStyles.tooltip
        }`}
      >
        <img src="/assets/properties/icons/truestate-badge.svg" alt="Recommended" />
        Recommended
        <span className={projectPopupStyles.tooltiptext}>
          These are hand-picked TruEstate properties
        </span>
      </button>
      {type === "Auction" && (
        <button
          onClick={() => {
            handleViewChange("verified");
            logEvent(analytics, "clicked_properties_verified", {
              Name: "properties_verified",
            });
          }}
          className={`px-2 py-1 rounded flex flex-row gap-2 items-center justify-center ${
            selectedView === "verified" ? styles.btnsty : styles.btnsty1
          } ${selectedView === "verified" ? styles.selected1 : ""} ${
            projectPopupStyles.tooltip
          }`}
        >
          <img src="/assets/properties/icons/verified-icon.svg" alt="Verified" />
          Verified
          <span className={projectPopupStyles.tooltiptext}>
            Verified by TruEstate team with document proof
          </span>
        </button>
      )}
    </div>
  );
};

export default CustomRefinementList;
