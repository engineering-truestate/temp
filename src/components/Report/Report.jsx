import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Finance from "../Finance";
// import { selectUserEmail } from '../../slices/userAuthSlice';
import close from "/assets/icons/navigation/btn-close-alt.svg";
import reset from "/assets/icons/actions/btn-reset.svg";
import toggle from "/assets/icons/ui/toggle.svg";
import {
  formatCost,
  formatCostSuffix,
  formatTimestampDateWithoutDate,
  formatToOneDecimal,
} from "../../utils/common";
import { createReport } from "../../utils/investmentReport.js";
import MyBreadcrumb from "../BreadCrumbs/Breadcrumb.jsx";
import styles1 from "../ProjectDetails/ProjectDetails.module.css";
import CustomSlider from "./CustomSlider"; // Import the custom slider
import MonthlyCashFlowTable from "./MonthlyCashFlowTable";
import styles from "./Report.module.css";
import { logEvent } from "firebase/analytics";
import { analytics, db } from "../../firebase.js";
import { formatMonthYear, toCapitalizedWords } from "../../utils/common.js";
import { APARTMENT_CONFIGURATION_KEYS } from "../../constants/apartmentTypes";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useSelector } from "react-redux";

const charges = ["Transfer Fees", "Stamp Duty"];

const Report = ({ data }) => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const { projectName } = params;
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  console.log(params);
  // const { project } = location.state || {};
  const [project, setProject] = useState(null);

  const [truReportAreaWiseData, setTruReportAreaWiseData] = useState([]); // super built up for apartment,etc and  plot area for plot
  const [truReportConfigWiseData, setTruReportConfigWiseData] = useState(null); // configurations for apartment, etc (not for plots)
  const [activeTruReportConfigTab, setActiveTruReportConfigTab] =
    useState(null); // currently active config tab
  const [activeTruReportAreaTab, setActiveTruReportAreaTab] = useState(null); // currently active area tab

  const [selectedCharge, setSelectedCharge] = useState("Stamp Duty"); // Default to stamp duty
  const [loanPercentage, setLoanPercentage] = useState(
    project?.assetType === "plot" ? 75 : 85
  ); // Default to 80
  const [interestRate, setInterestRate] = useState(8.5); // Default to 8.5
  const [tenure, setTenure] = useState(20); // Default to 5
  const [holdingPeriod, setHoldingPeriod] = useState(4); // Default based on project cost
  const [sellingCost, setSellingCost] = useState(30000000); // Default based on project cost
  const isReport = true;
  const [ismodal, setismodal] = useState(false);

  const [investmentOverviewData, setInvestmentOverviewData] = useState([]);

  // data to sent to finance
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [data2, setD2] = useState(null);

  // data to sent to monthly cash flow table
  const [monthlyCashFlowData, setMonthlyCashFlowData] = useState([]);

  const [initialParams, setInitialParams] = useState({});
  const isreport2 = true;
  const [tempproject, setTempProject] = useState({});

  useEffect(() => {
    const fetchProjectByName = async () => {
      try {
        // Fetch the project data based on the decoded project name
        const q = query(
          collection(db, "truEstatePreLaunch"),
          where("projectName", "==", projectName)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const fetchedProject = querySnapshot.docs[0].data();
          setProject(fetchedProject); // Set project if found
        } else {
        }
      } catch (error) {
        console.log(error);
      } finally {
      }
    };

    fetchProjectByName();
  }, [projectName]); // Re-run this effect when projectname changes

  useEffect(() => {
    // Map the necessary fields to the desired label-value format
    const date = new Date();
    const temp = [
      {
        label: "Current Price",
        value:
          formatCostSuffix(parseInt(activeTruReportAreaTab?.price)) || "N/A",
      },
      {
        label: "Price / Sq ft",
        value:
          formatCost(parseInt(project?.projectOverview.pricePerSqft)) || "N/A",
      },
      {
        label: "Est. Price / Sq ft",
        value:
          formatCost(
            parseInt(data2?.finalPrice / activeTruReportAreaTab?.area)
          ) || "N/A",
      },
      {
        label: "Handover Date",
        value: project?.projectOverview.handOverDate
          ? formatTimestampDateWithoutDate(
              project?.projectOverview.handOverDate
            )
          : "N/A",
      },
      {
        label: "Loan Amount",
        value:
          formatCostSuffix(
            parseInt((activeTruReportAreaTab?.price * loanPercentage) / 100)
          ) || "N/A",
      },
      { label: "Loan Percentage", value: "85%" || "N/A" },
      { label: "Loan Tenure", value: "20 Years" || "N/A" },
    ];
    // Update the state
    setTempProject(temp);
  }, [activeTruReportAreaTab, loanPercentage, project, data2]);

  useEffect(() => {
    if (project?.investmentOverview.cagr) {
      const cagrToConsider = project?.investmentOverview.cagr / 100;
      const SellingCost = parseInt(
        activeTruReportAreaTab?.price *
          Math.pow(1 + cagrToConsider, holdingPeriod)
      );

      setSellingCost(SellingCost);
    }
  }, [activeTruReportAreaTab]);

  useEffect(() => {
    let InitialActiveTruReportAreaTab = null;
    let InitialActiveTruReportConfigTab = null;
    let TruReportConfigWiseData = {};

    // if asset is apartment,villa then set truReportConfigWiseData and truReportAreaWiseData
    // Helper function to convert configuration keys to display names
    const getConfigDisplayName = (configKey) => {
      const displayNames = {
        studio: "Studio",
        oneBHK: "1 BHK",
        oneBHKPlus: "1 BHK+",
        twoBHK: "2 BHK",
        twoBHKPlus: "2 BHK+",
        threeBHK: "3 BHK",
        threeBHKPlus: "3 BHK+",
        fourBHK: "4 BHK",
        fourBHKPlus: "4 BHK+",
        fiveBHK: "5 BHK",
        fiveBHKPlus: "5 BHK+",
        sixBHK: "6 BHK",
      };

      return displayNames[configKey] || configKey;
    };

    // if asset is apartment,villa then set truReportConfigWiseData and truReportAreaWiseData
    if (project?.configuration && project?.assetType !== "plot") {
      if (project?.assetType === "apartment") {
        // Process ConfigurationApartment
        const configKeys = APARTMENT_CONFIGURATION_KEYS;

        configKeys.forEach((configKey) => {
          const configData = project.configuration[configKey];
          if (configData && configData.length > 0) {
            const configName = getConfigDisplayName(configKey);

            configData.forEach((eachData) => {
              if (eachData.available) {
                // Only process available units
                const dataPoint = {
                  area: eachData?.sbua,
                  price: eachData?.currentPrice,
                };

                TruReportConfigWiseData[configName] &&
                TruReportConfigWiseData[configName].length > 0
                  ? TruReportConfigWiseData[configName].push(dataPoint)
                  : (TruReportConfigWiseData[configName] = [dataPoint]);
              }
            });
          }
        });
      } else if (project?.assetType === "villa") {
        // Process ConfigurationVilla array
        if (Array.isArray(project.configuration)) {
          project.configuration.forEach((eachData) => {
            const configName =
              eachData.landholdingType === "uds"
                ? "Villa (UDS)"
                : "Villa (Land Registration)";
            const dataPoint = {
              area:
                eachData?.landDetails?.sbua ||
                eachData?.landDetails?.landArea ||
                eachData?.plotArea,
              price:
                eachData?.pricePerSqft *
                (eachData?.landDetails?.sbua ||
                  eachData?.landDetails?.landArea ||
                  eachData?.plotArea),
            };

            TruReportConfigWiseData[configName] &&
            TruReportConfigWiseData[configName].length > 0
              ? TruReportConfigWiseData[configName].push(dataPoint)
              : (TruReportConfigWiseData[configName] = [dataPoint]);
          });
        }
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

    // if asset is plot then set only truReportAreaWiseData
    if (
      project?.configuration &&
      project?.configuration.length > 0 &&
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
    setActiveTruReportAreaTab(InitialActiveTruReportAreaTab);
  }, [project]);

  const getReport = async (payload) => {
    try {
      console.log(payload);
      const res = await fetch(
        "https://cashflow-calc-dot-iqol-crm.uc.r.appspot.com/api/investmentReport",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();
      console.log("Data coming is hereeee it issss", result);
      setResults(result);
      return result; // Return the result so it can be used
    } catch (error) {
      console.error("Error:", error);
      throw error; // Re-throw so calling code can handle it
    }
  };
  console.log("my project data isss ", project);
  useEffect(() => {
    // creating the report
    const fetchData = async () => {
      try {
        const payload = {
          acquisitionPrice: activeTruReportAreaTab?.price || 500000,
          tenure,
          holdingPeriod,
          constructionCompletionDate: project?.projectOverview.handOverDate,
          finalPrice: sellingCost || 600000,
          interestRate,
          selectedCharge,
          assetType: project?.assetType,
        };
        const response = await getReport(payload);
        console.log("this is my response in report", response);
        setResults(response);
        console.log(response.data.xirr, "xirr at", payload);

        // Process data2 for InvestmentBreakdownChart
        setD2({
          booking_amt: response.data.monthly_cf[0]?.[2]?.value
            ? parseFloat(response.data.monthly_cf[0][2].value)
            : null,
          intrest: response.data.monthly_cf.reduce((sum, month) => {
            return sum + parseFloat(month[4] || 0); // Interest is at index 4
          }, 0),
          principal: response.data.monthly_cf.reduce((sum, month) => {
            return sum + parseFloat(month[5] || 0); // Principal is at index 5
          }, 0),
          constructionCompletionDate: project?.projectOverview.handOverDate,
          finalPrice: sellingCost,
          selectedCharge,
          charges_value: (() => {
            // Extract charges from monthly_cf components
            for (const month of response.data.monthly_cf) {
              if (month[2] && month[2].components) {
                const stampDutyComponent = month[2].components.find(
                  (comp) =>
                    comp.includes("stamp duty") ||
                    comp.includes("registration charges") ||
                    comp.includes("possession amount")
                );
                if (stampDutyComponent) {
                  const match = stampDutyComponent.match(/₹([\d,]+)/);
                  if (match) {
                    return parseFloat(match[1].replace(/,/g, ""));
                  }
                }
              }
            }
            return null;
          })(),
          possessionAmount: (() => {
            // Extract possession amount from monthly_cf components
            for (const month of response.data.monthly_cf) {
              if (month[2] && month[2].components) {
                const possessionComponent = month[2].components.find((comp) =>
                  comp.includes("possession amount")
                );
                if (possessionComponent) {
                  const match = possessionComponent.match(/₹([\d,]+)/);
                  if (match) {
                    return parseFloat(match[1].replace(/,/g, ""));
                  }
                }
              }
            }
            return null;
          })(),
          amounttNotDisbursed: null, // This field might need to be calculated differently
        });

        // setting investment overview data
        setInvestmentOverviewData([
          {
            label: "Total Investment",
            value: formatCostSuffix(response.data.minInvestment),
          },
          {
            label: "Total Returns",
            value: formatCostSuffix(Math.abs(response.data.total_returns)),
          },
          {
            label: "Price",
            value: `${
              activeTruReportAreaTab?.area
                ? Math.round(
                    activeTruReportAreaTab.price / activeTruReportAreaTab.area
                  )
                : "N/A"
            }/sqft`,
          },
          {
            label: "Gross Price",
            value: formatCost(activeTruReportAreaTab?.price || 0),
          },
          {
            label: "XIRR",
            value:
              response.data.xirr > 0
                ? `+${formatToOneDecimal(response.data.xirr)}%`
                : response.data.xirr < 0
                ? `${formatToOneDecimal(response.data.xirr)}%`
                : project.investmentOverview.xirr > 0
                ? `+${formatToOneDecimal(project.investmentOverview.xirr)}%`
                : project.investmentOverview.xirr < 0
                ? `${formatToOneDecimal(project.investmentOverview.xirr)}%`
                : "__",
          },
          {
            label: "Equity Multiplier",
            value: `${formatToOneDecimal(response.data.equity_multiplier)}`,
          },
          {
            label: "CAGR",
            value: project?.investmentOverview.cagr
              ? `${formatToOneDecimal(project.investmentOverview.cagr)}%`
              : "N/A",
          },
        ]);

        // Setting monthly cashflow data - no need to format here, let MonthlyCashFlowTable handle it
        setMonthlyCashFlowData([]); // Clear old data format, let component use results directly
      } catch (err) {
        setError(err.message);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [
    tenure,
    holdingPeriod,
    sellingCost,
    interestRate,
    loanPercentage,
    selectedCharge,
    activeTruReportAreaTab,
  ]);

  //  function for changing the current configuration and area data acc to it (in case of apartment, villa)
  const onConfigChange = (tab) => {
    setActiveTruReportConfigTab(tab);
    setTruReportAreaWiseData(
      truReportConfigWiseData[tab].sort((a, b) => a.area - b.area)
    );
    setActiveTruReportAreaTab(truReportConfigWiseData[tab][0]);

    // analytics
    logEvent(analytics, "investment_report_config", {
      selected_config: tab,
    });
  };

  const handleAreaTabChange = (tab) => {
    setActiveTruReportAreaTab(tab);
    logEvent(analytics, "investment_report_area_selection", {
      selected_area: tab.area,
    });
  };

  const handleChargeSelection = (charge) => {
    setSelectedCharge(charge);
    logEvent(analytics, "investment_report_charge_type_selection", {
      selected_charge: charge,
    });
  };

  const handleSetInitialParams = () => {
    let initial_state = {
      initial_activeConfigTab: activeTruReportConfigTab,
      initial_activeAreaTab: activeTruReportAreaTab,
      initial_selectedCharge: selectedCharge,
      initial_tenure: tenure,
      initial_loanPercentage: loanPercentage,
      initial_interestRate: interestRate,
      initial_holdingPeriod: holdingPeriod,
      initial_sellingCost: sellingCost,
    };
    setInitialParams(initial_state);
  };

  const togglemodal = () => {
    handleSetInitialParams();
    setismodal(!ismodal);
  };

  const handleResetInitialParams = () => {
    // activeConfigTab will only set if config wise data (2bhk, 3bhk) exists (in case of apartment,villa) (not for plot)
    if (initialParams?.initial_activeConfigTab) {
      setActiveTruReportConfigTab(initialParams.initial_activeConfigTab);
      setTruReportAreaWiseData(
        truReportConfigWiseData[initialParams.initial_activeConfigTab].sort(
          (a, b) => a.area - b.area
        )
      );
    }
    setActiveTruReportAreaTab(initialParams.initial_activeAreaTab);
    setSelectedCharge(initialParams.initial_selectedCharge);
    setTenure(initialParams.initial_tenure);
    setLoanPercentage(initialParams.initial_loanPercentage);
    setInterestRate(initialParams.initial_interestRate);
    setHoldingPeriod(initialParams.initial_holdingPeriod);
    setSellingCost(initialParams.initial_sellingCost);

    togglemodal();
  };

  const sliderRange = {
    tenure: { min: 1, max: 20 },
    loanPercentage: { min: 1, max: 85 },
    interestRate: { min: 1, max: 15 },
    holdingPeriod: { min: 1, max: 20 },
    sellingCost: { min: 1, max: 50000000 },
  };

  const [markerValue, setMarkerValue] = useState(null);

  useEffect(() => {
    const setMarkerWrtHoldingPeriod = () => {
      if (holdingPeriod == 1) {
        setMarkerValue(suggestedSellingCost[2025].toFixed(2));
      } else if (holdingPeriod == 2) {
        setMarkerValue(suggestedSellingCost[2026].toFixed(2));
      } else if (holdingPeriod == 3) {
        setMarkerValue(suggestedSellingCost[2027].toFixed(2));
      } else if (holdingPeriod == 4) {
        setMarkerValue(suggestedSellingCost[2028].toFixed(2));
      } else {
        setMarkerValue(15000000);
      }
    };

    setMarkerWrtHoldingPeriod();
  }, []);

  const calculateFuturePrice = (currentPrice, finalCAGR, holdingPeriod) => {
    const compoundedGrowthFactor = Math.pow(1 + finalCAGR / 100, holdingPeriod);
    return compoundedGrowthFactor * currentPrice;
  };

  const currentPrice = project?.projectOverview.pricePerSqft;
  const finalCAGR = project?.investmentOverview.cagr;

  const finalPrice = calculateFuturePrice(
    currentPrice,
    finalCAGR,
    holdingPeriod
  );
  const appreciation = ((finalPrice - currentPrice) / finalPrice) * 100;

  const appreciation2025 = 0.3 * appreciation;
  const appreciation2026 = 0.25 * appreciation;
  const appreciation2027 = 0.3 * appreciation;

  const compounded2025 = 1 + appreciation2025 / 100;
  const compounded2026 = 1 + appreciation2026 / 100;
  const compounded2027 = 1 + appreciation2027 / 100;

  const appreciationByYear = {
    2025: appreciation2025,
    2026: appreciation2026,
    2027: appreciation2027,
    2028: project?.investmentOverview.cagr,
  };

  const suggestedSellingCost = {
    2025:
      calculateFuturePrice(currentPrice, appreciationByYear[2025], 1) *
      activeTruReportAreaTab?.area,
    2026:
      calculateFuturePrice(currentPrice, appreciationByYear[2026], 2) *
      activeTruReportAreaTab?.area,
    2027:
      calculateFuturePrice(currentPrice, appreciationByYear[2027], 3) *
      activeTruReportAreaTab?.area,
    2028:
      calculateFuturePrice(currentPrice, appreciationByYear[2028], 4) *
      activeTruReportAreaTab?.area,
  };
  console.log("chumaaaaa results", results);
  return (
    <>
      <div className="flex flex-col">
        <div className="  px-4 md:px-8 mt-3  mb-3 lg:mb-0 ">
          <MyBreadcrumb />
        </div>

        <div className="w-full hidden px-8 mt-3 mb-6 lg:block">
          <p className={`${styles.HeadingReport}`}>Investment Report</p>
        </div>

        <div className="flex flex-row gap-[50px] px-4 md:px-8 ">
          {ismodal && (
            <>
              {/* Background overlay */}
              <div
                className="fixed inset-0 bg-black xl:hidden opacity-50 z-40 "
                onClick={togglemodal}
              ></div>

              {/* Modal content */}
              <div className="fixed inset-0 flex flex-col justify-center items-center  xl:hidden z-50">
                <div className="h-[100vh] w-full xl:w-[35%] mt-28   border-2 overflow-y-auto rounded-lg bg-[#FAFAFA] xl:hidden ">
                  <div className="flex justify-between p-4 border-b-2 bg-[#FAFAFA]  z-10 sticky top-0">
                    <p className={`${styles1.invtitle} `}>Parameters</p>
                    <img
                      className="w-[14px] h-[14px]"
                      src={close}
                      alt="no img"
                      onClick={togglemodal}
                    />
                  </div>
                  <div className="px-4 py-4 ">
                    {truReportConfigWiseData && (
                      <>
                        <h3
                          className={`${styles.LeftSid} ${styles1.font1} mb-2 font-bold`}
                        >
                          Configuration
                        </h3>
                        <div className="flex flex-wrap lg:grid lg:grid-cols-2 gap-2 mb-6">
                          {Object.keys(truReportConfigWiseData) &&
                            Object.keys(truReportConfigWiseData).length > 0 &&
                            Object.keys(truReportConfigWiseData).map(
                              (tab, index) => (
                                <button
                                  key={index}
                                  className={`w-[fit-content] ${
                                    styles.configbutton
                                  } ${
                                    activeTruReportConfigTab === tab
                                      ? styles.configselected
                                      : ""
                                  }`}
                                  onClick={() => {
                                    onConfigChange(tab);
                                    logEvent(
                                      analytics,
                                      "click_chng_config_report",
                                      { Name: "chng_config_report" }
                                    );
                                  }}
                                >
                                  <p
                                    className={`${styles.configbuttontext1} ${
                                      styles1.buttontxt
                                    } ${
                                      activeTruReportConfigTab === tab
                                        ? `text-white`
                                        : ""
                                    }  truncate`}
                                  >
                                    {tab}
                                  </p>
                                </button>
                              )
                            )}
                        </div>
                      </>
                    )}

                    <h3
                      className={`${styles.LeftSid} ${styles1.font1} mb-2 font-bold`}
                    >
                      {project?.assetType === "plot"
                        ? "Plot area"
                        : "Super built-up area"}
                    </h3>
                    <div className="flex flex-wrap lg:grid lg:grid-cols-2 gap-2 mb-6">
                      {truReportAreaWiseData.map((tab, index) => (
                        <button
                          key={index}
                          className={`w-[fit-content] ${styles.configbutton} ${
                            activeTruReportAreaTab?.area === tab?.area
                              ? styles.configselected
                              : ""
                          }`}
                          onClick={() => {
                            handleAreaTabChange(tab);
                            logEvent(analytics, "click_chng_area_report", {
                              Name: "chng_area_report",
                            });
                          }}
                        >
                          <p
                            className={`${styles.configbuttontext1} ${
                              styles1.buttontxt
                            } ${
                              activeTruReportAreaTab?.area === tab?.area
                                ? `text-white`
                                : ""
                            }  truncate`}
                          >
                            {`${tab?.area} Sq ft`}
                          </p>
                        </button>
                      ))}
                    </div>

                    <CustomSlider
                      min={sliderRange.interestRate.min}
                      max={sliderRange.interestRate.max}
                      value={interestRate}
                      setValue={setInterestRate}
                      label="Interest Rate"
                      unit="%"
                      svgIcon="/path-to-interest-icon.svg"
                    />
                    <CustomSlider
                      min={sliderRange.holdingPeriod.min}
                      max={sliderRange.holdingPeriod.max}
                      value={holdingPeriod}
                      setValue={setHoldingPeriod}
                      label="Holding Period"
                      unit="Yr"
                      svgIcon="/path-to-tenure-icon.svg"
                    />
                    <CustomSlider
                      min={sliderRange.sellingCost.min}
                      max={sliderRange.sellingCost.max}
                      value={sellingCost}
                      setValue={setSellingCost}
                      holdingPeriod={holdingPeriod}
                      label="Selling Cost"
                      unit="Rs"
                      markerValue={markerValue}
                      svgIcon="/path-to-selling-cost-icon.svg"
                    />

                    <div className="flex gap-1">
                      <div
                        style={{
                          width: "6px",
                          height: "20px",
                          marginBottom: "8px",
                          backgroundColor: "#EF7717",
                        }}
                      />
                      <p className={`${styles.disc}`}>
                        *The marked line indicates the estimated value
                        calculated by Truestate for the specified holding
                        period.
                      </p>
                    </div>
                  </div>

                  {/* Sticky Submit Button */}
                  <div className="bg-[#FAFAFA] border-t-[1px] border-[#CCCBCB] w-full sticky bottom-0 py-2 px-4 flex gap-2 items-center justify-end font-lato font-[600]">
                    <div className="px-4 py-2 text-[#DE1135] text-center leading-5 w-[25%]">
                      <button
                        onClick={() => {
                          handleResetInitialParams();
                          logEvent(analytics, "click_cancel_report", {
                            Name: "click_cancel_report",
                          });
                        }}
                      >
                        Cancel
                      </button>
                    </div>

                    <div
                      onClick={togglemodal}
                      className="px-6 py-3 text-[#FAFBFC] bg-[#153E3B] leading-6 rounded-[4px] text-center w-[75%]"
                    >
                      <button
                        onClick={() => {
                          logEvent(analytics, "click_apply_report", {
                            Name: "click_apply_report",
                          });
                        }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Left side - Parameters */}
          <div className="h-[fit-content] w-full lg:w-[35%] py-4 px-5 border-2 rounded-lg sticky hidden lg:block ">
            {truReportConfigWiseData && (
              <>
                <h3 className={`${styles.LeftSideH} mb-2`}>Configuration</h3>
                <div className="flex flex-wrap gap-4 mb-6">
                  {truReportConfigWiseData &&
                    Object.keys(truReportConfigWiseData) &&
                    Object.keys(truReportConfigWiseData).length > 0 &&
                    Object.keys(truReportConfigWiseData).map((tab, index) => (
                      <button
                        key={index}
                        className={` w-[fit-content] ${styles.configbutton} ${
                          activeTruReportConfigTab === tab
                            ? styles.configselected
                            : ""
                        }`}
                        onClick={() => onConfigChange(tab)}
                      >
                        <p
                          className={`${styles.configbuttontext1}  ${
                            activeTruReportConfigTab === tab ? `text-white` : ""
                          } truncate`}
                        >
                          {tab}
                        </p>
                      </button>
                    ))}
                </div>
              </>
            )}

            <h3 className={`${styles.LeftSideH} mb-2`}>
              {project?.assetType === "plot"
                ? "Plot area"
                : "Super built-up area"}
            </h3>
            <div className="flex flex-wrap gap-4 mb-6">
              {truReportAreaWiseData.map((tab, index) => (
                <button
                  key={index}
                  className={` w-[fit-content] ${styles.configbutton} ${
                    activeTruReportAreaTab?.area === tab?.area
                      ? styles.configselected
                      : ""
                  }`}
                  onClick={() => setActiveTruReportAreaTab(tab)}
                >
                  <p
                    className={`${styles.configbuttontext1}  ${
                      activeTruReportAreaTab?.area === tab?.area
                        ? `text-white`
                        : ""
                    } truncate`}
                  >{`${tab?.area} Sq ft`}</p>
                </button>
              ))}
            </div>

            <CustomSlider
              min={sliderRange.interestRate.min}
              max={sliderRange.interestRate.max}
              value={interestRate}
              setValue={setInterestRate}
              label="Interest Rate"
              unit="%"
              svgIcon="/path-to-interest-icon.svg"
            />

            <CustomSlider
              min={sliderRange.holdingPeriod.min}
              max={sliderRange.holdingPeriod.max}
              value={holdingPeriod}
              setValue={setHoldingPeriod}
              label="Holding Period"
              unit="Yr"
              svgIcon="/path-to-tenure-icon.svg"
            />

            <CustomSlider
              min={sliderRange.sellingCost.min}
              max={sliderRange.sellingCost.max}
              value={sellingCost}
              setValue={setSellingCost}
              label="Selling Cost"
              unit="Rs"
              markerValue={markerValue}
              svgIcon="/path-to-selling-cost-icon.svg"
              holdingPeriod={holdingPeriod}
            />

            <div className="flex gap-1">
              <div
                style={{
                  width: "4px",
                  height: "20px",
                  marginBottom: "8px",
                  backgroundColor: "#EF7717",
                  cursor: "crosshair",
                }}
              />
              <p className={`${styles.disc}`}>
                *The marked line indicates the estimated value calculated by
                Truestate for the specified holding period.
              </p>
            </div>
          </div>

          {/* Right Side - Financial Overview */}
          <div className="w-full  xl:w-[60%] ">
            <img
              src={toggle}
              onClick={togglemodal}
              alt="no image"
              className="fixed right-4 bottom-0 block xl:hidden z-[9999]"
            />
            <Finance
              investmentOverviewData={investmentOverviewData}
              results={results}
              data2={data2}
              err={error}
              holdingPeriod={holdingPeriod}
              isreport2={isreport2}
              data3={tempproject}
            />

            <hr />

            <div className="mt-8">
              <MonthlyCashFlowTable
                cashflowData={monthlyCashFlowData}
                results={results}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Report;
