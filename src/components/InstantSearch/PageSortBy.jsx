import React, { useState, useRef, useEffect } from "react";
import { useSortingConfig } from "../../hooks/useInstantSearch.jsx";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";
import { useLocation } from "react-router-dom";
import Sort from "/assets/icons/ui/sort.svg";

/**
 * Page-specific sorting component
 * Automatically configures sort options based on the current page
 */
const PageSortBy = ({
  selectedSortOption = "",
  onSortChange,
  className = "",
  isVisible = true,
}) => {
  const location = useLocation();
  const sortingConfig = useSortingConfig();
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

  if (!sortingConfig || !isVisible) {
    return null;
  }

  const toggleSortBox = () => {
    setIsSortBoxOpen((prev) => !prev);
  };

  const handleSortOptionClick = (option) => {
    const newSelection = selectedSortOption === option.value ? "" : option.value;

    if (onSortChange) {
      onSortChange(newSelection);
    }

    setIsSortBoxOpen(false);

    // Analytics
    const route = location.pathname.split("/").join("_");
    logEvent(analytics, "sort_option_selected", {
      sort_option: newSelection,
      page: route,
    });
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`hidden sm:flex rounded-lg p-1 w-[34px] h-[34px] md:w-[fit-content] ml-auto justify-center items-center cursor-pointer ${
          selectedSortOption.length > 0
            ? `border border-[#205E59] bg-[#DFF4F3]`
            : `border border-gray-300`
        }`}
        onClick={toggleSortBox}
      >
        <img src={Sort} className="w-[18px] h-[18px]" alt="Sort" />
        <button
          className={`hidden md:block px-1 py-1 rounded ${
            selectedSortOption.length > 0
              ? "text-[#205E59] font-medium"
              : "text-gray-600"
          }`}
        >
          Sort By
        </button>
      </div>

      {/* Sort Options Dropdown */}
      {isSortBoxOpen && (
        <div
          className="absolute right-0 mt-2 w-64 bg-[#FAFAFA] border border-gray-300 shadow-lg z-50 rounded-md"
          ref={sortBoxRef}
        >
          <ul className="p-2">
            {sortingConfig.options.map((option) => (
              <li
                key={option.value}
                className={`cursor-pointer min-h-11 py-3 px-4 font-lato text-sm rounded-md transition-colors ${
                  selectedSortOption === option.value
                    ? "bg-[#DAFBEA] text-[#205E59] font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => handleSortOptionClick(option)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PageSortBy;