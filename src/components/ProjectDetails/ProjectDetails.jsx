import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";
import { APARTMENT_CONFIGURATION_KEYS } from "../../constants/apartmentTypes";
import { useToast } from "../../hooks/useToast.jsx";
import Footer from "../../landing/pages/home/Footer.jsx";
import {
  fetchCompareProjects,
  removeProjectFromComparison,
  addProjectForComparison,
  selectCompareProjects,
} from "../../slices/compareSlice";
import {
  getInvestmentReport
} from "../../slices/reportSlice";
import {
  fetchProjectByName,
  selectCurrentProject,
  selectProjectLoading,
  selectProjectError,
} from "../../slices/projectSlice";
import { setShowSignInModal } from "../../slices/modalSlice.js";
import { selectUserPhoneNumber, selectUserDocId } from "../../slices/userAuthSlice";
import {
  fetchWishlistedProjects,
  updateWishlist,
  selectWishlistItems,
} from "../../slices/wishlistSlice";
import {
  customRound,
  formatCost,
  formatCostSuffix,
  formatTimestampDate,
  formatTimestampDateWithoutDate,
  formatToOneDecimal,
  getTruGrowthStatus,
  toCapitalizedWords,
  upperCaseProperties
} from "../../utils/common.js";
import MyBreadcrumb from "../BreadCrumbs/Breadcrumb.jsx";
import Loader from "../Loader";
import CashFlowsTable from "./CashFlowsTable";
import ContactInvestmentManager from "./ContactInvManager";
import InvestmentBreakdownChart from "./GanttChart";
import ImageCarousel from "./ImageCarousel";
import InvestmentOverview from "./InvOverview";
import LocationAnalysis from "./LocationAnalysis";
import Overview from "./Overview";
import styles from "./ProjectDetails.module.css";
import TruReportHeading from "./TruReportHeading";
import Rera from "/assets/icons/brands/rera.svg";
import True from "/assets/icons/brands/tru-selected.svg";
import sidelogo from "/assets/icons/brands/truestate-side-logo.svg";
import compon from "/assets/icons/features/compare-active.svg";
import compoff from "/assets/icons/features/compare-inactive.svg";
import selon from "/assets/icons/features/wishlist-active.svg";
import seloff from "/assets/icons/features/wishlist-inactive.svg";
import LitigationIcon from "/assets/icons/status/litigation.svg";
import soldOut from "/assets/icons/status/sold-out.svg";

