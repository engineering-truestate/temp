import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCompareProjects,
  selectCompareProjects,
  removeProjectFromComparison,
  addProjectForComparison,
} from "../../slices/compareSlice";
import { useToast } from "../../hooks/useToast.jsx";
import { toCapitalizedWords } from "../../utils/common.js";

// Styles
import styles from "./Compare.module.css";
import styles1 from "../../components/SearchBar.module.css";

// Assets
import crossCompare from "/assets/icons/features/compare-remove-2.svg";
import search from "/assets/icons/ui/search.svg";
import close from "/assets/icons/navigation/close-compare.svg";
import {
  fetchAllProjects,
  selectAllProjects,
} from "../../slices/projectSlice.js";

// Constants
const MAX_COMPARE_PROJECTS = 4;
const SEARCH_DEBOUNCE_DELAY = 500;

const ComparePage = () => {
  // Hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Selectors
  const compareProjects = useSelector(selectCompareProjects) || [];
  const allProjects = useSelector(selectAllProjects);

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchActive, setSearchActive] = useState(false);

  // Refs
  const searchContainerRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Computed values
  const canAddMoreProjects = compareProjects.length < MAX_COMPARE_PROJECTS;
  const hasSearchResults = filteredProjects.length > 0;

  // Debounced search effect
  useEffect(() => {
    dispatch(fetchAllProjects());
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (!allProjects || searchTerm.trim().length === 0) {
      setFilteredProjects([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      const filtered = (allProjects || []).filter(
  (project) =>
    project.projectName &&
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
);
      setFilteredProjects(filtered);
    }, SEARCH_DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, allProjects]);

  // Search handlers
  const handleInputFocus = useCallback(() => {
    setSearchActive(true);
    setIsDropdownVisible(true);
    window.history.pushState({ searchActive: true }, "");
  }, []);

  const closeSearch = useCallback(() => {
    setSearchActive(false);
    setIsDropdownVisible(false);
    setSearchTerm("");
    if (inputRef.current) {
      inputRef.current.blur();
    }
  }, []);

  const handleInputChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  // Project management handlers
  const handleProjectSelect = useCallback(
    async (project) => {
      try {
        closeSearch();

        if (compareProjects.length >= MAX_COMPARE_PROJECTS) {
          addToast("Dummy", "error", "Maximum 4 properties can be compared");
          return;
        }

        addToast(
          "Dummy",
          "success",
          "Property Added to Compare",
          "The property has been added to the compare list."
        );

        await dispatch(addProjectForComparison(project.id)).unwrap();
        await dispatch(fetchCompareProjects()).unwrap();
      } catch (error) {
        addToast(
          "Dummy",
          "error",
          "Compare Action Failed",
          "You are offline or there's an issue updating the compare list. Please try again."
        );
      }
    },
    [closeSearch, compareProjects.length, addToast, dispatch]
  );

  const handleRemoveProject = useCallback(
    async (id) => {
      try {
        await dispatch(removeProjectFromComparison(id)).unwrap();
        await dispatch(fetchCompareProjects()).unwrap();
        addToast(
          "Dummy",
          "error",
          "Property Removed from Compare",
          "The property has been removed from the compare list."
        );
      } catch (error) {
        addToast(
          "Dummy",
          "error",
          "Compare Action Failed",
          "You are offline or there's an issue updating the compare list. Please try again."
        );
      }
    },
    [dispatch, addToast]
  );

  const handleNavigateToCompare = useCallback(() => {
    navigate("/compare");
  }, [navigate]);

  // Outside click handler
  const handleClickOutside = useCallback(
    (e) => {
      if (
        searchContainerRef.current &&
        dropdownRef.current &&
        !searchContainerRef.current.contains(e.target) &&
        !dropdownRef.current.contains(e.target)
      ) {
        closeSearch();
      }
    },
    [closeSearch]
  );

  // Event listeners effect
  useEffect(() => {
    if (searchActive) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("popstate", closeSearch);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("popstate", closeSearch);
    };
  }, [searchActive, handleClickOutside, closeSearch]);

  // Render helpers
  const renderProjectItem = (project) => (
    <div
      key={project?.id}
      className="property-item flex justify-between items-center py-4 border-b border-[#D9D9D9]"
    >
      <div className="max-w-[250px]">
        <h3 className={styles.rowhead2}>
          {toCapitalizedWords(project?.projectName)}
        </h3>
        <p className={styles.h3}>{project?.micromarket}</p>
      </div>
      <button
        onClick={() => handleRemoveProject(project.id)}
        className="w-8 h-8"
        aria-label={`Remove ${project?.projectName} from comparison`}
      >
        <img src={crossCompare} alt="Remove" className="w-8 h-8" />
      </button>
    </div>
  );

  const renderSearchInput = () => (
    <div className="add-property flex justify-between items-center py-4 border-b">
      <div
        className={`flex items-center justify-center rounded-lg w-full ${styles1.Searchx}`}
        ref={searchContainerRef}
      >
        <form method="GET" className="rounded-lg w-full bg-[#FAFAFA]">
          <div className="flex">
            <span className="inset-y-0 relative left-2 flex items-center mr-2">
              <button
                className="mx-1 focus:outline-none focus:shadow-outline"
                onClick={(e) => e.preventDefault()}
                type="button"
                aria-label="Search"
              >
                <img src={search} alt="Search" />
              </button>
            </span>
            <input
              ref={inputRef}
              type="search"
              name="q"
              value={searchTerm}
              onFocus={handleInputFocus}
              onChange={handleInputChange}
              className="pl-2 py-2 text-sm rounded-md focus:outline-none focus:text-gray-900 w-full bg-gray-50"
              placeholder="Search properties..."
              autoComplete="off"
            />
            <button
              className={styles1.searchbtn}
              onClick={(e) => e.preventDefault()}
              type="button"
            >
              <p className={styles1.searchbtntxt}>Search</p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderSearchResults = () => {
    if (!isDropdownVisible || !searchActive) return null;

    return hasSearchResults ? (
      <ul
        className="dropdown absolute bg-[#FAFAFA] border border-gray-200 rounded-lg shadow-lg mr-4 max-h-60 overflow-y-auto z-10 mt-1"
        ref={dropdownRef}
      >
        {filteredProjects.map((project) => (
          <li
            key={project.id}
            className="py-2 px-4 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => handleProjectSelect(project)}
          >
            {toCapitalizedWords(project.projectName)}
          </li>
        ))}
      </ul>
    ) : (
      <div
        className="text-center py-2 border-b-[1px] text-gray-500"
        ref={dropdownRef}
      >
        No Matching Projects Found
      </div>
    );
  };

  return (
    <div className="h-[100vh] ml-4 mr-4 md:hidden">
      {/* Header */}
      <header className="header flex justify-between items-center py-4">
        <h2 className={styles.projname2}>Add Property to Compare</h2>
        <button onClick={handleNavigateToCompare} aria-label="Close">
          <img src={close} alt="Close" />
        </button>
      </header>

      {/* Properties List */}
      <div className="properties-list">
        {/* Existing Projects */}
        {!searchActive && compareProjects?.map(renderProjectItem)}

        {/* Search Input */}
        {canAddMoreProjects && renderSearchInput()}

        {/* Search Results */}
        {renderSearchResults()}
      </div>

      {/* Compare Button */}
      <div className="flex justify-center py-4">
        <button
          onClick={handleNavigateToCompare}
          className={`${styles.btn2} fixed w-full bottom-0`}
        >
          Compare
        </button>
      </div>
    </div>
  );
};

export default ComparePage;
