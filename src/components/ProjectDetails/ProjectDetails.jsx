// ================= ICON IMPORTS ====================
import Rera from "/assets/icons/brands/rera.svg";
import True from "/assets/icons/brands/tru-selected.svg";
import sidelogo from "/assets/icons/brands/truestate-side-logo.svg";
import compon from "/assets/icons/features/compare-active.svg";
import compoff from "/assets/icons/features/compare-inactive.svg";
import selon from "/assets/icons/features/wishlist-active.svg";
import seloff from "/assets/icons/features/wishlist-inactive.svg";
import LitigationIcon from "/assets/icons/status/litigation.svg";
import soldOut from "/assets/icons/status/sold-out.svg";

// ================= COMPONENT IMPORTS ===================
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
import { getInvestmentReport } from "../../slices/reportSlice";
import {
  fetchProjectByName,
  selectCurrentProject,
  selectProjectLoading,
  selectProjectError,
} from "../../slices/projectSlice";
import { setShowSignInModal } from "../../slices/modalSlice.js";
import {
  selectUserPhoneNumber,
  selectUserDocId,
} from "../../slices/userAuthSlice";
import {
  fetchWishlistedProjects,
  updateWishlist,
  selectWishlistItems,
  removeWishlist,
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
  upperCaseProperties,
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

// ================== MAIN COMPONENT ===================
const ProjectDetails = () => {
  const HOLDING_PERIOD = 4; // in years, default
  const params = useParams();
  const { projectName } = params;
  const name = projectName;

  // ============ REDUX STATE EXTRACTION ============
  const project = useSelector(selectCurrentProject);
  const projectLoading = useSelector(selectProjectLoading);
  const projectError = useSelector(selectProjectError);
  const userPhoneNumber = useSelector(selectUserPhoneNumber);
  const userDocId = useSelector(selectUserDocId);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const wishlistItems = useSelector(selectWishlistItems);
  const compareProjects = useSelector(selectCompareProjects);

  // ============ LOCAL STATE ============
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isWishlisted, setIsWishlisted]= useState(false)
  const [isCompared, setIsCompared]= useState(false)
  const [sellingCost, setSellingCost] = useState(300000);
  const { addToast, updateToast } = useToast();
  const tenure = 20;
  const interestRate = 8.5;
  const [loanPercentage, setLoanPercentage] = useState(85);
  const selectedCharge = "Stamp Duty";

  const [investmentOverviewData, setInvestmentOverviewData] = useState([]);
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
    amounttNotDisbursed: null,
  });
  const [projectOverviewDetails, setProjectOverviewDetails] = useState([]);
  const [investmentOverviewDetails, setInvestmentOverviewDetails] = useState(
    []
  );
  const [truReportAreaWiseData, setTruReportAreaWiseData] = useState([]);
  const [truReportConfigWiseData, setTruReportConfigWiseData] = useState(null);
  const [activeTruReportConfigTab, setActiveTruReportConfigTab] =
    useState(null);
  const [activeTruReportAreaTab, setActiveTruReportAreaTab] = useState(null);

  // ===== Comments for info-labels =====
  const labelsWithMoreInfoForProject = {
    TruEstimate: "Our estimate of the current fair value for this project.",
  };
  const labelsWithMoreInfoForInvestment = {
    "Transfer Fees":
      "When selling under-construction properties in India, transfer fees apply and vary from builder to builder.",
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkIsMobile);
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  // ====================================
  //              useEffects
  // ====================================

  const isReport = false;

  useEffect(() => {
    if (project) {
      // Map the necessary fields to the desired label-value format
      console.log(project.projectOverview.pricePerSqft, "asbdassuidduhds");
      const projectOverviewData = [
        {
          label: "Current Price",
          value: project?.projectOverview?.pricePerSqft
            ? `${formatCost(
                parseInt(project?.projectOverview?.pricePerSqft)
              )} / sqft`
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
            ? `${formatCost(
                parseInt(
                  project?.projectOverview?.pricePerSqft *
                    Math.pow(1 + project?.investmentOverview?.cagr / 100, 4)
                )
              )} / sqft`
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
          value: `${
            project?.projectOverview?.launchDate
              ? formatTimestampDateWithoutDate(
                  project?.projectOverview?.launchDate
                )
              : "NA"
          } `,
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
              ? `${parseFloat(
                  project?.projectOverview.totalUnits /
                    project?.projectOverview.projectSize
                ).toFixed(2)} / acre`
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
      console.log("report is", InitialActiveTruReportConfigTab);
      setActiveTruReportAreaTab(InitialActiveTruReportAreaTab);
    }
  }, [project]);

  useEffect(() => {
    if (!project) return;

    // Map the necessary fields to the desired label-value format
    let SellingCost = null;
    if (project?.investmentOverview?.cagr && isAuthenticated) {
      const cagrToConsider = project?.investmentOverview?.cagr / 100;
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
    if (userDocId) {
      dispatch(fetchWishlistedProjects(userDocId));
      dispatch(fetchCompareProjects());
    }
  }, [userPhoneNumber, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Only run when project is loaded and not in loading state
        if (projectLoading || !project) {
          console.log("Skipping useEffect - project loading or null:", {
            projectLoading,
            project: !!project,
          });
          return;
        }

        // For non-plot assets, wait for activeTruReportAreaTab to be initialized
        if (project?.assetType !== "plot" && !activeTruReportAreaTab) {
          console.log(
            "Skipping useEffect - waiting for activeTruReportAreaTab:",
            { assetType: project?.assetType, activeTruReportAreaTab }
          );
          return;
        }

        console.log("asset type is", project?.assetType);
        console.log("my project is", project);

        if (project?.assetType) {
          console.log("data fetched");

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

          // Direct API call instead of Redux dispatch
          const response = await fetch(
            "https://cashflow-calc-dot-iqol-crm.uc.r.appspot.com/api/investmentReport",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          if (!response.ok) {
            throw new Error(
              `API request failed with status ${response.status}`
            );
          }

          const result = await response.json();
          console.log("API response payload:", result);

          // Update results state with the API response
          setResults(result.data);

          // Update financial calculation data
          setFinancialCalculationData({
            booking_amt:
              result.data.monthlyReport && result.data.monthlyReport.length > 0
                ? parseFloat(result.data.monthlyReport[0]?.builderAmount || 0)
                : null,
            intrest: result.data.monthlyReport
              ? result.data.monthlyReport.reduce((sum, month) => {
                  return sum + parseFloat(month.interest || 0);
                }, 0)
              : 0,
            principal: result.data.monthlyReport
              ? result.data.monthlyReport.reduce((sum, month) => {
                  return sum + parseFloat(month.principal || 0);
                }, 0)
              : 0,
            constructionCompletionDate: project?.projectOverview?.handOverDate,
            finalPrice: sellingCost,
            selectedCharge,
            charges_value: result.data.charges_value
              ? parseFloat(result.data.charges_value)
              : null,
            possessionAmount: result.data.possession_amount
              ? parseFloat(result.data.possession_amount)
              : null,
            amounttNotDisbursed: result.data.amount_not_disbursed
              ? parseFloat(result.data.amount_not_disbursed)
              : null,

            // Additional fields that InvestmentBreakdownChart might expect
            transferCharges:
              selectedCharge === "Transfer Fees"
                ? result.data.charges_value
                  ? parseFloat(result.data.charges_value)
                  : null
                : null,
            stampRegCharges:
              selectedCharge === "Stamp Duty"
                ? result.data.charges_value
                  ? parseFloat(result.data.charges_value)
                  : null
                : null,
          });

          console.log("Setting investmentOverviewData with API data");

          // Update investment overview data
          setInvestmentOverviewData([
            {
              label: "Total Investment",
              value: formatCostSuffix(result.data.minInvestment),
            },
            {
              label: "Total Returns",
              value: formatCostSuffix(Math.abs(result.data.total_returns)),
            },
            {
              label: "Price",
              value: `${
                activeTruReportAreaTab?.area
                  ? Math.round(
                      activeTruReportAreaTab.price / activeTruReportAreaTab.area
                    )
                  : "N/A"
              }/ Sq ft`,
            },
            {
              label: "Gross Price",
              value: formatCost(activeTruReportAreaTab?.price || 0),
            },
            {
              label: "XIRR",
              value:
                result.data.xirr > 0
                  ? `+${formatToOneDecimal(result.data.xirr)}%`
                  : result.data.xirr < 0
                  ? `${formatToOneDecimal(result.data.xirr)}%`
                  : "__",
            },
            {
              label: "Equity Multiplier",
              value: `${formatToOneDecimal(result.data.equity_multiplier)}`,
            },
            {
              label: "CAGR",
              value: project?.investmentOverview?.cagr
                ? `${formatToOneDecimal(project?.investmentOverview?.cagr)}%`
                : "N/A",
            },
          ]);

          console.log(
            "Final investmentOverviewData in useEffect:",
            investmentOverviewData
          );
        }
      } catch (err) {
        console.error("Error fetching investment report:", err);
        setError(err.message);
      }
    };

    if (isAuthenticated) {
      fetchData();
    } else {
      console.log("Setting investmentOverviewData for unauthenticated user");
      setInvestmentOverviewData([
        {
          label: "Total Investment",
          value: formatCostSuffix(
            project?.investmentOverview?.minInvestment || 4325342
          ),
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
        constructionCompletionDate: project?.investmentOverview?.handOverDate,
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
    isAuthenticated,
  ]);

  useEffect(()=>{
    wishlistItems.map((item)=>{
      if(item.projectId== project.projectId)
        setIsWishlisted(true)
    })
  },[wishlistItems, project])

  useEffect(()=>{
    compareProjects.map((item)=>{
      if(item.projectId== project.projectId)
        setIsCompared(true)
    })
    console.log("hmm", compareProjects)
    console.log("hmm", project)
  },[compareProjects, project])

  // ====================================
  //            FUNCTIONS
  // ====================================

  const toggleCompare = async () => {
  if (!userDocId || !project?.projectId) {
    addToast(
      "Error",
      "error",
      "Authentication Required",
      "Please log in to manage your compare list."
    );
    return;
  }

  const newState = !isCompared;

  // Optimistically update local UI
  setIsCompared(newState);

  // Show loading toast right away
  const loadingToastId = addToast(
    "Compare",
    "loading",
    newState ? "Adding Property" : "Removing Property",
    newState
      ? "Adding property to compare list..."
      : "Removing property from compare list..."
  );

  try {
    if (newState) {
      // Adding to compare
      if (compareProjects.length < 4) {
        await dispatch(addProjectForComparison(project.projectId)).unwrap();

        updateToast(loadingToastId, {
          type: "success",
          heading: "Property Added",
          description: "The property has been added to the compare list.",
        });
      } else {
        // Revert optimistic update
        setIsCompared(false);

        updateToast(loadingToastId, {
          type: "error",
          heading: "Maximum Limit Reached",
          description: "You can only compare up to 4 properties.",
        });
      }
    } else {
      // Removing from compare
      await dispatch(removeProjectFromComparison(project.projectId)).unwrap();

      updateToast(loadingToastId, {
        type: "error", // 👈 consistent with wishlist removal
        heading: "Property Removed",
        description: "The property has been removed from the compare list.",
      });
    }
  } catch (error) {
    console.error("Error updating compare:", error);

    updateToast(loadingToastId, {
      type: "error",
      heading: "Compare Action Failed",
      description:
        error.message || "Failed to update compare list. Please try again.",
    });

    // Revert optimistic UI update
    setIsCompared(!newState);
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

    const newState = !isWishlisted;

    // Optimistically update the UI
    setIsWishlisted(newState);

    // Show loading toast right away
    const loadingToastId = addToast(
      "Wishlist",
      "loading",
      newState ? "Adding Property" : "Removing Property"
    );

    try {
      const propertyType = "preLaunch"; // or project?.propertyType || 'preLaunch'
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

      if (newState) {
        // Adding to wishlist
        logEvent(analytics, "added-to-wishlist", {
          name: project.projectName,
        });

        await dispatch(
          updateWishlist({
            userId: userDocId,
            propertyType,
            projectId: project.projectId,
            defaults: projectDefaults,
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
            userId: userDocId,
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

  // ====================================
  //           JSX RENDER
  // ====================================

  return (
    <>
      {projectLoading ? (
        <div className={`col-span-full flex justify-center my-4 h-[80vh]`}>
          <Loader />
        </div>
      ) : (
        <>
          <div
            className={`relative h-full  ${
              !isAuthenticated ? `md:px-20 lg:px-24` : ``
            } `}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4  mt-0 ">
              <div className="md:col-span-2 ">
                <div
                  className={`  px-4 mt-3 mb-3 ${
                    isAuthenticated ? `md:px-8 ` : `md:px-0`
                  } `}
                >
                  <MyBreadcrumb />
                </div>

                <div
                  className={`h-full w-full px-4  pb-[30px] ${
                    isAuthenticated ? `md:px-8` : `md:px-0`
                  } `}
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
                    {project &&
                      project?.projectOverview &&
                      project?.projectOverview?.litigation && (
                        <img
                          src={LitigationIcon}
                          alt="Litigation"
                          className="lg:ml-2 w-auto hidden lg:block"
                        />
                      )}
                    {project &&
                      project?.otherData.isReraApproved &&
                      project?.otherData.isReraApproved != "NA" && (
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
                    {project &&
                      project?.otherData.isReraApproved &&
                      project?.otherData.isReraApproved != "NA" && (
                        <img src={Rera} alt="Rera" className=" w-auto" />
                      )}
                    {project &&
                      project?.projectOverview &&
                      project?.projectOverview?.availability === "sold out" && (
                        <img src={soldOut} alt="Sold Out" className="w-auto" />
                      )}
                    {project &&
                      project?.projectOverview &&
                      project?.projectOverview?.litigation && (
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
                          {console.log(
                            "About to render InvestmentOverview with data:",
                            investmentOverviewData
                          )}
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
                            totalInvestment={
                              project?.investmentOverview?.minInvestment
                            }
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

                  {project && <LocationAnalysis project={project} />}
                  {/* <hr style={{ borderTop: 'solid 1px #E3E3E3' }} /> */}
                  <div className="hidden">
                    {/* <Documents documents={data.documents} /> */}
                    <hr style={{ borderTop: "solid 1px #E3E3E3" }} />
                  </div>

                  <div
                    className={`z-[9] fixed bottom-0 right-0  bg-[#FAFAFA] lg:hidden border-t  ${
                      isAuthenticated
                        ? `md:left-[119px] md:right-[40px] px-4 md:pr-[134px] w-full`
                        : `w-full px-4`
                    } `}
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
                  className={`md:col-span-1  ${
                    isAuthenticated ? "md:fixed" : "absolute"
                  } right-0 md:w-1/4  mt-11 hidden md:block ${
                    isAuthenticated ? `mr-8` : `mr-24`
                  } `}
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
