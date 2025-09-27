import React, { useEffect, useState, useRef } from "react";
import { Card, CardHeader, CardBody } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUserPhoneNumber, selectUserDocId } from "../../slices/userAuthSlice";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import CloseButton from "/assets/icons/navigation/btn-close.svg";
import LitigationIcon from "/assets/icons/status/litigation.svg";
// Import your icons here
// import truSelected from "/icons-1/truselected.svg"; // File no longer exists
import verified from "/assets/icons/status/verified.svg";
import rerasel from "/assets/icons/brands/rera.svg";
// import limited from "/icons-1/LimitedAvb.svg"; // File no longer exists
import soldOut from "/assets/icons/status/sold-out.svg";
// import imshared from "/icons-1/IMshared.svg"; // File no longer exists
import seloff from "/assets/icons/features/wishlist-inactive.svg";
import selon from "/assets/icons/features/wishlist-active.svg";
import styles from "./ProjectPopup.module.css";
import locicon from "/assets/icons/navigation/arrow-down.svg";
// import status from "/icons-1/Status.svg"; // File no longer exists
const cardpic = '/assets/properties/images/placeholder.webp';
// import HG from "/icons-1/HG.svg"; // File no longer exists
// import UV from "/icons-1/UV.svg"; // File no longer exists
import growth from "/assets/icons/features/home.svg";
import value from "/assets/icons/features/valuation-report.svg";
import asset from "/assets/icons/features/properties.svg";
import Soldout from "/assets/icons/status/sold-out.svg";
import True from "/assets/icons/brands/truestate-logo.svg";
import xirrLock from "/assets/icons/features/vault.svg";

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

