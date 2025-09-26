import React, { useEffect, useState, useRef } from "react";
import { Card, CardHeader, CardBody } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUserPhoneNumber, selectUserDocId } from "../../slices/userAuthSlice";
import CloseButton from "/assets/icons/navigation/btn-close.svg";
import LitigationIcon from "/assets/icons/status/litigation.svg";
// Import your icons here
import truSelected from "/assets/icons/brands/tru-selected.svg";
import rerasel from "/assets/icons/brands/rera.svg";
import soldOut from "/assets/icons/status/sold-out.svg";
import compoff from "/assets/icons/features/compare-inactive.svg";
import compon from "/assets/icons/features/compare-active.svg";
import seloff from "/assets/icons/features/wishlist-inactive.svg";
import selon from "/assets/icons/features/wishlist-active.svg";
import styles from "./ProjectPopup.module.css";
import locicon from "/assets/icons/navigation/arrow-down.svg";
const cardpic = '/assets/properties/images/placeholder.webp';
import growth from "/assets/icons/features/home.svg";
import value from "/assets/icons/features/valuation-report.svg";
import asset from "/assets/icons/features/properties.svg";
import Soldout from "/assets/icons/status/sold-out.svg";
import True from "/assets/icons/brands/truestate-logo.svg";
import xirrLock from "/assets/icons/features/vault.svg";

import {
  fetchCompareProjects,
  selectCompareProjects,
  removeProjectFromComparison,
  addProjectForComparison,
} from "../../slices/compareSlice";
import {
  fetchWishlistedProjects,
  selectWishlistItems,
  removeWishlist,
  updateWishlist,
} from "../../slices/wishlistSlice";
import { useToast } from "../../hooks/useToast.jsx";
import { getCurrentDateTime } from "../helper/dateTimeHelpers";
import { formatCost, toCapitalizedWords } from "../../utils/common.js";
import { setShowSignInModal } from "../../slices/modalSlice.js";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase.js";

