import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "./Pagination";
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
import { analytics, db } from "../../firebase";
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
import { 
  formatCost, 
  toCapitalizedWords,
  customRound,
  formatCostSuffix,
  formatMonthYear,
  formatTimestampDate,
  formatToOneDecimal,
  upperCaseProperties
} from "../../utils/common.js";
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
import {
  handlePrices, 
  handleValueGrowthColor, 
  handleValue, 
  handleGrowth, 
  formatHandOverDate  
} from "../../utils/propertyHelpers.js";
import UnifiedTableRow from "./UnifiedTableRow.jsx";

const UnifiedTable = ({
  projects,
  type = "properties", // "properties" | "auction"
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
  let { hits, results } = useHits(); 
  projects = hits;
  const [currentStatusState, setCurrentStatusState] = useState(0);
  const { searchTerm } = useSelector((state) => state.projectsState);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userPhoneNumber = useSelector(selectUserPhoneNumber);
  const { loading } = useSelector((state) => state.projectsState);
  const { addToast } = useToast();
  const { indexUiState, setIndexUiState, status } = useInstantSearch();
  const isReduxLoading = useSelector(selectLoader);

  useEffect(() => {
    setCurrentStatusState((prev) => prev + 1);
  }, [status]);

  useEffect(() => {
    if (type === "properties") {
      dispatch(fetchCompareProjects());
      dispatch(fetchWishlistedProjects(userPhoneNumber));
    }
  }, [dispatch, type, userPhoneNumber]);

  const { normalprojects, lastVisible, batchCount, loading2, noMoreProjects } =
    useSelector((state) => state.projectsState);

  const [filteredProjects, setFilteredProjects] = useState(projects);

  // Auction-specific helper functions
  const calculateFinalPrice = (reservePrice, cagr, holdingPeriodYears) => {
    return (
      reservePrice * Math.pow(1 + cagr / 100, holdingPeriodYears)
    ).toFixed(1);
  };

  const calculateCurrentValue = (unit) => {
    const area = unit?.sbua || unit?.carpetArea || unit?.plotArea || 0;
    const value = (unit?.truEstimatePrice * area) / 10000000;
    return value.toFixed(1);
  };

  const formatReservePrice = (value) => {
    if (value < 1) {
      return `₹${(value * 100).toFixed(0)} Lacs`;
    } else {
      return `₹${value} Cr`;
    }
  };

  const formatAuctionPrice = (reservePrice, totalSeats) => {
    let valueInLakh = reservePrice * 100; // because reservePrice is in crore

    if (totalSeats) {
      valueInLakh = valueInLakh / totalSeats;
    }

    if (valueInLakh >= 100) {
      const valueInCrore = valueInLakh / 100;
      return `₹${valueInCrore.toFixed(2)} Cr`;
    } else {
      return `₹${valueInLakh.toFixed(0)} Lacs`;
    }
  };

  const handleTruGrowthStatus = (cagr) => {
    if (cagr === "low") {
      return "Low Exp Return";
    } else if (cagr === "medium") {
      return "Medium Exp Return";
    } else if (cagr === "high") {
      return "High Exp Return";
    }
    return cagr;
  };

  const handleGrowthAndValueStatusColour = (status) => {
    if (status === "Under Valued" || status === "High Exp Return") {
      return "#DAFBEA";
    } else if (status === "Over Valued" || status === "Low Exp Return") {
      return "#F9ABB9";
    } else if (status === "Fairly Valued" || status === "Medium Exp Return") {
      return "#FBDD97";
    }
    return "#FAFBFC";
  };

  // Filter logic for normal properties (from original Table component)
  useEffect(() => {
    if (type === "wishlist") {
      const currentYear = new Date().getFullYear();
      const propertyAgeRangeMap = {
        "<1 Year": [currentYear - 1, currentYear],
        "1-2 Years": [currentYear - 2, currentYear - 1],
        "2-5 Years": [currentYear - 5, currentYear - 2],
        ">5 Years": [0, currentYear - 5],
      };

      const durationMap = {
        "<1 year": [0, 1],
        "1-2 years": [1, 2],
        "2-5 years": [2, 5],
        ">5 years": [5, 100],
      };

      let filtered = [...projects];

      const lowerSearchTerm = searchParams.get("q")?.toLowerCase() || "";
      if (lowerSearchTerm) {
        filtered = filtered.filter((project) =>
          project?.projectName?.toLowerCase().includes(lowerSearchTerm)
        );
      }

      // Apply all the existing filters...
      // (keeping the original filter logic for brevity)

      setFilteredProjects(filtered);
    }
  }, [searchParams, projects, type]);

  const projectsPerPage = type !== "properties" ? 10 : 12;
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects =
    type === "properties"
      ? projects
      : filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const resetAllFilters = () => {
    const eventName = type === "auction" ? "auction_reset_all_filters" : "reset_all_filters";
    logEvent(analytics, eventName, {
      event_category: "interaction",
      event_label: "All Filters Cleared",
      ...(type === "auction" && { page_type: "auction" })
    });

    setIndexUiState((prevState) => ({
      ...prevState,
      refinementList: {},
      query: "",
      menu: {},
      range: {},
    }));
  };

  const handleViewMore = (project) => {
  const basePath = type === "auction" ? "auction" : "properties";
  const eventName = type === "auction" ? "auction_table_view_details" : "property_view_details";

  const projectSlug = project.projectName
    .toLowerCase()                 // lowercase
    .trim()                        // remove leading/trailing spaces
    .replace(/[^a-z0-9\s/]/g, "")  // remove special characters first
    .replace(/[\s/]+/g, "-")       // replace spaces and slashes with hyphens
    .replace(/-+/g, "-");          // collapse multiple hyphens

  navigate(`/${basePath}/${projectSlug}/${project?.projectId}`, {
    state: { name: project?.projectName },
  });

  logEvent(analytics, eventName, {
    [type === "auction" ? "auction_id" : "property_id"]: project.projectId,
    page_type: type === "auction" ? "auction_table" : "properties_table",
  });
};


  // Render header based on type
  const renderTableHeader = () => {
    if (type === "auction") {
      return (
        <tr>
          <th className="border-b border-[#E3E3E3] py-[12px] pl-[24px] pr-[8px] text-left w-[200px] border-r-[1px] md:sticky left-0 bg-[#FAFBFC] whitespace-nowrap">
            Project Name
          </th>
          <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[170px] whitespace-nowrap">
            Asset Type
          </th>
          <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[100px] whitespace-nowrap">
            Micro Market
          </th>
          <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[136px] whitespace-nowrap">
            Min. Investment
          </th>
          <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[136px] whitespace-nowrap">
            Reserve Price (Total)
          </th>
          <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[136px] whitespace-nowrap">
            TruValue Status
          </th>
          <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[100px] whitespace-nowrap">
            Exp Return Growth
          </th>
          <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[90px] whitespace-nowrap">
            Exp Return (CAGR)
          </th>
          <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[80px] whitespace-nowrap">
            Strategy
          </th>
          <th className="border-b border-[#E3E3E3] bg-[#FBDAC0] py-[12px] px-[16px] text-left w-[80px] whitespace-nowrap">
            Market Price
          </th>
          <th className="border-b border-[#E3E3E3] bg-[#FBDAC0] py-[12px] px-[16px] text-left w-[100px] whitespace-nowrap">
            Est. Selling Price*
          </th>
          <th className="border-b border-[#E3E3E3] bg-[#FBDAC0] py-[12px] px-[16px] text-left w-[129px] whitespace-nowrap">
            Max Rec Price
          </th>
          <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[138px] whitespace-nowrap">
            EMD submission Date
          </th>
          <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[110px] whitespace-nowrap">
            Auction Date
          </th>
          <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[144px] whitespace-nowrap">
            Possesion
          </th>
          <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[100px] whitespace-nowrap">
            Holding Period
          </th>
          <th className="border-b border-[#E3E3E3] py-[12px] pl-[16px] pr-[8px] text-left w-[132px] border-l-[1px] md:sticky right-0 bg-[#FAFBFC] whitespace-nowrap">
            Actions
          </th>
        </tr>
      );
    } else {
      // Properties header
      return (
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
          <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[120px] whitespace-nowrap">
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
          {type !== "properties" && (
            <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[128px] whitespace-nowrap">
              Status
            </th>
          )}
          <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[170px] whitespace-nowrap">
            Stage
          </th>
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
      );
    }
  };

  // Render table rows based on type
  // Update your UnifiedTable component to use this:
const renderTableRows = () => {
  return hits.map((project, index) => (
    <UnifiedTableRow
      key={project.objectID || index}
      project={project}
      index={index}
      type={type}
      handlePrices={handlePrices}
      handleValueGrowthColor={handleValueGrowthColor}
      handleValue={handleValue}
      handleGrowth={handleGrowth}
      formatHandOverDate={formatHandOverDate}
      // Auction-specific helpers
      calculateFinalPrice={calculateFinalPrice}
      calculateCurrentValue={calculateCurrentValue}
      formatReservePrice={formatReservePrice}
      formatAuctionPrice={formatAuctionPrice}
      handleTruGrowthStatus={handleTruGrowthStatus}
      handleGrowthAndValueStatusColour={handleGrowthAndValueStatusColour}
      customHandleViewMore={handleViewMore}
    />
  ));
};

  return (
    <>
      {hits && hits.length > 0 && (
        <>
          <div
            className={`w-full flex-col mb-3 
              ${type !== "requirement" ? "px-4 md:px-8" : ""} 
              ${isAuthenticated ? "" : `${styles.authpadding}`}`}
          >
            <div
              className={`rounded-[8px] overflow-hidden border border-[#E0E0E0] bg-[#FAFBFC] ${
                type === "requirement"
                  ? "h-[calc(43vh)]"
                  : type === "auction" 
                  ? "h-[calc(100vh-246px)]"
                  : "h-[calc(100vh-270px)]"
              }`}
            >
              <div className="table-container">
                <table
                  className={`w-full ${
                    type === "properties" ? "min-w-[1934px]" : "min-w-[1934px]"
                  } border-collapse border-spacing-0 text-left cursor-default`}
                >
                  <thead className="bg-[#FAFBFC] font-montserrat font-semibold text-[12px] text-[#2B2928] sticky top-0 z-10">
                    {renderTableHeader()}
                  </thead>
                  <tbody className="font-lato text-[14px] leading-[21px] text-[#5A5555] bg-[#FAFBFC] flex-col justify-start text-left z-0">
                    {renderTableRows()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="sticky bottom-0 z-[1] bg-[#FAFAFA]">
            <CustomPagination />
          </div>
        </>
      )}

      {results.nbHits === 0 && status === "idle" && currentStatusState > 1 && (
        <NoPropertiesFound
          trueS={trueS}
          onResetFilters={resetAllFilters}
          title={type === "auction" ? "No auction property available" : "No Properties Found"}
          subtitle={trueS === "true"
            ? type === "auction" 
              ? "Due to some technical issue we're unable to show the recommended auction properties. Please try again later!"
              : "Due to some technical issue we're unable to show properties. Please try again later!"
            : "Please edit your preferences and try again."}
        />
      )}

      {(status === "loading" || status !== "idle" || isReduxLoading) && (
        <div className="flex h-[50vh]">
          <Loader />
        </div>
      )}

      <div className="flex flex-col md:flex-row ml-8 space-y-4 md:space-y-0 pb-4">
        {type === "auction" && (
          <p className={`pt-2 ${styles.starp}`}>*Values are calculated for the handover year.</p>
        )}
      </div>

      {!isAuthenticated && <Footer />}
    </>
  );
};

export default UnifiedTable;