import React, { useState, useEffect } from "react";

import DropdownRefinementList from "../DropdownRefinementList.jsx";
import MoreFilters from "../MoreFilters";

import { InstantSearch, SearchBox } from "react-instantsearch";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase.js";
import FilterIcon from "/assets/icons/ui/filter.svg";
import CloseIcon from "/assets/icons/navigation/btn-close.svg";
import ResetIcon from "/assets/icons/actions/btn-reset.svg";
import "../searchbox.css";
import { Highlight, useHits, useInstantSearch } from "react-instantsearch";
import { useInfiniteHits } from "react-instantsearch";
import { useDispatch } from "react-redux";
import { liteClient } from "algoliasearch/lite";
import { setSearchTerm } from "../../slices/projectSlice.js";
import { useSelector } from "react-redux";
import RangeMoreFilters from "../RangeMoreFilters";
import SearchIcon from "/assets/icons/ui/search.svg";

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

const AuctionFilters = ({
  handleSortOptionClick,
  setSelectedSortOption,
  selectedSortOption,
  isVisible,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile, isTablet, isDesktop } = useIsMobile();

  const [appliedFilters, setAppliedFilters] = useState({});
  const { indexUiState, setIndexUiState } = useInstantSearch();
  const [isFilterSelected, setIsFilterSelected] = useState(false);
  const dispatch = useDispatch();
  const { hits } = useHits();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const flag = hits.length <= 1 ? true : false;


  const handleToggle = () => {
    // Log event for toggling More Filters - Auction specific
    logEvent(analytics, "auction_more_filters_toggle", {
      event_category: "interaction",
      event_label: isOpen ? "Close More Filters" : "Open More Filters",
      page_type: "auction",
    });
    setIsOpen((prev) => !prev);
  };

  const filters = [
    {
      title: "Strategy",
      attribute: "unitDetails.Strategy",
      type: "tab",
    },
    {
      title: "Growth Potential",
      attribute: "auctionOverview.auctionCAGR", // assuming it maps to growth classification
      type: "tab",
    },
    {
      title: "Value",
      attribute: "auctionOverview.auctionValue", // assuming truValue returns valuation category
      type: "tab",
    },
    {
      title: "Commercial Type",
      attribute: "commercialType",
      type: "tab",
    },
    {
      title: "Asset Type",
      attribute: "assetType",
      type: "tab",
    },
    {
      title: "Budget",
      attribute: "auctionReservePrice",
      type:'range'
    },
    {
      title: "Loan Eligible",
      attribute: "auctionOverview.loanEligiblity",
      type: "tab",
    },
    {
      title: "Possession",
      attribute: "auctions.units.possession", // physical or symbolic
      type: "tab",
    },
  ];
  const visibleFilters = () => {
    console.log(isMobile, isTablet, isDesktop);
    if (isMobile) return []; // No filters except "More Filters" for mobile
    if (isTablet) return []; // First 3 filters for tablets
    // if (isDesktop) return filters.slice(0, 2); // First 3 filters for tablets
    return filters; // All filters for desktop
  };

  const areFiltersApplied = () => {
    const { refinementList, query, menu, range } = indexUiState;
    dispatch(setSearchTerm(query));
    // console.log(query, 'refinementList it is');

    const filteredRefinementList = Object.fromEntries(
      Object.entries(refinementList || {}).filter(
        ([key]) => key !== "truRecommended"
      )
    );

    //  console.log(filteredRefinementList);
    // Check if any refinement lists have selections
    const hasRefinementListFilters = Object.values(
      filteredRefinementList || {}
    ).some((filter) => filter && filter.length > 0);

    // Check if there's a search query
    const hasQuery = query && query.trim() !== "";

    // Check if any menu selections are made
    const hasMenuFilters = Object.values(menu || {}).some(
      (menuFilter) => menuFilter && menuFilter !== ""
    );

    // Check if any range filters are applied
    const hasRangeFilters = Object.values(range || {}).some(
      (rangeFilter) =>
        rangeFilter &&
        (rangeFilter.min !== undefined || rangeFilter.max !== undefined)
    );

    const hasRangeFilters2 = Object.values(range || {}).some(
      (rangeFilter) =>
        rangeFilter &&
        typeof rangeFilter === "string" &&
        rangeFilter.includes(":")
    );

    // console.log( hasRefinementListFilters , hasQuery ,  hasMenuFilters);
    return (
      hasRefinementListFilters ||
      hasQuery ||
      hasMenuFilters ||
      hasRangeFilters ||
      hasRangeFilters2
    );
  };

  // New function to reset all filters
  const resetAllFilters = () => {
    // Log event for resetting filters - Auction specific
    logEvent(analytics, "auction_reset_all_filters", {
      event_category: "interaction",
      event_label: "All Filters Cleared",
      page_type: "auction",
    });

    // Reset the UI state to clear all refinements
    setIndexUiState((prevState) => ({
      ...prevState,
      refinementList: {},
      query: "",
      menu: {},
      range: {},
    }));
  };

  return (
    <div
      className={`border-b border-gray-300 bg-[#FAFAFA] w-full py-2.5 md:py-4 mx-auto ${
        isAuthenticated ? `px-4 md:px-8` : ``
      }`}
    >
      <div className="flex md:flex-row items-center gap-2 md:gap-3 mb-0">
        {/* Filter Dropdowns */}

        {!isAuthenticated ? (
          <div className="relative w-[350px] h-[36px]">
            <div className="absolute top-2 left-3">
              <img src={SearchIcon} />
            </div>
            <SearchBox
              placeholder="Search auction properties, micro market..."
              searchAsYouType={false}
              onClick={() => {
                logEvent(analytics, "auction_click_search_box", {
                  Name: "Search Box",
                  page_type: "auction",
                });
              }}
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
                  onClick={() => {
                    logEvent(analytics, "auction_click_search_button", {
                      Name: "Search Button",
                      page_type: "auction",
                    });
                  }}
                  className="w-[52px] h-[30px] flex items-center justify-center bg-[#153E3B] hover:bg-black text-white rounded-md px-[8px] py-[6px] font-lato font-bold text-xs transition-all duration-200 mx-[2px]"
                >
                  Search
                </button>
              )}
              // Loading Icon Component (Hidden by Default)
              loadingIconComponent={() => <div className="hidden"></div>}
            />
          </div>
        ) : (
          (isTablet || isMobile) && (
            <div className="relative w-[400px] flex-grow h-[36px]">
              <div className="absolute top-2 left-3">
                <img src={SearchIcon} />
              </div>
              <SearchBox
                onClick={() => {
                  logEvent(analytics, "auction_click_search_box", {
                    Name: "Search Box",
                    page_type: "auction",
                  });
                }}
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
                    onClick={() => {
                      logEvent(analytics, "auction_click_search_button", {
                        Name: "Search Button",
                        page_type: "auction",
                      });
                    }}
                    className="w-[52px] h-[30px] flex items-center justify-center bg-[#153E3B] hover:bg-black text-white rounded-md px-[8px] py-[6px] font-lato font-bold text-xs transition-all duration-200 mx-[2px]"
                  >
                    Search
                  </button>
                )}
                // Loading Icon Component (Hidden by Default)
                loadingIconComponent={() => <div className="hidden"></div>}
              />
            </div>
          )
        )}

        <div className="flex items-center md:gap-3 md:w-fit">
          {/* Asset Type Filter */}
          {visibleFilters().map((filter, index) => (
            <DropdownRefinementList
              key={index}
              attribute={filter.attribute}
              label={filter.title}
              isRange={filter.type === "range" ? true : false}
            />
          ))}

          {(isMobile || isTablet) && (
            <MoreFilters
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              handleToggle={handleToggle}
              isMobile={isMobile}
              isTablet={isTablet}
              isDesktop={isDesktop}
              resetAllFilters={resetAllFilters}
              indexUiState={indexUiState}
              handleSortOptionClick={handleSortOptionClick}
              setSelectedSortOption={setSelectedSortOption}
              selectedSortOption={selectedSortOption}
              flag={flag}
              hits={hits}
              isVisible={isVisible}
              type="auction"
            />
          )}

          {/* Reset Filters Button */}
          {areFiltersApplied() && (
            <button
              onClick={resetAllFilters}
              className="sm:flex items-center justify-center text-left w-fit h-[36px] border border-[#B5B3B3] rounded-md py-2 px-3"
            >
              <img
                src={ResetIcon}
                alt="Reset Filters"
                className="min-w-[16px] min-h-[16px]"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionFilters;
