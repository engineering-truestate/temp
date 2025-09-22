import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";
import PropertyFilters from "../PropertyFilters";
import PageSortBy from "../InstantSearch/PageSortBy";
import CustomRefinement from "../CustomRefinement";
import styles from "../MainContent.module.css";

const PropertiesPageHeader = ({
  propertiesView,
  handleViewToggle,
  selectedSortOption,
  setSelectedSortOption,
  isVisible = true,
}) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isSortBoxOpen, setIsSortBoxOpen] = useState(false);
  const sortBoxRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortBoxRef.current && !sortBoxRef.current.contains(event.target)) {
        setIsSortBoxOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSortOptionClick = (option) => {
    const newSelection = selectedSortOption === option ? "" : option;
    setSelectedSortOption(newSelection);
    setIsSortBoxOpen(false);

    // Analytics
    logEvent(analytics, "sort_option_selected", {
      sort_option: newSelection,
      page: "properties",
    });
  };

  const toggleSortBox = () => {
    setIsSortBoxOpen((prev) => !prev);
  };

  return (
    <div
      className={`${
        isAuthenticated
          ? "sticky top-16"
          : "sticky top-0 px-4 md:px-20 lg:px-24"
      } z-10 flex h-10vh ${styles.wholesearch}`}
    >
      <div className="flex flex-col h-auto w-[100%]">
        {/* Property Filters */}
        <div
          className={`sticky ${
            isAuthenticated ? "top-[60px]" : "top-[0px]"
          } z-30 bg-[#F5F6F7]`}
        >
          <PropertyFilters
            handleSortOptionClick={handleSortOptionClick}
            setSelectedSortOption={setSelectedSortOption}
            selectedSortOption={selectedSortOption}
            isVisible={isVisible}
          />
        </div>

        {/* View Toggle and Sort Controls */}
        <div
          className={`flex flex-row flex-wrap my-4 mb-4 ${
            isAuthenticated ? "px-4 md:px-8" : ""
          } gap-2`}
        >
          {/* Grid/Table/Map buttons */}
          <div
            className="flex gap-4 sm:gap-2 flex-row w-fit scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              "-ms-overflow-style": "none",
            }}
          >
            <div className="flex flex-row border border-gray-300 rounded-lg p-1 w-[fit-content] h-[fit-content] min-w-max">
              <button
                id="step-2"
                onClick={() => {
                  handleViewToggle("grid", "properties");
                  logEvent(analytics, "click_grid_properties", {
                    Name: "property_grid",
                  });
                }}
                className={`px-2 py-1 rounded flex flex-row gap-2 ${
                  propertiesView === "grid" ? styles.btnsty : styles.btnsty1
                } ${propertiesView === "grid" ? styles.selected1 : ""}`}
              >
                <img
                  src="/assets/properties/icons/view-grid.svg"
                  className={`w-[18px] h-[18px] ${
                    propertiesView === "grid" ? styles.selected : ""
                  }`}
                  alt="Grid view"
                />
                Grid
              </button>
              <button
                id="step-3"
                onClick={() => {
                  handleViewToggle("table", "properties");
                  logEvent(analytics, "click_table_properties", {
                    Name: "property_table",
                  });
                }}
                className={`px-2 py-1 rounded flex flex-row gap-2 ${
                  propertiesView === "table" ? styles.btnsty : styles.btnsty1
                } ${propertiesView === "table" ? styles.selected1 : ""}`}
              >
                <img
                  src="/assets/properties/icons/view-table.svg"
                  className={`w-[18px] h-[18px] ${
                    propertiesView === "table" ? styles.selected : ""
                  }`}
                  alt="Table view"
                />
                Table
              </button>
              <button
                id="step-4"
                onClick={() => {
                  handleViewToggle("map", "properties");
                  logEvent(analytics, "click_map_properties", {
                    Name: "property_map",
                  });
                }}
                className={`px-2 py-1 rounded flex flex-row gap-2 ${
                  propertiesView === "map" ? styles.btnsty : styles.btnsty1
                } ${propertiesView === "map" ? styles.selected1 : ""}`}
              >
                <img
                  src="/assets/properties/icons/view-map.svg"
                  className={`w-[18px] h-[18px] ${
                    propertiesView === "map" ? styles.selected : ""
                  }`}
                  alt="Map view"
                />
                Map
              </button>
            </div>

            <div className="flex-none">
              <CustomRefinement attribute="recommended" />
            </div>
          </div>

          {/* Sort By Component */}
          <PageSortBy
            selectedSortOption={selectedSortOption}
            onSortChange={setSelectedSortOption}
            isVisible={isVisible && propertiesView !== "map"}
            className="ml-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertiesPageHeader;