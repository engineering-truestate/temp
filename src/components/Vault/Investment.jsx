import React, { useState, useEffect } from "react";
import styles from "./InvestmentSummary.module.css"; // Import the CSS
import logo from "/assets/icons/brands/truestate-logo-alt.svg";
import { useSelector, useDispatch } from "react-redux";
import { getVaultData } from "../../slices/apis/vault";
import { useNavigate } from "react-router-dom";
import ServiceRequestModal from "./ServiceRequestModal";
import arrowright from "/assets/icons/navigation/arrow-right-1.svg";
import Loader from "../Loader";
import { showLoader, hideLoader, selectLoader } from "../../slices/loaderSlice";
import {
  formatCostSuffix,
} from "../../utils/common.js";
import InvestmentAlertModal from "./InvestmentAlertModal.jsx";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";
import serviceCardData from "../helper/Investmentdata.js";
import {
  calculateWeightedAvgCAGR,
  getMostRecentDate,
} from "../../utils/calculations.js";
import HoldingsRenderer from "./Investment/Components/HoldingsRenderer.jsx";

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
  const [hasTruEstimateCameForAll, setHasTruEstimateCameForAll] =
    useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedService("");
  };

  const handleServiceClick = (service) => {
    if (selectedService === service && isModalOpen) {
      setIsModalOpen(false);
      setSelectedService("");
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
  useEffect(() => {}, [isModalOpen, selectedService]);

  const navigate = useNavigate();

  // Handle window resize to toggle between screen sizes
  const handleResize = () => {
    setIsLargeScreen(window.innerWidth >= 1024);
  };

  const handleNavigate = (
    formId,
    holdingName,
    holdingtruEstimate,
    holdingTotalReturns,
    holdingCagr
  ) => {
    if (holdingtruEstimate && holdingTotalReturns && holdingCagr) {
      navigate(`/vault/investment/${holdingName}`, {
        state: { formId: formId },
      });
    } else {
      // navigate(
      //   `/vault/investment/${holdingName}`,
      //   { state: { formId: formId }, }
      // );
      setIsInfoModalOpen(true);
    }
  };
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

        const properties = []; // contain {cagr, holdingPeriod}
        const lastUpdatedList = []; // list of last updated dates of properties

        // calculate weighted avg cagr
        if (vaultFormData && vaultFormData.length > 0) {
          vaultFormData.forEach((vault) => {
            if (vault.truestimatedFullPrice) {
              const holdingPeriod =
                new Date().getFullYear() - vault.yearOfPurchase;
              //const cagr = parseFloat((Math.pow(vault?.truestimatedFullPrice / vault?.purchaseAmount, 1 / holdingPeriod) - 1).toFixed(2));
              const cagr =
                vault.cagr ||
                parseFloat(
                  (
                    Math.pow(
                      vault?.truestimatedFullPrice / vault?.purchaseAmount,
                      1 / holdingPeriod
                    ) - 1
                  ).toFixed(2)
                );
              properties.push({ cagr, holdingPeriod });

              if (vault.lastUpdated) lastUpdatedList.push(vault.lastUpdated);
            } else setHasTruEstimateCameForAll(false);
          });
        }

        if (properties.length > 0) {
          setWeightedAvgCagr(calculateWeightedAvgCAGR(properties));
        }

        if (lastUpdatedList.length > 0) {
          setLastUpdated(getMostRecentDate(lastUpdatedList));
        }

        // calculate current value of properties
        const TotalTruEstimate =
          vaultFormData && vaultFormData.length > 0
            ? parseInt(
                vaultFormData?.reduce((acc, curObj) => {
                  if (curObj.truestimatedFullPrice)
                    return acc + parseInt(curObj.truestimatedFullPrice);
                  else return acc;
                }, 0)
              )
            : null;
        setTotalTruEstimate(TotalTruEstimate || null);

        // calculate total investment in properties
        let TotalInvestment = parseInt(
          vaultFormData?.reduce((acc, curObj) => {
            if (curObj?.truestimatedFullPrice) {
              return acc + parseInt(curObj.purchaseAmount);
            } else {
              return acc;
            }
          }, 0)
        );

        setTotalPurchasedPrice(TotalInvestment);

        // calculate total returns
        setTotalReturn(
          TotalTruEstimate && TotalInvestment
            ? TotalTruEstimate - TotalInvestment
            : null
        );
      } catch (error) {}
    };

    dispatch(showLoader());
    fetchVaultData();
  }, [vaultForms, userDoc.vaultForms]);

  const [disableAddProperty, setDisableAddProperty] = useState(false);
  useEffect(() => {
    if (vaultData?.length >= 30) {
      setDisableAddProperty(true);
    } else {
      setDisableAddProperty(false);
    }
  }, [vaultData]);

  return (
    <>
      {loading ? (
        <div className="flex h-[80vh] z-[9999]">
          <Loader />
        </div>
      ) : (
        <div
          className={`${styles.investmentSummary} px-4 py-4 md:py-6 md:px-8`}
        >
          <h2 className={`${styles.heading} mb-1`}>Investment Summary</h2>
          {lastUpdated && (
            <p className={`${styles.lastUpdate} mb-3 md:mb-4`}>
              Last update: - {lastUpdated}
            </p>
          )}

          {/* Investment Summary Section */}
          <div
            className={`${styles.summaryContainer} grid grid-cols-2 lg:grid-cols-3`}
          >
            {/* TruEstimate Box */}
            <div
              className={`${styles.summaryBox} w-full  px-0 py-0   flex  flex-row justify-center  `}
            >
              <div className=" w-full px-[10px]  py-3  md:py-4 md:px-5">
                <div className={styles.labelWithIcon}>
                  <span className="h-4 mr-[6px]">
                    <img src={logo} alt="" />
                  </span>

                  {/* current price  */}
                  <div className={`${styles.label} flex md:text-sm `}>
                    <span>Current Value</span>
                  </div>
                </div>
                <div className={`${styles.value} md:text-lg`}>
                  {totalTruEstimate ? formatCostSuffix(totalTruEstimate) : "_"}
                </div>
              </div>

              <div className="  w-full  hidden  text-right xl:flex ">
                {/* <img src={Vault1}  className="object-cover hidden xl:block  " /> */}
              </div>
            </div>

            {/* Purchase Price */}
            <div
              className={`${styles.summaryBox} w-full   px-0 py-0   flex  flex-row justify-center`}
            >
              <div className=" w-full  px-[10px]  py-3   md:py-4 md:px-5">
                <div className={`${styles.label} md:text-sm   `}>
                  Amount Invested
                </div>
                <div className={`${styles.value} md:text-lg`}>
                  {totalPurchasedPrice
                    ? formatCostSuffix(totalPurchasedPrice)
                    : "_"}
                </div>
              </div>

              <div className="  w-full  hidden  text-right xl:flex ">
                {/* <img src={Vault1}  className="object-cover hidden xl:block  w-full" /> */}
              </div>
            </div>

            {/* CAGR */}
            <div
              className={`${styles.summaryBox} w-full   px-0 py-0   flex  flex-row    justify-center`}
            >
              <div className=" w-full   px-[10px]  py-3   md:py-4 md:px-5">
                <div className={`${styles.label} flex md:text-sm `}>
                  <span>CAGR</span>
                </div>
                <div
                  className={`${
                    weightedAvgCagr
                      ? weightedAvgCagr >= 0
                        ? styles.valueGreen
                        : styles.valueRed
                      : `${styles.valueRed} text-black`
                  } md:text-lg`}
                >
                  {weightedAvgCagr ? `${weightedAvgCagr} %` : "__"}
                </div>
              </div>

              <div className="  w-full  hidden  text-right xl:flex ">
                {/* <img src={Vault1}  className="object-cover hidden xl:block w-full " /> */}
              </div>
            </div>
          </div>

          {/* Holdings Section */}
          <div className="mt-9 block ">
            <div className="flex  justify-between  items-center mb-3 lg:mb-4">
              <h2 className={`${styles.heading} `}>
                Holdings({vaultData?.length || 0})
              </h2>
              <div className="flex flex-col">
                <button
                  onClick={() => {
                    navigate("/vault/findproject");
                    logEvent(analytics, `click_inside_vault_add_property`, {
                      Name: `vaultinvestment_add_property`,
                    });
                  }}
                  className={`${styles.addButton} ml-auto ${
                    disableAddProperty ? "bg-[#CCCBCB] text-[#5A5555]" : ""
                  }`}
                  disabled={disableAddProperty}
                >
                  + Add Property
                </button>
                {disableAddProperty && (
                  <span className="font-lato text-red-500 text-[12px]">
                    *You can add only upto 30 properties.
                  </span>
                )}
              </div>
            </div>

            <HoldingsRenderer
              vaultData={vaultData}
              isLargeScreen={isLargeScreen}
              handleNavigate={handleNavigate}
              styles={styles}
            />
            {!hasTruEstimateCameForAll && (
              <p className="mt-2 text-sm font-[600] font-lato">
                {" "}
                <span className="text-black">*</span>
                Investment Analysis Pending.
              </p>
            )}
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
                    logEvent(analytics, `click_inside_vault_${card.title}`, {
                      Name: `vaultinvestment_${card.title}`,
                    });
                  }}
                >
                  <img
                    src={card.icon}
                    alt={card.title}
                    className="mb-4 w-6 h-6 "
                  />
                  <div className="flex  w-full mb-1">
                    <h4 className={`${styles.propertyName} `}>{card.title}</h4>
                    <img src={arrowright} className="ml-auto" />
                  </div>

                  <p className={`${styles.h10} h-8  mb-4`}>
                    {card.description}
                  </p>
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
      )}
    </>
  );
};

export default InvestmentSummary;
