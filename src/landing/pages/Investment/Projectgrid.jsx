import React, { useState, useEffect, useCallback, useRef } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { liteClient } from "algoliasearch/lite";
import { history } from "instantsearch.js/es/lib/routers";
import {
  RangeInput,
  RefinementList,
  useCurrentRefinements,
  useRefinementList,
} from "react-instantsearch";
import { InstantSearch, SearchBox, Configure } from "react-instantsearch";
import { Highlight, useHits, useInstantSearch } from "react-instantsearch";
import styles from "./MainContents.module.css";
import ProjectGrid from "../../../components/ProjectGrid";
import ProjectPopupMap from "../../../components/Project_popup/ProjectPopupMap";
import PropertyFilters from "../../../components/PropertyFilters";
import CustomRefinementList from "../../../components/CustomRefinement";
import { authSlice } from "../../../slices/authSlice";
import { useSelector } from "react-redux";
import Table from "../../../components/Table/Table";
import Map from "../../../components/Map/Map";

const searchClient = liteClient(
  "W6DT2LQBIH",
  "60dd7cc0afb3449e4f83fbbb12059138"
);

function Projectgrid() {
  const [currentIndex, setCurrentIndex] = useState("property-data");
  const [propertiesView, setPropertiesView] = useState("grid");
  const [initialHits, setinitialHits] = useState(12);
  const [initialProperties, setinitialProperties] = useState("showOnTruEstate:'true'");
  const [selectedMapProject, setSelectedMapProject] = useState(null);

  const [trueS, setTrueS] = useState("all");

  const isVisible = true;

  const handleViewToggle = (newView, viewType) => {
    // Set the new view state
    // console.log("here");

    if (viewType === "properties") {
      // console.log(newView);
      setinitialProperties("showOnTruEstate:'true'");
      if (newView === "map") {
        setCurrentIndex("For-map");
        setinitialHits(160);
      } else {
        setCurrentIndex("property-data");
        setinitialHits(12);
      }
      setTrueS("all");
      setPropertiesView(newView);
    } else if (viewType === "wishlist") {
      setWishlistView(newView);
    } else if (viewType === "trueS") {
      // console.log(propertiesView);
      if (propertiesView === "map") {
        // console.log(propertiesView);
        setCurrentIndex("For-map");
      } else {
        setCurrentIndex("property-data");
        setinitialHits(12);
      }
      setTrueS(newView);

      setinitialProperties("showOnTruEstate:'true' AND recommended:'true'");

      // console.log("reached here");
    }

    // setOffset(0);
  };

  const handleSearch = (term) => {
    setFilters((prevFilters) => ({ ...prevFilters, searchTerm: term }));
    // setOffset(0);
  };

  const auth = useSelector((state) => state.auth.isAuthenticated);
  const userData = useSelector((state) => state.auth.userData);

  // console.log(auth);
  // console.log(userData);

  return (
    <div className="px-10">
      <InstantSearch
        searchClient={searchClient}
        indexName={currentIndex}
        routing={true}
        // searchState={}
      >
        <Configure
          analytics={true} // Disable analytics for this search instance
          hitsPerPage={initialHits} // Set the number of hits per page
          // filters={initialProperties}
          // filters={`(stage:Qualified OR stage:Unqualified)${!(currentAgentData?.admin === true) ? ` AND currentAgent:${currentAgentEmail}` : ""}`}
        />
         
         <div> <div className={` z-10 flex   h-10vh bg-[#FAFAFA]`}>
          {
            <div className=" flex flex-col  h-auto w-[100%]  ">
              {location.pathname === "/InvestmentOpportunities" ? (
                <div className="">
                  {" "}
                  {/* Adjust `top` value if needed */}
                  <PropertyFilters />
                </div>
              ) : null}

              {/* Button container moved below SearchBar */}
              {location.pathname === "/InvestmentOpportunities" ? (
                <div className="flex  sm:flex-row  my-4 pl-4 sm:pl-8 mb-4  ">
                  <div className="flex  gap-2 ">
                    <div className="border border-gray-300   rounded-lg p-1 w-[fit-content] h-[fit-content]">
                      <button
                        onClick={() => handleViewToggle("grid", "properties")}
                        className={`px-2 py-1 rounded ${
                          propertiesView === "grid"
                            ? styles.btnsty
                            : styles.btnsty1
                        } ${
                          propertiesView === "grid" ? styles.selected1 : ""
                        } `}
                      >
                        Grid
                      </button>
                      <button
                        onClick={() => handleViewToggle("table", "properties")}
                        className={`px-2 py-1 rounded ${
                          propertiesView === "table"
                            ? styles.btnsty
                            : styles.btnsty1
                        } ${
                          propertiesView === "table" ? styles.selected1 : ""
                        }`}
                      >
                        Table
                      </button>
                      <button
                        onClick={() => handleViewToggle("map", "properties")}
                        className={`px-2 py-1 rounded ${
                          propertiesView === "map"
                            ? styles.btnsty
                            : styles.btnsty1
                        } ${propertiesView === "map" ? styles.selected1 : ""}`}
                      >
                        Map
                      </button>
                    </div>

                    {/* <CustomRefinement   attribute="truRecommended"/> */}
                  </div>
                  {/* 
                    {isVisible && propertiesView!="map" && (
                      <div
                        className={`    rounded-lg p-1 w-[34px] h-[34px] md:w-[fit-content] ml-auto mr-4 md:mr-8 flex justify-center items-center   ${
                          selectedSortOption.length > 0
                            ? `  border border-[#205E59]  bg-[#DFF4F3]`
                            : `  border border-gray-300`
                        }    `}
                        onClick={toggleSortBox}
                      >
                        <img src={Sort} className={`w-[18px] h-[18px]  `} />
                        <button
                          className={`hidden md:block  px-1 py-1  rounded ${
                            selectedSortOption.length > 0
                              ? `${styles.btnsty} `
                              : `${styles.btnsty1}  `
                          } ${
                            propertiesView === "Sort By"
                              ? `${styles.selected1} `
                              : ""
                          } `}
                        >
                          Sort By
                        </button>
                      </div>
                    )} */}

                  {/* {console.log(isSortBoxOpen)} */}

                  {/* Sort Options Box */}
                  {/* {isSortBoxOpen && (
                      <div
                        className="absolute  right-4 md:right-8 mt-10 w-64 h-fit  bg-[#FAFAFA] border border-gray-300  shadow-lg z-50"
                        ref={sortBoxRef}
                      >
                        <ul className="p-2">
                          <li
                            className={`cursor-pointer  min-h-11 py-3 px-4 font-lato text-sm ${
                              selectedSortOption === "price/sqft ascending"
                                ? ` ${styles.btnsty} bg-[#DAFBEA] `
                                : styles.btnsty1
                            }`}
                            onClick={() =>
                              handleSortOptionClick("price/sqft ascending")
                            }
                          >
                            Price/Sqft - Low to High
                          </li>
                          <li
                            className={`cursor-pointer min-h-11 py-3 px-4 font-lato text-sm ${
                              selectedSortOption === "price/sqft descending"
                                ? ` ${styles.btnsty} bg-[#DAFBEA] `
                                : styles.btnsty1
                            }`}
                            onClick={() =>
                              handleSortOptionClick("price/sqft descending")
                            }
                          >
                            Price/Sqft - High to Low
                          </li>
                          <li
                            className={`cursor-pointer min-h-11 py-3 px-4 font-lato text-sm ${
                              selectedSortOption ===
                              "investment amount ascending"
                                ? ` ${styles.btnsty} bg-[#DAFBEA] `
                                : styles.btnsty1
                            }`}
                            onClick={() =>
                              handleSortOptionClick(
                                "investment amount ascending"
                              )
                            }
                          >
                            Investment Amount - Low to High
                          </li>
                          <li
                            className={`cursor-pointer min-h-11 py-3 px-4 font-lato text-sm ${
                              selectedSortOption ===
                              "investment amount descending"
                                ? ` ${styles.btnsty} bg-[#DAFBEA] `
                                : styles.btnsty1
                            }`}
                            onClick={() =>
                              handleSortOptionClick(
                                "investment amount descending"
                              )
                            }
                          >
                            Investment Amount - High to Low
                          </li>
                        </ul>
                      </div>
                    )} */}
                </div>
              ) : null}
            </div>
          }
        </div>
        </div>
       
        {/* Main Content Area */}
        <div className={`flex-1 h-full overflow-x-auto `}>
          {/* Sticky Search Bar and Buttons */}

          {/* Main Content */}
          <div>
            <Routes>
              <Route
                path="/"
                element={
                  <div className="h-full">
                    {propertiesView === "grid" ? (
                      <>
                        {/* {console.log("here")} */}
                        <ProjectGrid trueS={trueS} />
                      </>
                    ) : propertiesView === "table" ? (
                      <>
                        <Table type="properties" trueS={trueS} />
                      </>
                    ) : propertiesView === "map" ? (
                      <>
                        {/* {setCurrentIndex("map-view")} */}
                        <div className="relative h-[70vh] ">
                          <div>
                            <Map
                              selectedProject={selectedMapProject}
                              setSelectedProject={setSelectedMapProject}
                              onSearch={handleSearch}
                              mapType={"all"}
                              trueS={trueS}
                            ></Map>
                          </div>

                          {/* Updated styles for the second div */}
                          {selectedMapProject && (
                            <div className="absolute bottom-0 sm:right-0   w-full sm:w-auto  sm:top-0 z-[8]">
                              {/* <span
                            onClick={() => setSelectedMapProject(null)}
                            className="bg-[blue] cursor-pointer"
                          >
                            <img
                              src={CloseButton}
                              className="absolute right-5 z-[9999]"
                              alt=""
                              srcset=""
                            />
                          </span> */}
                              <ProjectPopupMap
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
                      ""
                    )}
                  </div>
                }
              />
            </Routes>
          </div>
        </div>
      </InstantSearch>
    </div>
  );
}

export default Projectgrid;



