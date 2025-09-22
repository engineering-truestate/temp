import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "./Pagination"; // Importing the Pagination component
import {
  fetchCompareProjects,
  selectCompareProjects,
  removeProjectFromComparison,
  addProjectForComparison,
} from "../../slices/compareSlice";

import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  doc,
} from "firebase/firestore";
import { analytics, db } from "../../firebase"; // Firebase configuration
import { selectUserPhoneNumber } from "../../slices/userAuthSlice";
import {
  fetchWishlistedProjects,
  selectWishlistItems,
  removeWishlist,
} from "../../slices/wishlistSlice";
import { useToast } from "../../hooks/useToast.jsx";
import "./Table.css";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { getUnixDateTime } from "../helper/dateTimeHelpers";
import { formatCost, toCapitalizedWords } from "../../utils/common.js";
import Loader from "../Loader";
import { selectLoader } from "../../slices/loaderSlice";
import styles from "./Table.module.css";
import { useHits, useInstantSearch } from "react-instantsearch";
import CustomPagination from "../CustomPagination.jsx";
import { logEvent } from "firebase/analytics";
import TableRow from "./TableRow.jsx";
import Footer from "../../landing/pages/home/Footer";
import { is } from "date-fns/locale";
import NoPropertiesFound from "../NoPropertiesFound/NoPropertiesFound.jsx";

