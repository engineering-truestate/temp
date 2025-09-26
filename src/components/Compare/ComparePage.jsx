import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCompareProjects,
  selectCompareProjects,
  removeProjectFromComparison,
  selectCompareLoading,
} from "../../slices/compareSlice";
import { useToast } from "../../hooks/useToast.jsx";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";
import CompareTableDesktop from "./CompareTableDesktop";
import CompareTableMobile from "./CompareTableMobile";
import styles from "./Compare.module.css";
import emptyImage from "../../../src/components/Compare/Compare.png";
import trueStateIcon from "../../../public/assets/icons/ui/truestateIcon.svg";

const ComparePage = () => {
  const dispatch = useDispatch();
  const compareProjects = useSelector(selectCompareProjects);
  const isLoading = useSelector(selectCompareLoading);
  const [isMobile, setIsMobile] = useState(false);
  const { addToast, updateToast } = useToast();
  const navigate = useNavigate();

  // Fetch compare projects on mount
  useEffect(() => {
    dispatch(fetchCompareProjects());
  }, [dispatch]);

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Navigation handlers
  const handleNavigateToProperties = () => navigate("/properties");
  const handleNavigateToAddCompare = () => navigate("/compare/addcompare");

  // Remove project from comparison
  const handleRemoveProject = async (id) => {
  // show loading toast immediately
  const loadingToastId = addToast(
    "Compare",
    "loading",
    "Removing Property",
    "Removing property from compare list..."
  );

  try {
    await dispatch(removeProjectFromComparison(id));

    updateToast(loadingToastId, {
      type: "success",
      heading: "Property Removed",
      description: "The property has been removed from the compare list.",
    });
  } catch (error) {
    console.error("Error in handleRemoveProject:", error);

    updateToast(loadingToastId, {
      type: "error",
      heading: "Compare Action Failed",
      description:
        error.message ||
        "You are offline or there's an issue updating the compare list. Please try again.",
    });
  }
};


  // View project details
  const handleViewDetails = (project) => {
    navigate(`/properties/${project.projectName}`, {
      state: { name: project.projectName },
    });
  };

  // Loader state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray">
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="text-center">
            <div className="relative mx-auto mb-4 h-16 w-16">
              <div className="animate-spin rounded-full h-full w-full border-4 border-green-900 border-t-transparent border-l-transparent"></div>
              <img
                src={trueStateIcon}
                alt="Logo"
                className="absolute inset-0 m-auto h-8 w-8"
              />
            </div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (compareProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <img src={emptyImage} alt="No Projects" className={styles.emptyImage} />
        <div className={styles.emptyContent}>
          <div className={styles.secondarydiv}>
            <h2 className={styles.projname}>No Projects Added Currently</h2>
            <p className={styles.tertiarydiv}>Add a project to compare</p>
          </div>
          <button
            onClick={() => {
              handleNavigateToProperties();
              logEvent(analytics, "click_compare_go_to_prop", {
                Name: "_compare_gotoproperties",
              });
            }}
            className={styles.emptyButton}
          >
            Go to Properties Page
          </button>
        </div>
      </div>
    );
  }

  // Table props
  const tableProps = {
    projects: compareProjects.slice(0, 4), // Max 4 items
    onRemoveProject: (id) => {
      handleRemoveProject(id);
      logEvent(analytics, "click_compare_remove_prop", {
        Name: "_compare_remove property",
      });
    },
    onViewDetails: (project) => {
      handleViewDetails(project);
      logEvent(analytics, "click_compare_check_details", {
        Name: "compare_check_details",
      });
    },
    onNavigateToProperties: handleNavigateToProperties,
    onNavigateToAddCompare: handleNavigateToAddCompare,
    maxCompareItems: 4,
  };

  return (
    <div className="bg-gray rounded min-h-screen p-4">
      {isMobile ? (
        <CompareTableMobile {...tableProps} />
      ) : (
        <CompareTableDesktop {...tableProps} />
      )}
    </div>
  );
};

export default ComparePage;
