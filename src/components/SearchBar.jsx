import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import {
  setSearchTerm,
  setProjectStatus,
  setAssetType,
  setBudgetRange,
  setReraStatus,
  setPropertyAge,
  setAvailability,
  setTruEstimate,
  setGrowth,
  setDuration,
  fetchInitialProjects,
  fetchAllProjectsAtOnce,
  fetchTableProjects,
} from "../slices/projectSlice";
import Dropdown from "./Dropdown";
import MoreFiltersDropdown from "./MoreFiltersDropdown";
import styles from "./SearchBar.module.css";
import resetIcon from "/assets/icons/actions/btn-reset.svg";
import search from "/assets/icons/ui/search.svg";
import DropdownSlider from "./DropdownSlider";
import allProjectsList from "./helper/allProjectsList"; 



// analytics
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase";
import { toCapitalizedWords } from "../utils/common";





export function SearchBar({ setCurrentPage }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // Initialize state from search parameters and split the comma-separated values into arrays
  const initialSearchTerm = searchParams.get("q") || "";
  const initialProjectStatus = searchParams.get("status")?.split(",") || [];
  const initialAssetType = searchParams.get("asset_type")?.split(",") || [];
  const initialMinBudget = parseInt(searchParams.get("minBudget")) || 0;
  const initialMaxBudget = parseInt(searchParams.get("maxBudget")) || 300;
  const initialReraStatus = searchParams.get("rera")?.split(",") || [];
  const initialPropertyAge = searchParams.get("age")?.split(",") || [];
  const initialAvailability = searchParams.get("availability")?.split(",") || [];
  const initialTruEstimate = searchParams.get("truestimate")?.split(",") || [];  // Fetch from URL
  const initialGrowth = searchParams.get("growth")?.split(",") || [];
  const initialDuration = searchParams.get("duration")?.split(",") || [];

  const [searchTerm, setSearchTermState] = useState(initialSearchTerm);
  const [selectedProjectStatus, setSelectedProjectStatus] =
    useState(initialProjectStatus);
  const [selectedAssetTypes, setSelectedAssetTypes] =
    useState(initialAssetType);
  const [minBudget, setMinBudget] = useState(initialMinBudget);
  const [maxBudget, setMaxBudget] = useState(initialMaxBudget);
  const [selectedReraStatus, setSelectedReraStatus] =
    useState(initialReraStatus);
  const [selectedPropertyAge, setSelectedPropertyAge] =
    useState(initialPropertyAge);
  const [selectedDuration, setSelectedDuration] = useState(initialDuration ? [initialDuration] : []);
  const [selectedTruEstimates, setSelectedTruEstimates] = useState(initialTruEstimate); // Set state
  const [selectedGrowths, setSelectedGrowths] = useState(initialGrowth);
  const [selectedMoreFilters, setSelectedMoreFilters] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState(initialAvailability);
  // State for storing selected duration labels

  const [filteredOptions, setFilteredOptions] = useState(allProjectsList);
  const [showOptions, setShowOptions] = useState(false);

  const [openDropdown, setOpenDropdown] = useState(null);

  const [areFiltersApplied, setAreFiltersApplied] = useState(false);
  const [visibleFiltersCount, setVisibleFiltersCount] = useState(5);

  const handleResize = () => {
    const width = window.innerWidth;

    if (width <= 768) {
      setVisibleFiltersCount(0); // Show no filters outside "More Filters" for small screens
    } else if (width > 768 && width <= 1280) {
      setVisibleFiltersCount(3); // Show 2 filters for medium screens
    } else {
      setVisibleFiltersCount(5); // Show 4 filters for large screens
    }
  };

  // Add the resize event listener to ensure responsive behavior
  useEffect(() => {
    // Attach resize event listener
    window.addEventListener("resize", handleResize);

    // Call handleResize initially to set the right number of visible filters
    handleResize();

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {    
    const searchTerm = searchParams.get("q") || "";
    const projectStatus = searchParams.get("status")?.split(",") || [];
    const assetType = searchParams.get("asset_type")?.split(",") || [];
    const minBudgetParam = parseInt(searchParams.get("minBudget")) || 0;
    const maxBudgetParam = parseInt(searchParams.get("maxBudget")) || 300;
    const reraStatus = searchParams.get("rera")?.split(",") || [];
    const propertyAge = searchParams.get("age")?.split(",") || [];
    const availability = searchParams.get("availability")?.split(",") || [];
    const truestimate = searchParams.get("truestimate")?.split(",") || [];
    const growth = searchParams.get("growth")?.split(",") || [];
    const duration = searchParams.get("duration")?.split(",") || [];

    // Update Redux store
    dispatch(setSearchTerm(searchTerm));
    dispatch(setProjectStatus(projectStatus));
    dispatch(setAssetType(assetType));
    dispatch(setBudgetRange([minBudgetParam, maxBudgetParam]));
    dispatch(setReraStatus(reraStatus));
    dispatch(setPropertyAge(propertyAge));
    dispatch(setAvailability(availability));
    dispatch(setTruEstimate(truestimate));
    dispatch(setGrowth(growth));
    dispatch(setDuration(duration));

    // Update dropdown states
    setSearchTermState(searchTerm);
    setSelectedProjectStatus(projectStatus);
    setSelectedAssetTypes(assetType);
    setMinBudget(minBudgetParam);
    setMaxBudget(maxBudgetParam);
    setSelectedReraStatus(reraStatus);
    setSelectedPropertyAge(propertyAge);
    setSelectedAvailability(availability);
    setSelectedTruEstimates(truestimate);
    setSelectedGrowths(growth);
    setSelectedDuration(duration);

    // Fetch updated projects
    dispatch(fetchInitialProjects());
    dispatch(fetchAllProjectsAtOnce());
    dispatch(fetchTableProjects(1));
    setCurrentPage(1);
  }, [location, searchParams, dispatch]);



  useEffect(() => {
    setAreFiltersApplied(
      selectedProjectStatus.length > 0 ||
      selectedAssetTypes.length > 0 ||
      selectedDuration.length > 0 ||
      selectedTruEstimates.length > 0 ||
      selectedGrowths.length > 0 ||
      selectedReraStatus.length > 0 ||
      selectedPropertyAge.length > 0 ||
      selectedAvailability.length > 0 ||
      minBudget !== 0 ||
      maxBudget !== 300 ||
      selectedMoreFilters.length > 0
    );
  }, [
    selectedProjectStatus,
    selectedAssetTypes,
    selectedDuration,
    selectedTruEstimates,
    selectedGrowths,
    selectedReraStatus,
    selectedPropertyAge,
    selectedAvailability,
    minBudget,
    maxBudget,
    selectedMoreFilters,
  ]);

  // Ensure that query params are dispatched to the store on initial load
  useEffect(() => {
    // Update state only when initial values exist
    if (initialSearchTerm) dispatch(setSearchTerm(initialSearchTerm));
    if (initialProjectStatus && initialProjectStatus.length > 0) dispatch(setProjectStatus(initialProjectStatus));
    if (initialAssetType && initialAssetType.length > 0) dispatch(setAssetType(initialAssetType));
    if (initialReraStatus && initialReraStatus.length > 0) dispatch(setReraStatus(initialReraStatus));
    if (initialPropertyAge && initialPropertyAge.length > 0) dispatch(setPropertyAge(initialPropertyAge));
    if (initialAvailability && initialAvailability.length > 0) dispatch(setAvailability(initialAvailability));
    if (initialTruEstimate && initialTruEstimate.length > 0) dispatch(setTruEstimate(initialTruEstimate));
    if (initialGrowth && initialGrowth.length > 0) dispatch(setGrowth(initialGrowth));
    if (initialDuration && initialDuration.length > 0) dispatch(setDuration(initialDuration));
    if (minBudget !== 0 || maxBudget !== 300) dispatch(setBudgetRange([minBudget, maxBudget]));

    // Check if any filter has a value before fetching projects
    if (
      initialSearchTerm ||
      (initialProjectStatus && initialProjectStatus.length > 0) ||
      (initialAssetType && initialAssetType.length > 0) ||
      (minBudget !== 0 || maxBudget !== 300) ||
      (initialReraStatus && initialReraStatus.length > 0) ||
      (initialPropertyAge && initialPropertyAge.length > 0) ||
      (initialAvailability && initialAvailability.length > 0) ||
      (initialTruEstimate && initialTruEstimate.length > 0) ||
      (initialGrowth && initialGrowth.length > 0) ||
      (initialDuration && initialDuration.length > 0)
    ) {
      // dispatch(fetchInitialProjects());
      // dispatch(fetchAllProjectsAtOnce());
      // dispatch(fetchTableProjects(1));
      setCurrentPage(1);
    }
  }, [
    initialSearchTerm,
    initialProjectStatus?.length,
    initialAssetType?.length,
    minBudget,
    maxBudget,
    initialReraStatus?.length,
    initialPropertyAge?.length,
    initialAvailability?.length,
    initialTruEstimate?.length,
    initialGrowth?.length,
    initialDuration?.length,
    dispatch
  ]);

  const handleFilterOptions = (term) => {
    if (!term) {
      setFilteredOptions(allProjectsList);
      return;
    }

    const options = allProjectsList.filter((option) => option?.toLowerCase()?.includes(term?.toLowerCase()));
    setFilteredOptions(options);
  }

  const handleOptionSelect = (e, option) => {
    setSearchTermState(option);
    handleSearchSubmit(e, option);
  }

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTermState(term);
    if(!showOptions)
    {
      setShowOptions(true);
    }
    handleFilterOptions(term);
  };

  const handleSearchSubmit = (event, submittedTerm = null) => {
    event.preventDefault();
    const searchQuery = submittedTerm || searchTerm;

    setShowOptions(false);
    const newParams = new URLSearchParams(searchParams);
    const status =
      selectedProjectStatus.length > 0 ? selectedProjectStatus.join(",") : "";
    const assetType =
      selectedAssetTypes.length > 0 ? selectedAssetTypes.join(",") : "";
    const reraStatus =
      selectedReraStatus.length > 0 ? selectedReraStatus.join(",") : "";
    const propertyAge =
      selectedPropertyAge.length > 0 ? selectedPropertyAge.join(",") : "";
    const availability =
      selectedAvailability.length > 0 ? selectedAvailability.join(",") : "";
    const truestimate = selectedTruEstimates.length > 0 ? selectedTruEstimates.join(",") : "";
    const growth = selectedGrowths.length > 0 ? selectedGrowths.join(",") : "";
    const duration = selectedDuration.length > 0 ? selectedDuration.join(",") : "";

    newParams.set("q", searchQuery.trim());
    if (status) newParams.set("status", status);
    else newParams.delete("status");

    if (assetType) newParams.set("asset_type", assetType);
    else newParams.delete("asset_type");

    if (minBudget !== 0) newParams.set("minBudget", minBudget);
    else newParams.delete("minBudget");

    if (maxBudget !== 300) newParams.set("maxBudget", maxBudget);
    else newParams.delete("maxBudget");

    if (reraStatus) newParams.set("rera", reraStatus);
    else newParams.delete("rera");

    if (propertyAge) newParams.set("age", propertyAge);
    else newParams.delete("age");

    if (availability) newParams.set("availability", availability);
    else newParams.delete("availability");

    if (truestimate) newParams.set("truestimate", truestimate);
    else newParams.delete("truestimate");

    if (growth) newParams.set("growth", growth);
    else newParams.delete("growth");

    if (duration) newParams.set("duration", duration);
    else newParams.delete("duration");

    setSearchParams(newParams);


    // const analyticsParams = {
    //   userId: userID,
    //   ...(status && { status }),
    //   ...(assetType && { assetType }),
    //   ...(budget && { budget }),
    //   ...(reraStatus && { reraStatus }),
    //   ...(propertyAge && { propertyAge }),
    //   ...(availability && { availability }),
    //   ...(truestimate && { truestimate }),
    //   ...(growth && { growth }),
    //   ...(duration && { duration })
    // };

    logEvent(analytics, "search", {
      search_term: searchQuery
    })


    // Dispatch values to Redux store
    dispatch(setSearchTerm(searchQuery.trim()));
    if (status) dispatch(setProjectStatus(status));
    if (assetType) dispatch(setAssetType(assetType));
    if (reraStatus) dispatch(setReraStatus(reraStatus));
    if (propertyAge) dispatch(setPropertyAge(propertyAge));
    if (availability) dispatch(setAvailability(availability));
    if (truestimate) dispatch(setTruEstimate(truestimate));
    if (growth) dispatch(setGrowth(growth));
    if (duration) dispatch(setDuration(duration));
    if (minBudget !== 0 || maxBudget !== 300) dispatch(setBudgetRange([minBudget, maxBudget]));

    // Fetch updated projects
    dispatch(fetchInitialProjects());
    dispatch(fetchAllProjectsAtOnce());
    dispatch(fetchTableProjects(1));
    setCurrentPage(1);
  };

  // Handle TruEstimate selection
  const handleTruEstimateChange = (selectedOptions) => {
    const uniqueSelections = [...new Set(selectedOptions)];
    setSelectedTruEstimates(uniqueSelections);
    updateQueryParam("truestimate", uniqueSelections);
    dispatch(setTruEstimate(uniqueSelections));  // Dispatch to store
  };

  // Handle Growth selection
  const handleGrowthChange = (selectedOptions) => {
    const uniqueSelections = [...new Set(selectedOptions)];
    setSelectedGrowths(uniqueSelections);
    updateQueryParam("growth", uniqueSelections);
    dispatch(setGrowth(uniqueSelections));  // Dispatch to store
  };

  const handleStatusChange = (selectedOptions) => {
    const uniqueSelections = [...new Set(selectedOptions)];
    setSelectedProjectStatus(uniqueSelections);
    updateQueryParam("status", uniqueSelections);
  };

  const handleAssetTypeChange = (selectedOptions) => {
    const uniqueSelections = [...new Set(selectedOptions)];
    setSelectedAssetTypes(uniqueSelections);
    updateQueryParam("asset_type", uniqueSelections);
  };

  const handleAvailabilityChange = (selectedOptions) => {
    const uniqueSelections = [...new Set(selectedOptions)];
    setSelectedAvailability(uniqueSelections);
    updateQueryParam("availability", uniqueSelections);
  };

  const handleBudgetApply = (values) => {
    const [minValue, maxValue] = values;
    setMinBudget(minValue);
    setMaxBudget(maxValue);

    // Update URL parameters
    const newParams = new URLSearchParams(searchParams);
    if (minValue !== 0) {
      newParams.set("minBudget", minValue);
    } else {
      newParams.delete("minBudget");
    }
    if (maxValue !== 300) {
      newParams.set("maxBudget", maxValue);
    } else {
      newParams.delete("maxBudget");
    }
    setSearchParams(newParams);

    // Dispatch to store
    dispatch(setBudgetRange([minValue, maxValue]));

    // Fetch updated projects
    dispatch(fetchInitialProjects());
    dispatch(fetchAllProjectsAtOnce());
    dispatch(fetchTableProjects(1));
    setCurrentPage(1);
  };


  // Use the helper function to display labels when needed


  const handleDurationChange = (selectedOptions) => {
    const uniqueSelections = [...new Set(selectedOptions)];
    setSelectedDuration(uniqueSelections);
    updateQueryParam("duration", uniqueSelections);
  };

  const handlePropertyAgeChange = (selectedOptions) => {
    const uniqueSelections = [...new Set(selectedOptions)];
    setSelectedPropertyAge(uniqueSelections);
    updateQueryParam("age", uniqueSelections);
  };

  const handleReraStatusChange = (selectedOptions) => {
    const uniqueSelections = [...new Set(selectedOptions)];
    setSelectedReraStatus(uniqueSelections);
    updateQueryParam("rera", uniqueSelections);
  };

  const updateQueryParam = (key, selectedOptions) => {
    const newParams = new URLSearchParams(searchParams);
    // Ensure selectedOptions is an array, otherwise treat it as an empty array
    const value = Array.isArray(selectedOptions) ? selectedOptions.join(",") : "";
    

    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    // Update the search params to reflect the change
    setSearchParams(newParams);

    // Always fetch updated projects after a filter is changed/removed
    // dispatch(fetchInitialProjects());
    // dispatch(fetchAllProjectsAtOnce());
  };



  const handleClearFilters = () => {
    // Clear local state
    setSelectedProjectStatus([]);
    setSelectedAssetTypes([]);
    setMinBudget(0);
    setMaxBudget(300);
    setSelectedDuration([]);
    setSelectedTruEstimates([]);
    setSelectedGrowths([]);
    setSelectedMoreFilters([]);
    setSelectedReraStatus([]);
    setSelectedPropertyAge([]);
    setSelectedAvailability([]);
    setOpenDropdown(null);
  
    // Get the current `q` parameter from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const searchTerm = searchParams.get("q") || "";
  
    // Decide the navigation path based on the current page
    let navigationPath = "/properties";
    if (window.location.pathname.includes("/wishlist")) {
      navigationPath = "/wishlist";
    }
  
    // Append the `q` parameter to the navigation path if it exists
    if (searchTerm) {
      navigationPath += `?q=${encodeURIComponent(searchTerm)}`;
    }
  
    // Navigate to the appropriate page
    navigate(navigationPath);
  
    // Clear Redux state
    dispatch(setProjectStatus(""));
    dispatch(setAssetType(""));
    dispatch(setBudgetRange([0, 300]));
    dispatch(setAvailability(""));
    dispatch(setDuration(""));
    dispatch(setTruEstimate(""));
    dispatch(setGrowth(""));
    dispatch(setReraStatus(""));
    dispatch(setPropertyAge(""));
  
    // Fetch the initial projects without any filters
    dispatch(fetchInitialProjects());
    dispatch(fetchAllProjectsAtOnce());
    dispatch(fetchTableProjects(1));
    
    // Reset the current page
    setCurrentPage(1);
  };
  

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const filters = [
    {
      label: "Value",
      options: ["Undervalued", "Overvalued", "Fairly Valued"],
      selectedOptions: selectedTruEstimates,
      onChange: handleTruEstimateChange,  // Use handleTruEstimateChange
    },
    {
      label: "Growth",
      options: ["High", "Medium", "Low"],
      selectedOptions: selectedGrowths,
      onChange: handleGrowthChange,       // Use handleGrowthChange
    },
    {
      label: "Asset Type",
      options: ["Plot", "Villa", "Apartment"],
      selectedOptions: selectedAssetTypes,
      onChange: handleAssetTypeChange,
    },
    {
      label: "Budget",
      options: null,
      selectedOptions: null,
      onChange: null,
    },
    // {
    //   label: "Duration",
    //   options: ["<1 year", "1-2 years", "2-5 years", ">5 years"],
    //   selectedOptions: selectedDuration,
    //   onChange: handleDurationChange,
    // },
    {
      label: "Status",
      options: [
        "Pre Launch",
        "Under Construction",
        "Complete",
        "Ready to Move", 
        // "Ongoing"
      ],
      selectedOptions: selectedProjectStatus,
      onChange: handleStatusChange,
    },
    
    {
      label: "Availability",
      options: ["Available", "Sold Out", "Limited"],
      selectedOptions: selectedAvailability,
      onChange: handleAvailabilityChange,
    },
    {
      label: "RERA",
      options: ["Approved", "Not Approved"],
      selectedOptions: selectedReraStatus,
      onChange: handleReraStatusChange,
    },



    // {
    //   label: "Age of Property",
    //   options: ["<1 Year", "1-2 Years", "2-5 Years", ">5 Years"],
    //   selectedOptions: selectedPropertyAge,
    //   onChange: handlePropertyAgeChange,
    // },
  ];

  const visibleFilters = filters.slice(0, visibleFiltersCount);
  const moreFilters = filters.slice(visibleFiltersCount);

  const dropdownRef = useRef(null);
  const searchContainerRef = useRef(null);

  const handleClickOutside = (e) => {
    if (
      searchContainerRef.current &&
      dropdownRef.current &&
      !searchContainerRef.current.contains(e.target) &&
      !dropdownRef.current.contains(e.target)
    ) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>

    <div
      className={`${styles.searchBar}  w-[100%]  py-3 px-4  md:px-8 `}
    >
      <div className="relative w-full">
        <div
          className={`flex items-center justify-center rounded-lg w-full ${styles.Searchx} h-[2.25rem]`}
        >
          <form
            method="GET"
            className={`rounded-lg w-full bg-[#FAFAFA] px-[0.25rem] ${styles.searchinp}`}
            onSubmit={handleSearchSubmit}
            
          >
            <div className="flex h-[1.75rem]">
              <span className=" inset-y-0 relative left-2 flex items-center mr-2  ">
                <button
                    type="submit"
                    className="mx-1 focus:outline-none focus:shadow-outline"
                    
                >
                  <img src={search} alt="Search" className="max-w-[none]" />
                </button>
              </span>
              <input
                type="search"
                name="q"
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-2 py-2 text-sm rounded-md focus:outline-none focus:text-gray-900 w-full bg-gray-50"
                placeholder="Search properties..."
                autoComplete="off"
                ref={searchContainerRef}
              />
              <button
                type="submit"
                className={`${styles.searchbtn}`}
              >
                <p className={`${styles.searchbtntxt}`}>Search</p>
              </button>
            </div>
          </form>
        </div>
        {/* {showOptions &&
          (filteredOptions.length > 0 ?
            (
              <ul className="dropdown w-full absolute bg-[#FAFAFA] border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20 mt-1" ref={dropdownRef}>
                {filteredOptions.map((option) => (
                  // filteredOptions
                  <li
                    className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                    onClick={(e) => handleOptionSelect(e, option)}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            ) : (
              <div
                className='flex flex-col absolute bg-[#FAFAFA] w-full border border-gray-200 rounded-lg shadow-lg py-2 z-20 mt-1'
                ref={dropdownRef}
              >
                <span className="text-center text-[14px] font-lato">No Matching Projects Found... </span>
                <span className="text-center text-[14px] font-lato">With Current Filters Applied</span>
              </div>
            )
          )
        } */}
      </div>

      {/* <Dropdown
        label={<div className={styles.iconWithLabel}>Status</div>}
        options={['Completed', 'Ongoing', 'New Project Launch']}
        selectedOptions={selectedProjectStatus}
        onChange={handleStatusChange}
        isOpen={openDropdown === 'Status'}
        toggleOpen={() => toggleDropdown('Status')}
      /> */}
      <div className="flex flex-row relative gap-[0.5rem]">
        {/* <DropdownSlider
          label={<div className={styles.iconWithLabel}>Budget</div>}
          minValue={0}
          maxValue={300}
          onApply={handleBudgetApply}
          isOpen={openDropdown === 'Budget'}
          toggleOpen={() => toggleDropdown('Budget')}
          initialMin={minBudget}
          initialMax={maxBudget}
        /> */}
        {visibleFilters.map((filter, index) => (
          <Dropdown
            key={index}
            label={<div className={styles.iconWithLabel}>{filter.label}</div>}
            options={filter.options}
            selectedOptions={filter.selectedOptions}
            onChange={filter.onChange}
            isOpen={openDropdown === filter.label}
            toggleOpen={() => toggleDropdown(filter.label)}
            minValue={0}
            maxValue={300}
            onApply={handleBudgetApply}
            initialMin={minBudget}
            initialMax={maxBudget}
          />
        ))}

        <MoreFiltersDropdown
          filters={moreFilters}
          isOpen={openDropdown === "moreFilters"}
          toggleOpen={() => toggleDropdown("moreFilters")}
          minValue={0}
            maxValue={300}
            onApply={handleBudgetApply}
            initialMin={minBudget}
            initialMax={maxBudget}
            handleClearFilters={handleClearFilters}
        />


<div
  className={`${styles.moreFilters} ${
    areFiltersApplied ? styles.filtersApplied : ''
  }`}
  style={{ visibility: areFiltersApplied ? 'visible' : 'hidden' }}
>
  <button
    className={`${styles.resetbtn}`}
    onClick={handleClearFilters}
  >
    <img src={resetIcon} alt="Reset" />
    <p className="text-[0.625rem] mt-[0.125rem] text-[#BD0E2D]">
      Reset
    </p>
  </button>
</div>


      </div>
    </div>



    </>
   
  );
}

export default SearchBar;
