import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Map from "../Map/Map";
import AuctionGrid from "./AuctionGrid";
import AuctionTable from "./AuctionTable.jsx";
import { getProjectImages } from "../../utils/common.js";
import AuctionPopupMap from "../Project_popup/AuctionPopupMap.jsx";
import Loader from "../Loader";
import { showLoader, hideLoader } from "../../slices/loaderSlice";
import UnifiedTable from "../Table/UnifiedTable.jsx";

const AuctionProperties = ({ auctionView}) => {
  const dispatch = useDispatch();
  const [initialDataLoaded,setInitialDataLoaded]=useState("false");
  // States
  const [selectedMapProject, setSelectedMapProject] = useState(null);
  const [trueS] = useState("all");
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        dispatch(showLoader());
        
        const response = await fetch("/data/projects.json");
        const data = await response.json();
        setImageData(data);
        
        // Set data loaded to true after fetch completes
        setInitialDataLoaded(true);
      } catch (error) {
        console.error("Error loading auction data:", error);
        // Still set to true to show the page even if there's an error
        setInitialDataLoaded(true);
      } finally {
        dispatch(hideLoader());
      }
    };

    loadInitialData();
  }, []);

  // Don't render content until data is loaded
  if (!initialDataLoaded) {
    return null;
  }

  return (
    <div>
      <div className="flex flex-col h-auto w-[100%] ">
        {/* Content area for auction properties */}
        <div className="h-auto">
          {auctionView === "grid" ? (
            <>
              <AuctionGrid
                trueS={trueS}
                propertiesView={auctionView}
              />
            </>
          ) : auctionView === "table" ? (
            <>
              <UnifiedTable
  type="auction"
  trueS={trueS}
  currentPage={"1"}
  // Other props as needed
/>
            </>
          ) : auctionView === "map" ? (
            <>
              <div className="relative h-[78vh]">
                <Map
                  mapType="all"
                  trueS={trueS}
                  selectedProject={selectedMapProject}
                  setSelectedProject={setSelectedMapProject}
                  isAuction={true}
                />

                {selectedMapProject && (
                  <div className="absolute bottom-0 sm:right-0 w-full sm:w-auto sm:top-0 z-[2]">
                    <AuctionPopupMap
                      project={selectedMapProject}
                      images={getProjectImages(
                        selectedMapProject["Internal ID"],
                        imageData
                      )}
                      onClose={setSelectedMapProject}
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            // Default fallback
            <AuctionGrid
              trueS={trueS}
              propertiesView={auctionView}
            />
          )}
        </div>
      </div>
      
      {/* Loader Component */}
      <Loader />
    </div>
  );
};

export default AuctionProperties;