function ProjectPopupMap({ project, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userPhoneNumber = useSelector(selectUserPhoneNumber);
  const userId = useSelector(selectUserDocId);
  const wishlistItems = useSelector(selectWishlistItems);
  const compareProjects = useSelector(selectCompareProjects);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [wishlistStatus, setWishlistStatus] = useState("");
  const [isLitigation, setIsLitigation] = useState(false);
  const { addToast, updateToast } = useToast();

  const date = new Date();

  let maxPricePerSqft;

  if (project?.assetType === "plot") {
    maxPricePerSqft = project?.data?.reduce((min, item) => {
      return item.totalPrice > min
        ? parseInt(item.totalPrice / item.plotArea)
        : min;
    }, 0);
  } else {
    maxPricePerSqft = project?.data?.reduce((min, item) => {
      return item.totalPrice > min
        ? parseInt(item.totalPrice / item.superBuiltUpArea)
        : min;
    }, 0);
  }

  useEffect(() => {
    setIsLitigation(project?.projectOverview?.litigation);
  }, [project]);

  useEffect(() => {
    dispatch(fetchCompareProjects());
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchWishlistedProjects(userId));
    }
  }, [dispatch, userId]);

  // Update local state based on Redux store
  useEffect(() => {
    const isProjectWishlisted = wishlistItems.some(item => item.projectId === project.projectId);
    setIsWishlisted(isProjectWishlisted);
  }, [wishlistItems, project.projectId]);

  useEffect(() => {
    const isProjectCompared = compareProjects.some(item => item.projectId === project.projectId);
    setIsCompared(isProjectCompared);
  }, [compareProjects, project.projectId]);


  const toggleWishlist = async () => {
      console.log("PropCard toggleWishlist called:", {
        projectId: project.projectId,
        projectName: project.projectName,
        propertyType: project.propertyType,
        defaultPropertyType: project.propertyType || "preLaunch",
        showOnTruEstate: project.showOnTruEstate,
        isAuthenticated,
        userId,
        currentWishlistState: isWishlisted,
        wishlistItems: wishlistItems.length,
      });
  
      const newState = !isWishlisted;
      setIsWishlisted(newState); // Optimistic update
  
      // Show loading toast immediately
      const loadingToastId = addToast(
        "Processing",
        "loading",
        newState ? "Adding Property" : "Removing Property"
      );
  
      try {
        logEvent(
          analytics,
          newState ? "added-to-wishlist" : "removed-from-wishlist",
          { name: project.projectName }
        );
  
        if (newState) {
          await dispatch(
            updateWishlist({
              userId,
              propertyType: project.propertyType || "preLaunch",
              projectId: project.projectId,
            })
          );
        } else {
          await dispatch(
            removeWishlist({
              userId,
              propertyType: project.propertyType || "preLaunch",
              projectId: project.projectId,
            })
          );
        }
  
        // Update loading toast to success/info
        updateToast(loadingToastId, {
          type: newState ? "success" : "error", // or use "info" for remove
          heading: newState
            ? "Property Added to Wishlist"
            : "Property Removed from Wishlist",
          description: newState
            ? "The property has been added to your wishlist."
            : "The property has been removed from your wishlist.",
        });
      } catch (error) {
        console.error("Error in toggleWishlist:", error);
  
        // Update loading toast to error
        updateToast(loadingToastId, {
          type: "error",
          heading: "Wishlist Action Failed",
          description:
            error.message || "An unexpected error occurred. Please try again.",
        });
  
        setIsWishlisted(!newState); // Revert UI on error
      }
    };

  const toggleCompare = async () => {
    const newState = !isCompared;

    // Check max 4 projects before adding
    if (!isCompared && compareProjects.length >= 4) {
      addToast(
        "Compare Limit Reached",
        "error",
        "You can only compare 4 properties at a time.",
        "Remove a property from compare before adding a new one."
      );
      return;
    }

    const loadingToastId = addToast(
      "Processing",
      "loading",
      newState ? "Adding Property" : "Removing Property"
    );

    setIsCompared(newState); // Optimistic UI update

    try {
      logEvent(
        analytics,
        newState ? "added-to-compare" : "removed-from-compare",
        { name: project.projectName }
      );

      if (newState) {
        await dispatch(addProjectForComparison(project.projectId));
      } else {
        await dispatch(removeProjectFromComparison(project.projectId));
      }

      // Success toast for add, negative/error toast for remove
      updateToast(loadingToastId, {
        type: newState ? "success" : "error",
        heading: newState
          ? "Property Added to Compare"
          : "Property Removed from Compare",
        description: newState
          ? "The property has been added to the compare list."
          : "The property has been removed from the compare list.",
      });
    } catch (error) {
      console.error("Error in toggleCompare:", error);
      updateToast(loadingToastId, {
        type: "error",
        heading: "Compare Action Failed",
        description:
          error.message || "An unexpected error occurred. Please try again.",
      });
      setIsCompared(!newState); // Revert UI on failure
    }
  };

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

  const handleStatus = (status) => {
    if (status === "Shared") {
      return "Being Discussed";
    }
    if (status.includes("Back")) {
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

  const handleViewMore = () => {
    onClose();
    const projectName = project.projectName.replace(/\s+/g, "-"); // Encodes special characters
    navigate(`/properties/${project.projectName}`, {
      state: { name: project.projectName },
    });
  };

  const handleClickLock = (e) => {
    e.stopPropagation();
    // console.log(e);
    dispatch(
      setShowSignInModal({ showSignInModal: true, redirectUrl: "/properties" })
    );
  };

  // const handleTruGrowthStatus = (status) => {
  //   if (status) {
  //     return toCapitalizedWords(status) + " growth";
  //   }
  //   return "";
  // };

  const handleTruGrowthStatus = (cagr) => {
    if (cagr <= 4) {
      return "Low";
    } else if (cagr <= 8) {
      return "Medium";
    } else if (cagr > 8) {
      return "High";
    }
  };

  const handleTruValueStatus = (status) => {
    if (status) {
      return toCapitalizedWords(status);
    }
    return "";
  };

  const handleGrowthAndValueStatusColour = (status) => {
    if (status === "Undervalued" || status === "High growth") {
      return "#DAFBEA";
    } else if (status === "Overvalued" || status === "Low growth") {
      return "#F9ABB9";
    } else if (status === "Fairly Valued" || status === "Medium growth") {
      return "#FBDD97";
    }
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatCost2 = (cost) => {
    if (cost >= 10000000) {
      return `₹${(cost / 10000000).toFixed(2)} Cr`;
    } else if (cost >= 100000) {
      return `₹${(cost / 100000).toFixed(2)} Lacs`;
    } else {
      return `₹${cost}`;
    }
  };

  if (isMobile) {
    // Return statement for mobile devices
    // console.log(project);
    return (
      <div
        className="absolute bottom-[30px] mx-[5%]   w-[90%]  flex  border-t bg-[#FAFAFA] border-gray-300 overflow-hidden"
        onClick={handleViewMore}
      >
        <div className="w-[128px] h-auto flex justify-between  items-center">
          <img
            src={project?.images?.length > 0 ? project?.images[0] : cardpic}
            alt="Property Image"
            className="w-full h-full object-cover "
          />
        </div>

        <div className="absolute top-[10px] left-4  space-x-2">
          <div className={`${styles.tooltip3}`}>
            <img
              src={isCompared ? compon : compoff}
              alt="Compare"
              onClick={toggleCompare}
              className={`w-7 h-7`}
            />
            <span className={`${styles.tooltiptext3}`}>Compare</span>
          </div>
          <div className={`${styles.tooltip3}`}>
            <img
              src={isWishlisted ? selon : seloff}
              alt="Star"
              onClick={toggleWishlist}
              className={`w-7 h-7`}
            />
            <span className={`${styles.tooltiptext3}`}>Wishlist</span>
          </div>
        </div>

        <div className="absolute bottom-1 left-3 md:left-4 flex space-x-1">
          {isShared && (
            <div className={`${styles.tooltip1}`}>
              <img src={imshared} />
              <span className={`${styles.tooltiptext1}`}>
                Project is shared by Investment Manager.
              </span>
            </div>
          )}
          {project.recommended && (
            <div className={`${styles.tooltip1}  `}>
              <img src={True} />
              <span className={`${styles.tooltiptext1}`}>
                Projects are recommended by TruEstate
              </span>
            </div>
          )}
          {project.combineAvailability === "limited availability" ? (
            <div className={`${styles.tooltip1}`}>
              <img src={limited} />
              <span className={`${styles.tooltiptext1}`}>
                Less than 20% availability
              </span>
            </div>
          ) : project.combineAvailability === "sold out" ? (
            <div className={`${styles.tooltip1}`}>
              <img src={Soldout} />
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="flex-1 p-[12px]  flex flex-col  ">
          <div className="flex justify-between  mb-1">
            <div className="font-montserrat text-[14px] font-bold leading-[21px] text-left ">
              {toCapitalizedWords(project.projectName)}
            </div>
            <span className="w-4 h-4" onClick={() => onClose()}>
              <img
                src={CloseButton}
                alt=""
                onClick={(event) => {
                  event.stopPropagation();
                  onClose();
                }}
              />
            </span>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-2   mb-3">
            {project.status && (
              <>
                <p className={`flex items-center  ${styles.proj_address}`}>
                  <img
                    src={status}
                    className={`flex items-center pr-1 ${styles.proj_address_icon} w-auto`}
                    alt=""
                  />
                  <p
                    className={`flex items-center  text-[0.70rem] md:text-[0.75rem] ${styles.proj_address}`}
                  >
                    {toCapitalizedWords(project.status)}
                  </p>
                </p>
              </>
            )}
            {project.assetType && (
              <>
                <p
                  className={`truncate max-w-[33%] color-gray ${styles.proj_address_line}`}
                >
                  |
                </p>
                <p
                  className={`flex items-center truncate max-w-[33%] text-[0.70rem] md:text-[0.75rem] ${styles.proj_address}`}
                >
                  {toCapitalizedWords(project.assetType)}
                </p>
              </>
            )}
          </div>

          <div className="flex justify-between items-center  font-lato text-[12px] font-bold leading-[18px]  ">
            <div className="flex flex-col   gap-[2px]">
              <span
                className={`font-montserrat text-[12px] font-medium leading-[18px] text-left text-[#433F3E]`}
              >
                Price / Sq ft
              </span>
              <span
                className={`font-lato text-[12px] font-semibold leading-[18px] text-left`}
              >
                {/* {formatCost(project?.commonPricePerSqft || 25)}/Sqft */}
                {project?.commonPricePerSqft
                  ? `${formatCost(project.commonPricePerSqft)} `
                  : maxPricePerSqft
                    ? `${formatCost(maxPricePerSqft)} `
                    : "NA"}
              </span>
            </div>
            <div className="flex flex-col gap-[2px]">
              <span
                className={`font-montserrat text-[12px] font-medium leading-[18px] text-left text-[#433F3E]`}
              >
                Min. Invest
              </span>
              <span
                className={`font-lato text-[12px] font-semibold leading-[18px] text-left`}
              >
                {project?.minInvestment
                  ? formatCost2(project?.minInvestment)
                  : "NA"}
              </span>
            </div>
            <div className="flex flex-col gap-[2px]">
              <span
                className={`font-montserrat text-[12px] font-medium leading-[18px] text-left text-[#433F3E]`}
              >
                XIRR
              </span>
              <span
                className={`font-lato text-[12px] font-semibold leading-[18px] text-left`}
              >
                {!isAuthenticated ? (
                  <img onClick={handleClickLock} src={xirrLock} />
                ) : project?.investmentOverview.xirr &&
                  project?.investmentOverview.xirr !== "#NUM!" ? (
                  `${project?.investmentOverview.xirr} %`
                ) : (
                  "NA"
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  {
    // console.log(project);
  }

  return (
    <Card className=" relative  w-full mx-4 sm:mx-0 sm:w-[278px]  lg:w-[378px]  sm:h-[100%] bg-[#FAFAFA] shadow-none border  border-[#CCCBCB] rounded-none overflow-y-scroll">
      <div className="flex">
        <div className="flex justify-between sticky top-0 bg-[#FAFAFA] z-10 sm:w-full">
          <div className=" sm:pt-4 sm:px-4  sm:mb-6  sm:w-full">
            <div className="sm:flex sm:justify-between sm:mb-[6px]">
              <div
                className={`font-large flex flex-wrap   ${styles.projname} pr-[20px]  `}
              >
                {toCapitalizedWords(project.projectName)}
              </div>
              <span
                className="w-5 h-5 cursor-pointer"
                onClick={() => onClose()}
              >
                <img src={CloseButton} alt="" onClick={() => onClose()} />
              </span>
            </div>
            <div className="flex flex-wrap gap-3 sm:gap-2 ">
              {project.micromarket && (
                <p className={`flex items-center  ${styles.proj_address}`}>
                  <img
                    src={locicon}
                    className={`pr-1 ${styles.proj_address_icon} w-auto`}
                    alt=""
                  />
                  <p
                    className={`flex items-center  text-[0.70rem] md:text-[0.75rem] ${styles.proj_address}`}
                  >
                    {toCapitalizedWords(project.micromarket)}
                  </p>
                </p>
              )}
              {project.status && (
                <>
                  <p
                    className={`truncate max-w-[33%]  color-gray ${styles.proj_address_line}`}
                  >
                    |
                  </p>
                  <p className={`flex items-center  ${styles.proj_address}`}>
                    <img
                      src={status}
                      className={`flex items-center pr-1 ${styles.proj_address_icon} w-auto`}
                      alt=""
                    />
                    <p
                      className={`flex items-center  text-[0.70rem] md:text-[0.75rem] ${styles.proj_address}`}
                    >
                      {toCapitalizedWords(project.status)}
                    </p>
                  </p>
                </>
              )}
              {project.assetType && (
                <>
                  <p
                    className={`truncate max-w-[33%] color-gray ${styles.proj_address_line}`}
                  >
                    |
                  </p>
                  <p
                    className={`flex items-center truncate max-w-[33%] text-[0.70rem] md:text-[0.75rem] ${styles.proj_address}`}
                  >
                    {toCapitalizedWords(project.assetType)}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <CardHeader
        floated={false}
        color="blue-gray"
        className="relative mx-0 rounded-none shadow-none mt-0 "
      >
        <img
          src={project?.images?.length > 0 ? project?.images[0] : cardpic}
          alt={project?.projectName}
          className="h-full w-full object-cover max-h-[10rem]"
        />
        {/* {console.log(project)} */}
        {/* <div className="absolute inset-0 h-full w-full" /> */}
        <div className="absolute top-4 left-3 md:left-4 flex space-x-2">
          {project.recommended && (
            <div className={`${styles.tooltip}  `}>
              <img src={truSelected} />
              <span className={`${styles.tooltiptext}`}>
                This project is recommended by TruEstate for investment.
              </span>
            </div>
          )}
          {project?.isReraApproved &&
            project?.isReraApproved === "Approved" && (
              <div className={`${styles.tooltip}`}>
                <img src={rerasel} />
                <span className={`${styles.tooltiptext}`}>
                  This project is RERA approved
                </span>
              </div>
            )}
        </div>

        <div className="absolute bottom-4 left-3 md:left-4 flex space-x-2">
          {isShared && (
            <div className={`${styles.tooltip1}`}>
              <img src={imshared} />
              <span className={`${styles.tooltiptext1}`}>
                Project is shared by IM
              </span>
            </div>
          )}
          {project.combineAvailability === "limited available" ? (
            <div className={`${styles.tooltip1}`}>
              <img src={limited} />
              <span className={`${styles.tooltiptext1}`}>
                Less than 20% availability
              </span>
            </div>
          ) : project.projectOverview?.availability === "sold out" ? (
            <div className={`${styles.tooltip1}`}>
              <img src={soldOut} />
              <span className={`${styles.tooltiptext1}`}>Project sold out</span>
            </div>
          ) : (
            ""
          )}

          {isWishlisted && wishlistStatus && (
            <div className={`${styles.tooltip1}`}>
              <div
                className="w-fit h-fit rounded-[4px] px-[6px] py-[4px] font-lato text-[12px] leading-[18px] text-center text-[#2B2928] font-extrabold"
                style={{
                  backgroundColor: handleStatusColour(
                    handleStatus(wishlistStatus)
                  ),
                }}
              >
                {handleStatus(wishlistStatus)}
              </div>
              <span className={`${styles.tooltiptext1}`}>
                Your project status is '{handleStatus(wishlistStatus)}'
              </span>
            </div>
          )}
        </div>
        {isAuthenticated && (
          <div className="absolute top-4 right-3 md:right-4 flex space-x-2">
            <div className={`${styles.tooltip3}`}>
              <img
                src={isCompared ? compon : compoff}
                alt="Compare"
                onClick={toggleCompare}
                className={`md:w-7 lg:w-7 `}
              />
              <span className={`${styles.tooltiptext3}`}>Compare</span>
            </div>
            <div className={`${styles.tooltip3}`}>
              <img
                src={isWishlisted ? selon : seloff}
                alt="Star"
                onClick={toggleWishlist}
                className={`md:w-7 lg:w-7`}
              />
              <span className={`${styles.tooltiptext3}`}>Wishlist</span>
            </div>
          </div>
        )}

        {isLitigation && (
          <div className="absolute bottom-4 right-3 md:right-4 flex space-x-2">
            <div className={`${styles.tooltip1}`}>
              <img src={LitigationIcon} />
            </div>
          </div>
        )}
      </CardHeader>
      <CardBody className="sm:pt-3 sm:pb-4 sm:px-4 rounded-b-xl">
        <div className="flex-col space-y-[8px] sm:max-h-[150px] lg:min-h-fit overflow-y-auto  pb-[20px]">
          <div className="flex justify-between max-w-[248px]">
            <span className={`${styles.proj_detail_type}`}>XIRR:</span>
            <span className={`${styles.proj_detail_type_val}`}>
              {!isAuthenticated ? (
                <img
                  onClick={handleClickLock}
                  className="cursor-pointer"
                  src={xirrLock}
                />
              ) : project?.investmentOverview.xirr &&
                project?.investmentOverview.xirr !== "#NUM!" ? (
                `${project?.investmentOverview.xirr} %`
              ) : (
                "NA"
              )}{" "}
            </span>
          </div>
          {project?.projectOverview.pricePerSqft && (
            <div className="flex justify-between max-w-[248px]">
              <span className={`${styles.proj_detail_type}`}>Price:</span>
              <span className={`${styles.proj_detail_type_val}`}>
                {/* {formatCost(project?.commonPricePerSqft || 25)}/Sqft */}
                {project?.projectOverview.pricePerSqft
                  ? `${formatCost(project?.projectOverview.pricePerSqft)} / Sq ft`
                  : maxPricePerSqft
                    ? `${formatCost(maxPricePerSqft)} / Sq ft`
                    : "NA"}
              </span>
            </div>
          )}
          {project?.handOverDate && (
            <div className="flex justify-between max-w-[248px]">
              <span className={`${styles.proj_detail_type}`}>Duration:</span>
              <span className={`${styles.proj_detail_type_val}`}>
                {project?.projectOverview.handOverDate
                  ? `${
                      parseInt(project?.projectOverview.handOverDate.split("/")[1]) -
                      date.getFullYear() +
                      1
                    } Years`
                  : "NA"}
              </span>
            </div>
          )}
          {project.investmentOverview.minInvestment && (
            <div className="flex justify-between max-w-[248px]">
              <span className={`${styles.proj_detail_type}`}>
                Min. Investment:
              </span>
              <span className={`${styles.proj_detail_type_val}`}>
                {project.investmentOverview.minInvestment 
                  ? formatCost2(project.investmentOverview.minInvestment)
                  : "NA"}
              </span>
            </div>
          )}
          {project.investmentOverview.cagr && (
            <div className="flex justify-between max-w-[248px]">
              <span className={`${styles.proj_detail_type}`}>
                CAGR Category:
              </span>
              <span className={`${styles.proj_detail_type_val}`}>
                {handleTruGrowthStatus(project.investmentOverview.cagr)}
              </span>
            </div>
          )}
          {project.investmentOverview.value && (
            <div className="flex justify-between max-w-[248px]">
              <span className={`${styles.proj_detail_type}`}>Value:</span>
              <span className={`${styles.proj_detail_type_val}`}>
                {handleTruValueStatus(project.investmentOverview.value)}
              </span>
            </div>
          )}
        </div>
      </CardBody>

      <div className=" lg:py-3 lg:px-4 absolute bottom-0   border-t-[1px]   bg-[#FAFAFA]  sm:w-full border-[#CFCECE]">
        <button onClick={handleViewMore} className={`${styles.getdetailsbtn} `}>
          Get Details
        </button>
      </div>
    </Card>
  );
}

export default ProjectPopupMap;