function AuctionPopupMap({ project, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userPhoneNumber = useSelector(selectUserPhoneNumber);
  const userId = useSelector(selectUserDocId);
  const wishlistItems = useSelector(selectWishlistItems);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isWishlisted, setIsWishlisted] = useState(false);
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
    setIsLitigation(project?.litigation);
  }, [project]);


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





  const toggleWishlist = async () => {
  const newState = !isWishlisted;
  setIsWishlisted(newState); // Optimistic update

  // 1️⃣ show a loading toast
  const loadingToastId = addToast(
    "Wishlist",
    "loading",
    newState ? "Adding Property" : "Removing Property"
  );


  try {
    if (newState) {
      await dispatch(
        updateWishlist({
          userId,
          propertyType: project.propertyType || "auction",
          projectId: project.projectId,
        })
      );

      // 2️⃣ update the same toast to success
      updateToast(loadingToastId, {
        type: "success",
        heading: "Property Added to Wishlist",
        description: "The property has been added to the Wishlist.",
      });
    } else {
      await dispatch(
        removeWishlist({
          userId,
          propertyType: project.propertyType || "auction",
          projectId: project.projectId,
        })
      );

      // 2️⃣ update the same toast to success
      updateToast(loadingToastId, {
        type: "success",
        heading: "Property Removed from Wishlist",
        description: "The property has been removed from the Wishlist.",
      });
    }
  } catch (error) {
    console.error("Error in toggleWishlist:", error);

    // 3️⃣ update the same toast to error
    updateToast(
      loadingToastId,
      "error",
      "Wishlist Action Failed",
      error.message || "An unexpected error occurred. Please try again."
    );

    setIsWishlisted(!newState); // Revert UI on error
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

  const projectSlug = project.projectName
    .toLowerCase()                 // lowercase
    .trim()                        // remove leading/trailing spaces
    .replace(/[^a-z0-9\s/]/g, "")  // remove special characters
    .replace(/[\s/]+/g, "-")       // replace spaces and slashes with hyphens
    .replace(/-+/g, "-");          // collapse multiple hyphens

  navigate(`/auction/${projectSlug}/${project.id}`, {
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
      return `₹${(cost / 100000).toFixed(2)} L`;
    } else {
      return `₹${cost}`;
    }
  };

  if (isMobile) {
    // Return statement for mobile devices
    // console.log(project);
    return (
      <div
        className="absolute bottom-0 mx-[5%] z-[1000]   w-[90%]  flex  border-t bg-[#FAFAFA] border-gray-300 overflow-hidden"
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
          {project?.auctions?.[0]?.recommended && (
            <div className={`${styles.tooltip1}  `}>
              <img src={True} />
              <span className={`${styles.tooltiptext1}`}>
                Projects are recommended by TruEstate
              </span>
            </div>
          )}
          {project?.auctions?.[0]?.verified && (
            <div className={`${styles.tooltip1}`}>
              <img className="h-[26px]" src={verified} />
              <span className={`${styles.tooltiptext1}`}>
                This project is verified.
              </span>
            </div>
          )}
          {project?.combineAvailability === "limited availability" ? (
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
            {project?.micromarket && (
              <>
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
                Reserve Price
              </span>
              <span
                className={`font-lato text-[12px] font-semibold leading-[18px] text-left`}
              >
                {/* {formatCost(project?.commonPricePerSqft || 25)}/Sqft */}
                {project?.auctions?.[0].units?.[0]?.reservePrice
                  ? `${formatCost(project?.auctions?.[0].units?.[0]?.reservePrice)} Cr`
                  : project?.auctions?.[0].units?.[0]?.reservePrice
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
                {project?.auctions?.[0].units?.[0]?.reservePrice &&
                project?.auctions?.[0].units?.[0]?.totalSeats
                  ? formatCost2(
                      (
                        project?.auctions?.[0].units?.[0]?.reservePrice /
                        project?.auctions?.[0].units?.[0]?.totalSeats
                      ).toFixed(2) * 10000000
                    )
                  : project?.auctions?.[0].units?.[0]?.reservePrice
                    ? `${project?.auctions?.[0].units?.[0]?.reservePrice} Cr`
                    : "NA"}
              </span>
            </div>
            <div className="flex flex-col gap-[2px]">
              <span
                className={`font-montserrat text-[12px] font-medium leading-[18px] text-left text-[#433F3E]`}
              >
                Exp. Return
              </span>
              <span
                className={`font-lato text-[12px] font-semibold leading-[18px] text-left`}
              >
                {!isAuthenticated ? (
                  <img onClick={handleClickLock} src={xirrLock} />
                ) : project?.auctions?.[0].units?.[0]?.cagr ? (
                  `${project?.auctions?.[0].units?.[0]?.cagr} %`
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
    <Card className=" relative bottom-0  w-full mx-4 sm:mx-0 sm:w-[278px] lg:w-[378px]  sm:h-[100%] bg-[#FAFAFA] shadow-none border  border-[#CCCBCB] rounded-none overflow-y-scroll">
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
              {project?.micromarket && (
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
              {project.auctions?.[0]?.propertyType && (
                <>
                  <p
                    className={`truncate max-w-[33%]  color-gray ${styles.proj_address_line}`}
                  >
                    |
                  </p>
                  <p className={`flex items-center  ${styles.proj_address}`}>
                    <p
                      className={`flex items-center  text-[0.70rem] md:text-[0.75rem] ${styles.proj_address}`}
                    >
                      {toCapitalizedWords(project.auctions?.[0]?.propertyType)}
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
          {project?.auctions?.[0]?.recommended && (
            <div className={`${styles.tooltip}  `}>
              <img src={truSelected} />
              <span className={`${styles.tooltiptext}`}>
                This project is recommended by TruEstate for investment.
              </span>
            </div>
          )}

          {project?.auctions?.[0]?.verified && (
            <div className={`${styles.tooltip}`}>
              <img className="h-[26px]" src={verified} />
              <span className={`${styles.tooltiptext}`}>
                This project is verified.
              </span>
            </div>
          )}
          {project?.reraId && project?.reraId !== "NA" && (
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
          {project.projectOverview?.availability === "limited available" ? (
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
          {project?.unitDetails?.[0]?.reservePrice && (
            <div className="flex justify-between max-w-[248px]">
              <span className={`${styles.proj_detail_type}`}>
                Reserve Price:
              </span>
              <span className={`${styles.proj_detail_type_val}`}>
                {/* {formatCost(project?.commonPricePerSqft || 25)}/Sqft */}
                {project?.unitDetails?.[0]?.reservePrice
                  ? `${formatCost(project?.unitDetails?.[0]?.reservePrice)} Cr`
                  : maxPricePerSqft
                    ? `${formatCost(maxPricePerSqft)} / Sq ft`
                    : "NA"}
              </span>
            </div>
          )}

          {project?.unitDetails?.[0]?.reservePrice && (
            <div className="flex justify-between max-w-[248px]">
              <span className={`${styles.proj_detail_type}`}>
                Min. Investment:
              </span>
              <span className={`${styles.proj_detail_type_val}`}>
                {project?.unitDetails?.[0]?.reservePrice &&
                project?.unitDetails?.[0]?.totalSeats
                  ? formatCost2(
                      (
                        project?.unitDetails?.[0]?.reservePrice /
                        project?.unitDetails?.[0]?.totalSeats
                      ).toFixed(2) * 10000000
                    )
                  : project?.unitDetails?.[0]?.reservePrice
                    ? `${project?.unitDetails?.[0]?.reservePrice} Cr`
                    : "NA"}
              </span>
            </div>
          )}
          {project?.unitDetails?.[0]?.cagr && (
            <div className="flex justify-between max-w-[248px]">
              <span className={`${styles.proj_detail_type}`}>Exp Return :</span>
              <span className={`${styles.proj_detail_type_val}`}>
                {project?.unitDetails?.[0]?.cagr} %
              </span>
            </div>
          )}

          <div className="flex justify-between max-w-[248px]">
            <span className={`${styles.proj_detail_type}`}>
              Holding Period :
            </span>
            <span className={`${styles.proj_detail_type_val}`}>
              {project.unitDetails[0].holdingPeriodYears
                  ? `${project.unitDetails[0].holdingPeriodYears} Years`
                  : "1 Year"}
            </span>
          </div>

          {console.log("Property datat akndflsdlfdskf", project)}

          {project?.projectType && (
            <div className="flex justify-between max-w-[248px]">
              <span className={`${styles.proj_detail_type}`}>
                Property Type :
              </span>
              <span className={`${styles.proj_detail_type_val}`}>
                {toCapitalizedWords(project?.projectType)}
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

export default AuctionPopupMap;
