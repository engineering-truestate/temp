import React, { useState, useRef, useEffect } from "react";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase";
import {
  RangeInput,
  RefinementList,
  useCurrentRefinements,
  useRefinementList,
} from "react-instantsearch";
import Loader from "./Loader";
import { useSelector } from "react-redux";
import RangeMoreFilters from "./RangeMoreFilters";

const DropdownRefinementList = ({
  attribute,
  label,
  isRange = false,
  isSlider = false,
  enableLocalSearch = false,
  transformItems = (items) => items, // Default function if not provided
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Fetch current refinements
  const { items: currentRefinements } = useCurrentRefinements();

  const { items: refinementItems } = useRefinementList({
    attribute,
  });

  // Enhanced logging for possession attribute
  if (attribute === "possession") {
    console.log("=== POSSESSION DEBUG ===");
    console.log("Refinement items:", refinementItems);
    console.log("Items count:", refinementItems?.length);
    console.log("Items is array?", Array.isArray(refinementItems));
    console.log("Current refinements:", currentRefinements);
    console.log("Individual items:", refinementItems?.map(item => ({
      label: item.label,
      count: item.count,
      isRefined: item.isRefined,
      value: item.value
    })));
    console.log("=====================");
  }

  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    // Special handling for array attributes
    const arrayAttributes = ["possession", "strategy"];
    
    if (arrayAttributes.includes(attribute)) {
      console.log(`${attribute} refinementItems:`, refinementItems);
      console.log(`${attribute} refinementItems length:`, refinementItems?.length);
      // For array attributes, even if refinementItems is empty initially,
      // the filter should still be available
      setIsAvailable(true);
    } else {
      setIsAvailable(refinementItems?.length > 0);
    }
  }, [refinementItems, attribute]);
  
  // Check if current attribute has any active refinements
  const isActive = currentRefinements.some(
    (item) => item.attribute === attribute && item.refinements.length > 0
  );

  // Check if this is a range filter (Budget or Auction Reserve Price)
  const isRangeFilter = attribute === "investmentOverview.minInvestment" || attribute === "auctionReservePrice";

  const handleToggle = () => {
    if (!isAvailable) return;
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  // Handle clicks inside the dropdown content
  const handleDropdownContentClick = (e) => {
    // For range filters, prevent the dropdown from closing when clicking inside
    if (isRangeFilter) {
      e.stopPropagation();
    }
    // For regular filters, let them close normally (don't stop propagation)
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Transform function to group "Launched" options
  const combinedTransformItems = (items) => {
    return items.reduce((acc, item) => {
      if (
        item.label === "launched (booking not started)" ||
        item.label === "launched (booking started)"
      ) {
        const launchedOption = acc.find(
          (option) => option.label === "Launched"
        );
        if (launchedOption) {
          launchedOption.count += item.count;
        } else {
          acc.push({
            label: "Launched",
            count: item.count,
            value: "launched",
            isRefined: item.isRefined || false,
          });
        }
      } else {
        acc.push(item);
      }
      return acc;
    }, []);
  };

  return (
    <div
      ref={ref}
      className={`relative text-left min-w-fit h-[36px] border rounded-md p-2 
      ${
        isActive
          ? "bg-[#DFF4F3]  border-[#205E59] "
          : "text-black border-[#B5B3B3]"
      }  
      ${
        !isAvailable
          ? "bg-[#F3F4F6] cursor-default opacity-50"
          : "cursor-pointer"
      }
      `}
      onClick={() => {
        handleToggle()
        logEvent(analytics,`click_properties_${label}`,{Name:`${label}`})
      }}
    >
      <button
        className={`flex items-center justify-between gap-[2px] ${
          !isAvailable ? "cursor-default" : "cursor-pointer"
          }`}
      >
        <span className={`w-fit font-lato font-bold text-xs`}>
          <div className="flex flex-nowrap">{label}</div>
        </span>
        <svg
          className={`w-4 h-4 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Container visibility controlled by CSS class */}
      <div
        className={`absolute mt-2 w-fit rounded-lg shadow-lg  ring-1 ring-black ring-opacity-5 z-30 p-4 bg-[#FAFAFA] top-[40px] ${
          isAuthenticated ? "left-0" : "right-0"
        }
                     ${isOpen ? "block" : "hidden"}
                `}
        onClick={handleDropdownContentClick} // Add click handler to dropdown content
      >

        {!isRange && attribute!=="investmentOverview.minInvestment" && attribute!=="auctionReservePrice" && (
          <>
            {enableLocalSearch ? (
              <RefinementList
                attribute={attribute}
                searchable={true}
                searchablePlaceholder="Search categories..."
                searchableComponent={() => <div className="hidden" />}
                {...props}
                classNames={{
                  root: "flex flex-col gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm w-full",
                  list: "flex flex-wrap gap-3",
                  item: "p-2 cursor-pointer border border-gray-300 rounded-lg font-lato text-xs leading-4 text-gray-600",
                  selectedItem:
                    "p-2 cursor-pointer bg-teal-800 border-2 border-teal-800 rounded-lg font-lato text-sm leading-4 text-white",
                  label:
                    "w-full flex justify-between items-center cursor-pointer",
                  checkbox: "hidden",
                  count:
                    "bg-gray-200 rounded px-2 py-1 text-gray-800 font-lato text-xs ml-2",
                  searchBox:
                    "w-full mb-3 p-2 border border-gray-300 rounded-md text-sm focus:outline-none",
                  searchInput:
                    "bg-none w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none",
                }}
              />
            ) : (
              <RefinementList
                attribute={attribute}
                // For array attributes like possession and strategy, we need to ensure proper configuration
                operator={(attribute === "possession" || attribute === "strategy") ? "or" : "or"} // Default is "or" which works for arrays
                // Special handling for array attributes
                limit={(attribute === "possession" || attribute === "strategy") ? 1000 : 10} // Increase limit for array attributes
                // showMore={(attribute === "possession" || attribute === "strategy") ? false : true}
                // transformItems={combinedTransformItems}
                sortBy={["name:asc"]}
                {...props}
                classNames={{
                  root: "flex colspan-2",
                  list: "flex flex-wrap gap-3",
                  item: "w-full p-2 cursor-pointer border-[1px] border-[#E1E1E1]   rounded-[8px] font-lato text-[12px] leading-[17.92px]  text-[#5A5A5A] capitalize break-normal",
                  selectedItem:
                    "w-full p-2 cursor-pointer  border bg-[#DFF4F3]  border-[#205E59]  rounded-[8px] font-lato text-[12px] leading-[17.92px] text-black",
                  
                  label: "flex items-center gap-2 cursor-pointer whitespace-nowrap",
                  checkbox: "hidden",
                  count:
                    "bg-[#E8ECEB] rounded-full text-[#313131] font-lato py-[2px] px-[4px] text-[12px] ml-2  hidden",
                }}
              />
            )}
          </> 
        )}
        {(attribute === "investmentOverview.minInvestment" || attribute ==="auctionReservePrice") && (
          <div onClick={(e) => e.stopPropagation()}> {/* Prevent closing for range filters */}
            <RangeMoreFilters attribute={attribute}/>
          </div>
        )}

        {/* Optional: Add a "Done" button for range filters */}
        {isRangeFilter && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-sm bg-[#0F2C2A] text-white rounded-md hover:bg-[#064f4c] transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownRefinementList;