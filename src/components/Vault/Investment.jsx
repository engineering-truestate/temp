import React, { useState, useEffect } from "react";
import { selectUserPhoneNumber } from "../../slices/userAuthSlice";
import styles from "./InvestmentSummary.module.css"; // Import the CSS
import projectPopupStyles from '../Project_popup/ProjectPopup.module.css';
import logo from "/assets/icons/brands/truestate-logo-alt.svg";
import infoIcon from  '/assets/icons/ui/info.svg';
import ElectricityBill from "/assets/icons/features/electricity-bill.svg";
import house from "/assets/icons/ui/house.svg";
import KahataTransfer from "/assets/icons/features/kahata-transfer.svg";
import SellProperty from "/assets/icons/ui/money-bag.svg";
import TitleClearence from "/assets/icons/features/title-clearance.svg";
import Wallet from "/assets/icons/ui/wallet.svg";
import ArrowRight from '/assets/icons/navigation/arrow-right.svg';

import TDSpayment from "/assets/icons/features/tds-payment.svg";
import { useSelector, useDispatch } from "react-redux";
import { getVaultData } from "../../slices/apis/vault";
import { useNavigate } from "react-router-dom";
import ServiceRequestModal from './ServiceRequestModal';
import arrowright from "/assets/icons/navigation/arrow-right-1.svg";
import Loader from "../Loader";
import { showLoader, hideLoader, selectLoader } from "../../slices/loaderSlice";
import { formatCost, formatCostSuffix, toCapitalizedWords } from "../../utils/common.js";
import InvestmentAlertModal from "./InvestmentAlertModal.jsx";
// import Vault1 from '/assets/icons/ui/vault-1.svg';
// import Vault2 from '/assets/icons/ui/vault-2.svg';
// import Vault3 from '/assets/icons/ui/vault-3.svg';
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";




// Card data for rendering (for the new image)
const serviceCardData = [
  {
    title: "Khata Transfer",
    description:
      "Change ownership of property easily",
    icon: KahataTransfer,
  },
  {
    title: "Sell Property",
    description:
      "Find buyers for your real estate investments",
    icon: SellProperty,
  },
  {
    title: "Title Clearance",
    description:
      "Confirm that your property has no legal issues",
    icon: TitleClearence,
  },
  {
    title: "Electricity Bill Transfer",
    description:
      "Change owner name in BESCOM",
    icon: ElectricityBill,
  },
  {
    title: "Find Tenant",
    description:
      "List and rent out your apartment",
    icon: house,
  },
  {
    title: "Collect Rent",
    description:
      "Seamlessly collect rent from your tenants",
    icon: Wallet,
  },
];

const InvestmentSummary = () => {
  const dispatch = useDispatch();
  const { userDoc } = useSelector((state) => state.userAuth);

  const { vaultForms } = userDoc;
  const [vaultData, setVaultData] = useState([]);
  const loading = useSelector(selectLoader);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  const [totalTruEstimate, setTotalTruEstimate] = useState(null);
  const [totalPurchasedPrice, setTotalPurchasedPrice] = useState(null);
  const [totalReturn, setTotalReturn] = useState(null);
  const [weightedAvgCagr, setWeightedAvgCagr] = useState(null);
  const [hasTruEstimateCameForAll, setHasTruEstimateCameForAll] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedService('');
  };

  const handleServiceClick = (service) => {
    if (selectedService === service && isModalOpen) {
      setIsModalOpen(false);
      setSelectedService('');
      setTimeout(() => {
        setSelectedService(service);
        setIsModalOpen(true);
      }, 200);
    } else {
      setSelectedService(service);
      setIsModalOpen(true);
    }
  };



  // Monitor the state changes with useEffect
  useEffect(() => {
  }, [isModalOpen, selectedService]);


  const navigate = useNavigate();

  // Handle window resize to toggle between screen sizes
  const handleResize = () => {
    setIsLargeScreen(window.innerWidth >= 1024);
  };

  const handleNavigate = (formId, holdingName, holdingtruEstimate, holdingTotalReturns, holdingCagr) => {
    if(holdingtruEstimate && holdingTotalReturns && holdingCagr)
    {
      navigate(
        `/vault/investment/${holdingName}`,
        { state: { formId: formId }, }
      );
    }
    else
    {
      // navigate(
      //   `/vault/investment/${holdingName}`,
      //   { state: { formId: formId }, }
      // );
      setIsInfoModalOpen(true);
    }
  };

  // Use effect to set up the resize event listener
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener when component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchVaultData = async () => {
      try {
        const vaultFormIds = userDoc.vaultForms || [];
        const vaultFormData = await getVaultData(vaultFormIds, userDoc);
        
        console.log("vaultFormData", vaultFormData);
        setVaultData(vaultFormData);
        dispatch(hideLoader());

        const properties = []   // contain {cagr, holdingPeriod}
        const lastUpdatedList=[]; // list of last updated dates of properties


        // calculate weighted avg cagr 
        if(vaultFormData && vaultFormData.length > 0){
          vaultFormData.forEach((vault)=>{
            if(vault.truestimatedFullPrice){
              const holdingPeriod = new Date().getFullYear() - vault.yearOfPurchase;
              //const cagr = parseFloat((Math.pow(vault?.truestimatedFullPrice / vault?.purchaseAmount, 1 / holdingPeriod) - 1).toFixed(2));
              const cagr = vault.cagr || parseFloat((Math.pow(vault?.truestimatedFullPrice / vault?.purchaseAmount, 1 / holdingPeriod) - 1).toFixed(2));
              properties.push({cagr,holdingPeriod});
              
              if(vault.lastUpdated)
              lastUpdatedList.push(vault.lastUpdated);
            }
            else
            setHasTruEstimateCameForAll(false);
          })
        }

        if(properties.length>0){
          setWeightedAvgCagr(calculateWeightedAvgCAGR(properties));
        }

        if(lastUpdatedList.length>0){
          setLastUpdated(getMostRecentDate(lastUpdatedList));          
        }
        

        // calculate current value of properties 
        const TotalTruEstimate = (vaultFormData && vaultFormData.length > 0) ? parseInt(
          vaultFormData?.reduce((acc, curObj) => {
          if(curObj.truestimatedFullPrice)
          return acc + parseInt(curObj.truestimatedFullPrice);
          else return acc;
          }, 0)
        ) : null;
        setTotalTruEstimate(TotalTruEstimate || null);


        // calculate total investment in properties 
        let TotalInvestment = parseInt(
          vaultFormData?.reduce((acc, curObj) => {
            if(curObj?.truestimatedFullPrice){
              return acc + parseInt(curObj.purchaseAmount)
            }
            else{
              return acc;
            } 
          }, 0)
        );

        setTotalPurchasedPrice(TotalInvestment);

        // calculate total returns 
        setTotalReturn((TotalTruEstimate && TotalInvestment) ? (TotalTruEstimate - TotalInvestment) : null);
      } catch (error) {
      }
    };

    dispatch(showLoader());
    fetchVaultData();
  }, [vaultForms, userDoc.vaultForms]);


  const [disableAddProperty, setDisableAddProperty] = useState(false);
  useEffect(() => {
    if(vaultData?.length >= 30)
    {
      setDisableAddProperty(true);
    }
    else
    {
      setDisableAddProperty(false);
    }
  }, [vaultData])


  const formatarea = (price) => {
    if(!price && price!==0) return;
  
  price = String(price);
  let isNegative = false;

  if (price < 0) {
    isNegative = true;
    price = Math.abs(price);
  }

  // Convert the price to a string and remove any existing commas
  let priceStr = price?.toString().replace(/,/g, "");

  // Split the number into integer and decimal parts
  let [integerPart, decimalPart] = priceStr.split(".");

  // Add commas for lakhs and crores
  let lastThree = integerPart.substring(integerPart.length - 3);
  let otherNumbers = integerPart.substring(0, integerPart.length - 3);

  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }

  otherNumbers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");

  // Combine the formatted integer part with decimal part (if exists)
  let formattedPrice = `${otherNumbers}${lastThree}`;
  if (decimalPart) {
    formattedPrice += `.${decimalPart}`;
  }

  if (isNegative) formattedPrice = `-${formattedPrice}`;

  return formattedPrice;
  };


  // function to calculate weighted avg cagr takes cagr and holding period of the properties 
  function calculateWeightedAvgCAGR(properties) {
    // Calculate the total weight (sum of holding periods)
    let totalWeight = 0;
    let weightedGrowthSum = 0;
    
    // Loop through each property to calculate the weighted growth sum
    properties.forEach(property => {
        const { cagr, holdingPeriod } = property;
        
        // Convert CAGR to growth factor for the holding period
        const growthFactor = Math.pow(1 + cagr, holdingPeriod);
        
        // Add the weighted growth factor to the sum
        weightedGrowthSum += growthFactor * holdingPeriod;
        
        // Sum up the total weight (holding periods)
        totalWeight += holdingPeriod;
    });

    // Calculate the weighted average growth factor
    const weightedGrowthFactor = weightedGrowthSum / totalWeight;

    // Calculate the weighted CAGR from the weighted growth factor
    const weightedCAGR = Math.pow(weightedGrowthFactor, 1 / totalWeight) - 1;

    return parseFloat((weightedCAGR * 100).toFixed(2));
}

