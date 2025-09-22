import React from "react";
import { SearchBox } from "react-instantsearch";
import { useSearchBoxConfig } from "../../hooks/useInstantSearch.jsx";
import SearchIcon from "/assets/icons/ui/search.svg";

/**
 * Page-specific SearchBox component
 * Automatically configures SearchBox based on the current page
 */
const PageSearchBox = ({ className = "", ...props }) => {
  const searchBoxConfig = useSearchBoxConfig();

  if (!searchBoxConfig) {
    return null; // Page doesn't support search
  }

  return (
    <div className={`relative flex justify-end ${className}`}>
      <div className="absolute top-3 right-[calc(100%-30px)]">
        <img src={SearchIcon} alt="Search" />
      </div>
      <SearchBox
        {...searchBoxConfig}
        {...props}
      />
    </div>
  );
};

export default PageSearchBox;