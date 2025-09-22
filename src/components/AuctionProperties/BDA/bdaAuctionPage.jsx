import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
// Table icon moved to public folder
// import tableIcon from "../../../assets/Icons/properties/Table.svg";
// Map icon moved to public folder
// import mapIcon from "../../../assets/Icons/properties/mapIcon.svg";
import styles from "../../MainContent.module.css";
import CustomRefinement from "../../CustomRefinement.jsx";
import Map from "../../Map/Map.jsx";
import BdaTable from "./BdaTable.jsx";
import BdaPropertyDetailModal from "./bdaPropertyDetailModal.jsx";
import {
  InstantSearch,
  SearchBox,
  useInstantSearch,
} from "react-instantsearch";
import SearchIcon from "/assets/icons/ui/search.svg";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../../firebase";
import Loader from "../../Loader";
import { selectLoader } from "../../../slices/loaderSlice";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= 768 && window.innerWidth < 1024
  );

  const [isDesktop, setIsDesktop] = useState(
    window.innerWidth >= 1024 && window.innerWidth <= 1280
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
      setIsDesktop(window.innerWidth >= 1024 && window.innerWidth <= 1280);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isMobile, isTablet, isDesktop };
};

const BdaAuctionPage = ({ setInitialHits }) => {
  // Get authentication state from Redux
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { trueS } = useSelector((state) => state.projectsState);
  const [selectedMapProject, setSelectedMapProject] = useState(null);
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [currentStatusState, setCurrentStatusState] = useState(0);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  // Get InstantSearch status for loading state
  const { status } = useInstantSearch();
  const isReduxLoading = useSelector(selectLoader);

  const { isMobile, isTablet, isDesktop } = useIsMobile();

  // State for view toggle
  const [auctionView, setAuctionView] = useState("map");

  // Refs
  const sortBoxRef = useRef(null);

  useEffect(() => {
    if (selectedMapProject) {
      setPropertyModalOpen(true);
    }
  }, [selectedMapProject]);

  useEffect(() => {
    setCurrentStatusState((prev) => prev + 1);

    // Mark as initially loaded once we've had at least one status change and reached idle
    if (status === "idle" && currentStatusState > 0) {
      setHasInitiallyLoaded(true);
    }
  }, [status]);

  useEffect(() => {
    if (auctionView === "map") {
      setInitialHits(160);
    } else {
      setInitialHits(12);
    }
  }, [auctionView]);

  // View toggle handler
  const handleViewToggle = (newView, viewType) => {
    if (viewType === "auction") {
      if (newView == "map") {
        setInitialHits(160);
      } else {
        setInitialHits(12);
      }
      setAuctionView(newView);
    }
  };

  // Index is now set in MainContent.jsx based on route

  return (
    <>
      <div>
        {(isTablet || isMobile) && (
          <div
            className={`border-b border-gray-300 bg-[#FAFAFA] w-full py-2.5 md:py-4 mx-auto ${`px-4 md:px-8`}`}
          >
            <div className="relative w-full flex-grow h-[36px]">
              <div className="absolute top-2 left-3">
                <img src={SearchIcon} />
              </div>
              <SearchBox
                placeholder="Search auction properties, micro market..."
                searchAsYouType={false}
                classNames={{
                  root: "w-full h-full flex gap-0 items-center border border-[#B5B3B3] max-w-[400px] rounded-md",
                  form: "flex w-full h-full",
                  input:
                    "w-full h-full px-[12px] py-[4px] ml-7 rounded-md border-none text-sm text-black focus:outline-none font-lato font-medium text-xs",
                }}
                // Reset/Clear Button
                resetIconComponent={() => <></>}
                // Submit Button
                submitIconComponent={() => (
                  <button
                    // onClick={(state)=> console.log(state)}
                    type="button"
                    className="w-[52px] h-[30px] flex items-center justify-center bg-[#153E3B] hover:bg-black text-white rounded-md px-[8px] py-[6px] font-lato font-bold text-xs transition-all duration-200 mx-[2px]"
                  >
                    Search
                  </button>
                )}
                // Loading Icon Component (Hidden by Default)
                loadingIconComponent={() => <div className="hidden"></div>}
              />
            </div>
          </div>
        )}
        <div
          className={`flex flex-row sticky top-[64px] md:top-[64px] bg-white py-4 ${
            isAuthenticated ? `px-4 md:px-8` : ``
          } gap-2`}
        >
          {/* Grid/Table/Map buttons */}
          <div
            className="flex gap-4 sm:gap-2 flex-row w-fit sticky overflow-x-auto overflow-y-hidden top-0 bg-white z-[3]"
            style={{
              scrollbarWidth: "none",
              "-ms-overflow-style": "none",
              position: "sticky",
              top: "0",
            }}
          >
            <div className="flex flex-row border border-gray-400 rounded-lg p-1 w-[fit-content] h-[fit-content] min-w-max">
              <button
                onClick={() => {
                  handleViewToggle("map", "auction");
                  logEvent(analytics, "click_auction_bda_map", {
                    Name: "auction_bda_map",
                  });
                }}
                className={`px-2 py-1 rounded flex flex-row gap-2 ${
                  auctionView === "map" ? styles.btnsty : styles.btnsty1
                } ${auctionView === "map" ? styles.selected1 : ""}`}
              >
                <img
                  src="/assets/properties/icons/view-map.svg"
                  className={`w-[18px] h-[18px] ${
                    auctionView === "map" ? styles.selected : ""
                  }`}
                />
                Map
              </button>
              <button
                onClick={() => {
                  handleViewToggle("table", "auction");
                }}
                className={`px-2 py-1 rounded flex flex-row gap-2 ${
                  auctionView === "table" ? styles.btnsty : styles.btnsty1
                } ${auctionView === "table" ? styles.selected1 : ""}`}
              >
                <img
                  src="/assets/properties/icons/view-table.svg"
                  className={`w-[18px] h-[18px] ${
                    auctionView === "table" ? styles.selected : ""
                  }`}
                />
                Table
              </button>
            </div>

            {/* BDA-specific filters can be added here later */}
            <CustomRefinement attribute="recommended" type="BDA" />
          </div>
        </div>
        <div className="">
          {/* Loader - only show during initial loading */}
          {!hasInitiallyLoaded &&
            (status === "loading" ||
              status === "stalled" ||
              currentStatusState <= 1 ||
              isReduxLoading) && (
              <div className="col-span-full flex justify-center my-4 h-[60vh]">
                <Loader />
              </div>
            )}

          {/* Content - show once initially loaded or if status is idle */}
          {hasInitiallyLoaded ||
          (status === "idle" && currentStatusState > 1) ? (
            <>
              {auctionView === "table" ? (
                <BdaTable trueS={trueS} currentPage="1" />
              ) : auctionView === "map" ? (
                <Map
                  mapType="all"
                  selectedProject={selectedMapProject}
                  setSelectedProject={setSelectedMapProject}
                  isBda={true}
                />
              ) : null}
            </>
          ) : null}
        </div>
      </div>
      {propertyModalOpen && (
        <BdaPropertyDetailModal
          isOpen={propertyModalOpen}
          onClose={() => setPropertyModalOpen(false)}
          property={selectedMapProject}
        />
      )}
    </>
  );
};

export default BdaAuctionPage;
