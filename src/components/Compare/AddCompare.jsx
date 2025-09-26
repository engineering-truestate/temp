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
import close from "/assets/icons/navigation/close-compare.svg";
import algoliaService from "../../services/algoliaService.js";

const MAX_COMPARE_PROJECTS = 4;

// ---------- Custom Hit Component ----------
const Hit = ({ hit, onSelect }) => {
  return (
    <li
      key={hit.objectID}
      className="py-2 px-4 cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => onSelect(hit)}
    >
      {toCapitalizedWords(hit.projectName)}
    </li>
  );
};

// simple debounce hook
function useDebouncedValue(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ---------- Main Page ----------
const AddCompare = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast, updateToast } = useToast();

  const compareProjects = useSelector(selectCompareProjects) || [];

  const [searchActive, setSearchActive] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300); // 300ms debounce, change if you want

  const [results, setResults] = useState([]);

  const searchContainerRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const canAddMoreProjects = compareProjects.length < MAX_COMPARE_PROJECTS;

  const closeSearch = useCallback(() => {
    setSearchActive(false);
    if (inputRef.current) inputRef.current.blur();
  }, []);

  const handleProjectSelect = useCallback(
    async (project) => {
      try {
        closeSearch();

        if (compareProjects.length >= MAX_COMPARE_PROJECTS) {
          addToast("Dummy", "error", "Maximum 4 properties can be compared");
          return;
        }

        // Show loading toast immediately
        const loadingToastId = addToast(
          "Compare",
          "loading",
          "Adding Property"
        );

        await dispatch(addProjectForComparison(project.objectID)).unwrap();
        await dispatch(fetchCompareProjects()).unwrap();

        // Update loading toast to success
        updateToast(loadingToastId, {
          type: "success",
          heading: "Property Added to Compare",
          description: "The property has been added to the compare list.",
        });
      } catch (error) {
        // If loading toast was created, update it to error
        // Otherwise create a new error toast
        if (compareProjects.length < MAX_COMPARE_PROJECTS) {
          updateToast(loadingToastId, {
            type: "error",
            heading: "Compare Action Failed",
            description:
              "You are offline or there's an issue updating the compare list. Please try again.",
          });
        } else {
          addToast(
            "Dummy",
            "error",
            "Compare Action Failed",
            "You are offline or there's an issue updating the compare list. Please try again."
          );
        }
      }
    },
    [closeSearch, compareProjects.length, addToast, updateToast, dispatch]
  );

  const handleRemoveProject = useCallback(
    async (id) => {
      // Show loading toast immediately
      const loadingToastId = addToast(
        "Compare",
        "loading",
        "Removing Property"
      );

      try {
        await dispatch(removeProjectFromComparison(id)).unwrap();
        await dispatch(fetchCompareProjects()).unwrap();

        // Update loading toast to success (using error type for red color since it's removal)
        updateToast(loadingToastId, {
          type: "error", // Red color for removal action
          heading: "Property Removed from Compare",
          description: "The property has been removed from the compare list.",
        });
      } catch (error) {
        // Update loading toast to error
        updateToast(loadingToastId, {
          type: "error",
          heading: "Compare Action Failed",
          description:
            "You are offline or there's an issue updating the compare list. Please try again.",
        });
      }
    },
    [dispatch, addToast, updateToast]
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

  // Perform Algolia search when debouncedQuery changes
  useEffect(() => {
    let cancelled = false;

    // clear results when query is empty
    if (!debouncedQuery || debouncedQuery.trim().length === 0) {
      setResults([]);
      return;
    }

    (async () => {
      try {
        const res = await algoliaService.client.search([
          {
            indexName: "truEstatePreLaunch",
            query: debouncedQuery,
            params: {
              filters: "showOnTruEstate:true",
              hitsPerPage: 6,
            },
          },
        ]);

        if (cancelled) return;
        const hits =
          (res && res.results && res.results[0] && res.results[0].hits) || [];
        setResults(hits);
      } catch (err) {
        // keep silent, but you can console.log for debugging
        console.error("Algolia search error:", err);
        if (!cancelled) setResults([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

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
      <div className="properties-list relative">
        {/* Existing Projects */}
        {!searchActive && compareProjects?.map(renderProjectItem)}

        {/* Algolia debounced search (custom input) */}
        {canAddMoreProjects && (
          <div
            className={`flex items-center justify-center rounded-lg w-full ${styles1.Searchx}`}
            ref={searchContainerRef}
          >
            <div className="rounded-lg w-full bg-[#FAFAFA] relative">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchActive(true)}
                placeholder="Search properties..."
                className="pl-2 py-2 text-sm rounded-md focus:outline-none focus:text-gray-900 w-full bg-gray-50"
                aria-label="Search properties"
              />
            </div>

            {/* Dropdown results */}
            {searchActive && (
              <ul
                className="absolute left-0 top-full right-0 bg-[#FAFAFA] border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50 mt-1"
                ref={dropdownRef}
              >
                {results.length === 0 ? (
                  <li className="py-2 px-4 text-sm text-gray-500">
                    No results
                  </li>
                ) : (
                  results.map((hit) => (
                    <Hit
                      key={hit.objectID}
                      hit={hit}
                      onSelect={handleProjectSelect}
                    />
                  ))
                )}
              </ul>
            )}
          </div>
        )}
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

export default AddCompare;