// function to find the most recent dates out of all given dates (DD/MM/YYYY)
function getMostRecentDate(dates) {
  // Get today's date
  const today = new Date();

  // Function to convert date string (DD/MM/YYYY) to Date object
  function parseDate(dateStr) {
      const [day, month, year] = dateStr.split('/');
      return new Date(year, month - 1, day); // Month is 0-indexed
  }

  // Convert all date strings to Date objects
  const dateObjects = dates.map(dateStr => parseDate(dateStr));

  // Find the most recent date
  const mostRecentDate = dateObjects.reduce((latest, current) => {
      return current > latest ? current : latest;
  });

  // Return the most recent date in DD/MM/YYYY format
  const day = mostRecentDate.getDate().toString().padStart(2, '0');
  const month = (mostRecentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = mostRecentDate.getFullYear();

  return `${day}/${month}/${year}`;
}


// function to render the holding component (which shows all propeties) in mobile and desktop view
  const rendering = () => {

    if (isLargeScreen) {
      return (
        <table className="w-full border-[2px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className={`text-left ${styles.value1} p-4 font-semibold `}>Property</th>
              <th className=" p-4 flex  items-center text-center justify-center">
                <span className="h-4 mr-[6px]">
                  <img src={logo} alt="" />
                </span>
                <p className={`text-left ${styles.value1} font-semibold `}>Current Value</p>
              </th>
              <th className={` p-4 text-center ${styles.value1}  font-semibold`}>Amount Invested</th>
              {/* <th className={` p-4 text-center ${styles.value1} font-semibold`}>Total Return</th> */}
              <th className={` p-4 text-center ${styles.value1} font-semibold`}>CAGR</th>
            </tr>
          </thead>
          <tbody>
            {vaultData &&
              vaultData.length > 0 &&
              vaultData.map((holding, index) => {

                // current price 
                const holdingtruEstimate = holding?.truestimatedFullPrice || null;

                // total returns
                const holdingTotalReturns = (holding.purchaseAmount && holdingtruEstimate) ? (holdingtruEstimate - holding.purchaseAmount) : null;

                // // total return percentage
                // const holdingReturnPer = (holdingTotalReturns && holding?.purchasePrice) ? (((holdingTotalReturns / holding?.purchasePrice) * 100).toFixed(1)) : null;


               // total cagr percentage
              const holdingPeriod = new Date().getFullYear() - holding.yearOfPurchase;
              const holdingCagr = (holdingtruEstimate && holding?.purchaseAmount && holdingPeriod) ? parseFloat((Math.pow(holdingtruEstimate / holding.purchaseAmount, 1 / holdingPeriod) - 1).toFixed(2)) : null;



                return (
                  <tr key={index} className={`border-b border-gray-200 ${(holding?.truestimatedFullPrice) && 'cursor-pointer'}`} onClick={() => handleNavigate(holding?.unitId, holding?.projectName, holdingtruEstimate, holdingTotalReturns, holdingCagr)}>
                    <td
                      className="px-6 py-4 flex flex-col gap-2"
                    >
                      <span className="flex gap-2">
                        <h3 className={`${styles.propertyName} `}>
                          {toCapitalizedWords(holding?.projectName) || "NA"}
                          {holding.purchaseAmount && holding.truestimatedFullPrice
                          ? "" : 
                          <span className="text-black ml-1">*</span>}
                        </h3>
                        {holding?.truestimatedFullPrice ? <img src={ArrowRight} /> : ""}
                      </span>
                      <p
                        className={`${styles.propertyDetails} flex gap-2 `}
                      >{`${toCapitalizedWords(holding?.assetType)} | ${holding?.assetType === "plot"
                        ? formatarea(holding?.plotArea)
                        : formatarea(holding?.sbua)
                        } Sq ft | ${holding?.assetType !== "plot" ? holding?.configuration : ""
                        }`}</p>
                    </td>
                    <td>
                      <p className={`${styles.value} px-4 text-center`}>
                        {holdingtruEstimate ? formatCostSuffix(holdingtruEstimate) : "_"}
                      </p>
                    </td>
                    <td>
                      <p className={`${styles.value} px-4 text-center`}>
                        {holding.purchaseAmount && holding.truestimatedFullPrice
                          ? formatCostSuffix(holding?.purchaseAmount)
                          : 
                          <>
                          {"_"}
                          </>
                          }
                      </p>
                    </td>
                    {/* <td>
                      <p className={`text-[1rem] ${(holdingTotalReturns && holdingTotalReturns >= 0) ? styles.valueGreen : (holdingTotalReturns && holdingTotalReturns < 0) ? `${styles.valueRed} text-[1rem]` : null} px-4 text-center`}>
                        {holdingTotalReturns
                          ? formatCostSuffix(holdingTotalReturns)
                          : "_"}
                      </p>
                    </td> */}
                    <td>
                      <p className={`text-[1rem] ${(holding?.cagr) ? (holding.cagr > 0) ? styles.valueGreen : styles.valueRed : `${styles.value}`} px-4 text-center`}>
                        {holding?.cagr
                          ? `${holding.cagr.toFixed(2)} %`
                          : "_"}
                      </p>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      );
    } else {
      return (
        <div className="block ">
          {vaultData &&
            vaultData.length > 0 &&
            vaultData.map((holding, index) => {
              // current price 
              const holdingtruEstimate = holding?.truestimatedFullPrice || null;

              // total returns 
              const holdingTotalReturns = (holding.purchaseAmount && holdingtruEstimate) ? (holdingtruEstimate - holding.purchaseAmount) : null;

              // total cagr percentage

              const holdingPeriod = new Date().getFullYear() - holding.yearOfPurchase;
              const holdingCagr = (holdingtruEstimate && holding?.purchaseAmount && holdingPeriod) ? parseFloat((Math.pow(holdingtruEstimate / holding.purchaseAmount, 1 / holdingPeriod) - 1).toFixed(2)) : null;


              return (
                <div
                  key={index}
                  className={`border border-gray-300 rounded-lg p-4 mb-4 ${(holding?.pricePerSqft) && 'cursor-pointer'}`}
                  onClick={() => handleNavigate(holding?.unitId, holding?.projectName, holdingtruEstimate, holdingTotalReturns, holdingCagr)}
                >
                  <div  >
                    <div className="flex gap-2">
                      <h3 className={` ${styles.propertyName}  mb-1`}>
                        {toCapitalizedWords(holding?.projectName) || "Sobha Neopolis"}
                        {holding.purchaseAmount && holding.truestimatedFullPrice
                          ? "" : 
                          <span className="text-black ml-1">*</span>
                          }
                      </h3>
                      {holding?.truestimatedFullPrice ? <img src={ArrowRight} /> : ""}
                      </div>
                    <div className="flex gap-2 ">
                      <p
                        className={`${styles.propertyDetails}`}
                      >{`${toCapitalizedWords(holding?.assetType)}`}</p>
                      <p className={`${styles.propertyDetails}`}>{`|`}</p>
                      <p className={`${styles.propertyDetails}`}>{`${holding?.assetType === "plot"
                        ? holding?.plotArea
                        : holding?.sbua
                        } Sq ft`}</p>
                      <p className={`${styles.propertyDetails}`}>{`|`}</p>
                      {holding?.assetType !== "plot" && (
                        <p className={`${styles.propertyDetails}`}>
                          {" "}
                          {holding?.configuration}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex w-full border-t-[1px] border-[#D9D9D9]  mt-3">
                    <div className=" mt-3  w-full  flex flex-col gap-5">
                      <div>
                        <p className={` ${styles.value1}`}>Current Value</p>
                        <p className={` ${styles.value}  m-0`}>
                          {holdingtruEstimate ? formatCostSuffix(holdingtruEstimate) : "_"}
                        </p>
                      </div>
                      <div>
                        <p className={` ${styles.value1}`}>Amount Invested</p>
                        <p className={` ${styles.value} m-0`}>
                        {holding.purchaseAmount && holding.truestimatedFullPrice
                          ? formatCostSuffix(holding?.purchaseAmount)
                          : 
                          <>
                          {"_"} 
                          </>
                          }
                        </p>
                      </div>
                    </div>
                    <div className=" mt-3  w-full flex flex-col gap-5">
                      {/* <div>
                        <p className={` ${styles.value1}`}>Total Return</p>
                        <p className={`text-[1rem] ${(holdingTotalReturns) ? (holdingTotalReturns > 0) ? styles.valueGreen : styles.valueRed : styles.value} m-0`}>
                          {holdingTotalReturns
                            ? formatCostSuffix(holdingTotalReturns)
                            : "_"}
                        </p>
                      </div> */}
                      <div>
                        <p className={`${styles.value1}`}>CAGR </p>
                        <p className={`text-[1rem] ${(holdingCagr) ? (holdingCagr > 0) ? styles.valueGreen : styles.valueRed : `${styles.value}`} m-0`}>
                          {holdingCagr
                            ? `${holdingCagr} %`
                            : "_"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      );
    }
  };

  return (
    <>
      {loading ? <div className="flex h-[80vh] z-[9999]"><Loader /></div> :
        <div className={`${styles.investmentSummary} px-4 py-4 md:py-6 md:px-8`}>
          <h2 className={`${styles.heading} mb-1`}>Investment Summary</h2>
          {lastUpdated && <p className={`${styles.lastUpdate} mb-3 md:mb-4`}>
            Last update: - {lastUpdated}
          </p>
          }

          {/* Investment Summary Section */}
          <div
            className={`${styles.summaryContainer} grid grid-cols-2 lg:grid-cols-3`}
          >
            {/* TruEstimate Box */}
            <div className={`${styles.summaryBox} w-full  px-0 py-0   flex  flex-row justify-center  `}>
            
             <div className=" w-full px-[10px]  py-3  md:py-4 md:px-5">
             <div className={styles.labelWithIcon}>
                <span className="h-4 mr-[6px]">
                  <img src={logo} alt="" />
                </span>

                {/* current price  */}
                <div className={`${styles.label} flex md:text-sm `}>
                 <span>Current Value</span> 

                 {/* more info icon with tooltip  */}
                 {/* <div className={`${projectPopupStyles.tooltip} cursor-pointer`}>
                  <img src={infoIcon} className="ml-1 mr-2 mt-[2px]" alt="info" />
                  <span className={`${projectPopupStyles.tooltiptext}`}>
                   abcd
                  </span>
                </div> */}
                </div>
              </div>
              <div className={`${styles.value} md:text-lg`}>
                {totalTruEstimate ? formatCostSuffix(totalTruEstimate) : "_"}
              </div>
               
             </div>
              
              <div  className="  w-full  hidden  text-right xl:flex ">
              {/* <img src={Vault1}  className="object-cover hidden xl:block  " /> */}
              </div>
   
            </div>

            {/* Purchase Price */}
            <div className={`${styles.summaryBox} w-full   px-0 py-0   flex  flex-row justify-center`}>

              <div className=" w-full  px-[10px]  py-3   md:py-4 md:px-5">
              <div className={`${styles.label} md:text-sm   `}>Amount Invested</div>
              <div className={`${styles.value} md:text-lg`}>
                {totalPurchasedPrice ? formatCostSuffix(totalPurchasedPrice) : "_"}
              </div>
              </div>

              <div  className="  w-full  hidden  text-right xl:flex ">
              {/* <img src={Vault1}  className="object-cover hidden xl:block  w-full" /> */}
              </div>
            </div>

            {/* Total Return */}
            {/* <div className={`${styles.summaryBox} w-full  flex  justify-center`}>
              <div className={`${styles.label} flex md:text-sm `}>
                <span>
                Total Return
                </span>

           
              
              </div>
              <div className={`${(totalReturn) ? (totalReturn >= 0) ? styles.valueGreen : styles.valueRed : `${styles.valueRed} text-black`} md:text-lg`}>
                {totalReturn ? formatCostSuffix(totalReturn) : "_"}
              </div>
            </div> */}

            {/* CAGR */}
            <div className={`${styles.summaryBox} w-full   px-0 py-0   flex  flex-row    justify-center`}>
              <div className=" w-full   px-[10px]  py-3   md:py-4 md:px-5">
              <div className={`${styles.label} flex md:text-sm `}>
                <span>
                CAGR
                </span>

                 {/* more info icon with tooltip  */}
                 {/* <div className={`${projectPopupStyles.tooltip} cursor-pointer`}>
                  <img src={infoIcon} className="ml-1 mr-2 mt-[2px]" alt="info" />
                  <span className={`${projectPopupStyles.tooltiptext}`}>
                   abcd
                  </span>
                </div> */}
              </div>
              <div className={`${(weightedAvgCagr) ? (weightedAvgCagr >= 0) ? styles.valueGreen : styles.valueRed : `${styles.valueRed} text-black`} md:text-lg`}>{weightedAvgCagr ? `${weightedAvgCagr} %` : "__"}</div>
              </div>
      
              <div  className="  w-full  hidden  text-right xl:flex ">
              {/* <img src={Vault1}  className="object-cover hidden xl:block w-full " /> */}
              </div>
            </div>
          </div>

          {/* Holdings Section */}
          <div className="mt-9 block ">
            <div className="flex  justify-between  items-center mb-3 lg:mb-4">
              <h2 className={`${styles.heading} `}>Holdings({vaultData?.length || 0})</h2>
              <div className="flex flex-col">
                <button onClick={() => {
                  navigate("/vault/findproject")
                  logEvent(analytics, `click_inside_vault_add_property`, { Name: `vaultinvestment_add_property` });
                }} className={`${styles.addButton} ml-auto ${disableAddProperty ? "bg-[#CCCBCB] text-[#5A5555]" : ""}`} disabled={disableAddProperty}>
                  + Add Property
                </button>
                {disableAddProperty &&
                  <span className="font-lato text-red-500 text-[12px]">*You can add only upto 30 properties.</span>
                }
              </div>
            </div>

            {rendering()}
            {!hasTruEstimateCameForAll && <p className="mt-2 text-sm font-[600] font-lato"> <span className="text-black">*</span> 
            Investment Analysis Pending.</p>}
          </div>

          {/* Card Section */}
          <div className="mt-9 md:mt-9  mb-7">
            <h3 className={` ${styles.heading} mb-4`}>Our Services</h3>
            <div className="grid md:grid-cols-2 md:flex md:flex-wrap xl:grid-cols-4 items-start gap-6 w-full">
              {serviceCardData.map((card, index) => (
                <div
                  key={index}
                  className="border-2 border-gray-300 rounded-lg p-4 flex flex-col md:w-[275px] h-full items-start hover:shadow-md cursor-pointer"
                  onClick={() => {
                    handleServiceClick(card.title);
                    logEvent(analytics, `click_inside_vault_${card.title}`, { Name: `vaultinvestment_${card.title}` });}
                    
                  }
                >
                  <img src={card.icon} alt={card.title} className="mb-4 w-6 h-6 " />
                  <div className="flex  w-full mb-1">
                    <h4 className={`${styles.propertyName} `}>{card.title}</h4>
                    <img src={arrowright} className="ml-auto" />
                  </div>

                  <p className={`${styles.h10} h-8  mb-4`}>{card.description}</p>
                </div>
              ))}
            </div>

            <ServiceRequestModal
              isOpen={isModalOpen}
              onClose={handleModalClose}
              service={selectedService}
              properties={vaultData}

            />
            <InvestmentAlertModal
              isOpen={isInfoModalOpen}
              title="We're Reviewing Your Property"
              message="Our agents are currently analyzing the information, and we'll get back to you once the review is complete."
              submitLabel="Back to Vault"
              setIsOpen={setIsInfoModalOpen}
            />
          </div>
        </div>
      }
    </>
  );
};

export default InvestmentSummary;
