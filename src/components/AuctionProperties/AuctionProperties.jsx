import React, { useState, useEffect } from "react";
import Map from "../Map/Map";
import AuctionGrid from "./AuctionGrid";
import AuctionTable from "./AuctionTable.jsx";
import { getProjectImages } from "../../utils/common.js";
import AuctionPopupMap from "../Project_popup/AuctionPopupMap.jsx";


const AuctionProperties = ({ auctionView }) => {
  // useEffect(() => {
  //   setCurrentIndex("truEstateAuctions");
  // }, []);

  // States
  const [selectedMapProject, setSelectedMapProject] = useState(null);
  const [trueS] = useState("all");
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    fetch("/data/projects.json")
      .then((response) => response.json())
      .then((data) => setImageData(data))
      .catch(() => {});
  }, []);


  return (
    <div>


      <div className="flex flex-col h-auto w-[100%] ">
     

        {/* Button container */}

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
              <AuctionTable trueS={trueS} currentPage="1" />
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
    </div>
  );
};

export default AuctionProperties;
