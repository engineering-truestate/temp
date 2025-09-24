import { useEffect, useState, useMemo, useCallback } from "react";
import { Card, CardHeader, CardBody } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUserPhoneNumber, selectUserDocId } from "../../slices/userAuthSlice";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";
import { APARTMENT_CONFIGURATION_KEYS } from "../../constants/apartmentTypes";

// Import your icons here

const truSelected = '/assets/properties/icons/recommended-badge.svg';
import LitigationIcon from "/assets/icons/status/litigation.svg";
import rerasel from "/assets/icons/brands/rera.svg";
// import limited from "/icons-1/LimitedAvb.svg"; // File no longer exists
import soldOut from "/assets/icons/status/sold-out.svg";
// import imshared from "/icons-1/IMshared.svg"; // File no longer exists
import compoff from "/assets/icons/features/compare-inactive.svg";
import compon from "/assets/icons/features/compare-active.svg";
import seloff from "/assets/icons/features/wishlist-inactive.svg";
import selon from "/assets/icons/features/wishlist-active.svg";
import styles from "./ProjectPopup.module.css";
import locicon from "/assets/icons/navigation/location.svg";
// import status from "/icons-1/Status.svg"; // File no longer exists
import statu from "/assets/icons/navigation/Status.svg";
const cardpic = '/assets/properties/images/placeholder.webp';
import growth from "/assets/icons/features/home.svg";
import value from "../../../public/assets/icons/features/Value.svg";
import asset from "/assets/icons/features/properties.svg";
import xirrLock from "/assets/icons/features/vault.svg";
import infoIcon from "/assets/icons/ui/info.svg";

import { fetchCompareProjects, selectCompareProjects } from "../../slices/compareSlice";
import { fetchWishlistedProjects, selectWishlistItems } from "../../slices/wishlistSlice";
import { useToast } from "../../hooks/useToast.jsx";
import {
  formatCostSuffix,
  toCapitalizedWords,
  upperCaseProperties,
} from "../../utils/common.js";
import { formatCost } from "../../utils/common.js";
import { setShowSignInModal } from "../../slices/modalSlice.js";
import { Loader } from "lucide-react";
import { updateWishlist, removeWishlist } from "../../slices/wishlistSlice";
import { addProjectForComparison } from "../../slices/compareSlice";
import { handleStatus, handleStatusColour, handleTruGrowthStatus, handleTruValueStatus, handleGrowthAndValueStatusColour, handleGrowthStatusColour, handleGrowthStatusTextColour } from "../../utils/propertyHelpers.js";

