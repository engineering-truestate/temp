import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUserDocId } from "../../slices/userAuthSlice";

import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";

// Import your icons here

const truSelected = "/assets/properties/icons/recommended-badge.svg";
import LitigationIcon from "/assets/icons/status/litigation.svg";
import verified from "/assets/icons/status/verified.svg";
import seloff from "/assets/icons/features/wishlist-inactive.svg";
import selon from "/assets/icons/features/wishlist-active.svg";
import styles from "./ProjectPopup.module.css";
import locicon from "../../../public/assets/icons/navigation/location.svg";
const cardpic = "/assets/properties/images/placeholder.webp";
import growth from "/assets/icons/features/home.svg";
import value from "../../../public/assets/icons/features/Value.svg";
import asset from "/assets/icons/features/properties.svg";
import target from "../../../public/assets/icons/features/targetst.svg";
import infoIcon from "/assets/icons/ui/info.svg";

import {
  fetchWishlistedProjects,
  updateWishlist,
  removeWishlist,
  selectWishlistItems,
} from "../../slices/wishlistSlice";
import { useToast } from "../../hooks/useToast.jsx";
import { toCapitalizedWords, upperCaseProperties } from "../../utils/common.js";

const AuctionCard = ({ project }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const userId = useSelector(selectUserDocId);
  const wishlistItems = useSelector(selectWishlistItems);
  const [isLitigation, setIsLitigation] = useState(false);
  const { addToast } = useToast(); // Access the toast function

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const dispatch = useDispatch();

  useEffect(() => {
    if (userId) {
      dispatch(fetchWishlistedProjects(userId));
    }
  }, [dispatch, userId]);

  const [isWishlisted, setIsWishlisted] = useState(false);

  // Sync local state with redux wishlist once when data changes
  useEffect(() => {
    const isProjectWishlisted = wishlistItems.some(
      (item) => item.projectId === project.projectId
    );
    setIsWishlisted(isProjectWishlisted);
  }, [wishlistItems, project.projectId]);

  useEffect(() => {
    setIsLitigation(project?.litigation);
  }, [project?.litigation]);
  function formatCostSuffix1(value) {
    if (value < 100) {
      return `${value} Lacs`;
    } else {
      const croreValue = (value / 100).toFixed(2).replace(/\.00$/, "");
      return `${croreValue} Cr`;
    }
  }
  const handleViewMore = () => {
    navigate(
      `/auction/${project.projectName.replace(/[\s/]+/g, "-")}/${
        project.projectId
      }`,
      {
        state: { name: project.projectName },
      }
    );
  };
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleWishlist = async (e) => {
    e.stopPropagation();

    const newState = !isWishlisted;
    setIsWishlisted(newState); // 🔥 Optimistic UI update

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
            propertyType: project.propertyType || "auction",
            projectId: project.projectId,
          })
        );
        addToast(
          "Wishlist",
          "success",
          "Property Added",
          "The property has been added to your wishlist."
        );
      } else {
        await dispatch(
          removeWishlist({
            userId,
            propertyType: project.propertyType || "auction",
            projectId: project.projectId,
          })
        );
        addToast(
          "Wishlist",
          "error", // 👈 changed from warning → error for negative effect
          "Property Removed",
          "The property has been removed from your wishlist."
        );
      }

      // optionally refresh in background, but not required for UI
      dispatch(fetchWishlistedProjects(userId));
    } catch (error) {
      console.error("Error in toggleWishlist:", error);

      // revert optimistic update on error
      setIsWishlisted(!newState);

      addToast(
        "Wishlist",
        "error",
        "Wishlist Action Failed",
        error.message || "An unexpected error occurred. Please try again."
      );
    }
  };

  const imageUrl = project?.images?.length > 0 ? project?.images[0] : null;

  const handleTruGrowthStatus = (cagr) => {
    if (cagr === "low") {
      return "Low Return";
    } else if (cagr === "medium") {
      return "Medium Return";
    } else if (cagr === "high") {
      return "High Return";
    }
  };
  console.log("check this", project?.unitDetails?.[0]?.strategy);

  const handleTruValueStatus = (status) => {
    return toCapitalizedWords(status);
  };

  const handleGrowthAndValueStatusColour = (status) => {
    if (status === "Under Valued" || status === "High Return") {
      return "#DAFBEA";
    } else if (status === "Over Valued" || status === "Low Return") {
      return "#FCD5DC";
    } else if (status === "Fairly Valued" || status === "Medium Return") {
      return "#FBDD97";
    }
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
          {project?.truRecommended && (
            <div
              className={`${styles.tooltip}  `}
              onClick={(event) => event.stopPropagation()}
            >
              <img src={truSelected} />
              <span className={`${styles.tooltiptext}`}>
                This auction is recommended by TruEstate for investment.
              </span>
            </div>
          )}
          {project?.truVerified && (
            <div className={`${styles.tooltip}`}>
              <img className="h-[26px]" src={verified} />
              <span className={`${styles.tooltiptext}`}>
                This project is verified.
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
              {project.projectId}
              {" : "}
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
                {toCapitalizedWords(project?.micromarket || "NA")}
              </p>
            </div>

            <div className="flex items-center gap-1 pr-2 w-fit ">
              <img src={asset} className="w-[14px] h-[14px]" />
              <p className="font-lato font-medium text-xs text-[#433F3E] leading-[150%]">
                {toCapitalizedWords(project?.assetType || "NA")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 w-full flex-wrap">
            <div className=" py-1">
              <p
                className="font-montserrat text-xs font-medium text-[#433F3E] leading-[150%]"
                onClick={() => {
                  console.log(project);
                }}
              >
                Reserve Price
              </p>
              <p className="font-lato text-sm font-bold text-[#2B2928] leading-[150%]">
                {project?.auctionReservePrice
                  ? `${project.auctionReservePrice.toFixed(1)} Cr`
                  : "NA"}
              </p>
            </div>

            <div className=" py-1">
              <p className="font-montserrat text-xs font-medium text-[#433F3E] leading-[150%] flex">
                <span className="whitespace-nowrap">Min. Investment</span>
                <div
                  className={`${styles.tooltip} cursor-pointer`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <img
                    src={infoIcon}
                    className="ml-[2px] mr-2 mt-[1px]"
                    alt="info"
                  />
                  <span className={`${styles.tooltiptext} min-w-[120px]`}>
                    In partial buy, we fix the number of seats and split the
                    total investment equally among them.
                  </span>
                </div>
              </p>

              <p className="font-lato text-sm font-bold text-[#2B2928] leading-[150%]">
                {project?.minInvestmentOfAuction != null
                  ? `${formatCostSuffix1(
                      project.minInvestmentOfAuction.toFixed(0)
                    )} `
                  : project?.auctionReservePrice != null
                  ? `${project.auctionReservePrice.toFixed(2)} Lacs`
                  : "NA"}
              </p>
            </div>

            <div className=" py-1">
              <p className="font-montserrat text-xs font-medium text-[#433F3E] leading-[150%]">
                Holding Period
              </p>
              <p className="font-lato text-sm font-bold text-[#2B2928] leading-[150%]">
                {/* {project?.auctions?.[0]?.units?.[0]?.holdingPeriodYears
                  ? `${project.auctions[0].units[0].holdingPeriodYears} Years`
                  : "1 Year"} */}
                {project?.unitDetails?.[0]?.holdingPeriodYears
                  ? `${project.unitDetails[0].holdingPeriodYears} Years`
                  : "1 Year"}
              </p>
            </div>

            <div className=" py-1">
              <p className="font-montserrat text-xs font-medium text-[#433F3E] leading-[150%] flex">
                <span className="whitespace-nowrap">Exp Return</span>
                <div
                  className={`${styles.tooltip} cursor-pointer`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <img
                    src={infoIcon}
                    className="ml-[2px] mr-2 mt-[1px]"
                    alt="info"
                  />
                  <span className={`${styles.tooltiptext} min-w-[120px]`}>
                    Represents the compound annual growth rate — a measure of
                    return assuming the investment grows at a steady rate over
                    time.
                  </span>
                </div>
              </p>

              <p className="font-lato text-sm font-bold text-[#2B2928] leading-[150%]">
                {project?.unitDetails?.[0]?.cagr != null
                  ? `${project.unitDetails[0].cagr} %`
                  : "NA"}
              </p>
            </div>
          </div>

          {/* Auction CAGR */}
          <hr className="mt-3 " style={{ borderTop: " 1px solid #E3E3E3" }} />
          <div
            className="flex gap-2 mt-3 justify-start overflow-x-auto w-full whitespace-nowrap"
            onClick={() => {
              console.log(project?.auctions?.[0]?.auctionCAGR);
            }}
          >
            {/* CAGR Growth Status */}
            {project?.auctionOverview?.auctionCAGR && (
              <div className={`${styles.tooltip2}`}>
                <div
                  className="rounded-[4px] px-[12px] py-[4px] flex items-center justify-center gap-[4px]"
                  style={{
                    backgroundColor: handleGrowthAndValueStatusColour(
                      handleTruGrowthStatus(project.auctionOverview.auctionCAGR)
                    ),
                  }}
                >
                  <img src={growth} alt="growth" />
                  <span className="font-lato text-[12px] leading-[18px] text-center text-[#151413] font-bold">
                    {handleTruGrowthStatus(project.auctionOverview.auctionCAGR)}
                  </span>
                </div>
              </div>
            )}

            {/* Auction Value Status */}
            {project?.auctionOverview?.auctionValue && (
              <div className={`${styles.tooltip2}`}>
                <div
                  className="rounded-[4px] px-[10px] py-[4px] flex items-center justify-center gap-[4px]"
                  style={{
                    backgroundColor: handleGrowthAndValueStatusColour(
                      handleTruValueStatus(project.auctionOverview.auctionValue)
                    ),
                  }}
                >
                  <img src={value} alt="value" />
                  <span className="font-lato text-[12px] leading-[18px] text-center text-[#151413] font-bold">
                    {handleTruValueStatus(project.auctionOverview.auctionValue)}
                  </span>
                </div>
              </div>
            )}

            {!isMobile &&
              project?.unitDetails?.[0]?.strategy &&
              Array.isArray(project?.unitDetails?.[0]?.strategy) &&
              project?.unitDetails?.[0]?.strategy.map((strat, idx) => (
                <div key={idx} className={`${styles.tooltip2} sm`}>
                  <div
                    className="w-auto rounded-[4px] px-[10px] py-[4px] flex items-center justify-center gap-[4px]"
                    style={{
                      backgroundColor: "#DAFBEA",
                    }}
                  >
                    <img src={target} alt="value" />
                    <span className="font-lato text-[12px] leading-[18px] text-center text-[#151413] font-bold">
                      {handleTruValueStatus(strat)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default AuctionCard;
