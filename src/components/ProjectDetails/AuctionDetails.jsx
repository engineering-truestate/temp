import { useEffect, useState } from "react";

// React Router & Redux
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Firebase
import { collection, getDocs, query, where } from "firebase/firestore";
import { logEvent } from "firebase/analytics";
import { analytics, db } from "../../firebase";

// Redux Slices
import {
  fetchWishlistedProjects,
  updateWishlist,
  removeWishlist,
} from "../../slices/wishlistSlice";
import {
  selectUserDocId,
  selectUserPhoneNumber,
} from "../../slices/userAuthSlice";

// Components
import StatusTag from "./StatusTag.jsx";
import ContactInvestmentManager from "./ContactInvManager";
import ImageCarousel from "./ImageCarousel";
import FractionalInvestmentCom from "./FracInvCom";
import LocationAnalysis from "./LocationAnalysis";
import Overview from "./Overview";
import MyBreadcrumb from "../BreadCrumbs/Breadcrumb.jsx";
import TruReportHeading from "./TruReportHeading";
import Loader from "../Loader";
import { showLoader, hideLoader, selectLoader } from "../../slices/loaderSlice";
import Footer from "../../landing/pages/home/Footer.jsx";

// Utils
import InvManager from "../../utils/InvManager";
import { useToast } from "../../hooks/useToast.jsx";
import {
  customRound,
  formatTimestampDate,
  formatToOneDecimal,
  toCapitalizedWords,
  upperCaseProperties,
} from "../../utils/common.js";
import { getUnixDateTime } from "../helper/dateTimeHelpers";

// Assets
// Project placeholder moved to public folder
// import projectPlaceholder from "../../assets/Images/project-placeholder.webp";
import verified from "/assets/icons/status/verified.svg";
import Rera from "/assets/icons/brands/rera.svg";
import seloff from "/assets/icons/features/wishlist-inactive.svg";
import selon from "/assets/icons/features/wishlist-active.svg";
// Recommended icon moved to public folder
// import recommended from "../../assets/Icons/properties/truRecommended.svg";
import whatsapp from "/assets/icons/social/whatsapp-5.svg";

// Styles
import styles from "./ProjectDetails.module.css";
import MainContentLayout from "../MainContentLayout.jsx";

// Constants
const DEFAULTS = {
  HOLDING_PERIOD: 4,
  SELLING_COST: 300000,
  TENURE: 20,
  INTEREST_RATE: 8.5,
  LOAN_PERCENTAGE_DEFAULT: 85,
  LOAN_PERCENTAGE_PLOT: 75,
  SELECTED_CHARGE: "Stamp Duty",
};

const LABELS_WITH_MORE_INFO = {
  project: {
    TruEstimate: "Our estimate of the current fair value for thi s project.",
  },
  investment: {
    "All Inclusive Price":
      "This is the total cost of the property, including base price, government charges, GST, and other applicable fees. No hidden costs.",

    "Exp Return Growth":
      "Compound Annual Growth Rate (Exp Return) indicates the average annual growth of the investment, assuming profits are reinvested each year.",

    "Exit Risk":
      "Represents the potential difficulty or cost involved in selling the property later. Higher risk may imply lower liquidity or longer selling time.",

    Dues: "Outstanding payments such as maintenance fees, property taxes, or builder dues that must be cleared by the seller or buyer.",
  },
};