const Table = ({
  projects,
  type,
  trueS,
  handleFirstPage,
  handlePreviousPage,
  handleNextPage,
  handleLastPage,
  totalPages,
  currentPage,
  setCurrentPage,
}) => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { hits, results } = useHits(); // Fetch Algolia hits (property data)
  // console.log(hits);
  projects = hits;

  // useEffect(() => {
  //     // Fetch new data or perform any action when currentPage changes
  //     // You might call a function here to fetch new data based on currentPage
  //   }, [currentPage]);
  // console.log("here");
  const [isCompared, setIsCompared] = useState({});
  const [isWishlisted, setIsWishlisted] = useState({});
  const [currentStatusState, setCurrentStatusState] = useState(0);
  const { searchTerm } = useSelector((state) => state.projectsState);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // console.log(searchTerm);
  // console.log(isAuthenticated);

  const userPhoneNumber = useSelector(selectUserPhoneNumber);
  const { loading } = useSelector((state) => state.projectsState);

  const { addToast } = useToast();
  const { indexUiState, setIndexUiState, status } = useInstantSearch();
  const isReduxLoading = useSelector(selectLoader);

  const [agentsData, setAgentsData] = useState();

  useEffect(() => {
    const fetchAgentsData = async () => {
      const q = query(collection(db, "agents"));
      const querySnapshot = await getDocs(q);

      let agents = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const agent = {
          name: data.name,
          email: data.email,
          profilePic: data.profilePic,
        };
        agents.push(agent);
      });

      setAgentsData(agents);
    };

    fetchAgentsData();
  }, [isAuthenticated]);

  useEffect(() => {
    // console.log(status, "status table");
    // console.log(currentStatusState, "currentStatusState");
    setCurrentStatusState((prev) => prev + 1);
  }, [status]);

  useEffect(() => {
    dispatch(fetchCompareProjects());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchWishlistedProjects(userPhoneNumber));
  }, [dispatch]);

  const handleRemoveComparison = (id) => {
    dispatch(removeProjectFromComparison(id));
    dispatch(fetchCompareProjects());
  };

  const handleRemoveWishlist = (id) => {
    dispatch(removeWishlist({ userPhoneNumber, id }));
    dispatch(fetchWishlistedProjects(userPhoneNumber));
  };

  const { normalprojects, lastVisible, batchCount, loading2, noMoreProjects } =
    useSelector((state) => state.projectsState);

  // Fetch wishlisted and compared status from Firebase
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const q = query(
          collection(db, "truEstateUsers"),
          where("phoneNumber", "==", userPhoneNumber)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          let allSharedProperties = [];
          let comparedProjects = [];

          querySnapshot.forEach((doc) => {
            allSharedProperties = doc.data().sharedProperties || [];
            comparedProjects = doc.data().compare || [];
          });

          // console.log(comparedProjects) ;

          setIsCompared(comparedProjects);
          setIsWishlisted(allSharedProperties);
          // console.log(isCompared , allSharedProperties ) ;
        }
      } catch (error) {}
    };

    fetchStatus();
  }, [hits, userPhoneNumber]);

  const simulateNetworkRequest = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (navigator.onLine) {
          resolve("Success");
        } else {
          reject("Network error");
        }
      }, 1000);
    });
  };

  const [filteredProjects, setFilteredProjects] = useState(projects);

  useEffect(() => {
    // Check if type is "wishlist"
    if (type === "wishlist") {
      const currentYear = new Date().getFullYear();
      const propertyAgeRangeMap = {
        "<1 Year": [currentYear - 1, currentYear],
        "1-2 Years": [currentYear - 2, currentYear - 1],
        "2-5 Years": [currentYear - 5, currentYear - 2],
        ">5 Years": [0, currentYear - 5],
      };

      // Map for Duration Range (holding period)
      const durationMap = {
        "<1 year": [0, 1],
        "1-2 years": [1, 2],
        "2-5 years": [2, 5],
        ">5 years": [5, 100],
      };

      // Start with a copy of wishlisted projects for filtering
      let filtered = [...projects];

      // Filter by search term
      const lowerSearchTerm = searchParams.get("q")?.toLowerCase() || "";
      if (lowerSearchTerm) {
        filtered = filtered.filter((project) =>
          project?.projectName?.toLowerCase().includes(lowerSearchTerm)
        );
      }

      // Filter by project status
      const projectStatus = searchParams.get("status")?.split(",") || [];
      if (projectStatus.length > 0 && projectStatus[0] !== "") {
        const lowerProjectStatus = projectStatus
          .map((status) => status?.toLowerCase())
          .filter(Boolean);
        filtered = filtered.filter(
          (project) =>
            project?.status &&
            lowerProjectStatus.includes(project.status.toLowerCase())
        );
      }

      // Filter by asset type
      const assetType = searchParams.get("asset_type")?.split(",") || [];
      if (assetType.length > 0 && assetType[0] !== "") {
        const lowerAssetType = assetType
          .map((type) => type?.toLowerCase())
          .filter(Boolean);
        filtered = filtered.filter(
          (project) =>
            project?.assetType &&
            lowerAssetType.includes(project.assetType.toLowerCase())
        );
      }

      // Filter by budget range
      const minBudget = parseInt(searchParams.get("minBudget")) || 0;
      const maxBudget = parseInt(searchParams.get("maxBudget")) || 1500;
      if (minBudget !== 0 || maxBudget !== 1500) {
        filtered = filtered.filter(
          (project) =>
            project?.minInvestment >= minBudget * 10000 &&
            project?.minInvestment <= maxBudget * 10000
        );
      }

      // Filter by RERA status
      const reraStatus = searchParams.get("rera")?.split(",") || [];
      if (reraStatus.length > 0 && reraStatus[0] !== "") {
        const isApproved = reraStatus.includes("Approved");
        filtered = filtered.filter((project) =>
          isApproved ? project?.reraId !== "NA" : project?.reraId === "NA"
        );
      }

      // Filter by property age range
      const propertyAgeRange = searchParams.get("age")?.split(",") || [];
      if (propertyAgeRange.length > 0 && propertyAgeRange[0] !== "") {
        const ranges = propertyAgeRange
          .map((label) => propertyAgeRangeMap[label])
          .filter(Boolean);
        const minFormattedYear = Math.min(...ranges.map((range) => range[0]));
        const maxFormattedYear = Math.max(...ranges.map((range) => range[1]));

        filtered = filtered.filter(
          (project) =>
            project?.launchYear >= minFormattedYear &&
            project?.launchYear <= maxFormattedYear
        );
      }

      // Filter by availability
      const availability = searchParams.get("availability")?.split(",") || [];
      if (availability.length > 0 && availability[0] !== "") {
        const lowerAvailability = availability
          .map((avail) => avail?.toLowerCase())
          .filter(Boolean);
        filtered = filtered.filter(
          (project) =>
            project?.combineAvailability &&
            lowerAvailability.includes(
              project.combineAvailability.toLowerCase()
            )
        );
      }

      // Filter by TruEstimate
      const truEstimate = searchParams.get("truestimate")?.split(",") || [];
      if (truEstimate.length > 0 && truEstimate[0] !== "") {
        const lowerTruEstimate = truEstimate
          .map((status) => status?.toLowerCase())
          .filter(Boolean);
        filtered = filtered.filter(
          (project) =>
            project?.truValue &&
            lowerTruEstimate.includes(project.truValue.toLowerCase())
        );
      }

      // Filter by growth
      const growth = searchParams.get("growth")?.split(",") || [];
      if (growth.length > 0 && growth[0] !== "") {
        const lowerGrowth = growth
          .map((status) => status?.toLowerCase())
          .filter(Boolean);
        filtered = filtered.filter(
          (project) =>
            project?.truGrowth &&
            lowerGrowth.includes(project.truGrowth.toLowerCase())
        );
      }

      // Filter by duration
      const duration = searchParams.get("duration")?.split(",") || [];
      if (duration.length > 0 && duration[0] !== "") {
        const ranges = duration
          .map((label) => durationMap[label])
          .filter(Boolean);
        const minDuration = Math.min(...ranges.map((range) => range[0]));
        const maxDuration = Math.max(...ranges.map((range) => range[1]));
        filtered = filtered.filter(
          (project) =>
            project?.holdingPeriod >= minDuration &&
            project?.holdingPeriod <= maxDuration
        );
      }

      // Apply sort order
      const sortOrder = searchParams.get("sortOrder") || "";
      if (sortOrder) {
        switch (sortOrder) {
          case "irr_desc":
            filtered = filtered.sort((a, b) => {
              if (a.irrForMinInv === b.irrForMinInv) {
                return b.launchYear - a.launchYear;
              }
              return b.irrForMinInv - a.irrForMinInv;
            });
            break;
          case "investment_desc":
            filtered = filtered.sort((a, b) => {
              if (a.minInvestment === b.minInvestment) {
                return b.launchYear - a.launchYear;
              }
              return b.minInvestment - a.minInvestment;
            });
            break;
          case "investment_asc":
            filtered = filtered.sort((a, b) => {
              if (a.minInvestment === b.minInvestment) {
                return b.launchYear - a.launchYear;
              }
              return a.minInvestment - b.minInvestment;
            });
            break;
          case "price_sqft_asc":
            filtered = filtered.sort((a, b) => {
              if (a.commonPricePerSqft === b.commonPricePerSqft) {
                return b.launchYear - a.launchYear;
              }
              return a.commonPricePerSqft - b.commonPricePerSqft;
            });
            break;
          case "price_sqft_desc":
            filtered = filtered.sort((a, b) => {
              if (a.commonPricePerSqft === b.commonPricePerSqft) {
                return b.launchYear - a.launchYear;
              }
              return b.commonPricePerSqft - a.commonPricePerSqft;
            });
            break;
          default:
            filtered = filtered.sort((a, b) => b.launchYear - a.launchYear);
        }
      } else {
        filtered = filtered.sort((a, b) => b.launchYear - a.launchYear);
      }

      // Set the filtered projects
      setFilteredProjects(filtered);
    }
  }, [searchParams, projects, type]);

  // const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = type != "properties" ? 10 : 12;

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects =
    type === "properties"
      ? projects
      : filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  // const handleFirstPage = () => setCurrentPage(1);
  // const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  // const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  // const handleLastPage = () => setCurrentPage(totalPages);

  const handleStatus = (status) => {
    if (status) {
      if (status === "Shared") {
        return "Being Discussed";
      }
      if (status.includes("Back")) {
        return "Not Interested";
      }
      return toCapitalizedWords(status);
    }
    return "";
  };

  const handleStatusColour = (status) => {
    if (status) {
      if (status === "Not Discussed") {
        return "#FBDD97";
      } else if (status === "Being Discussed") {
        return "#FCE9BA";
      } else if (status === "Booking Amount") {
        return "#91F3BF";
      } else if (status === "Not Interested") {
        return "#F9ABB9";
      } else if (status === "Short Listed") {
        return "#F6BC2F";
      } else {
        return "#C2EFE9";
      }
    }
    return;
  };

  const handleAddedBy = (recommendedBy) => {
    if (recommendedBy) {
      if (
        recommendedBy === "Customer" ||
        recommendedBy === "masal" ||
        recommendedBy === "agent"
      ) {
        return toCapitalizedWords(recommendedBy);
      }

      const agentData = agentsData?.find(
        (agent) => agent.email === recommendedBy
      );
      if (agentData) {
        return toCapitalizedWords(agentData.name);
      }
      return recommendedBy;
    }
    return "";
  };

  const handleValue = (value) => {
    if (value) {
      return toCapitalizedWords(value);
    }
    return "Undervalued";
  };

  const handleGrowth = (growth) => {
    if (growth) {
      return toCapitalizedWords(growth);
    }
    return "Overvalued";
  };

  // const handleGrowth = (cagr) => {
  //   if (cagr <= 4) {
  //     return "Low";
  //   } else if (cagr <= 8) {
  //     return "Medium";
  //   } else if (cagr > 8) {
  //     return "High";
  //   }
  //   return "Overvalued";
  // };

  const handleValueGrowthColor = (item) => {
    if (item === "Undervalued" || item === "High") {
      return "#DAFBEA";
    } else if (item === "Overvalued" || item === "Low") {
      return "#F9ABB9";
    } else if (item === "Fairly Valued" || item === "Medium") {
      return "#FBDD97";
    } else return "#FBDAC0";
  };

  const handlePrices = (price) => {
    if (price) {
      return formatCost(parseInt(price));
    } else return "____";
  };

  function formatHandOverDate(date) {
    if (date === "____") return date;
    const [month, year] = date.split("/");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  }

  // console.log(trueS, hits);

  const resetAllFilters = () => {
    // Log event for resetting filters
    logEvent(analytics, "reset_all_filters", {
      event_category: "interaction",
      event_label: "All Filters Cleared",
    });

    // Reset the UI state to clear all refinements
    setIndexUiState((prevState) => ({
      ...prevState,
      refinementList: {},
      query: "",
      menu: {},
      range: {},
    }));
  };


  return (
    <>
      {hits && hits.length > 0 && (
        <>
          <div
            className={`w-full flex-col mb-3 
              ${type != "requirement" ? "px-4 md:px-8" : ""} 
                ${isAuthenticated ? "" : `${styles.authpadding}`} `}
          >
            <div
              className={` rounded-[8px] overflow-hidden border border-[#E0E0E0] bg-[#FAFBFC] ${
                type === "requirement"
                  ? "h-[calc(43vh)]"
                  : "h-[calc(100vh-270px)]"
              } ${type === "properties" ? "" : ""}`}
            >
              <div className="table-container">
                <table
                  className={`w-full ${
                    type === "properties" ? "min-w-[1934px]" : "min-w-[2062px]"
                  } border-collapse border-spacing-0 text-left cursor-default`}
                >
                  <thead className="bg-[#FAFBFC] font-montserrat font-semibold text-[12px] text-[#2B2928] sticky top-0 z-10">
                    <tr>
                      <th className="border-b border-[#E3E3E3] py-[12px] pl-[24px] pr-[8px] text-left w-[200px] border-r-[1px] md:sticky left-0 bg-[#FAFBFC] whitespace-nowrap">
                        Project Name
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[110px] whitespace-nowrap">
                        Asset Type
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[144px] whitespace-nowrap">
                        Micro Market
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[136px] whitespace-nowrap">
                        Min. Investment
                      </th>
                      <th
                        className={`border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[120px] whitespace-nowrap`}
                      >
                        Value
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[90px] whitespace-nowrap">
                        CAGR Cat.
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[80px] whitespace-nowrap">
                        CAGR
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[80px] whitespace-nowrap">
                        XIRR
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[100px] whitespace-nowrap">
                        Price / Sq ft
                      </th>
                      <th className="border-b border-[#E3E3E3] bg-[#FBDAC0] py-[12px] px-[16px] text-left w-[129px] whitespace-nowrap">
                        TruEstimate
                      </th>
                      <th className="border-b border-[#E3E3E3] bg-[#FBDAC0] py-[12px] px-[16px] text-left w-[138px] whitespace-nowrap">
                        Est. Selling Price
                      </th>

                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[100px] whitespace-nowrap">
                        Handover
                      </th>
                      {type != "properties" && (
                        <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[128px] whitespace-nowrap">
                          Status
                        </th>
                      )}
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[170px] whitespace-nowrap">
                        Stage
                      </th>

                      {/* <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[120px] whitespace-nowrap">
                                            Added by
                                        </th> */}
                      {/* <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[120px] whitespace-nowrap">
                                            Strategy
                                        </th> */}
                      {/* <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[100px] whitespace-nowrap">
                                            Tenure
                                        </th> */}

                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[100px] whitespace-nowrap">
                        Availability
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[125px] whitespace-nowrap">
                        RERA
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] pl-[16px] pr-[8px] text-left w-[132px] border-l-[1px] md:sticky right-0 bg-[#FAFBFC] whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-lato text-[14px] leading-[21px] text-[#5A5555] bg-[#FAFBFC] flex-col justify-start text-left z-0">
                    {/* {console.log(hits)} */}
                    {hits.map((project, index) => (
                      <TableRow
                        project={project}
                        index={index}
                        handlePrices={handlePrices}
                        handleValueGrowthColor={handleValueGrowthColor}
                        handleValue={handleValue}
                        handleGrowth={handleGrowth}
                        formatHandOverDate={formatHandOverDate}
                        type={type}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="sticky bottom-0 z-[1] bg-[#FAFAFA] ">
            <CustomPagination />
          </div>
        </>
      )}

      {results.nbHits === 0 && status === "idle" && currentStatusState > 1 && (
        <NoPropertiesFound
          trueS={trueS}
          onResetFilters={resetAllFilters}
        />
      )}

      {(status === "loading" || status !== "idle" || isReduxLoading) && (
        <div className="flex h-[50vh]">
          <Loader />
        </div>
      )}

      <div className="flex flex-col md:flex-row ml-8 space-y-4 md:space-y-0 pb-4 ">
        {/* <p className={`pt-2 ${styles.starp}`}>*Values are calculated for the handover year.</p> */}
      </div>

      {!isAuthenticated && <Footer />}
    </>
  );
};

export default Table;