const ProjectDetails = () => {
  const HOLDING_PERIOD = 4; // in years, default
  const params = useParams();
  const { projectName } = params;
  const name = projectName;

  // Get project data from Redux
  const project = useSelector(selectCurrentProject);
  const projectLoading = useSelector(selectProjectLoading);
  const projectError = useSelector(selectProjectError);

  // labels for which we want hover text on info icon
  const labelsWithMoreInfoForProject = {
    TruEstimate: "Our estimate of the current fair value for this project.",
  };

  const labelsWithMoreInfoForInvestment = {
    "Transfer Fees":
      "When selling under-construction properties in India, transfer fees apply and vary from builder to builder.",
  };

  const navigate = useNavigate();
  // device type
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const userPhoneNumber = useSelector(selectUserPhoneNumber);
  const userDocId = useSelector(selectUserDocId);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // Get wishlist and compare state from Redux
  const wishlistItems = useSelector(selectWishlistItems);
  const compareProjects = useSelector(selectCompareProjects);

  // Determine if current project is wishlisted or compared
  const isWishlisted = wishlistItems.some(item => item.projectId === project?.projectId);
  const isCompared = compareProjects.some(item => item.projectId === project?.projectId);
  const [sellingCost, setSellingCost] = useState(300000);

  const { addToast } = useToast(); // Access the toast function
  const tenure = 20;
  const interestRate = 8.5;
  const [loanPercentage, setLoanPercentage] = useState(85);
  const selectedCharge = "Stamp Duty";

  // data to sent to overview
  const [investmentOverviewData, setInvestmentOverviewData] = useState([]);

  // data to sent to finance
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [financialCalculationData, setFinancialCalculationData] = useState({
    booking_amt: null,
    intrest: null,
    principal: null,
    constructionCompletionDate: null, // handover date
    finalPrice: null, // final selling cost
    selectedCharge, // transfer fee or stamp duty & reg charges
    charges_value: null, // value of the above charge
    possessionAmount: null,
    amounttNotDisbursed: null, // loan amount not disbursed till last
  });
  const [projectOverviewDetails, setProjectOverviewDetails] = useState([]);
  const [investmentOverviewDetails, setInvestmentOverviewDetails] = useState([]);

  // data to sent to TruReportHeading

  const [truReportAreaWiseData, setTruReportAreaWiseData] = useState([]); // super built up for apartment,etc and  plot area for plot
  const [truReportConfigWiseData, setTruReportConfigWiseData] = useState(null); // configurations for apartment, etc (not for plots)
  const [activeTruReportConfigTab, setActiveTruReportConfigTab] =
    useState(null); // currently active config tab
  const [activeTruReportAreaTab, setActiveTruReportAreaTab] = useState(null); // currently active area tab

  // const [showConfirmationModal, setShowConfirmationModal] = useState(true);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkIsMobile);
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);


  const handleShare = async () => {
    try {
      // Get the current URL
      const currentUrl = window.location.href;

      // Try to use the modern navigator.clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentUrl);
        addToast(
          "Dummy",
          "success",
          "Link Copied!",
          "Project link has been copied to clipboard"
        );
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = currentUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        addToast(
          "Dummy",
          "success",
          "Link Copied!",
          "Project link has been copied to clipboard"
        );
      }
    } catch (error) {
      addToast(
        "Dummy",
        "error",
        "Share Failed",
        "Unable to copy link to clipboard"
      );
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCompareProjects());
  }, [dispatch]);


  const isReport = false;

  useEffect(() => {
    if (project) {
      // Map the necessary fields to the desired label-value format

      const projectOverviewData = [
        {
          label: "Current Price",
          value: project?.projectOverview?.pricePerSqft
            ? `${formatCost(parseInt(project?.projectOverview?.pricePerSqft))} / sqft`
            : "NA",
        },
        {
          label: "TruEstimate",
          value: !isAuthenticated
            ? null
            : project?.truEstimate
              ? `${formatCost(project?.truEstimate)} / sqft`
              : "NA",
        },
        {
          label: "Est. Price in 4 Yrs",
          value: !isAuthenticated
            ? null
            : project?.investmentOverview.cagr &&
              project?.projectOverview?.pricePerSqft
              ? `${formatCost(parseInt(project?.projectOverview?.pricePerSqft * Math.pow(1 + project?.investmentOverview?.cagr / 100, 4)))} / sqft`
              : "NA",
        },
        { label: "Value", value: project?.investmentOverview.value || "NA" },
        {
          label: "CAGR",
          value: project?.investmentOverview.cagr
            ? getTruGrowthStatus(project?.investmentOverview.cagr)
            : "NA",
        },
        { label: "Developer", value: project?.builder || "NA" },
        { label: "Asset Type", value: project?.assetType || "NA" },
        { label: "Micro Market", value: project?.micromarket || "NA" },
        { label: "Zone", value: project?.projectOverview.zone || "NA" },
        {
          label: "Total Units",
          value: customRound(project?.projectOverview.totalUnits) || "NA",
        },
        {
          label: "Project Area",
          value: project?.projectOverview.projectSize
            ? `${customRound(project?.projectOverview.projectSize)} Acres`
            : "NA",
        },
        {
          label:
            project?.reraId && project.reraId != "N/A"
              ? "Launch Date"
              : "Est. Launch Date",
          value: `${project?.projectOverview?.launchDate ? formatTimestampDateWithoutDate(project?.projectOverview?.launchDate) : "NA"} `,
        },
        {
          label:
            project?.reraId && project.reraId != "N/A"
              ? "Handover Date"
              : "Est. Handover Date",
          value: project?.projectOverview?.handOverDate
            ? formatTimestampDateWithoutDate(
              project?.projectOverview?.handOverDate
            )
            : "NA",
        },
        {
          label: "Open Area",
          value: project?.projectOverview.openArea
            ? project?.projectOverview.openArea + "%"
            : "NA",
        }, // Using truGrowth for Age but replace as needed
        {
          label: "Project Density",
          value:
            project?.projectOverview.totalUnits != "NA" &&
              project?.projectOverview.totalUnits &&
              project?.projectOverview.projectSize
              ? `${parseFloat(project?.projectOverview.totalUnits / project?.projectOverview.projectSize).toFixed(2)} / acre`
              : "NA",
        },
        {
          label: "Stage",
          value: project?.projectOverview.stage
            ? `${toCapitalizedWords(project?.projectOverview.stage)}`
            : "NA",
        },
      ];

      // Update the state
      setProjectOverviewDetails(projectOverviewData);

      // truReport logic begins from here

      let InitialActiveTruReportAreaTab = null;
      let InitialActiveTruReportConfigTab = null;
      let TruReportConfigWiseData = {};

      // if asset is apartment,villa then set truReportConfigWiseData and truReportAreaWiseData
      // Helper function to convert configuration keys to display names
      const getConfigDisplayName = (configKey) => {
        const displayNames = {
          studio: "Studio",
          oneBHK: "1 BHK",
          oneBHKPlus: "1.5 BHK",
          twoBHK: "2 BHK",
          twoBHKPlus: "2.5 BHK",
          threeBHK: "3 BHK",
          threeBHKPlus: "3.5 BHK",
          fourBHK: "4 BHK",
          fourBHKPlus: "4.5 BHK",
          fiveBHK: "5 BHK",
          fiveBHKPlus: "5.5 BHK",
          sixBHK: "6 BHK",
        };

        return displayNames[configKey] || configKey;
      };

      // For apartments and villas - process configuration object
      if (project.configuration && project?.assetType !== "plot") {
        if (project?.assetType === "apartment") {
          // Process ConfigurationApartment
          const configKeys = APARTMENT_CONFIGURATION_KEYS;

          configKeys.forEach((configKey) => {
            const configData = project.configuration[configKey];
            if (configData && configData.length > 0) {
              configData.forEach((eachData) => {
                if (eachData.available) {
                  // Only process available units
                  const configName = getConfigDisplayName(configKey);

                  TruReportConfigWiseData[configName] &&
                    TruReportConfigWiseData[configName].length > 0
                    ? TruReportConfigWiseData[configName].push({
                      area: eachData?.sbua,
                      price: eachData?.currentPrice,
                    })
                    : (TruReportConfigWiseData[configName] = [
                      {
                        area: eachData?.sbua,
                        price: eachData?.currentPrice,
                      },
                    ]);
                }
              });
            }
          });
        } else if (project?.assetType === "villa") {
          // Process ConfigurationVilla array
          project.configuration.forEach((eachData) => {
            const configName = "Villa";

            TruReportConfigWiseData[configName] &&
              TruReportConfigWiseData[configName].length > 0
              ? TruReportConfigWiseData[configName].push({
                area:
                  eachData?.landDetails?.sbua ||
                  eachData?.landDetails?.landArea,
                price:
                  eachData?.pricePerSqft *
                  (eachData?.landDetails?.sbua || eachData?.plotArea),
              })
              : (TruReportConfigWiseData[configName] = [
                {
                  area:
                    eachData?.landDetails?.sbua ||
                    eachData?.landDetails?.landArea,
                  price:
                    eachData?.pricePerSqft *
                    (eachData?.landDetails?.sbua || eachData?.plotArea),
                },
              ]);
          });
        }

        if (
          TruReportConfigWiseData &&
          Object.values(TruReportConfigWiseData).length > 0
        ) {
          setTruReportConfigWiseData(TruReportConfigWiseData);
          setTruReportAreaWiseData(
            Object.values(TruReportConfigWiseData)[0].sort(
              (a, b) => a.area - b.area
            )
          );

          InitialActiveTruReportConfigTab = Object.keys(
            TruReportConfigWiseData
          )[0];
          InitialActiveTruReportAreaTab = Object.values(
            TruReportConfigWiseData
          )[0][0];
        }
      }

      // If asset is plot then set only truReportAreaWiseData
      if (
        project.configuration &&
        project.configuration.length > 0 &&
        project?.assetType === "plot"
      ) {
        const TruReportAreaWiseData = project.configuration.map((eachData) => ({
          area: eachData?.plotArea,
          price: eachData?.pricePerSqft * eachData?.plotArea,
        }));
        setTruReportAreaWiseData(
          TruReportAreaWiseData.sort((a, b) => a.area - b.area)
        );
        InitialActiveTruReportAreaTab = TruReportAreaWiseData[0];
      }

      setActiveTruReportConfigTab(InitialActiveTruReportConfigTab);
      console.log("report is", InitialActiveTruReportConfigTab)
      setActiveTruReportAreaTab(InitialActiveTruReportAreaTab);
    }
  }, [project]);

  useEffect(() => {
    if (!project) return;

    // Map the necessary fields to the desired label-value format
    let SellingCost = null;
    if (project?.investmentOverview?.cagr && isAuthenticated) {
      const cagrToConsider = project?.investmentOverview?.cagr / 100;
      console.log("Here is the donnn", activeTruReportAreaTab);
      SellingCost = parseInt(
        activeTruReportAreaTab?.price *
        Math.pow(1 + cagrToConsider, HOLDING_PERIOD)
      );

      setSellingCost(SellingCost);
    } else if (isAuthenticated) {
      SellingCost = parseInt(1.75 * activeTruReportAreaTab?.price);
      setSellingCost(SellingCost);
    }

    const investmentDetailsData = [
      {
        label: "Availability",
        value: project?.projectOverview.availability || "NA",
      },
      {
        label: "Selling Price",
        value: !isAuthenticated
          ? null
          : sellingCost
            ? formatCostSuffix(SellingCost)
            : "NA",
      },
      {
        label: "Current Price",
        value:
          formatCostSuffix(
            parseInt(
              activeTruReportAreaTab?.area *
              project?.projectOverview?.pricePerSqft
            )
          ) || "NA",
      },
      // { label: "Duration", value: project?.handOverDate ? `${parseInt(project?.handOverDate.split("/")[1]) - date.getFullYear() + 1} Years` : "N/A"},
      { label: "Duration", value: "4 Years" },
      { label: "Loan Tenure", value: `${tenure} Years` || "NA" },
      { label: "Loan Percentage", value: `${loanPercentage}%` || "NA" },
      {
        label: "Transfer Fees",
        value: `${project?.tranferFee || "2%"} `,
      },
      { label: "Interest Rate", value: `${`${interestRate}%` || "NA"} ` },
    ];

    // Update the state
    setInvestmentOverviewDetails(investmentDetailsData);
  }, [project, activeTruReportAreaTab, sellingCost]);

  useEffect(() => {
    if (name) {
      dispatch(fetchProjectByName(name));
    }
  }, [name, dispatch]);

  // Handle loan percentage based on asset type
  useEffect(() => {
    if (project?.assetType === "plot") {
      setLoanPercentage(75);
    }
  }, [project]);

  // Initialize wishlist and compare data when component mounts
  useEffect(() => {
    if (userPhoneNumber) {
      dispatch(fetchWishlistedProjects(userPhoneNumber));
      dispatch(fetchCompareProjects());
    }
  }, [userPhoneNumber, dispatch]);


  const toggleCompare = () => {
    if (!userDocId || !project?.projectId) {
      addToast(
        "Error",
        "error",
        "Authentication Required",
        "Please log in to manage your compare list."
      );
      return;
    }

    try {
      if (isCompared) {
        dispatch(removeProjectFromComparison(project.projectId));
        addToast(
          "Success",
          "success",
          "Property Removed from Compare",
          "The property has been removed from the compare list."
        );
      } else {
        if (compareProjects.length < 4) {
          dispatch(addProjectForComparison({
            projectId: project.projectId,
            projectName: project.projectName,
            // Add other necessary project data
          }));
          addToast(
            "Success",
            "success",
            "Property Added to Compare",
            "The property has been added to the compare list."
          );
        } else {
          addToast(
            "Error",
            "error",
            "Maximum Limit Reached",
            "Maximum 4 properties can be compared"
          );
        }
      }
    } catch (error) {
      console.error("Error updating compare:", error);
      addToast(
        "Error",
        "error",
        "Compare Action Failed",
        "Failed to update compare list. Please try again."
      );
    }
  };


  const toggleWishlist = async () => {
    if (!userDocId || !project?.projectId) {
      addToast(
        "Error",
        "error",
        "Authentication Required",
        "Please log in to manage your wishlist."
      );
      return;
    }

    try {
      const propertyType = 'auction'; // Default to auction, update this based on your project structure
      const projectDefaults = {
        projectName: project.projectName,
        builderName: project.builderName,
        location: project.location,
        minArea: project.minArea,
        maxArea: project.maxArea,
        minPricePerSqft: project.minPricePerSqft,
        maxPricePerSqft: project.maxPricePerSqft,
        possession: project.possession,
        image: project.image,
        configuration: project.configuration || null,
        projectOverview: project?.projectOverview || null,
        investmentOverview: project.investmentOverview || null,
      };

      const resultAction = await dispatch(
        updateWishlist({
          userId: userDocId,
          propertyType,
          projectId: project.projectId,
          defaults: projectDefaults,
        })
      );

      if (updateWishlist.fulfilled.match(resultAction)) {
        const isAdded = !isWishlisted;
        addToast(
          "Success",
          "success",
          "Wishlist Updated",
          isAdded
            ? `${project.projectName} added to wishlist!`
            : `${project.projectName} removed from wishlist!`
        );
      } else {
        addToast(
          "Error",
          "error",
          "Wishlist Action Failed",
          resultAction.payload || "Failed to update wishlist. Please try again."
        );
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      addToast(
        "Error",
        "error",
        "Wishlist Action Failed",
        "An unexpected error occurred. Please try again."
      );
    }
  };

  const handleViewMore = () => {
    if (isAuthenticated) {
      navigate(`/properties/${project.projectName}/report`);
    } else {
      dispatch(
        setShowSignInModal({
          showSignInModal: true,
          redirectUrl: `/properties/${project.projectName}`,
        })
      );
    }
  };



  const handleChangeActiveTruReportAreaTab = (tab) => {
    setActiveTruReportAreaTab(tab);
  };

  const handleChangeActiveTruReportConfigTab = (tab) => {
    setActiveTruReportConfigTab(tab);
    setTruReportAreaWiseData(
      truReportConfigWiseData[tab].sort((a, b) => a.area - b.area)
    );
    setActiveTruReportAreaTab(truReportConfigWiseData[tab][0]);
  };

  // useEffect for generating the report with the default values

  useEffect(() => {
    // Only run when project is loaded and not in loading state
    if (projectLoading || !project) {
      console.log("Skipping useEffect - project loading or null:", { projectLoading, project: !!project });
      return;
    }

    // For non-plot assets, wait for activeTruReportAreaTab to be initialized
    if (project?.assetType !== "plot" && !activeTruReportAreaTab) {
      console.log("Skipping useEffect - waiting for activeTruReportAreaTab:", { assetType: project?.assetType, activeTruReportAreaTab });
      return;
    }

    const fetchData = async () => {
      try {
        if (project?.assetType) {

          const payload = {
            acquisitionPrice: activeTruReportAreaTab?.price || 500000,
            tenure,
            holdingPeriod: HOLDING_PERIOD,
            constructionCompletionDate: project?.projectOverview?.handOverDate,
            finalPrice: sellingCost || 600000,
            interestRate,
            selectedCharge,
            assetType: project?.assetType,
          };
          console.log("Sending payload to investment report API:", payload);
          console.log("activeTruReportAreaTab:", activeTruReportAreaTab);
          const resultAction = await dispatch(getInvestmentReport(payload));

          if (getInvestmentReport.fulfilled.match(resultAction)) {
            const apiData = resultAction.payload;
            console.log("API response payload:", apiData);
            setResults(apiData);
          setFinancialCalculationData({
            booking_amt: apiData.monthly_cf && apiData.monthly_cf.length > 0 ? parseFloat(apiData.monthly_cf[0][8] || 0) : null,
            intrest: apiData.total_interest || 0,
            principal: apiData.total_principal || 0,
            constructionCompletionDate: project?.projectOverview?.handOverDate, // handover date
            finalPrice: sellingCost, // final selling cost
            selectedCharge, // transfer fee or stamp duty & reg charges
            charges_value: apiData.charges_value ? parseFloat(apiData.charges_value) : null, // value of the above charge
            possessionAmount: apiData.possession_amount ? parseFloat(apiData.possession_amount) : null,
            amounttNotDisbursed: apiData.amount_not_disbursed ? parseFloat(apiData.amount_not_disbursed) : null, // loan amount not disbursed till last

            // Additional fields that InvestmentBreakdownChart might expect
            transferCharges: selectedCharge === "Transfer Fees" ? (apiData.charges_value ? parseFloat(apiData.charges_value) : null) : null,
            stampRegCharges: selectedCharge === "Stamp Duty" ? (apiData.charges_value ? parseFloat(apiData.charges_value) : null) : null,
          });

          console.log(apiData.minInvestment, "apiData.minInvestment");
          console.log("Setting investmentOverviewData with API data");

          setInvestmentOverviewData([
            {
              label: "Total Investment",
              value: formatCostSuffix(apiDatada.minInvestment), // Use minInvestment directly from apiData
            },
            {
              label: "Total Returns",
              value: formatCostSuffix(Math.abs(apiData.total_returns)), // total_returns is at root level
            },
            {
              label: "Price",
              value: `${activeTruReportAreaTab?.area ? Math.round(activeTruReportAreaTab.price / activeTruReportAreaTab.area) : 'N/A'}/ Sq ft`,
            },
            {
              label: "Gross Price",
              value: formatCost(activeTruReportAreaTab?.price || 0),
            },
            {
              label: "XIRR",
              value:
                apiData.xirr > 0
                  ? `+${formatToOneDecimal(apiData.xirr)}% ` // xirr is at root level
                  : apiData.xirr < 0
                    ? `${formatToOneDecimal(apiData.xirr)}%`
                    : "__",
            },
            {
              label: "Equity Multiplier",
              value: `${formatToOneDecimal(apiData.equity_multiplier)}`, // equity_multiplier is at root level
            },
            {
              label: "CAGR",
              value: project?.investmentOverview?.cagr
                ? `${formatToOneDecimal(project?.investmentOverview?.cagr)}%`
                : "N/A",
            },
          ]);
          } else {
            console.error('Failed to fetch investment report:', resultAction.payload);
          }
        }
        console.log("Final investmentOverviewData in useEffect:", investmentOverviewData);

        // setting investment overview data
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    if (isAuthenticated) fetchData();
    else {
      console.log("Setting investmentOverviewData for unauthenticated user");
      setInvestmentOverviewData([
        {
          label: "Total Investment",
          value: formatCostSuffix(project?.investmentOverview.minInvestment || 4325342),
        },
        {
          label: "Total Returns",
          value: null,
        },

        {
          label: "Price",
          value: null,
        },
        {
          label: "Gross Price",
          value: null,
        },
        {
          label: "XIRR",
          value: null,
        },
        {
          label: "Equity Multiplier",
          value: null,
        },
        {
          label: "CAGR",
          value: null,
        },
      ]);

      setFinancialCalculationData({
        booking_amt: null,
        intrest: null,
        principal: null,
        constructionCompletionDate: `${project?.investmentOverview?.handOverDate}`, // handover date
        finalPrice: null,
        selectedCharge,
        charges_value: null,
        possessionAmount: null,
        amounttNotDisbursed: null,
      });
    }
  }, [
    project,
    projectLoading,
    tenure,
    interestRate,
    loanPercentage,
    selectedCharge,
    sellingCost,
    activeTruReportAreaTab,
    dispatch,
    isAuthenticated
  ]);


  return (
    <>
      {projectLoading ? (
        <div className={`col-span-full flex justify-center my-4 h-[80vh]`}>
          <Loader />
        </div>
      )  : (
        <>

          <div
            className={`relative h-full  ${!isAuthenticated ? `md:px-20 lg:px-24` : ``} `}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4  mt-0 ">
              <div className="md:col-span-2 ">
                <div
                  className={`  px-4 mt-3 mb-3 ${isAuthenticated ? `md:px-8 ` : `md:px-0`} `}
                >
                  <MyBreadcrumb />
                </div>

                <div
                  className={`h-full w-full px-4  pb-[30px] ${isAuthenticated ? `md:px-8` : `md:px-0`} `}
                >
                  <div className="flex gap-2.5 flex-wrap md:flex-nowrap ">
                    <div className={styles.bigheading}>
                      {project?.projectName
                        ? Object.keys(upperCaseProperties).includes(
                          project?.projectName
                        )
                          ? upperCaseProperties[project?.projectName]
                          : toCapitalizedWords(project?.projectName)
                        : "___"}
                    </div>
                    {project && project.showOnTruEstate && (
                      <img
                        src={True}
                        alt="True Selected"
                        className="lg:ml-2 w-auto hidden lg:block"
                      />
                    )}
                    {project && project?.projectOverview && project?.projectOverview?.litigation && (
                      <img
                        src={LitigationIcon}
                        alt="Litigation"
                        className="lg:ml-2 w-auto hidden lg:block"
                      />
                    )}
                    {project && project?.otherData.isReraApproved && project?.otherData.isReraApproved != "NA" && (
                      <img
                        src={Rera}
                        alt="Rera"
                        className="lg:ml-2 w-auto hidden lg:block"
                      />
                    )}
                    {project &&
                      project?.projectOverview &&
                      project?.projectOverview?.availability === "sold out" && (
                        <img
                          src={soldOut}
                          alt="Sold Out"
                          className="lg:ml-2 w-auto hidden lg:block"
                        />
                      )}
                  </div>
                  <div className="flex md:flex-row mb-4 sm:mb-3 lg:mb-6 mt-[2px]">
                    <div className={`${styles.upd} mr-1`}>Updated on</div>
                    <div className={styles.updt}>
                      {project?.lastUpdated
                        ? formatTimestampDate(project?.lastUpdated)
                        : "17 Nov 2024"}
                    </div>
                  </div>

                  <div className="flex gap-2.5 flex-wrap md:flex-nowrap mb-6 md:mb-8 lg:hidden">
                    {project && project.showOnTruEstate && (
                      <img src={True} alt="True Selected" className=" w-auto" />
                    )}
                    {project && project?.otherData.isReraApproved && project?.otherData.isReraApproved != "NA" && (
                      <img src={Rera} alt="Rera" className=" w-auto" />
                    )}
                    {project &&
                      project?.projectOverview &&
                      project?.projectOverview?.availability === "sold out" && (
                        <img src={soldOut} alt="Sold Out" className="w-auto" />
                      )}
                    {project && project?.projectOverview && project?.projectOverview?.litigation && (
                      <img
                        src={LitigationIcon}
                        alt="Litigation"
                        className="lg:ml-2 w-auto lg:hidden "
                      />
                    )}
                  </div>

                  <div className="relative ">
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
                        />
                      </div>
                    )}
                    {isAuthenticated && (
                      <div className="absolute top-0 right-2 flex justify-end space-x-4 my-2 ">
                        <img
                          className={`{styles.proj_detail_icon} w-8 md:w-10`}
                          src={isCompared ? compon : compoff}
                          onClick={() => {
                            toggleCompare();
                            logEvent(analytics, `click_compare_property`, {
                              Name: `click_compare_property`,
                            });
                          }}
                          alt="Compare"
                          style={{ cursor: "pointer" }}
                        />
                        <img
                          className={`{styles.proj_detail_icon} w-8 md:w-10`}
                          src={isWishlisted ? selon : seloff}
                          onClick={() => {
                            toggleWishlist();
                            logEvent(analytics, `click_wishlist_property`, {
                              Name: `click_wishlist_property`,
                            });
                          }}
                          alt="Star"
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    )}
                  </div>
                  <hr
                    className="block lg:hidden"
                    style={{ borderTop: "solid 1px #E3E3E3" }}
                  />
                  <Overview
                    title="Project Overview"
                    details={projectOverviewDetails}
                    project={project}
                    isReport={isReport}
                    labelsWithMoreInfo={labelsWithMoreInfoForProject}
                  />
                  <hr style={{ borderTop: "solid 1px #E3E3E3" }} />

                  <div className="flex-col space-y-2 ml-0 mb-7  mt-9 sm:mt-9  sm:mb-10 ">
                    <div className="flex space-x-1 mt-0  mb-5">
                      <img
                        src={sidelogo}
                        alt="brand"
                        className="h-5 w-5 mt-2"
                      />
                      <h1 className={`${styles.heading} mt-0 `}>TruReport</h1>
                    </div>

                    <h1 className={styles.pttruhead}>Select Configuration</h1>

                    {/* For apartment projects - check if only 2BHK configuration exists and has limited data */}
                    {/* Check if apartment has limited configuration data (only 2BHK with minimal info) */}
                    {project?.assetType === "apartment" &&
                      project?.configuration?.twoBHK?.length === 1 &&
                      Object.keys(project?.configuration || {}).filter(
                        (key) =>
                          project?.configuration[key] &&
                          Array.isArray(project?.configuration[key]) &&
                          project?.configuration[key].length > 0
                      ).length === 1 &&
                      Object.keys(project?.configuration || {})
                        .filter(
                          (key) =>
                            project?.configuration[key] &&
                            Array.isArray(project?.configuration[key]) &&
                            project?.configuration[key].length > 0
                        )
                        .includes("twoBHK") && (
                        <div
                          className={`font-lato mt-1 font-medium text-[14px] text-[red]`}
                        >
                          * We don't have the project's configuration, so we're
                          considering it only for analysis
                        </div>
                      )}

                    {/* Alternative: Check if apartment has no meaningful configuration data at all */}
                    {project?.assetType === "apartment" &&
                      (!project?.configuration ||
                        Object.keys(project?.configuration || {}).every(
                          (key) =>
                            !project?.configuration[key] ||
                            !Array.isArray(project?.configuration[key]) ||
                            project?.configuration[key].length === 0
                        )) && (
                        <div
                          className={`font-lato mt-1 font-medium text-[14px] text-[red]`}
                        >
                          * We don't have the project's configurations yet.
                          We'll be updating soon!
                        </div>
                      )}

                    {/* Simplified version: Check if only has minimal data */}
                    {project?.assetType === "apartment" &&
                      project?.configuration &&
                      Object.values(project?.configuration || {}).filter(
                        (arr) => Array.isArray(arr) && arr.length > 0
                      ).length === 1 &&
                      project?.configuration?.twoBHK?.length === 1 && (
                        <div
                          className={`font-lato mt-1 font-medium text-[14px] text-[red]`}
                        >
                          * We don't have the project's configuration, so we're
                          considering it only for analysis
                        </div>
                      )}

                    {/* For plot projects - check if configuration array is empty */}
                    {project?.assetType === "plot" &&
                      (!project?.configuration ||
                        project?.configuration?.length === 0) && (
                        <div
                          className={`font-lato mt-1 font-medium text-[14px] text-[red]`}
                        >
                          * We don't have the project's configurations yet.
                          We'll be updating soon!
                        </div>
                      )}

                    {/* Alternative approach for apartment - check if no meaningful configuration data exists */}
                    {project?.assetType === "apartment" &&
                      (!project?.configuration ||
                        Object.values(project?.configuration).every(
                          (config) => !config || config.length === 0
                        )) && (
                        <div
                          className={`font-lato mt-1 font-medium text-[14px] text-[red]`}
                        >
                          * We don't have the project's configurations yet.
                          We'll be updating soon!
                        </div>
                      )}

                    {/* For villa projects - similar check */}
                    {project?.assetType === "villa" &&
                      (!project?.configuration ||
                        project?.configuration?.length === 0) && (
                        <div
                          className={`font-lato mt-1 font-medium text-[14px] text-[red]`}
                        >
                          * We don't have the project's configurations yet.
                          We'll be updating soon!
                        </div>
                      )}

                    {truReportConfigWiseData &&
                      Object.keys(truReportConfigWiseData) &&
                      Object.keys(truReportConfigWiseData).length > 0 && (
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
                          isRounded={true}
                          type={"area"}
                          truReportData={truReportAreaWiseData}
                          activeTruReportTab={activeTruReportAreaTab}
                          handleChange={handleChangeActiveTruReportAreaTab}
                        />
                      )}
                  </div>

                  {project?.assetType === "plot" &&
                    project?.configurations?.length === 0 ? (
                    <></>
                  ) : (
                    <>
                      {
                        <div className="mb-9  lg:mb-12 ">
                          {console.log("About to render InvestmentOverview with data:", investmentOverviewData)}
                          <InvestmentOverview
                            data={investmentOverviewData}
                            isReport={isReport}
                          />
                          <div className="lg:mt-[-30px]">
                            <Overview
                              details={investmentOverviewDetails}
                              project={project}
                              isReport={isReport}
                              labelsWithMoreInfo={
                                labelsWithMoreInfoForInvestment
                              }
                            />
                          </div>
                          <InvestmentBreakdownChart
                            data2={financialCalculationData}
                            totalInvestment={project?.investmentOverview?.minInvestment}
                            holdingPeriod={HOLDING_PERIOD}
                            results={results}
                          />
                          {isAuthenticated ? (
                            <CashFlowsTable
                              isMobile={isMobile}
                              data={results}
                              data2={financialCalculationData}
                              isAuthenticated={isAuthenticated}
                            />
                          ) : (
                            <CashFlowsTable
                              isMobile={isMobile}
                              data={results}
                              data2={financialCalculationData}
                              isAuthenticated={isAuthenticated}
                            />
                          )}
                        </div>
                      }
                      <div
                        className={`${styles.ReportCTAdiv} lg:mb-12 bg-[radial-gradient(50%_553.77%_at_50%_50%,_#014E47_0%,_#10302D_100%)]`}
                      >
                        <div className="text-center items-center flex flex-col gap-4">
                          <p
                            id="step-2"
                            className={`${styles.ReportCTAh} text-white`}
                          >
                            Create and analyze a custom report for this project
                          </p>
                          <button
                            className={`${styles.ReportCTAbtn} border border-white`}
                            onClick={() => {
                              handleViewMore();
                              logEvent(analytics, "click_create_report", {
                                Name: "create_report",
                              });
                            }}
                          >
                            <p className={`${styles.ReportBtnTxt} text-white`}>
                              Create Report
                            </p>
                            {/* <img src={arrright} className="ml-2" /> */}
                          </button>
                        </div>
                      </div>
                      <hr style={{ borderTop: "solid 1px #E3E3E3" }} />
                    </>
                  )}

                  {project && (
                    <LocationAnalysis
                      project={project}
                    />
                  )}
                  {/* <hr style={{ borderTop: 'solid 1px #E3E3E3' }} /> */}
                  <div className="hidden">
                    {/* <Documents documents={data.documents} /> */}
                    <hr style={{ borderTop: "solid 1px #E3E3E3" }} />
                  </div>

                  <div
                    className={`z-[9] fixed bottom-0 right-0  bg-[#FAFAFA] lg:hidden border-t  ${isAuthenticated ? `md:left-[119px] md:right-[40px] px-4 md:pr-[134px] w-full` : `w-full px-4`} `}
                  >
                    <ContactInvestmentManager
                      projectName={project?.projectName}
                      propertyId={project?.projectId}
                    />
                  </div>
                </div>
              </div>
              {
                <div
                  className={`md:col-span-1  ${isAuthenticated ? "md:fixed" : "absolute"} right-0 md:w-1/4  mt-11 hidden md:block ${isAuthenticated ? `mr-8` : `mr-24`} `}
                >
                  <div className="sticky">
                    <div className={`sticky top-0  pl-6 hidden lg:block   `}>
                      <ContactInvestmentManager
                        projectName={project?.projectName}
                        propertyId={project?.projectId}
                      />
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
          {!isAuthenticated && <Footer />}
        </>
      )}
    </>
  );
};

export default ProjectDetails;
