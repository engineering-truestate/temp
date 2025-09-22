import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchCompareProjects, selectCompareProjects } from "../../slices/compareSlice";
import CompIcon from "/assets/icons/features/compare-inactive.svg";
import CompIconA from "/assets/icons/features/compare-active.svg";
import StarIcon from "/assets/icons/features/wishlist-inactive.svg";
import StarIconA from "/assets/icons/features/wishlist-active.svg";
import RArrowIcon from "/assets/icons/navigation/arrow-right.svg";
import { analytics } from "../../firebase"; // Firebase configuration
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
import { formatCost, toCapitalizedWords } from "../../utils/common.js";
import { logEvent } from "firebase/analytics";
// import lock from "/icons-1/lock.svg"; // File no longer exists
import { setShowSignInModal } from "../../slices/modalSlice.js";
import { updateWishlist } from "../../slices/wishlistSlice";
import { addProjectForComparison } from "../../slices/compareSlice";
import { getUnixDateTime } from "../helper/dateTimeHelpers";

const TableRow = ({
  project,
  index,
  handlePrices,
  handleValueGrowthColor,
  handleValue,
  handleGrowth,
  type,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const userPhoneNumber = useSelector(selectUserPhoneNumber);
  const userId = useSelector(selectUserDocId);
  const wishlistItems = useSelector(selectWishlistItems);
  const compareProjects = useSelector(selectCompareProjects);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const { addToast } = useToast(); // Access the toast function

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCompareProjects());
    if (userId) {
      dispatch(fetchWishlistedProjects(userId));
    }
  }, [dispatch, userId]);

  const handleRemoveProject2 = (projectId) => {
    dispatch(removeWishlist({
      userId,
      propertyType: project.propertyType || "preLaunch",
      projectId: projectId
    }));
    dispatch(fetchWishlistedProjects(userId));
  };

  // Update local state based on Redux store
  useEffect(() => {
    const isProjectWishlisted = wishlistItems.some(item => item.projectId === project.projectId);
    setIsWishlisted(isProjectWishlisted);
  }, [wishlistItems, project.projectId]);

  useEffect(() => {
    const isProjectCompared = compareProjects.some(item => item.projectId === project.projectId);
    setIsCompared(isProjectCompared);
  }, [compareProjects, project.projectId]);

  const handleViewMore = () => {
    const projectName = project.projectName.replace(/\s+/g, "-");
    navigate(`/properties/${project.projectName}`, {
      state: { name: project.projectName },
    });
  };

  const toggleWishlist = async () => {
    const newState = !isWishlisted;
    setIsWishlisted(newState);

    try {
      logEvent(analytics, newState ? "added-to-wishlist" : "removed-from-wishlist", {
        name: project.projectName,
      });

      if (newState) {
        await dispatch(updateWishlist({
          userId,
          propertyType: project.propertyType || "preLaunch",
          projectId: project.projectId
        }));
        addToast(
          "Dummy",
          "success",
          "Property Added to Wishlist",
          "The property has been added to the Wishlist."
        );
        dispatch(fetchWishlistedProjects(userId));
      } else {
        handleRemoveProject2(project.projectId);
        addToast(
          "Dummy",
          "success",
          "Property Removed from Wishlist",
          "The property has been removed from the Wishlist."
        );
      }
    } catch (error) {
      console.error("Error in toggleWishlist:", error);
      addToast(
        "Dummy",
        "error",
        "Wishlist Action Failed",
        error.message || "An unexpected error occurred. Please try again."
      );
      setIsWishlisted(!newState); // Revert UI on error
    }
  };

  const toggleCompare = async () => {
    const propertyType = project.propertyType || type;
    if (propertyType === "auction") {
      addToast(
        "Dummy",
        "info",
        "Compare Not Available",
        "Auction properties cannot be compared."
      );
      return;
    }

    const newState = !isCompared;
    setIsCompared(newState);

    try {
      logEvent(analytics, newState ? "added-to-compare" : "removed-from-compare", {
        name: project.projectName,
      });

      if (newState) {
        await dispatch(addProjectForComparison(project.projectId));
        addToast(
          "Dummy",
          "success",
          "Property Added to Compare",
          "The property has been added to the compare list."
        );
      } else {
        addToast(
          "Dummy",
          "success",
          "Property Removed from Compare",
          "The property has been removed from the compare list."
        );
      }
      dispatch(fetchCompareProjects());
    } catch (error) {
      console.error("Error in toggleCompare:", error);
      addToast(
        "Dummy",
        "error",
        "Compare Action Failed",
        error.message || "An unexpected error occurred. Please try again."
      );
      setIsCompared(!newState); // Revert UI
    }
  };

  const handleStatus = (status) => {
    if (status === "Shared") {
      return "Being Discussed";
    }
    if (status === "Back") {
      return "Not Interested";
    }
    return toCapitalizedWords(status);
  };

  const handleStatusColour = (status) => {
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
  };

  const handleClickLock = () => {
    dispatch(
      setShowSignInModal({ showSignInModal: true, redirectUrl: "/properties" })
    );
  };

  return (
    <>
      <tr key={index} className="border-b border-[#EBEBEB]">
        <td
          className="py-[12px] pl-[24px] pr-[8px] border-r-[1px] border-[#E3E3E3] cursor-pointer md:sticky left-0 bg-[#FAFBFC]"
          data-tooltip-id="tooltip"
          data-tooltip-content={project.projectName}
          onClick={() => handleViewMore(project.projectName)}
        >
          <div className="w-[180px]">
            {project.projectName
              ? toCapitalizedWords(project.projectName)
              : "____"}
          </div>
        </td>

        <td className="py-[12px] px-[16px]">
          {toCapitalizedWords(project.assetType || "Apartment")}
        </td>

        <td className="py-[12px] px-[16px]">
          {toCapitalizedWords(project.micromarket || "Bengaluru")}
        </td>

        <td className="py-[12px] px-[16px]">
          {handlePrices(project.investmentOverview?.minInvestment)}
        </td>

        <td className={`py-[12px] px-[16px] text-center`}>
          <div
            className={`px-1 py-1 rounded-[4px] text-[12px] text-[#151413] font-bold leading-[18px]`}
            style={{
              backgroundColor: handleValueGrowthColor(
                handleValue(project.investmentOverview?.value)
              ),
            }}
          >
            {project.investmentOverview?.value ? handleValue(project.investmentOverview?.value) : "____"}
          </div>
        </td>

        <td className={`py-[12px] px-[16px] text-center`}>
          <div
            className={`px-1 py-1 rounded-[4px] text-[12px] text-[#151413] font-bold leading-[18px]`}
            style={{
              backgroundColor: handleValueGrowthColor(
                handleGrowth(project.investmentOverview?.growth)
              ),
            }}
          >
            {project.investmentOverview?.growth ? handleGrowth(project.investmentOverview?.growth) : "____"}
          </div>
        </td>

        <td
          className={`py-[12px] px-[16px] relative ${
            !isAuthenticated ? "bg-[#FBDAC0]" : ""
          }`}
        >
          <div className={!isAuthenticated ? "blur-[6px]" : ""}>
            {project.investmentOverview?.cagr ? `${project.investmentOverview?.cagr}%` : "____"}
          </div>
        </td>

        <td
          className={`py-[12px] px-[16px] relative ${
            !isAuthenticated ? "rounded-r-lg bg-[#FBDAC0]" : ""
          }`}
        >
          <div className={!isAuthenticated ? "blur-[6px]" : ""}>
            {project.investmentOverview.xirr && project.investmentOverview.xirr !== "#NUM!"
              ? `${project.investmentOverview.xirr.toFixed(1)} %`
              : "____"}
          </div>
          {!isAuthenticated && (
            <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 ">
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

        <td className="py-[12px] px-[16px]">
          {project.projectOverview.pricePerSqft
            ? handlePrices(project.projectOverview.pricePerSqft)
            : "____"}
        </td>

        <td
          className={`py-[12px] px-[16px] bg-[#FBDAC0] relative ${
            !isAuthenticated ? "bg-[#FBDAC0] " : ""
          }`}
        >
          <div className={!isAuthenticated ? "blur-[6px] text-center" : ""}>
            {project.truEstimate
              ? `${formatCost(project.truEstimate)} / Sq ft`
              : "____"}
          </div>
        </td>

        <td
          className={`py-[12px] px-[16px] relative ${
            !isAuthenticated ? "rounded-r-lg bg-[#FBDAC0]" : "bg-[#FBDAC0]"
          }`}
        >
          <div className={!isAuthenticated ? "blur-[6px] text-center" : ""}>
            {project.projectOverview.pricePerSqft && project.investmentOverview?.cagr
              ? `${formatCost(
                  parseInt(
                    project.projectOverview.pricePerSqft *
                      Math.pow(1 + project.investmentOverview?.cagr / 100, 4)
                  )
                )} / Sq ft`
              : "____"}
          </div>
          {!isAuthenticated && (
            <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 ">
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

        <td className="py-[12px] px-[16px]">
          {project.projectOverview.handOverDate
            ? (getUnixDateTime(project.projectOverview.handOverDate))
            : "____"}
        </td>

        {type != "properties" && (
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
              className={`px-1 py-1 rounded-[4px] text-[12px] text-[#2B2928] font-bold leading-[18px] w-[88px] truncate text-center`}
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

        <td className="py-[12px] px-[16px]">
          {project.projectOverview.stage ? toCapitalizedWords(project.projectOverview.stage) : "____"}
        </td>

        <td className="py-[12px] px-[16px]">
          {project.projectOverview.availability
            ? toCapitalizedWords(project.projectOverview.availability)
            : "____"}
        </td>

        <td className="py-[12px] px-[16px]">
          {project.reraId && project.reraId != "NA"
            ? "Approved"
            : "Not Approved"}
        </td>

        <td className="py-[12px] pl-[16px] pr-[24px] border-l-[1px] border-[#E3E3E3] cursor-pointer md:sticky right-0 bg-[#FAFBFC]">
          <div
            className={`flex items-center ${
              isAuthenticated ? "justify-between" : "justify-center"
            } space-x-[10px] `}
          >
            {isAuthenticated && (
              <>
                <img
                  src={isCompared ? CompIconA : CompIcon}
                  alt="Compare"
                  onClick={toggleCompare}
                  className={`${(project.propertyType || type) === "auction" ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                  data-tooltip-id="tooltip3"
                  data-tooltip-content={(project.propertyType || type) === "auction" ? "Compare not available for auction properties" : "Compare"}
                />
                <img
                  src={isWishlisted ? StarIconA : StarIcon}
                  alt="Wishlist"
                  onClick={toggleWishlist}
                  className="cursor-pointer"
                  data-tooltip-id="tooltip3"
                  data-tooltip-content="Wishlist"
                />
              </>
            )}
            <img
              src={RArrowIcon}
              alt="Details"
              onClick={() => handleViewMore(project.projectName)}
              className="cursor-pointer"
              data-tooltip-id="tooltip3"
              data-tooltip-content="Check Detail"
            />
            <Tooltip id="tooltip3" place="left" />
          </div>
        </td>
      </tr>
    </>
  );
};

export default TableRow;