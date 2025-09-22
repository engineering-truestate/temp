import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchCompareProjects,
  selectCompareProjects,
  removeProjectFromComparison,
  addProjectForComparison,
} from '../../slices/compareSlice';
import styles from './Compare.module.css';
import crossCompare from '/assets/icons/features/compare-remove-2.svg'; // Replace with actual icon path
import addIcon from '../../../public/images/addicon_compare.png'; // Add icon for "Add Property"
import styles1 from '../../components/SearchBar.module.css';
import search from '/assets/icons/ui/search.svg';
import close from '/assets/icons/navigation/close-compare.svg';
// import { fetchInitialProjects , fetchMoreProjects , setSearchTerm   } from '../../slices/projectSlice'; // Correct import for fetching projects
import { useToast } from "../../hooks/useToast.jsx";
import { toCapitalizedWords } from '../../utils/common.js';

const ComparePage = () => {
  const dispatch = useDispatch();
  const compareProjects = useSelector(selectCompareProjects) || [];
  // const { projects, loading , searchTerm } = useSelector((state) => state.projectsState); // Get projects from the state

  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Control dropdown visibility
  const [filteredProjects, setFilteredProjects] = useState([]); // Filtered projects
  const { addToast } = useToast(); // Access the toast function

  const [searchActive, setSearchActive] = useState(false);
  const searchContainerRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const { allProjects } = useSelector((state) => state.projectsState);


  // Fetch initial projects when the component mounts
  // useEffect(() => {
  //   dispatch(fetchInitialProjects()); // Only fetch once on mount

  // }, [dispatch , searchTerm]);

  // Filter the projects based on the search term
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const filtered = allProjects.filter((project) =>
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setTimeout(() => {
        setFilteredProjects(filtered);
      }, [500]);
    } else {
      setFilteredProjects([]); // Reset filtered projects if search term is empty
    }
  }, [searchTerm, allProjects]); // Run this effect when searchTerm or projects change

  // Fetch comparison projects (only once when component mounts)
  // useEffect(() => {
  //   dispatch(fetchCompareProjects());
  // }, [dispatch ]);

  // When the input is focused, show the dropdown
  // const handleInputFocus = () => {
  //   setIsDropdownVisible(true);
  // };

  // Handle input changes to filter projects based on search term
  const handleInputChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    //  dispatch(setSearchTerm(searchValue)); // Update the search term
    setSearchTerm(searchValue);
  };

  // Handle project selection from dropdown
  const handleProjectSelect = async (project) => {
    try {
      // dispatch(setSearchTerm(''));
      closeSearch();
      setSearchTerm('');
      setIsDropdownVisible(false);
      if (compareProjects.length >= 4) {
        addToast("Dummy", "error", "Maximum 4 properties can be compared");
        return;
      }
      addToast("Dummy", "success", "Property Added to Compare", "The property has been added to the compare list.");
      await dispatch(addProjectForComparison(project.id)).unwrap();
      await dispatch(fetchCompareProjects()).unwrap();

    } catch (error) {
      addToast("Dummy", "error", "Compare Action Failed", "You are offline or there's an issue updating the compare list. Please try again.");
    }
  };

  const handleRemoveProject = async (id) => {
    try {
      await dispatch(removeProjectFromComparison(id)).unwrap();
      await dispatch(fetchCompareProjects()).unwrap();
      addToast("Dummy", "error", "Property Removed from Compare", "The property has been removed from the compare list.");

    } catch (error) {
      addToast("Dummy", "error", "Compare Action Failed", "You are offline or there's an issue updating the compare list. Please try again.");
    }
  };

  const navigate = useNavigate();
  const handleAdd = () => {
    navigate('/compare');
  };

  const handleInputFocus = () => {
    setSearchActive(true);
    setIsDropdownVisible(true);

    window.history.pushState({ searchActive: true }, '');
  };

  const closeSearch = () => {
    setSearchActive(false);
    setIsDropdownVisible(false);
    if (inputRef.current) {
      inputRef.current.blur(); // Deselect input field
    }
  };

  // Close the search view on outside click
  const handleClickOutside = (e) => {
    if (
      searchContainerRef.current &&
      dropdownRef.current &&
      !searchContainerRef.current.contains(e.target) &&
      !dropdownRef.current.contains(e.target)
    ) {
      closeSearch();
    }
  };

  useEffect(() => {
    if (searchActive) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('popstate', closeSearch);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('popstate', closeSearch);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('popstate', closeSearch);
    }
  }, [searchActive]);

  return (
    <div className="h-[100vh] ml-4 mr-4 md:hidden">
      <div className="header flex justify-between items-center py-4">
        <h2 className={styles.projname2}>Add Property to Compare</h2>
        <img src={close} onClick={handleAdd} alt="Close" />
      </div>

      <div className="properties-list">
        {!searchActive &&
          compareProjects?.map((project) => (
            <div
              key={project?.id}
              className="property-item flex justify-between items-center py-4 border-b border-[#D9D9D9]"
            >
              <div className="max-w-[250px]">
                <h3 className={styles.rowhead2}>{toCapitalizedWords(project?.projectName)}</h3>
                <p className={styles.h3}>{project?.micromarket}</p>
              </div>
              <button
                onClick={() => handleRemoveProject(project.id)}
                className="w-8 h-8"
              >
                <img src={crossCompare} alt="Remove" className="w-8 h-8" />
              </button>
            </div>
          ))}

        {/* Search input */}
        {compareProjects.length<=3 &&  <div className="add-property flex justify-between items-center py-4  border-b">
          <div className={`flex items-center justify-center rounded-lg w-full ${styles1.Searchx}`} ref={searchContainerRef}>
            <form method="GET" className="rounded-lg w-full bg-[#FAFAFA]">
              <div className="flex">
                <span className="inset-y-0 relative left-2 flex items-center mr-2">
                  <button className="mx-1 focus:outline-none focus:shadow-outline" onClick={(e) => e.preventDefault()} >
                    <img src={search} alt="Search" />
                  </button>
                </span>
                <input
                  type="search"
                  name="q"
                  value={searchTerm}
                  onFocus={handleInputFocus} // Show dropdown when input is focused
                  onChange={handleInputChange} // Handle search input changes
                  className="pl-2 py-2 text-sm rounded-md focus:outline-none focus:text-gray-900 w-full bg-gray-50"
                  placeholder="Search properties..."
                  autoComplete="off"
                  ref={inputRef}
                />
                <button className={`${styles1.searchbtn}`} onClick={(e) => e.preventDefault()}>
                  <p className={`${styles1.searchbtntxt}`}>Search</p>
                </button>
              </div>
            </form>
          </div>
        </div>}

        {/* Display dropdown with filtered results */}
        {isDropdownVisible && searchActive &&
          (
            filteredProjects.length > 0 ? (
              <ul className="dropdown absolute bg-[#FAFAFA] border border-gray-200 rounded-lg shadow-lg mr-4 max-h-60 overflow-y-auto z-10 mt-1" ref={dropdownRef}>
                {filteredProjects.map((project) => (
                  <li
                    key={project.id}
                    className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleProjectSelect(project)}
                  >
                    {toCapitalizedWords(project.projectName)}
                  </li>
                ))}
              </ul>

            ) :
              (
                <div
                  className='text-center py-2 border-b-[1px]'
                  ref={dropdownRef}
                >
                  No Matching Projects Found
                </div>
              )
          )
        }
      </div>

      <div className="flex justify-center py-4">
        <button onClick={handleAdd} className={`${styles.btn2} fixed w-full bottom-0`}>
          Compare
        </button>
      </div>
    </div>
  );
};

export default ComparePage;
