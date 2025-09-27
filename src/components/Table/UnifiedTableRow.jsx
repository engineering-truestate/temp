import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchCompareProjects, selectCompareProjects } from "../../slices/compareSlice";
import CompIcon from "/assets/icons/features/compare-inactive.svg";
import CompIconA from "/assets/icons/features/compare-active.svg";
import StarIcon from "/assets/icons/features/wishlist-inactive.svg";
import StarIconA from "/assets/icons/features/wishlist-active.svg";
import RArrowIcon from "/assets/icons/navigation/arrow-right.svg";
import { analytics } from "../../firebase";
import { selectUserPhoneNumber, selectUserDocId } from "../../slices/userAuthSlice";
import {
  fetchWishlistedProjects,
  removeWishlist,
  selectWishlistItems,
} from "../../slices/wishlistSlice";
import { useToast } from "../../hooks/useToast.jsx";
import "./Table.css";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { formatCost, toCapitalizedWords, formatTimestampDate } from "../../utils/common.js";
import { logEvent } from "firebase/analytics";
import { setShowSignInModal } from "../../slices/modalSlice.js";
import { updateWishlist } from "../../slices/wishlistSlice";
import { getUnixDateTime } from "../helper/dateTimeHelpers";
import { toggleCompare, toggleWishlist } from "../../utils/projectActions.js";