const PropCard = ({ project }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const userPhoneNumber = useSelector(selectUserPhoneNumber);
  const userId = useSelector(selectUserDocId);
  const wishlistItems = useSelector(selectWishlistItems);
  const compareProjects = useSelector(selectCompareProjects);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const [isShared] = useState(false);
  const [projectStatus] = useState("");
  const [isLitigation, setIsLitigation] = useState(false);
  const { addToast } = useToast(); // Access the toast function

  // console.log(isAuthenticated);
  const maxPricePerSqft = useMemo(() => {
    if (project?.assetType === "plot") {
      if (project?.configuration && Array.isArray(project.configuration)) {
        return project.configuration.reduce((max, item) => {
          const pricePerSqft = item.pricePerSqft || 0;
          return pricePerSqft > max ? pricePerSqft : max;
        }, 0);
      }
      return 0;
    } 
    
    if (project?.assetType === "apartment") {
      const configKeys = APARTMENT_CONFIGURATION_KEYS;
      let maxPrice = 0;

      if (project?.configuration) {
        configKeys.forEach((configKey) => {
          const configData = project.configuration[configKey];
          if (configData && Array.isArray(configData)) {
            configData.forEach((item) => {
              if (item.available && item.sbua > 0) {
                const pricePerSqft = parseInt(item.currentPrice / item.sbua);
                maxPrice = pricePerSqft > maxPrice ? pricePerSqft : maxPrice;
              }
            });
          }
        });
      }
      return maxPrice;
    } 
    
    if (project?.assetType === "villa") {
      if (project?.configuration && Array.isArray(project.configuration)) {
        return project.configuration.reduce((max, item) => {
          const pricePerSqft = item.pricePerSqft || 0;
          return pricePerSqft > max ? pricePerSqft : max;
        }, 0);
      }
      return 0;
    }
    
    return 0;
  }, [project?.assetType, project?.configuration]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId) {
      dispatch(fetchWishlistedProjects(userId));
      dispatch(fetchCompareProjects(userId));
    }
  }, [userId, dispatch]);

  // Update local state based on Redux store
  useEffect(() => {
    const isProjectWishlisted = wishlistItems.some(item => item.projectId === project.projectId);
    setIsWishlisted(isProjectWishlisted);
  }, [wishlistItems, project.projectId]);

  useEffect(() => {
    const isProjectCompared = compareProjects.some(item => item.projectId === project.projectId);
    setIsCompared(isProjectCompared);
  }, [compareProjects, project.projectId]);

  useEffect(() => {
    setIsLitigation(project?.projectOverview?.litigation);
  }, [project]);

  const handleViewMore = () => {
    // setting the current scroll position of the properties page while navigating to the project detail page
    //  so that when user return from there page can start from that position
    // if(currentPage==='/properties')
    // dispatch(setProjectsScrollPosition(mainContentRef?.current?.scrollTop));

    navigate(`/properties/${project.projectName}`, {
      state: { name: project.projectName },
    });
  };

  const toggleWishlist = useCallback(async () => {

    const newState = !isWishlisted;
    setIsWishlisted(newState); // Optimistic update

    try {
      logEvent(analytics, newState ? "added-to-wishlist" : "removed-from-wishlist", {
        name: project.projectName,
      });

      if (newState) {
        const result = await dispatch(updateWishlist({
          userId,
          propertyType: project.propertyType || "preLaunch",
          projectId: project.projectId
        }));
        const fetchResult = await dispatch(fetchWishlistedProjects(userId));
      } else {
        const result = await dispatch(removeWishlist({
          userId,
          propertyType: project.propertyType || "preLaunch",
          projectId: project.projectId
        }));
        const fetchResult = await dispatch(fetchWishlistedProjects(userId));
      }

      addToast(
        "Dummy",
        "success",
        newState ? "Property Added to Wishlist" : "Property Removed from Wishlist",
        newState
          ? "The property has been added to the Wishlist."
          : "The property has been removed from the Wishlist."
      );
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
  }, [
    isWishlisted,
    project.projectId,
    project.projectName,
    project.propertyType,
    isAuthenticated,
    userId,
    wishlistItems.length,
    dispatch,
    addToast
  ]);


  const toggleCompare = useCallback(async () => {
    const newState = !isCompared;
    setIsCompared(newState); // Optimistic UI update

    try {
      logEvent(analytics, newState ? "added-to-compare" : "removed-from-compare", {
        name: project.projectName,
      });

      if (newState) {
        await dispatch(addProjectForComparison(project.projectId));
      }

      addToast(
        "Dummy",
        "success",
        newState ? "Property Added to Compare" : "Property Removed from Compare",
        newState
          ? "The property has been added to the compare list."
          : "The property has been removed from the compare list."
      );
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
  }, [isCompared, project.projectName, project.projectId, dispatch, addToast]);


  const imageUrl = useMemo(() => 
    project?.images?.length > 0 ? project.images[0] : cardpic, 
    [project?.images]
  );

  const handleClickLock = (e) => {
    e.stopPropagation();
    // console.log(e);
    dispatch(
      setShowSignInModal({ showSignInModal: true, redirectUrl: "/properties" })
    );
  };

  return (
    <Card
      className={` rounded-xl bg-[#FAFAFA] shadow-none border hover:cursor-pointer border-[#CCCBCB]  ${
        isAuthenticated ? `min-w-[278px]` : `min-w-[268px]`
      }  `}
    >
      <CardHeader
        floated={false}
        color="blue-gray"
        className="relative h-[164px] mx-0 rounded-t-lg rounded-b-none shadow-none mt-0 bg-black border-b-[1px] border-[#CCCBCB]"
      >
        <img
          src={project?.images?.length > 0 ? imageUrl : cardpic}
          alt={project?.projectName}
          className="h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 h-full w-full"
          onClick={handleViewMore}
        />
        <div className="absolute top-4 left-3 md:left-4 flex space-x-2">
          {project.recommended && (
            <div
              className={`${styles.tooltip}`}
              onClick={(event) => event.stopPropagation()}
            >
              <img src={truSelected} />
              <span className={`${styles.tooltiptext}`}>
                This project is recommended by TruEstate for investment.
              </span>
            </div>
          )}
          {project?.otherData?.isReraApproved &&
            project?.otherData?.isReraApproved != "Pending" && (
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
                Project is shared by Investment Manager.
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
          ) : project.combineAvailability === "sold out" ? (
            <div className={`${styles.tooltip1}`}>
              <img src={soldOut} />
              <span className={`${styles.tooltiptext1}`}>Project sold out</span>
            </div>
          ) : (
            ""
          )}
          {projectStatus && (
            <div className={`${styles.tooltip1}`}>
              <div
                className="w-fit h-fit rounded-[4px] px-[6px] py-[4px] font-lato text-[12px] leading-[18px] text-center text-[#2B2928] font-extrabold"
                style={{
                  backgroundColor: handleStatusColour(
                    handleStatus(projectStatus)
                  ),
                }}
              >
                {handleStatus(projectStatus)}
              </div>
              <span className={`${styles.tooltiptext1}`}>
                Your project status is &apos;{handleStatus(projectStatus)}&apos;
              </span>
            </div>
          )}
        </div>

        {isLitigation && (
          <div className="absolute bottom-4 right-3 md:right-4 flex space-x-2">
            <div className={`${styles.tooltip1}`}>
              <img src={LitigationIcon} />
            </div>
          </div>
        )}

        {/* only show when user is authenticated  */}
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
      </CardHeader>
      <CardBody
        className=" px-3 pt-3 pb-4  gap-4 bg-[#FAFAFA] rounded-b-xl"
        onClick={handleViewMore}
      >
        <div className=" h-full">
          <div className="mb-[8px] inline-block">
            <span className="font-montserrat font-bold text-[#252626] text-[16px] leading-[1.5] line-clamp-1">
              {project?.projectName
                ? Object.keys(upperCaseProperties).includes(
                    project?.projectName
                  )
                  ? upperCaseProperties[project?.projectName]
                  : toCapitalizedWords(project?.projectName)
                : "___"}
            </span>
          </div>

          <div className="flex flex-wrap justify-items-start  w-full  gap-2  mb-4 ">
            <div className="flex items-center gap-1 w-fit pr-2 border-r-[1px]">
              <img src={locicon} className="w-[14px] h-[14px]" />
              <p className="font-lato font-medium text-xs text-[#433F3E] leading-[150%]">
                {toCapitalizedWords(project.micromarket)}
              </p>
            </div>

            <div className="flex items-center gap-1 pr-2 w-fit border-r-[1px]">
              <img src={statu} className="w-[14px] h-[14px]" />
              <p className="font-lato font-medium text-xs text-[#433F3E] leading-[150%]">
                {toCapitalizedWords(project.projectOverview?.stage)}
              </p>
            </div>

            <div className="flex items-center gap-1 pr-2 w-fit ">
              <img src={asset} className="w-[14px] h-[14px]" />
              <p className="font-lato font-medium text-xs text-[#433F3E] leading-[150%]">
                {toCapitalizedWords(project.assetType)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 w-full ">
            <div className="py-1">
              <p className="font-montserrat text-xs font-medium text-[#433F3E] leading-[150%]">
                Price / Sq ft
              </p>
              <p className="font-lato text-sm font-bold text-[#2B2928]  leading-[150%]">
                {project?.projectOverview?.pricePerSqft
                  ? formatCost(project.projectOverview.pricePerSqft)
                  : maxPricePerSqft
                    ? formatCost(maxPricePerSqft)
                    : "NA"}
              </p>
            </div>

            <div className="py-1 ">
              <p className="font-montserrat text-xs font-medium text-[#433F3E] leading-[150%] flex">
                Min. Investment
              </p>

              <p className="font-lato text-sm font-bold text-[#2B2928]  leading-[150%]">
                {" "}
                {project?.investmentOverview?.minInvestment
                  ? formatCostSuffix(project.investmentOverview.minInvestment)
                  : "NA"}
              </p>
            </div>

            <div className="py-1">
              <p className="font-montserrat text-xs font-medium text-[#433F3E] leading-[150%]">
                Investment Period
              </p>
              {/* <p className="font-lato text-sm font-bold text-[#2B2928]  leading-[150%]">{project?.handOverDate ? `${parseInt(project?.handOverDate.split("/")[1]) - date.getFullYear() + 1} Years`: "NA"} </p> */}
              <p className="font-lato text-sm font-bold text-[#2B2928]  leading-[150%]">
                {"4 Years"}{" "}
              </p>
            </div>

            <div className="py-1">
              <p className="font-montserrat text-xs font-medium text-[#433F3E] leading-[150%] flex">
                <span>XIRR</span>

                {/* more info icon with tooltip  */}
                <div
                  className={`${styles.tooltip} cursor-pointer`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <img
                    src={infoIcon}
                    className="ml-1 mr-2 mt-[1px]"
                    alt="info"
                  />
                  <span className={`${styles.tooltiptext} min-w-[120px]`}>
                    Calculates an investment’s annualized return over irregular
                    cash flow dates, offering a more precise measure than
                    standard IRR.
                  </span>
                </div>
              </p>
              {
                <p className="font-lato text-sm font-bold text-[#2B2928]  leading-[150%]">
                  {!isAuthenticated ? (
                    <img onClick={handleClickLock} src={xirrLock} />
                  ) : project?.investmentOverview?.xirr &&
                    project?.investmentOverview?.xirr !== "#NUM!" ? (
                    `${project?.investmentOverview.xirr} %`
                  ) : (
                    <Loader />
                  )}
                </p>
              }
            </div>
          </div>

          <hr className="mt-3" style={{ borderTop: " 1px solid #E3E3E3" }} />
          <div className="flex gap-2 mt-3 justify-start">
            {project.investmentOverview?.cagr && (
              <div className={`${styles.tooltip2}`}>
                <div
                  className="rounded-[4px] px-[6px] py-[4px] flex items-center justify-center gap-[4px]"
                  style={{
                    backgroundColor: handleGrowthStatusColour(
                      handleTruGrowthStatus(project.investmentOverview.cagr)
                    ),
                  }}
                >
                  <img src={growth} alt="growth" />
                  <span
                    className={`font-lato text-[12px] leading-[18px] text-center font-bold`}
                    style={{
                      // color: handleGrowthStatusTextColour(
                      //   handleTruGrowthStatus(project?.investmentOverview?.cagr)
                      // ),
                      color: "#151413",
                    }}
                  >
                    {handleTruGrowthStatus(project?.investmentOverview?.cagr)}
                  </span>
                </div>
              </div>
            )}
            {project.truEstimate && (
              <div className={`${styles.tooltip2}`}>
                <div
                  className="rounded-[4px] px-[6px] py-[4px] flex items-center justify-center gap-[4px]"
                  style={{
                    backgroundColor: handleGrowthAndValueStatusColour(
                      handleTruValueStatus(project.investmentOverview.value)
                    ),
                  }}
                >
                  <img src={value} alt="value" />
                  <span className="font-lato text-[12px] leading-[18px] text-center text-[#151413] font-bold ">
                    {handleTruValueStatus(project.investmentOverview.value)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default PropCard;
