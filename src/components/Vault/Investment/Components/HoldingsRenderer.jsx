// components/HoldingsRenderer.jsx - Exact extraction from original rendering function
import React from 'react';
import logo from "/assets/icons/brands/truestate-logo-alt.svg";
import ArrowRight from '/assets/icons/navigation/arrow-right.svg';
import { formatCostSuffix, toCapitalizedWords } from "../../../../utils/common.js";

const HoldingsRenderer = ({ 
  vaultData, 
  isLargeScreen, 
  handleNavigate, 
  styles 
}) => {
  // Helper function from original code
  const formatarea = (price) => {
    if (!price && price !== 0) return;

    price = String(price);
    let isNegative = false;

    if (price < 0) {
      isNegative = true;
      price = Math.abs(price);
    }
    let priceStr = price?.toString().replace(/,/g, "");
    let [integerPart, decimalPart] = priceStr.split(".");

    let lastThree = integerPart.substring(integerPart.length - 3);
    let otherNumbers = integerPart.substring(0, integerPart.length - 3);

    if (otherNumbers !== "") {
      lastThree = "," + lastThree;
    }

    otherNumbers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    let formattedPrice = `${otherNumbers}${lastThree}`;
    if (decimalPart) {
      formattedPrice += `.${decimalPart}`;
    }

    if (isNegative) formattedPrice = `-${formattedPrice}`;

    return formattedPrice;
  };

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

export default HoldingsRenderer;