import React, { useState, useEffect, useRef } from "react";
import FormModalHeader from "./FormModalHeader";
import DropdownMoreFilters from "./DropdownMoreFilters.jsx";
import { useMediaQuery } from "react-responsive";
import { RefinementList, useRefinementList } from "react-instantsearch";
import { Range } from "react-range";
import RangeMoreFilters from "./RangeMoreFilters";
import "./searchbox.css";
import styles from "./SearchBar.module.css";
import { toCapitalizedWords } from "../utils/common.js";
import FilterIcon from "/assets/icons/ui/filter.svg";
import CloseIcon from "/assets/icons/navigation/btn-close.svg";
// import './MoreFilters.css';
import { useDispatch, useSelector } from "react-redux";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase";

const MoreFilters = ({
  isOpen,
  setIsOpen,
  handleToggle,
  isMobile,
  isTablet,
  isDesktop,
  resetAllFilters,
  indexUiState,
  handleSortOptionClick,
  setSelectedSortOption,
  selectedSortOption,
  flag,
  hits,
  isVisible,
  type = "all",
}) => {
  // console.log("flag" , flag) ;
  const ref = useRef(null);
  const rightSideRef = useRef(null);
  const selectedFilterRef = useRef(null);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [countFiltersApplied, setCountFiltersApplied] = useState(0);

  //filter types : dropdown , tab & range

  const outsideFilters =
    type === "auction"
      ? [
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
            type: "range",
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
        ]
      : [
          {
            title: "Value",
            attribute: "investmentOverview.value",
            type: "tab",
          },
          // { title: "CAGR", attribute: "truGrowth", type: "tab" },
          { title: "Asset Type", attribute: "assetType", type: "tab" },
          { title: "Status", attribute: "projectOverview.stage", type: "tab" },
          { title: "RERA", attribute: "otherData.isReraApproved", type: "tab" },
          {
            title: "Budget",
            attribute: "investmentOverview.minInvestment",
            type: "range",
          },
          {
            title: "Availability",
            attribute: "projectOverview.availability",
            type: "tab",
          },
        ];
  const isSmallScreen = useMediaQuery({ maxWidth: 767 });
  const visibleFilters = () => {
    if (isMobile) return outsideFilters; // No filters except "More Filters" for mobile
    if (isTablet) return outsideFilters.slice(0, 7); // First 3 filters for tablets
    if (isDesktop) return outsideFilters.slice(2, 7); // First 3 filters for tablets
    return outsideFilters.slice(4, 7); // All filters for desktop
  };

  useEffect(() => {
    const currentFilters = visibleFilters();
    // Check refinementList
    // Assuming 'currentFilters' or 'outsideFilters' is the filter list
    // console.log(currentFilters, outsideFilters);
    const refinementListCount = currentFilters.reduce((count, filter) => {
      // Check if the filter is a refinementList type (tab)
      if (
        filter.type === "tab" &&
        indexUiState.refinementList?.[filter.attribute]
      ) {
        // console.log("Refinement filter found:", filter.title);
        count += 1;
      }
      return count;
    }, 0);

    // console.log("Refinement List Count:", refinementListCount);

    // Check range filters (for attributes like 'minInvestment')
    const rangeFiltersCount = currentFilters.reduce((count, filter) => {
      // Check if the filter is a range type
      // console.log("indexuistate" , indexUiState);

      if (hits.length <= 1) {
        return 0;
      }

      if (filter.type === "range" && indexUiState.range?.[filter.attribute]) {
        // console.log("Range filter found:", filter.title);
        count += 1;
      }
      return count;
    }, 0);

    // console.log("Range Filters Count:", rangeFiltersCount);

    // Total filters applied
    const totalFiltersApplied = refinementListCount + rangeFiltersCount;
    // console.log("Total Filters Applied:", totalFiltersApplied);

    // // Update state with total number of applied filters
    setCountFiltersApplied(totalFiltersApplied);
    // console.log("total filters are " , totalFiltersApplied) ;
  }, [indexUiState]);

  const areVisibleFiltersApplied = () => {
    const currentFilters = visibleFilters();

    // Check refinementList
    const refinementListApplied = currentFilters.some(
      (filter) => indexUiState.refinementList?.[filter.attribute]?.length > 0
    );

    // Check range filters
    const rangeFiltersApplied = currentFilters.some(
      (filter) =>
        filter.type === "range" &&
        indexUiState.range?.[filter.attribute] !== undefined
    );

    return refinementListApplied || rangeFiltersApplied;
  };

  const [selectedFilter, setSelectedFilter] = useState({});

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filterRefs = useRef({});

  useEffect(() => {
    visibleFilters().forEach((filter) => {
      if (!filterRefs.current[filter.title]) {
        filterRefs.current[filter.title] = React.createRef();
      }
    });
  }, [visibleFilters]);

  const handleFilterClick = (filterTitle) => {
    logEvent(analytics, `click_properties_${filterTitle}`, {
      Name: "more_filters",
    });

    setSelectedFilter(filterTitle);
    // if (filterRefs.current[filterTitle]) {
    //   filterRefs.current[filterTitle].current.scrollIntoView({
    //     behavior: "smooth",
    //     block: "start",
    //   });
    // }
  };

  useEffect(() => {
    if (selectedFilterRef.current && rightSideRef.current) {
      const container = rightSideRef.current;
      const element = selectedFilterRef.current;

      // Calculate the position of the element relative to the container
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      const scrollOffset =
        elementRect.top - containerRect.top + container.scrollTop;

      container.scrollTo({
        top: scrollOffset,
        behavior: "smooth",
      });
    }
  }, [selectedFilter]);

  const sortByOptions = [
    { label: "Price: Low to High", value: "price/sqft ascending" },
    { label: "Price: High to Low", value: "price/sqft descending" },
    { label: "Investment: Low to High", value: "investment amount ascending" },
    { label: "Investment: High to Low", value: "investment amount descending" },
    { label: "XIRR : High to Low", value: "xirr amount descending" },
  ];

  const onOptionSelect = (value) => {
    setSelectedSortOption(value);
    handleSortOptionClick(value);
    // console.log("hello");
  };

  const { items: refinementItems } = useRefinementList({
    attribute: "combineAvailability",
  });

  const [hasFiltersAvailable, setHasFiltersAvailable] = useState(true);

  useEffect(() => {
    setHasFiltersAvailable(refinementItems?.length > 0);
  });

  return (
    <div className="">
      {/* More Filters Button */}
      <button
        onClick={() => {
          handleToggle();
          logEvent(analytics, "click_more_filter_prop", {
            Name: "more_filters",
          });
        }}
        className={`flex items-center justify-center text-left min-w-fit h-[36px] border border-[#B5B3B3] rounded-md py-2 px-3 gap-[2px] ${
          areVisibleFiltersApplied()
            ? "border-[#153E3B] bg-[#DFF4F3]"
            : "border-[#B5B3B3]"
        } ${"cursor-pointer"} `}
      >
        <img
          src={FilterIcon}
          className=" min-w-[18px] min-h-[18px] " // Adjust height as needed
        />

        <span className=" hidden sm:block  font-lato font-bold text-xs ">
          More Filters
        </span>
        <span className=" sm:hidden block  font-lato font-bold text-xs  ">
          Filters
        </span>
        <span
          className={`ml-1 w-[18px]  h-[18px]  bg-black text-white rounded-full flex items-center justify-center  font-lato font-bold text-[10px] ${
            countFiltersApplied === 0 ? "hidden" : "block"
          } `}
        >
          {countFiltersApplied}
        </span>
      </button>

      {/* <div
        ref={ref}
        className={` ${isOpen ? "block" : "hidden"}   absolute top-[8px]  ${
          isAuthenticated
            ? `right-[0px]`
            : `right-[-20px] md:right-[-15px] lg:right-[-35px] `
        }   `}
      >
        <div
          className={`${styles.moreFiltersContent}   rounded-lg right-[0px] md:right-[16px] lg:right-[38px] w-screen md:w-[28rem] mt-2 flex flex-col h-screen md:h-[16.3125rem]   top-0 md:top-[50px]`}
        > */}
      <div
        ref={ref}
        className={`${isOpen ? "block" : "hidden"} ${
          isMobile || isTablet
            ? "fixed right-0 bottom-0 z-[9999] w-screen h-[90vh] bg-white"
            : "absolute top-[8px] z-50"
        } ${
          isAuthenticated
            ? `right-0`
            : `right-[-20px] md:right-[-15px] lg:right-[-35px]`
        }`}
      >
        <div
          className={`${styles.moreFiltersContent} rounded-lg w-full h-full flex flex-col ${
            isMobile || isTablet
              ? "right-0 top-0 w-full h-full"
              : "md:w-[28rem] md:h-[16.3125rem] right-0 mt-2"
          }`}
          style={{
            ...(isMobile || isTablet
              ? { borderRadius: 0, minHeight: "90vh", minWidth: "100vw" }
              : {}),
          }}
        >
          {/* Top bar */}
          <div className=" md:hidden bg-[#FAFAFA] py-4 px-[0.75rem] flex justify-between  border-b-2 w-full flex-shrink-0 sticky top-0 z-10">
            <div className="flex flex-col bg-[#FAFAFA]">
              <span className="text-lg font-semibold">Filters</span>
              <span className="text-[14px] font-lato font-normal">
                Filters are applied automatically when selected
              </span>
            </div>

            <div>
              <button
                onClick={() => handleToggle(false)}
                className="text-gray-500 font-semibold"
              >
                &#10005;
              </button>
            </div>
          </div>
          {/* {console.log(visibleFilters())} */}
          <div className="flex md:flex-row flex-col  flex-grow overflow-y-auto ">
            {/* Left Side (only on md and above) */}
            <div
              className={`${styles.leftSide} bg-[#FAFAFA] bg-pink-400 w-[140px] z-10  hidden md:block rounded-l-lg overflow-y-auto top-0 relative md:h-[inherit] lg:h-auto  `}
            >
              {visibleFilters()
                .filter(
                  (filter) => !(flag && filter.attribute === "minInvestment")
                )
                .map((filter) => (
                  <div
                    key={filter.label}
                    className={`${styles.filterTopic}  ${
                      selectedFilter === filter.title
                        ? "border-r-2 border-[#153E3B]"
                        : ""
                    }`}
                    onClick={(e) => handleFilterClick(filter.title)}
                  >
                    <div className={`${styles.filterlabeltxt}`}>
                      {filter.title}
                    </div>
                  </div>
                ))}
            </div>

            {/* Right Side */}
            <div
              ref={rightSideRef}
              className={`${styles.rightSide} bg-[#FAFAFA] pb-36 md:pb-0 z-10 w-screen rounded-r-lg  top-0 flex-grow overflow-y-auto  `}
              style={{
                minHeight: "100%",
                overflowY: "auto",
              }}
            >
              <>
                {type === "all" && !isVisible && (
                  <div
                    className={`sort-by-container p-3 border-[1px] border-[#ECECEC]   w-full  h-auto w-auto gap-3}`}
                  >
                    <div
                      className={`font-regular mb-2 text-[14px] font-lato leading-[17.92px] text-[#313131]`}
                    >
                      Sort By
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {sortByOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`p-2 cursor-pointer border-[1px]  border-[#E1E1E1] rounded-[8px] font-lato text-[12px] leading-[17.92px] text-[#5A5A5A] capitalize ${
                            selectedSortOption === option.value
                              ? "  bg-[#DFF4F3]  border-[#205E59] text-black"
                              : "bg-[#FAFAFA]"
                          }`}
                          onClick={() => onOptionSelect(option.value)}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {visibleFilters().map((filter, idx) => (
                  <>
                    {/* { console.log(filter.title) } */}
                    <div
                      key={idx}
                      ref={
                        selectedFilter === filter.title
                          ? selectedFilterRef
                          : null
                      }
                      className={`p-3 border-[1px] border-[#ECECEC]  h-auto w-full gap-3 ${
                        filter.type === "tab"
                          ? "col-span-2"
                          : filter.type === "dropdown"
                            ? "col-span-1"
                            : filter.type === "range"
                              ? "col-span-2"
                              : ""
                      } ${
                        flag && filter.title === "Budget" ? "hidden" : "block"
                      }`}
                    >
                      <div
                        className={`font-regular mb-2 text-[14px] font-lato leading-[17.92px] text-[#313131]`}
                      >
                        {filter.title}
                      </div>

                      {filter.type === "dropdown" ? (
                        <DropdownMoreFilters
                          attribute={filter.attribute}
                          title="Please Select"
                        />
                      ) : filter.type === "tab" ? (
                        <RefinementList
                          attribute={filter.attribute}
                          classNames={{
                            root: "flex colspan-2",
                            list: "flex flex-wrap gap-3",
                            item: "p-2 cursor-pointer border-[1px] border-[#E1E1E1] rounded-[8px] font-lato text-[12px] leading-[17.92px] text-[#5A5A5A] capitalize ",
                            selectedItem:
                              "p-2 cursor-pointer  border-[1.5px] bg-[#DFF4F3]  border-[#205E59]  rounded-[8px] font-lato text-[12px] leading-[17.92px] text-black ",
                            label:
                              "w-full flex justify-between items-center cursor-pointer ",
                            checkbox: "hidden",
                            count:
                              "bg-[#E8ECEB] rounded-full text-[#313131] font-lato py-[2px] px-[4px] text-[12px] ml-2 hidden",
                          }}
                          templates={{
                            item: ({ label, count, isRefined, refine }) => (
                              <div
                                className={`flex justify-between w-full items-center p-2 ${
                                  isRefined ? "bg-gray-200" : ""
                                } hover:bg-gray-100`}
                                onClick={() => refine(label)}
                              >
                                <span className="font-medium ">{label}</span>
                                <span className="text-xs text-gray-500">
                                  {count}
                                </span>
                              </div>
                            ),
                          }}
                          sortBy={["name:asc"]}
                        />
                      ) : filter.type === "range" ? (
                        <RangeMoreFilters attribute={filter.attribute} />
                      ) : (
                        <></>
                      )}
                    </div>
                  </>
                ))}
              </>
            </div>
          </div>

          {/* Bottom bar */}
          {isSmallScreen && (
            <>
              {/* {console.log("reached here")}; */}
              <div className="fixed bottom-0 left-0 right-0 z-[10] md:hidden w-full h-16 bg-[#FAFAFA] flex items-center justify-center px-4 border-t border-gray-200">
    <button
      className="text-[0.875rem] text-[#BD0E2D] font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition-colors"
      onClick={resetAllFilters}
    >
      Reset
    </button>
  </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoreFilters;