const UnifiedTableRow = ({
  project,
  index,
  type = "properties", // "properties" | "auction"
  handlePrices,
  handleValueGrowthColor,
  handleValue,
  handleGrowth,
  formatHandOverDate,
  // Auction-specific helpers
  calculateFinalPrice,
  calculateCurrentValue,
  formatReservePrice,
  formatAuctionPrice,
  handleTruGrowthStatus,
  handleGrowthAndValueStatusColour,
  customHandleViewMore,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const userId = useSelector(selectUserDocId);
  const wishlistItems = useSelector(selectWishlistItems);
  const compareProjects = useSelector(selectCompareProjects);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const { addToast, updateToast } = useToast();

  const dispatch = useDispatch();

  // Get auction and unit data for auction type
  const auction = project.auctionOverview || {};
  const unit = project.unitDetails?.[0] || {};

  useEffect(() => {
    dispatch(fetchCompareProjects());
    if (userId) {
      dispatch(fetchWishlistedProjects(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    const isProjectWishlisted = wishlistItems.some(item => item.projectId === project.projectId);
    setIsWishlisted(isProjectWishlisted);
  }, [wishlistItems, project.projectId]);

  useEffect(() => {
    const isProjectCompared = compareProjects.some(item => item.projectId === project.projectId);
    setIsCompared(isProjectCompared);
  }, [compareProjects, project.projectId]);

  const handleViewMore = () => {
    if (customHandleViewMore) {
      customHandleViewMore(project);
    } else {
      const basePath = type === "auction" ? "auction" : "properties";
      const projectName = project.projectName.replace(/[\s\/]+/g, "-");
      navigate(`/${basePath}/${projectName}/${project?.projectId}`, {
        state: { name: project.projectName },
      });
    }

    // Analytics
    const eventName = type === "auction" ? "auction_table_view_details" : "property_view_details";
    logEvent(analytics, eventName, {
      [type === "auction" ? "auction_id" : "property_id"]: project.projectId,
      page_type: type === "auction" ? "auction_table" : "properties_table",
    });
  };

  const handleClickLock = () => {
    dispatch(
      setShowSignInModal({ showSignInModal: true, redirectUrl: "/properties" })
    );
  };

  const handleWishlist = () => {
    if (type !== "auction") {
      toggleWishlist({
        isWishlisted, 
        setIsWishlisted, 
        project, 
        userId, 
        analytics, 
        dispatch, 
        updateWishlist, 
        fetchWishlistedProjects, 
        addToast, 
        updateToast
      });
    }
  };

  const handleCompare = () => {
    if (type !== "auction") {
      toggleCompare({
        isCompared, 
        setIsCompared, 
        project, 
        type, 
        analytics, 
        dispatch, 
        fetchCompareProjects, 
        addToast, 
        updateToast, 
        compareProjects
      });
    }
  };

  // Helper functions for properties data
  const getProjectData = (field) => {
    if (type === "auction") {
      return project[field] || "____";
    } else {
      return project[field] || "____";
    }
  };

  const renderProjectName = () => {
    if (type === "auction") {
      return (
        <div
          className="text-[#2B2928] font-medium cursor-pointer break-words w-[180px]"
          onClick={handleViewMore}
        >
          {project.projectId && `${project.projectId} : `}
          {toCapitalizedWords(project.projectName || "____")}
        </div>
      );
    } else {
      return (
        <div 
          className="w-[180px] cursor-pointer"
          onClick={handleViewMore}
        >
          {project.projectName
            ? toCapitalizedWords(project.projectName)
            : "____"}
        </div>
      );
    }
  };

  const renderMinInvestment = () => {
    if (type === "auction") {
      return unit?.reservePrice != null
        ? formatAuctionPrice(unit.reservePrice, unit.totalSeats)
        : "____";
    } else {
      return handlePrices(project.investmentOverview?.minInvestment);
    }
  };

  const renderValueColumn = () => {
    if (type === "auction") {
      return unit?.reservePrice
        ? formatReservePrice(unit.reservePrice)
        : "____";
    } else {
      return (
        <div
          className="px-1 py-1 rounded-[4px] text-[12px] text-[#151413] font-bold leading-[18px]"
          style={{
            backgroundColor: handleValueGrowthColor(
              handleValue(project.investmentOverview?.value)
            ),
          }} 
        >
          {project.investmentOverview?.value ? handleValue(project.investmentOverview?.value) : "____"}
        </div>
      );
    }
  };

  const renderGrowthColumn = () => {
    if (type === "auction") {
      return (
        <div
          className="rounded-[4px] text-center py-[2px] px-[8px] text-[10px] font-semibold text-[#2B2928]"
          style={{
            backgroundColor: handleGrowthAndValueStatusColour(auction?.auctionValue),
          }}
        >
          {auction?.auctionValue ?? "____"}
        </div>
      );
    } else {
      return (
        <div
          className="px-1 py-1 rounded-[4px] text-[12px] text-[#151413] font-bold leading-[18px]"
          style={{
            backgroundColor: handleValueGrowthColor(
              handleGrowth(project.investmentOverview?.growth)
            ),
          }}
        >
          {project.investmentOverview?.growth ? handleGrowth(project.investmentOverview?.growth) : "____"}
        </div>
      );
    }
  };

  const renderCAGRColumn = () => {
    if (type === "auction") {
      return (
        <div
          className="rounded-[4px] text-center py-[2px] px-[8px] text-[10px] font-semibold text-[#2B2928]"
          style={{
            backgroundColor: handleGrowthAndValueStatusColour(handleTruGrowthStatus(auction?.auctionCAGR))
          }}
        >
          {handleTruGrowthStatus(auction?.auctionCAGR) || "____"}
        </div>
      );
    } else {
      return (
        <div className={!isAuthenticated ? "blur-[6px]" : ""}>
          {project.investmentOverview?.cagr ? `${project.investmentOverview?.cagr}%` : "____"}
        </div>
      );
    }
  };

  const renderXIRRColumn = () => {
    if (type === "auction") {
      return auction?.auctionCAGR ? auction?.auctionCAGR : "____";
    } else {
      return (
        <div className={!isAuthenticated ? "blur-[6px]" : ""}>
          {project.investmentOverview.xirr && project.investmentOverview.xirr !== "#NUM!"
            ? `${project.investmentOverview.xirr.toFixed(1)} %`
            : "____"}
        </div>
      );
    }
  };

  const renderPricePerSqft = () => {
    if (type === "auction") {
      return unit?.strategy
        ? Array.isArray(unit.strategy)
          ? unit.strategy.map((s, index) => (
              <span key={index}>
                {s}
                <br />
              </span>
            ))
          : unit.strategy
              .split(/[,;/|]+/)
              .map((s, index) => (
                <span key={index}>
                  {s.trim()}
                  <br />
                </span>
              ))
        : "____";
    } else {
      return project.projectOverview?.pricePerSqft
        ? handlePrices(project.projectOverview.pricePerSqft)
        : "____";
    }
  };

  const renderTruEstimate = () => {
    if (type === "auction") {
      return unit
        ? `₹${calculateCurrentValue(unit)} Cr`
        : "____";
    } else {
      return (
        <div className={!isAuthenticated ? "blur-[6px] text-center" : ""}>
          {project.truEstimate
            ? `${formatCost(project.truEstimate)} / Sq ft`
            : "____"}
        </div>
      );
    }
  };

  const renderEstSellingPrice = () => {
    if (type === "auction") {
      return unit?.reservePrice != null && unit?.cagr != null
        ? `₹${calculateFinalPrice(unit.reservePrice, unit.cagr, unit?.holdingPeriodYears || 1)} Cr`
        : "____";
    } else {
      return (
        <div className={!isAuthenticated ? "blur-[6px] text-center" : ""}>
          {project.projectOverview?.pricePerSqft && project.investmentOverview?.cagr
            ? `${formatCost(
                parseInt(
                  project.projectOverview.pricePerSqft *
                    Math.pow(1 + project.investmentOverview?.cagr / 100, 4)
                )
              )} / Sq ft`
            : "____"}
        </div>
      );
    }
  };

  const renderHandover = () => {
    if (type === "auction") {
      return unit?.maxBidPrice != null
        ? `₹${unit.maxBidPrice.toFixed(1)} Cr`
        : "____";
    } else {
      return project.projectOverview?.handOverDate
        ? getUnixDateTime(project.projectOverview.handOverDate)
        : "____";
    }
  };

  const renderAdditionalAuctionColumns = () => {
    if (type !== "auction") return null;

    return (
      <>
        {/* EMD Submission Date */}
        <td className="py-[12px] px-[16px] whitespace-nowrap">
          {auction?.emdSubmissionDate
            ? formatTimestampDate(auction.emdSubmissionDate)
            : "____"}
        </td>

        {/* Auction Date */}
        <td className="py-[12px] px-[16px] whitespace-nowrap">
          {auction?.auctionDate
            ? formatTimestampDate(auction.auctionDate)
            : "____"}
        </td>

        {/* Possession */}
        <td className="py-[12px] px-[16px] whitespace-nowrap">
          {toCapitalizedWords(unit?.possession || "____")}
        </td>

        {/* Holding Period */}
        <td className="py-[12px] px-[16px] whitespace-nowrap">
          {unit?.holdingPeriodYears
            ? `${unit.holdingPeriodYears} Years`
            : "1 Year"}
        </td>
      </>
    );
  };

  const renderAdditionalPropertiesColumns = () => {
    if (type === "auction") return null;

    return (
      <>
        {/* Status column for non-properties types */}
        {type !== "properties" && (
          <td
            className="py-[12px] px-[16px] w-[128px]"
            data-tooltip-id="tooltip2"
            data-tooltip-content={
              project.userStatus
                ? handleStatus(project.userStatus)
                : "This property is not shared or wishlisted yet"
            }
          >
            <Tooltip id="tooltip2" place="top" />
            <div
              className="px-1 py-1 rounded-[4px] text-[12px] text-[#2B2928] font-bold leading-[18px] w-[88px] truncate text-center"
              style={{
                backgroundColor: handleStatusColour(
                  handleStatus(project.userStatus)
                ),
              }}
            >
              {project.userStatus ? handleStatus(project.userStatus) : "____"}
            </div>
          </td>
        )}

        {/* Stage */}
        <td className="py-[12px] px-[16px]">
          {project.projectOverview?.stage ? toCapitalizedWords(project.projectOverview.stage) : "____"}
        </td>

        {/* Availability */}
        <td className="py-[12px] px-[16px]">
          {project.projectOverview?.availability
            ? toCapitalizedWords(project.projectOverview.availability)
            : "____"}
        </td>

        {/* RERA */}
        <td className="py-[12px] px-[16px]">
          {project.reraId && project.reraId !== "NA"
            ? "Approved"
            : "Not Approved"}
        </td>
      </>
    );
  };

  const renderActions = () => {
    if (type === "auction") {
      return (
        <button
          className="bg-[#153E3B] text-white px-3 py-1 rounded text-xs hover:bg-[#0f2f2c] transition-colors"
          onClick={handleViewMore}
        >
          View Details
        </button>
      );
    } else {
      return (
        <div
          className={`flex items-center ${
            isAuthenticated ? "justify-between" : "justify-center"
          } space-x-[10px]`}
        >
          {isAuthenticated && (
            <>
              <img
                src={isCompared ? CompIconA : CompIcon}
                alt="Compare"
                onClick={handleCompare}
                className="cursor-pointer"
                data-tooltip-id="tooltip3"
                data-tooltip-content="Compare"
              />
              <img
                src={isWishlisted ? StarIconA : StarIcon}
                alt="Wishlist"
                onClick={handleWishlist}
                className="cursor-pointer"
                data-tooltip-id="tooltip3"
                data-tooltip-content="Wishlist"
              />
            </>
          )}
          <img
            src={RArrowIcon}
            alt="Details"
            onClick={handleViewMore}
            className="cursor-pointer"
            data-tooltip-id="tooltip3"
            data-tooltip-content="Check Detail"
          />
          <Tooltip id="tooltip3" place="left" />
        </div>
      );
    }
  };

  return (
    <tr 
      key={index} 
      className={type === "auction" ? "hover:bg-[#F5F6F7] border-b border-[#E3E3E3]" : "border-b border-[#EBEBEB]"}
    >
      {/* Project Name */}
      <td
        className="py-[12px] pl-[24px] pr-[8px] border-r-[1px] border-[#E3E3E3] cursor-pointer md:sticky left-0 bg-[#FAFBFC]"
        data-tooltip-id="tooltip"
        data-tooltip-content={project.projectName}
      >
        {renderProjectName()}
        <Tooltip id="tooltip" place="top" />
      </td>

      {/* Asset Type */}
      <td className="py-[12px] px-[16px] whitespace-nowrap">
        {toCapitalizedWords(project.assetType || "____")}
      </td>

      {/* Micro Market */}
      <td className="py-[12px] px-[16px] whitespace-nowrap">
        {toCapitalizedWords(project.micromarket || "____")}
      </td>

      {/* Min Investment */}
      <td className="py-[12px] px-[16px] whitespace-nowrap">
        {renderMinInvestment()}
      </td>

      {/* Value/Reserve Price Column */}
      <td className={`py-[12px] px-[16px] ${type === "properties" ? "text-center" : ""} whitespace-nowrap`}>
        {renderValueColumn()}
      </td>

      {/* Growth/TruValue Status Column */}
      <td className={`py-[12px] px-[16px] ${type === "properties" ? "text-center" : ""} whitespace-nowrap`}>
        {renderGrowthColumn()}
      </td>

      {/* CAGR/Exp Return Growth Column */}
      <td className={`py-[12px] px-[16px] relative ${
        !isAuthenticated && type !== "auction" ? "bg-[#FBDAC0]" : ""
      } whitespace-nowrap`}>
        {renderCAGRColumn()}
      </td>

      {/* XIRR/Exp Return (CAGR) Column */}
      <td className={`py-[12px] px-[16px] relative ${
        !isAuthenticated && type !== "auction" ? "rounded-r-lg bg-[#FBDAC0]" : ""
      } whitespace-nowrap`}>
        {renderXIRRColumn()}
        {!isAuthenticated && type !== "auction" && (
          <div className="absolute left-[-12px] top-1/2 -translate-y-1/2">
            <img
              src={lock}
              alt="Locked"
              className="w-4 h-4"
              onClick={() => {
                handleClickLock();
                logEvent(analytics, "click_properties_xirr_lock", {
                  Name: "properties_xirr_lock",
                });
              }}
            />
          </div>
        )}
      </td>

      {/* Price Per Sqft/Strategy Column */}
      <td className="py-[12px] px-[16px] whitespace-nowrap">
        {renderPricePerSqft()}
      </td>

      {/* TruEstimate/Market Price Column */}
      <td className={`py-[12px] px-[16px] bg-[#FBDAC0] relative ${
        !isAuthenticated && type !== "auction" ? "bg-[#FBDAC0]" : ""
      } whitespace-nowrap`}>
        {renderTruEstimate()}
      </td>

      {/* Est. Selling Price Column */}
      <td className={`py-[12px] px-[16px] relative ${
        !isAuthenticated && type !== "auction" ? "rounded-r-lg bg-[#FBDAC0]" : "bg-[#FBDAC0]"
      } whitespace-nowrap`}>
        {renderEstSellingPrice()}
        {!isAuthenticated && type !== "auction" && (
          <div className="absolute left-[-12px] top-1/2 -translate-y-1/2">
            <img
              src={lock}
              alt="Locked"
              className="w-4 h-4"
              onClick={() => {
                handleClickLock();
                logEvent(analytics, "click_properties_price_lock", {
                  Name: "properties_price_lock",
                });
              }}
            />
          </div>
        )}
      </td>

      {/* Handover/Max Bid Price Column */}
      <td className="py-[12px] px-[16px] whitespace-nowrap">
        {renderHandover()}
      </td>

      {/* Additional auction-specific columns */}
      {renderAdditionalAuctionColumns()}

      {/* Additional properties-specific columns */}
      {renderAdditionalPropertiesColumns()}

      {/* Actions */}
      <td className="py-[12px] pl-[16px] pr-[8px] border-l-[1px] border-[#E3E3E3] cursor-pointer md:sticky right-0 bg-[#FAFBFC] whitespace-nowrap">
        {renderActions()}
      </td>
    </tr>
  );
};

export default UnifiedTableRow;