const AuctionDetails = ({ data }) => {
  // 📌 React Router
  const params = useParams();
  const { projectName, id } = params;
  const userId = useSelector(selectUserDocId);

  // 🔧 Redux & Toast
  const dispatch = useDispatch();
  const { addToast, updateToast } = useToast();

  // 🧠 Global Auth Info
  const userPhoneNumber = useSelector(selectUserPhoneNumber);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // 📦 Component State

  // Project
  const [project, setProject] = useState(null);
  const [tempproject2, setTempProject2] = useState({});
  const loading = useSelector(selectLoader);

  // Wishlist
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Investment Parameters
  const [holdingPeriod] = useState(DEFAULTS.HOLDING_PERIOD);
  const [sellingCost, setSellingCost] = useState(DEFAULTS.SELLING_COST);
  const [loanPercentage] = useState(DEFAULTS.LOAN_PERCENTAGE_DEFAULT);

  // Investment Data
  const [investmentOverviewData, setInvestmentOverviewData] = useState([]);

  // TruReport Data
  const [truReportAreaWiseData, setTruReportAreaWiseData] = useState([]);
  const [truReportConfigWiseData, setTruReportConfigWiseData] = useState(null);
  const [activeTruReportConfigTab, setActiveTruReportConfigTab] =
    useState(null);
  const [activeTruReportAreaTab, setActiveTruReportAreaTab] = useState(null);

  // ❤️ Toggle Wishlist
  const toggleWishlist = async () => {
    const newState = !isWishlisted;

    // Optimistically update the UI
    setIsWishlisted(newState);

    // Show loading toast right away
    const loadingToastId = addToast(
      "Wishlist",
      "loading",
      newState ? "Adding Property" : "Removing Property",
      newState
        ? "Adding property to your wishlist..."
        : "Removing property from your wishlist..."
    );

    try {
      // Determine property type
      const propertyType = project?.propertyType || "auction";

      if (newState) {
        // Adding to wishlist
        logEvent(analytics, "added-to-wishlist", {
          name: project.projectName,
        });

        await dispatch(
          updateWishlist({
            userId,
            propertyType,
            projectId: project.projectId,
            defaults: {
              stage: "discussion initiated",
              agentId: null,
              agentName: null,
              modeOfEoi: null,
              requirementIds: [],
            },
          })
        ).unwrap();

        updateToast(loadingToastId, {
          type: "success",
          heading: "Property Added",
          description: "The property has been added to your wishlist.",
        });
      } else {
        // Removing from wishlist
        logEvent(analytics, "removed-from-wishlist", {
          name: project.projectName,
        });

        await dispatch(
          removeWishlist({
            userId,
            propertyType,
            projectId: project.projectId,
          })
        ).unwrap();

        updateToast(loadingToastId, {
          type: "error", // 👈 negative effect for removal
          heading: "Property Removed",
          description: "The property has been removed from your wishlist.",
        });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);

      updateToast(loadingToastId, {
        type: "error",
        heading: "Wishlist Action Failed",
        description:
          error.message ||
          "There was an issue updating the wishlist. Please try again.",
      });

      // Revert optimistic UI update
      setIsWishlisted(!newState);
    }
  };

  // 🧭 TruReport Tab Handlers

  const handleChangeActiveTruReportAreaTab = (tab) => {
    setActiveTruReportAreaTab(tab);
    console.log("data is", activeTruReportAreaTab);
  };

  const handleChangeActiveTruReportConfigTab = (tab) => {
    setActiveTruReportConfigTab(tab);

    if (!truReportConfigWiseData[tab]) return;

    const sortedAreaData = [...truReportConfigWiseData[tab]].sort(
      (a, b) =>
        (a.carpetArea || a.plotArea || a.sbua) -
        (b.carpetArea || b.plotArea || b.sbua)
    );

    setTruReportAreaWiseData(sortedAreaData);
    setActiveTruReportAreaTab(sortedAreaData[0]);
  };

  // 💰 Price Formatter
  function formatPriceInLacOrCr(price) {
    const value = price * 100; // ₹ in Lakhs
    return value < 100
      ? `₹${value.toFixed(0)} Lac`
      : `₹${(value / 100).toFixed(1)} Cr`;
  }

  // Fetch project data
  useEffect(() => {
    const fetchProjectByName = async () => {
      try {
        dispatch(showLoader());
        const q = query(
          collection(db, "truEstateAuctions"),
          where("projectId", "==", id)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const fetchedProject = querySnapshot.docs[0].data();
          setProject(fetchedProject);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchProjectByName();
  }, [projectName]);

  // Set project overview data
  useEffect(() => {
    if (project) {
      let InitialActiveTruReportAreaTab = null;
      let InitialActiveTruReportConfigTab = null;
      let TruReportConfigWiseData = {};

      const isPlot = project?.assetType === "plot";

      if (project.unitDetails && project.unitDetails.length > 0) {
        if (!isPlot) {
          project.unitDetails.forEach((unit) => {
            const configKey = unit.configuration || "Unknown";
            const combined = { ...project, ...unit };

            if (TruReportConfigWiseData[configKey]) {
              TruReportConfigWiseData[configKey].push(combined);
            } else {
              TruReportConfigWiseData[configKey] = [combined];
            }
          });

          console.log("Hare Krishna", TruReportConfigWiseData);
        } else if (isPlot) {
          const areaField = "plotArea";

          const flattened = [];

          project.unitDetails.forEach((unit) => {
            const combined = { ...project, ...unit };
            flattened.push(combined);
          });

          const sorted = flattened
            .filter((item) => item[areaField])
            .sort((a, b) => a[areaField] - b[areaField]);

          setTruReportAreaWiseData(sorted);
          InitialActiveTruReportAreaTab = sorted.length > 0 ? sorted[0] : null;
        }

        if (!isPlot && Object.keys(TruReportConfigWiseData).length > 0) {
          setTruReportConfigWiseData(TruReportConfigWiseData);

          const firstKey = Object.keys(TruReportConfigWiseData)[0];
          const firstGroup = TruReportConfigWiseData[firstKey];

          setTruReportAreaWiseData(
            firstGroup.sort((a, b) => {
              const areaA = a.sbua || a.carpetArea || a.plotArea;
              const areaB = b.sbua || b.carpetArea || b.plotArea;

              return areaA - areaB;
            })
          );

          InitialActiveTruReportConfigTab = firstKey;
          InitialActiveTruReportAreaTab =
            firstGroup.length > 0 ? firstGroup[0] : null;
        }

        setActiveTruReportConfigTab(InitialActiveTruReportConfigTab);
        setActiveTruReportAreaTab(InitialActiveTruReportAreaTab);
      }
    }
  }, [project]);
  console.log("Data is", project);
  console.log("cagr is", project?.auctionOverview?.auctionCAGR);
  // Set investment data
  useEffect(() => {
    let SellingCost = null;
    if (project?.cagr && isAuthenticated) {
      const cagrToConsider = project?.cagr / 100;
      SellingCost = parseInt(
        activeTruReportAreaTab?.price *
          Math.pow(1 + cagrToConsider, holdingPeriod)
      );
      setSellingCost(SellingCost);
    } else if (isAuthenticated) {
      SellingCost = parseInt(1.75 * activeTruReportAreaTab?.price);
      setSellingCost(SellingCost);
    }
    const temp3 = [
      {
        label: "Holding Period",
        value: activeTruReportAreaTab?.holdingPeriodYears
          ? `${activeTruReportAreaTab?.holdingPeriodYears} Yrs`
          : "1 Yrs",
      },
      {
        label: "EMD Price",
        value:
          activeTruReportAreaTab?.emdPrice != null
            ? formatPriceInLacOrCr(project?.unitDetails[0]?.emdPrice)
            : "NA",
      },
      {
        label: "All Inclusive Price",
        value:
          typeof activeTruReportAreaTab?.allInclusivePrice === "number"
            ? `₹${activeTruReportAreaTab.allInclusivePrice.toFixed(1)} Cr`
            : "NA",
      },

      {
        label: "Rec. Bid Price",
        value:
          activeTruReportAreaTab?.maxBidPrice != null
            ? `₹${activeTruReportAreaTab.maxBidPrice.toFixed(1)} Cr`
            : "NA",
      },
      {
        label: "Strategy",
        value:
          Array.isArray(activeTruReportAreaTab?.strategy) &&
          activeTruReportAreaTab.strategy.length > 0
            ? activeTruReportAreaTab.strategy.join(", ")
            : "NA",
      },
      {
        label: "Exit Risk",
        value: project?.auctionOverview?.exitRisk || "NA",
      },
      {
        label: "Exp Return Growth",
        value: project?.auctionOverview?.auctionCAGR
          ? `${project.auctionOverview.auctionCAGR}`
          : "NA",
      },
      {
        label: "Value",
        value: project?.auctionOverview.auctionValue
          ? `${project?.auctionOverview.auctionValue}`
          : "NA",
      },
      {
        label: "Possession",
        value: activeTruReportAreaTab?.possession || "NA",
      },
      {
        label: "Loan Eligible",
        value:
          project?.auctionOverview?.loanEligiblity != null
            ? project.auctionOverview.loanEligiblity
              ? "Yes"
              : "No"
            : "NA",
      },
      {
        label: "Interest of Buyers",
        value: activeTruReportAreaTab?.interestOfBuyer || "NA",
      },
      {
        label: "Auction Type",
        value: project?.auctionOverview?.auctionType || "NA",
      },
      {
        label: "Units",
        value:
          activeTruReportAreaTab?.units != null
            ? customRound(activeTruReportAreaTab.units)
            : "NA",
      },
      {
        label: "Dues",
        value:
          activeTruReportAreaTab?.maintainsDue != null ||
          activeTruReportAreaTab?.costToBuilder != null ||
          activeTruReportAreaTab?.damagesRenovationCost != null ||
          activeTruReportAreaTab?.demolitionCost != null
            ? `₹${(
                (activeTruReportAreaTab.maintainsDue ?? 0) +
                (activeTruReportAreaTab.costToBuilder ?? 0) +
                (activeTruReportAreaTab.damagesRenovationCost ?? 0) +
                (activeTruReportAreaTab.demolitionCost ?? 0)
              ).toFixed(2)} Lac`
            : "₹0",
      },
      {
        label: "Bank Type",
        value: project?.auctionOverview?.bankType || "NA",
      },
      {
        label: "Rental Yield",
        value: activeTruReportAreaTab?.rentalYield
          ? `${activeTruReportAreaTab?.rentalYield}%`
          : "NA",
      },
      {
        label: "Micromarket",
        value: project?.micromarket || "NA",
      },
      {
        label: "Zone",
        value: project?.zone || "NA",
      },
      {
        label: "Owner's Name",
        value: activeTruReportAreaTab?.ownerName
          ? activeTruReportAreaTab.ownerName.charAt(0).toUpperCase() +
            activeTruReportAreaTab.ownerName.slice(1).toLowerCase()
          : "NA",
      },
      {
        label: "Khata Type",
        value: project?.auctionOverview?.khataType
          ? `${project.auctionOverview.khataType}`
          : "NA",
      },
    ];

    const temp2 =
      project?.projectType === "commercial"
        ? [
            {
              label: "Holding Period",
              value: activeTruReportAreaTab?.holdingPeriodYears
                ? `${activeTruReportAreaTab?.holdingPeriodYears} Yrs`
                : "1 Yrs",
            },
            {
              label: "EMD Price",
              value:
                activeTruReportAreaTab?.emdPrice != null
                  ? `₹${activeTruReportAreaTab.emdPrice.toFixed(2)} Lac`
                  : "NA",
            },
            {
              label: "All Inclusive Price",
              value:
                activeTruReportAreaTab?.allInclusivePrice != null
                  ? `₹${activeTruReportAreaTab.allInclusivePrice.toFixed(1)} Cr`
                  : "NA",
            },
            {
              label: "Rec. Bid Price",
              value:
                activeTruReportAreaTab?.maxBidPrice != null
                  ? `₹${activeTruReportAreaTab.maxBidPrice.toFixed(1)} Cr`
                  : "NA",
            },
            {
              label: "Strategy",
              value:
                Array.isArray(activeTruReportAreaTab?.strategy) &&
                activeTruReportAreaTab.strategy.length > 0
                  ? activeTruReportAreaTab.strategy.join(", ")
                  : "NA",
            },
            {
              label: "Exit Risk",
              value: project?.auctionOverview?.exitRisk || "NA",
            },
            {
              label: "Value",
              value: activeTruReportAreaTab?.currentValue
                ? `₹${activeTruReportAreaTab.currentValue.toFixed(2)} Cr`
                : "NA",
            },
            {
              label: "Exp Return Growth",
              value: activeTruReportAreaTab?.cagr
                ? `${activeTruReportAreaTab.cagr}%`
                : "NA",
            },
            {
              label: "Possession",
              value: activeTruReportAreaTab?.possession || "NA",
            },
            {
              label: "Interest of Buyers",
              value: activeTruReportAreaTab?.interestOfBuyer || "NA",
            },
            {
              label: "Auction Type",
              value: project?.auctionOverview?.auctionType || "NA",
            },
            {
              label: "Dues",
              value:
                activeTruReportAreaTab?.maintainsDue != null ||
                activeTruReportAreaTab?.costToBuilder != null ||
                activeTruReportAreaTab?.damagesRenovationCost != null ||
                activeTruReportAreaTab?.demolitionCost != null
                  ? `₹${(
                      (activeTruReportAreaTab.maintainsDue ?? 0) +
                      (activeTruReportAreaTab.costToBuilder ?? 0) +
                      (activeTruReportAreaTab.damagesRenovationCost ?? 0) +
                      (activeTruReportAreaTab.demolitionCost ?? 0)
                    ).toFixed(2)} Lac`
                  : "₹0",
            },
            {
              label: "Bank Type",
              value: project?.auctionOverview?.bankType || "NA",
            },
            {
              label: "Property Type",
              value: project?.commercialType || "NA",
            },
            {
              label: "Loan Eligible",
              value:
                project?.auctionOverview?.loanEligiblity != null
                  ? project.auctionOverview.loanEligiblity
                    ? "Yes"
                    : "No"
                  : "NA",
            },
            {
              label: "Rental Yield",
              value: activeTruReportAreaTab?.rentalYield
                ? `${activeTruReportAreaTab?.rentalYield}%`
                : "NA",
            },
            {
              label: "Khata Type",
              value: project?.auctionOverview?.khataType
                ? `${project.auctionOverview.khataType}`
                : "NA",
            },
            {
              label: "Micromarket",
              value: project?.micromarket || "NA",
            },
            {
              label: "Zone",
              value: project?.zone || "NA",
            },
          ]
        : project?.assetType === "plot"
        ? temp3
        : project?.assetType === "villa"
        ? temp3.concat([
            {
              label: "Furnished",
              value: project?.unitDetails[0].furnished || "NA",
            },
            {
              label: "Total Floor",
              value: project?.unitDetails[0].totalFloors
                ? project?.unitDetails[0].totalFloors
                : "NA",
            },
          ])
        : temp3.concat([
            {
              label: "Furnished",
              value: project?.unitDetails[0].furnished || "NA",
            },
            {
              label: "Floor No.",
              value: project?.unitDetails[0].floor || "NA",
            },
          ]);
    if (project?.unitDetails?.[0]?.soldPrice > 0) {
      temp2.push({
        label: "Sold Price",
        value: `₹${project.unitDetails[0].soldPrice.toFixed(2)} Cr`,
      });
    }

    setTempProject2(temp2);
  }, [
    project,
    activeTruReportAreaTab,
    sellingCost,
    holdingPeriod,
    loanPercentage,
  ]);

  useEffect(() => {
    const fetchUserWishlist = async () => {
      try {
        const q = query(
          collection(db, "truEstateUsers"),
          where("phoneNumber", "==", userPhoneNumber)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userId = querySnapshot.docs[0].id;
          // Fetch wishlist using Redux action
          const resultAction = await dispatch(fetchWishlistedProjects(userId));

          if (fetchWishlistedProjects.fulfilled.match(resultAction)) {
            const wishlistItems = resultAction.payload;
            // Check if current project is in wishlist
            if (project) {
              const isProjectWishlisted = wishlistItems.some(
                (item) => item.projectId === project.projectId
              );
              setIsWishlisted(isProjectWishlisted);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user for wishlist:", error);
        setIsWishlisted(false);
      }
    };

    if (userPhoneNumber && isAuthenticated && project) {
      fetchUserWishlist();
    }
  }, [userPhoneNumber, isAuthenticated, project, dispatch]);

  function calculateFinalPrice(reservePrice, cagr, holdingPeriodYears = 1) {
    // cagr should be in decimal form, e.g., 10% as 0.10
    return reservePrice * Math.pow(1 + cagr / 100, holdingPeriodYears);
  }
  function calculateCurrentValue(unit) {
    const area = unit?.sbua || unit?.carpetArea || unit?.plotArea;

    const value =
      area && unit?.truEstimatePrice
        ? ((unit?.truEstimatePrice * area) / 10000000).toFixed(1)
        : "NA";

    return value;
  }
  const toCapitalCase = (str) => {
    return str.replace(/\b\w/g, (c) => c.toUpperCase());
  };
  function formatCostSuffix(value) {
    if (value < 100) {
      return `${value} Lacs`;
    } else {
      const croreValue = (value / 100).toFixed(2).replace(/\.00$/, "");
      return `${croreValue} Cr`;
    }
  }
  const handleTalkToManager = () => {
    const phonenumber = InvManager.phoneNumber;
    const message = encodeURIComponent(
      `Hi, Can you please share auction notice of ${id}: ${
        projectName ? toCapitalCase(projectName) : "a project"
      }`
    );
    const whatsappUrl = `https://wa.me/${phonenumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };
  // Generate investment report
  useEffect(() => {
    if (isAuthenticated && activeTruReportAreaTab && project) {
      setInvestmentOverviewData([
        {
          label: "Minimum Investment",
          value:
            activeTruReportAreaTab?.minInvestment != null &&
            activeTruReportAreaTab?.totalSeats
              ? `₹${formatCostSuffix(
                  activeTruReportAreaTab.minInvestment.toFixed(2)
                )}`
              : "NA",
        },
        {
          label: "Seats Filled",
          value: activeTruReportAreaTab?.seatsFilled
            ? activeTruReportAreaTab.seatsFilled
            : 0,
        },
        {
          label: "Total Seats",
          value: activeTruReportAreaTab?.totalSeats
            ? activeTruReportAreaTab.totalSeats
            : "NA",
        },
        {
          label: "Last Date",
          value:
            activeTruReportAreaTab?.lastDate !== undefined
              ? getUnixDateTime() > activeTruReportAreaTab.lastDate
                ? "Open"
                : formatTimestampDate(activeTruReportAreaTab.lastDate)
              : "NA",
        },
        {
          label: "Reserve Price",
          value: project.unitDetails[0].reservePrice
            ? project.unitDetails[0].reservePrice.toFixed(1)
            : "NA",
        },
        {
          label: "Expected Return",
          value:
            activeTruReportAreaTab?.reservePrice != null &&
            activeTruReportAreaTab?.cagr != null
              ? (
                  calculateFinalPrice(
                    activeTruReportAreaTab.reservePrice,
                    activeTruReportAreaTab.cagr,
                    activeTruReportAreaTab.holdingPeriodYears
                      ? activeTruReportAreaTab.holdingPeriodYears
                      : 1
                  ) - activeTruReportAreaTab.reservePrice
                ).toFixed(1)
              : "NA",
        },
        {
          label: "Market Price",
          value: activeTruReportAreaTab
            ? calculateCurrentValue(activeTruReportAreaTab)
            : "NA",
        },
        {
          label: "Selling Price",
          value:
            project.unitDetails[0].reservePrice != null &&
            activeTruReportAreaTab?.cagr != null
              ? calculateFinalPrice(
                  project.unitDetails[0].reservePrice,
                  project.unitDetails[0].cagr,
                  project.unitDetails[0].holdingPeriodYears
                    ? project.unitDetails[0].holdingPeriodYears
                    : 1
                ).toFixed(1)
              : "NA",
        },
        {
          label: "Exp Return",
          value:
            activeTruReportAreaTab?.cagr != null
              ? `${formatToOneDecimal(activeTruReportAreaTab.cagr)}%`
              : "NA",
        },
        {
          label: "EMD Submission Date",
          value:
            project?.auctionOverview?.emdSubmissionDate !== undefined
              ? getUnixDateTime() > project.auctionOverview.emdSubmissionDate
                ? "Open"
                : formatTimestampDate(project.auctionOverview.emdSubmissionDate)
              : "NA",
        },
        {
          label: "Auction Date",
          value: project?.auctionStatus,
        },
        {
          label: "sbua",
          value:
            activeTruReportAreaTab?.sbua ||
            activeTruReportAreaTab?.carpetArea ||
            activeTruReportAreaTab?.plotArea ||
            "NA",
        },
      ]);
    } else {
      setInvestmentOverviewData([
        { label: "Minimum Investment", value: "__" },
        { label: "Seats Filled", value: "__" },
        { label: "Total Seats", value: "__" },
        { label: "Last Date", value: "__" },

        { label: "Reserve Price", value: "__" },
        { label: "Expected Return", value: "__" },
        { label: "Market Price", value: "__" },
        { label: "Selling Price", value: "__" },
        { label: "Exp Return", value: "__" },
        { label: "EMD Submission Date", value: "__" },
        { label: "Auction Date", value: "__" },
      ]);
    }
  }, [
    project,
    sellingCost,
    activeTruReportAreaTab,
    isAuthenticated,
    holdingPeriod,
    loanPercentage,
  ]);

  if (loading) {
    return (
      <div className="col-span-full flex justify-center my-4 h-[80vh]">
        <Loader />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="col-span-full flex justify-center my-4 h-[80vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600">
            Project Not Found
          </h2>
          <p className="text-gray-500 mt-2">
            The requested project could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MainContentLayout>
        <div
          className={`relative h-full ${
            !isAuthenticated ? `md:px-20 lg:px-24` : ``
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-0">
            <div className="md:col-span-2">
              <div
                className={`px-4 mt-3 mb-3 ${
                  isAuthenticated ? `md:px-8` : `md:px-0`
                }`}
              >
                <MyBreadcrumb />
              </div>

              <div
                className={`h-full w-full px-4 pb-[30px] ${
                  isAuthenticated ? `md:px-8` : `md:px-0`
                }`}
              >
                {/* Project Header */}

                <div className="flex gap-1 flex-wrap md:flex-nowrap mr-4 ">
                  <div className={styles.bigheading}>
                    {project.projectId}
                    {" : "}
                    {project?.projectName
                      ? Object.keys(upperCaseProperties).includes(
                          project?.projectName
                        )
                        ? upperCaseProperties[project?.projectName]
                        : toCapitalizedWords(project?.projectName)
                      : "___"}
                  </div>
                </div>

                {/* Updated on section */}
                <div className="flex md:flex-row mb-4 sm:mb-3 lg:mb-6 mt-[2px]">
                  <div className={`${styles.upd} mr-1`}>Updated on</div>
                  <div className={styles.updt}>
                    {formatTimestampDate(project?.lastModified)}
                  </div>
                </div>

                {/* Badges for both mobile and desktop - now appear after property information */}
                {(activeTruReportAreaTab?.recommended ||
                  (project?.reraId && project?.reraId != "NA") ||
                  (project && activeTruReportAreaTab?.truVerified)) && (
                  <div className="flex gap-2.5 flex-wrap md:flex-nowrap mb-6 md:mb-8">
                    {activeTruReportAreaTab?.recommended && (
                      <img
                        src="/assets/properties/icons/recommended-badge.svg"
                        alt="Recommended"
                        className="w-auto"
                      />
                    )}{" "}
                    {project?.reraId && project?.reraId != "NA" && (
                      <img src={Rera} alt="Rera" className="w-auto" />
                    )}
                    {project && activeTruReportAreaTab?.verified && (
                      <img
                        src={verified}
                        alt="verified"
                        className="h-[26px] w-[81px]"
                      />
                    )}
                  </div>
                )}

                {/* Image Carousel */}
                <div className="relative">
                  {project?.images?.length > 0 ? (
                    <ImageCarousel
                      images={project?.images || []}
                      projectId={project.id}
                      projectName={project.projectName}
                    />
                  ) : (
                    <div className="flex items-center justify-center bg-gray-100">
                      <img
                        src="/assets/properties/images/placeholder.webp"
                        className="object-cover h-[200px] md:h-[360px] w-full rounded-lg"
                        alt="Project placeholder"
                      />
                    </div>
                  )}
                  {isAuthenticated && (
                    <div className="absolute top-0 right-2 flex justify-end space-x-4 mt-2">
                      <img
                        className="w-8 md:w-10 cursor-pointer"
                        src={isWishlisted ? selon : seloff}
                        onClick={() => {
                          toggleWishlist();
                          logEvent(analytics, "click_wishlist_auction", {
                            Name: "click_wishlist_auction",
                          });
                        }}
                        alt="Wishlist"
                      />
                    </div>
                  )}
                </div>

                <hr
                  className="block lg:hidden mt-9"
                  style={{ borderTop: "solid 1px #E3E3E3" }}
                />

                {/* Auction Details Section */}
                <div className="flex-col space-y-2 mb-[36px] mt-[36px] sm:mt-9 sm:mb-[14px]">
                  <div className="flex justify-between mb-[26px] flex-wrap">
                    <h1 className={`${styles.heading} mt-0}`}>
                      Auction Details
                    </h1>

                    <button
                      type="button"
                      onClick={() => {
                        logEvent(analytics, "download_auction_notice");
                        handleTalkToManager();
                      }}
                      className="w-[211px] gap-[6px] h-[37px] flex items-center justify-center border border-GableGreen  text-Black rounded-md px-[8px] py-[6px] font-lato font-bold text-xs transition-all duration-200 mt-2"
                    >
                      <img
                        className=" h-[15px] w-[15px]"
                        src={whatsapp}
                        alt="Download"
                      />
                      <span className="mr-2 text-[#075e54]">
                        Request Auction Notice
                      </span>
                    </button>
                  </div>

                  <h1 className={`${styles.pttruhead} font-[18px]`}>
                    Verification Status
                  </h1>
                  <div className="pt-2 pb-7 mt-[16px]  flex flex-wrap gap-2">
                    <StatusTag
                      label="Legal Verification"
                      status={activeTruReportAreaTab?.legalVerificationStatus}
                    />
                    <StatusTag
                      label="Construction Quality"
                      status={activeTruReportAreaTab?.constructionQualityStatus}
                    />
                    <StatusTag
                      label="Locality Check"
                      status={activeTruReportAreaTab?.localityCheckStatus}
                    />
                  </div>
                  <h1 className={`${styles.pttruhead} mt-6`}>
                    Select Configuration
                  </h1>

                  {/* Configuration tabs */}

                  {/* Area tabs */}
                  {truReportConfigWiseData &&
                    Object.keys(truReportConfigWiseData) &&
                    Object.keys(truReportConfigWiseData).length > 0 &&
                    Object.keys(truReportConfigWiseData).some(
                      (key) => key != null
                    ) && (
                      <TruReportHeading
                        isRounded={false}
                        type={"config"}
                        truReportData={Object.keys(truReportConfigWiseData)}
                        activeTruReportTab={activeTruReportConfigTab}
                        handleChange={handleChangeActiveTruReportConfigTab}
                      />
                    )}
                  {truReportAreaWiseData &&
                    truReportAreaWiseData.length > 0 && (
                      <TruReportHeading
                        assetType={project?.assetType}
                        isRounded={
                          project?.projectType === "commercial" ? false : true
                        }
                        type={
                          project?.unitDetails[0]?.carpetArea
                            ? "carpetArea"
                            : project?.unitDetails[0]?.plotArea
                            ? "plotArea"
                            : "sbua"
                        }
                        truReportData={truReportAreaWiseData}
                        activeTruReportTab={activeTruReportAreaTab}
                        handleChange={handleChangeActiveTruReportAreaTab}
                      />
                    )}
                </div>

                {/* Investment Details */}

                <div className="mb-6 lg:mb-6">
                  <FractionalInvestmentCom
                    data={investmentOverviewData}
                    isReport={false}
                  />
                  <div className="lg:mt-[-30px]">
                    <Overview
                      details={tempproject2}
                      project={project}
                      isReport={false}
                      labelsWithMoreInfo={LABELS_WITH_MORE_INFO.investment}
                    />
                  </div>
                </div>
                {activeTruReportAreaTab?.additionalInfo && (
                  <div className="rounded-lg w-full mb-4 sm:mb-6">
                    <h2
                      className={`mb-2 font-montserrat font-bold text-[1.125rem] leading-[150%] text-[#0A0B0A]`}
                    >
                      Other Details
                    </h2>
                    {activeTruReportAreaTab?.additionalInfo}
                  </div>
                )}
                {activeTruReportAreaTab?.riskInfo && (
                  <div className="rounded-lg w-full mb-4 sm:mb-12">
                    <h2
                      className={`mb-2 font-montserrat font-bold text-[1.125rem] leading-[150%] text-[#0A0B0A]`}
                    >
                      Risks
                    </h2>
                    {activeTruReportAreaTab?.riskInfo}
                  </div>
                )}

                <hr
                  className="mt-6"
                  style={{ borderTop: "solid 1px #E3E3E3" }}
                />

                {/* Location Analysis */}
                {project?.locationAnalysis?.lat &&
                  project?.locationAnalysis?.long && (
                    <LocationAnalysis
                      project={project}
                      filters={data?.locationAnalysis?.filters}
                      defaultMarker={data?.locationAnalysis?.defaultMarker}
                      markers={data?.locationAnalysis?.markers}
                      isAuction={true}
                    />
                  )}sdf

                {/* Mobile Contact Bar */}
                <div
                  className={`z-[9] fixed bottom-0 right-0 bg-[#FAFAFA] lg:hidden border-t ${
                    isAuthenticated
                      ? `md:left-[119px] md:right-[40px] px-4 md:pr-[134px] w-full`
                      : `w-full px-4`
                  }`}
                >
                  <ContactInvestmentManager
                    projectName={project?.projectName}
                    propertyId={project?.projectId}
                    type="auction"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div
              className={`md:col-span-1 ${
                isAuthenticated ? "md:fixed" : "absolute"
              } right-0 md:w-1/4 mt-11 hidden md:block ${
                isAuthenticated ? `mr-8` : `mr-24`
              }`}
            >
              <div className="sticky top-0 pl-6 hidden lg:block">
                <ContactInvestmentManager
                  projectName={project?.projectName}
                  propertyId={project?.projectId}
                  type="auction"
                />
              </div>
            </div>
          </div>
        </div>

        {!isAuthenticated && <Footer />}
      </MainContentLayout>
    </>
  );
};

export default AuctionDetails;
