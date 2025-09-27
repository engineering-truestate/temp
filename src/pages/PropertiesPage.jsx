import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import MainContentLayout from "../components/MainContentLayout";
import ProjectGrid from "../components/ProjectGrid";
import Map from "../components/Map/Map";
import Table from "../components/Table/Table";
import ProjectPopupMap from "../components/Project_popup/ProjectPopupMap";
import PageInstantSearch from "../components/InstantSearch/PageInstantSearch";
import PropertiesPageHeader from "../components/Headers/PropertiesPageHeader";
import {
  fetchAllProjects,
  fetchTableProjects,
  selectAllProjects,
} from "../slices/projectSlice";
import { getProjectImages } from "../utils/common";
import Loader from "../components/Loader";
import { showLoader, hideLoader } from "../slices/loaderSlice";
import UnifiedTable from "../components/Table/UnifiedTable";

const PropertiesPage = () => {
  const dispatch = useDispatch();
  const [propertiesView, setPropertiesView] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedMapProject, setSelectedMapProject] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false); // New state to track initial data load
  const [filters, setFilters] = useState({
    searchTerm: "",
    investmentType: "",
    strategy: "",
    minInvestment: 0,
    tenure: "",
  });
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [isVisible, setIsVisible] = useState(window.innerWidth > 640);

  // Get loading state from Redux
  const { table_projects, totalProjects, allProjects, loading } = useSelector(
    (state) => state.projectsState
  );

  useEffect(() => {
    const totalProjectsCount = totalProjects;
    if (totalProjectsCount !== null && totalProjectsCount !== undefined) {
      const pages = Math.ceil(totalProjectsCount / 12);
      setTotalPages(pages);
    } else {
      setTotalPages(0);
    }
  }, [totalProjects]);

  // Initial data loading effect
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        dispatch(showLoader());
        const response = await fetch("/data/projects.json");
        const data = await response.json();
        setImageData(data);

        if (propertiesView === "table") {
          await dispatch(fetchTableProjects(currentPage)).unwrap();
        }
        if (propertiesView === "map") {
          await dispatch(fetchAllProjects()).unwrap();
        }

        setInitialDataLoaded(true);
      } catch (error) {
        console.error("Error loading initial data:", error);
        setInitialDataLoaded(true);
      } finally {
        dispatch(hideLoader());
      }
    };

    loadInitialData();
  }, [propertiesView]);

  useEffect(() => {
    if (initialDataLoaded && propertiesView === "table") {
      const loadTableProjects = async () => {
        try {
          dispatch(showLoader());
          await dispatch(fetchTableProjects(currentPage)).unwrap();
        } catch (error) {
          console.error("Error loading table projects:", error);
        } finally {
          dispatch(hideLoader());
        }
      };
      loadTableProjects();
    }
  }, [propertiesView, dispatch, currentPage, initialDataLoaded]);

  const handleSearch = (term) => {
    setFilters((prevFilters) => ({ ...prevFilters, searchTerm: term }));
  };

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const setMinInvestment = (value) => {
    setFilters((prevFilters) => ({ ...prevFilters, minInvestment: value }));
  };

  const handleViewToggle = (newView, viewType) => {
    if (viewType === "properties") {
      setPropertiesView(newView);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsVisible(window.innerWidth > 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show loader until initial data is loaded
  if (!initialDataLoaded) {
    return (
      <div className="flex flex-col h-screen">
        <Loader />
      </div>
    );
  }
  console.log("hmm", allProjects);

  return (
    <div className="flex flex-col h-screen">
      <PageInstantSearch viewType={propertiesView}>
        <MainContentLayout pageTitle="Properties">
          <PropertiesPageHeader
            propertiesView={propertiesView}
            handleViewToggle={handleViewToggle}
            selectedSortOption={selectedSortOption}
            setSelectedSortOption={setSelectedSortOption}
            isVisible={isVisible}
          />
          <div className="h-full">
            {propertiesView === "grid" ? (
              <ProjectGrid
                trueS="all"
                propertiesView={propertiesView}
                setPropertiesView={setPropertiesView}
              />
            ) : propertiesView === "table" ? (
              <UnifiedTable
                projects={table_projects}
                type="properties"
                trueS="all"
                handleFirstPage={() => setCurrentPage(1)}
                handlePreviousPage={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
                handleNextPage={() =>
                  currentPage < totalPages && setCurrentPage(currentPage + 1)
                }
                handleLastPage={() => setCurrentPage(totalPages)}
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            ) : propertiesView === "map" ? (
              <div className="relative h-[70vh] ">
                <div>
                  <Map
                    projects={allProjects}
                    selectedProject={selectedMapProject}
                    setSelectedProject={setSelectedMapProject}
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                    minInvestment={filters.minInvestment}
                    setMinInvestment={setMinInvestment}
                    filters={filters}
                    mapType={"all"}
                    trueS="all"
                  />
                </div>
                {selectedMapProject && (
                  <div className="absolute bottom-0 sm:right-0   w-full sm:w-auto  sm:top-0 z-[8]">
                    <ProjectPopupMap
                      project={selectedMapProject}
                      images={getProjectImages(
                        selectedMapProject["Internal ID"],
                        imageData
                      )}
                      onClose={setSelectedMapProject}
                    />
                  </div>
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        </MainContentLayout>
      </PageInstantSearch>
      <Loader />
    </div>
  );
};

export default PropertiesPage;
