import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { analytics } from "../../firebase";
import "../Table/Table.css";
import Loader from "../Loader";
import { selectLoader } from "../../slices/loaderSlice";
import { useHits, useInstantSearch } from "react-instantsearch";
import CustomPagination from "../CustomPagination.jsx";
import { logEvent } from "firebase/analytics";
import Footer from "../../landing/pages/home/Footer";
import NoPropertiesFound from "../NoPropertiesFound/NoPropertiesFound.jsx";
import {
  customRound,
  formatCost,
  formatCostSuffix,
  formatMonthYear,
  formatTimestampDate,
  formatToOneDecimal,
  toCapitalizedWords,
  upperCaseProperties,
} from "../../utils/common.js";

const AuctionTable = ({ trueS }) => {
  const navigate = useNavigate();
  const [currentStatusState, setCurrentStatusState] = useState(0);
  const { searchTerm } = useSelector((state) => state.projectsState);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isReduxLoading = useSelector(selectLoader);
  const { loading } = useSelector((state) => state.projectsState);
  const { indexUiState, setIndexUiState, status } = useInstantSearch();
  let { hits, results } = useHits();

  function calculateFinalPrice(reservePrice, cagr, holdingPeriodYears) {
    // cagr should be in decimal form, e.g., 10% as 0.10
    return (
      reservePrice * Math.pow(1 + cagr / 100, holdingPeriodYears)
    ).toFixed(1);
  }

  useEffect(() => {
    setCurrentStatusState((prev) => prev + 1);
  }, [status]);

  const handlePrices = (price) => {
    if (price) {
      return formatCost(parseInt(price));
    } else return "____";
  };

  const handleViewMore = (project) => {
    // setting the current scroll position of the properties page while navigating to the project detail page
    //  so that when user return from there page can start from that position
    // if(currentPage==='/properties')
    // dispatch(setProjectsScrollPosition(mainContentRef?.current?.scrollTop));

    // Encodes special characters
    navigate(
      `/auction/${project.projectName.replace(/[\s\/]+/g, "-")}/${project?.projectId}`,
      {
        state: { name: project?.projectName },
      }
    );
  };

  function calculateCurrentValue(unit) {
    const area = unit?.sbua || unit?.carpetArea || unit?.plotArea || 0;
    const value = (unit?.truEstimatePrice * area) / 10000000;
    return value.toFixed(1);
  }

  function formatReservePrice(value) {
    if (value < 1) {
      return `₹${(value * 100).toFixed(0)} Lacs`;
    } else {
      return `₹${value} Cr`;
    }
  }

  function formatAuctionDate(date) {
    if (!date || date === "____") return date;
    const [month, year] = date.split("/");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  }

  const handleTruGrowthStatus = (cagr) => {
    if (cagr === "low") {
      return "Low Exp Return";
    } else if (cagr === "medium") {
      return "Medium Exp Return";
    } else if (cagr === "high") {
      return "High Exp Return";
    }
  };

  const handleTruValueStatus = (status) => {
    return toCapitalizedWords(status);
  };

  const handleGrowthAndValueStatusColour = (status) => {
    if (status === "Under Valued" || status === "High Exp Return") {
      return "#DAFBEA";
    } else if (status === "Over Valued" || status === "Low Exp Return") {
      return "#F9ABB9";
    } else if (status === "Fairly Valued" || status === "Medium Exp Return") {
      return "#FBDD97";
    }
  };

  function formatPrice(reservePrice, totalSeats) {
    let valueInLakh = reservePrice * 100; // because reservePrice is in crore

    if (totalSeats) {
      valueInLakh = valueInLakh / totalSeats;
    }

    if (valueInLakh >= 100) {
      // 1 crore or more
      const valueInCrore = valueInLakh / 100;
      return `₹${valueInCrore.toFixed(2)} Cr`;
    } else {
      return `₹${valueInLakh.toFixed(0)} Lacs`;
    }
  }

  const handleGrowthStatusColour = (status) => {
    if (status === "High CAGR") {
      return "#DAFBEA";
    } else if (status === "Low CAGR") {
      return "#FCD5DC";
    } else if (status === "Medium CAGR") {
      return "#FBDD97";
    }
  };

  const handleGrowthStatusTextColour = (status) => {
    if (status === "High CAGR") {
      return "#0E8345";
    } else if (status === "Low CAGR") {
      return "#BD0E2D";
    } else if (status === "Medium CAGR") {
      return "#866106";
    }
  };

  const resetAllFilters = () => {
    logEvent(analytics, "auction_reset_all_filters", {
      event_category: "interaction",
      event_label: "All Filters Cleared",
      page_type: "auction",
    });

    setIndexUiState((prevState) => ({
      ...prevState,
      refinementList: {},
      query: "",
      menu: {},
      range: {},
    }));
  };

  return (
    <>
      {hits && hits.length > 0 && (
        <>
          <div
            className={`w-full flex-col mb-3 px-4 md:px-8 ${isAuthenticated ? "" : `${styles.authpadding}`}`}
          >
            <div
              className={`rounded-[8px] overflow-hidden border border-[#E0E0E0] bg-[#FAFBFC] h-[calc(100vh-246px)]`}
            >
              <div className="table-container">
                <table
                  className={`w-full min-w-[1934px] border-collapse border-spacing-0 text-left cursor-default`}
                >
                  <thead className="bg-[#FAFBFC] font-montserrat font-semibold text-[12px] text-[#2B2928] sticky top-0 z-10">
                    <tr>
                      <th className="border-b border-[#E3E3E3] py-[12px] pl-[24px] pr-[8px] text-left w-[200px] border-r-[1px] md:sticky left-0 bg-[#FAFBFC] whitespace-nowrap">
                        Project Name
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[170px] whitespace-nowrap">
                        Asset Type
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[100px] whitespace-nowrap">
                        Micro Market
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[136px] whitespace-nowrap">
                        Min. Investment
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[136px] whitespace-nowrap">
                        Reserve Price (Total)
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[136px] whitespace-nowrap">
                        TruValue Status
                      </th>
                      <th
                        className={`border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[100px] whitespace-nowrap`}
                      >
                        Exp Return Growth
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[90px] whitespace-nowrap">
                        Exp Return (CAGR)
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[80px] whitespace-nowrap">
                        Strategy
                      </th>
                      <th className="border-b border-[#E3E3E3] bg-[#FBDAC0] py-[12px] px-[16px] text-left w-[80px] whitespace-nowrap">
                        Market Price
                      </th>
                      <th className="border-b border-[#E3E3E3] bg-[#FBDAC0] py-[12px] px-[16px] text-left w-[100px] whitespace-nowrap">
                        Est. Selling Price*
                      </th>
                      <th className="border-b border-[#E3E3E3] bg-[#FBDAC0] py-[12px] px-[16px] text-left w-[129px] whitespace-nowrap">
                        Max Rec Price
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[138px] whitespace-nowrap">
                        EMD submission Date
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[110px] whitespace-nowrap">
                        Auction Date
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[144px] whitespace-nowrap">
                        Possesion
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[100px] whitespace-nowrap">
                        Holding Period
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] pl-[16px] pr-[8px] text-left w-[132px] border-l-[1px] md:sticky right-0 bg-[#FAFBFC] whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-lato text-[14px] leading-[21px] text-[#5A5555] bg-[#FAFBFC] flex-col justify-start text-left z-0">
                    {hits.map((project, index) => {
                      const auction = project.auctionOverview || {};
                      const unit = project.unitDetails?.[0] || {};
                      console.log(project)
                      // console.log("Auction is",auction)
                      //console.log("Here it is",auction?.auctionDate)
                      return (
                        <tr
                          key={project.objectID || index}
                          className="hover:bg-[#F5F6F7] border-b border-[#E3E3E3]"
                        >
                          {/* Project Name */}
                          <td className="py-[12px] pl-[24px] pr-[8px] border-r-[1px] md:sticky left-0 bg-[#FAFBFC] min-w-[215px] max-w-[215px]">
                            <div
                              className="text-[#2B2928] font-medium cursor-pointer break-words"
                              onClick={() => {
                                handleViewMore(project);
                                logEvent(
                                  analytics,
                                  "auction_table_view_details",
                                  {
                                    auction_id: project.objectID,
                                    page_type: "auction_table",
                                  }
                                );
                              }}
                            >
                              {project.projectId}
                              {" : "}
                              {toCapitalizedWords(
                                project.projectName || "____"
                              )}
                            </div>
                          </td>

                          {/* Asset Type */}
                          <td className="py-[12px] px-[16px] whitespace-nowrap">
                            {toCapitalizedWords(project?.assetType || "____")}
                          </td>

                          {/* Micro Market */}
                          <td className="py-[12px] px-[16px] whitespace-nowrap">
                            {project?.micromarket || "____"}
                          </td>

                          {/* Per Seat Reserve Price */}
                          <td className="py-[12px] px-[16px] whitespace-nowrap">
                    
                            {unit?.reservePrice != null
                              ? formatPrice(unit.reservePrice, unit.totalSeats)
                              : "____"}
                          </td>

                          {/* Reserve Price (Total) */}
                          <td className="py-[12px] px-[16px] whitespace-nowrap">
                            {unit?.reservePrice
                              ? formatReservePrice(unit.reservePrice)
                              : "____"}
                          </td>

                          {/* TruValue Status */}
                          <td className="py-[12px] px-[16px] whitespace-nowrap">
                            <div
  className="rounded-[4px] text-center py-[2px] px-[8px] text-[10px] font-semibold text-[#2B2928]"
  style={{
    backgroundColor: handleGrowthAndValueStatusColour(auction?.auctionValue),
  }}
>
  {auction?.auctionValue ?? "____"}
</div>

                          </td>

                          {/* Exp Return Growth */}
                          <td className="py-[12px] px-[16px] whitespace-nowrap">
                            <div
                              className="rounded-[4px] text-center py-[2px] px-[8px] text-[10px] font-semibold text-[#2B2928]"
                              style={{
                                backgroundColor:
                                 handleGrowthAndValueStatusColour(handleTruGrowthStatus(auction?.auctionCAGR))

                              }}
                            >
                              {handleTruGrowthStatus(
                                auction?.auctionCAGR
                              ) || "____"}
                            </div>
                          </td>

                          {/* Exp Return (CAGR) */}
                          {/* <td className="py-[12px] px-[16px] whitespace-nowrap">
                            {project?.auctionCAGR != null ? `${project?.auctionCAGR}%` : "____"}
                          </td> */}
                          <td className="py-[12px] px-[16px] whitespace-nowrap">
                          {auction?.auctionCAGR ? auction?.auctionCAGR : "____"}
                          </td>

                          {/* Strategy */}
                          <td className="py-[12px] px-[16px] whitespace-nowrap">
                            {unit?.strategy
                              ? Array.isArray(unit.strategy)
                                ? unit.strategy.map((s, index) => (
                                    <span key={index}>
                                      {s}
                                      <br />
                                    </span>
                                  ))
                                : unit.strategy
                                    .split(/[,;/|]+/)
                                    .map((s, index) => (
                                      <span key={index}>
                                        {s.trim()}
                                        <br />
                                      </span>
                                    ))
                              : "____"}
                          </td>

                          {/* Market Price */}
                          <td className="py-[12px] px-[16px] bg-[#FBDAC0] whitespace-nowrap">
                            {unit
                              ? `₹${calculateCurrentValue(unit)} Cr`
                              : "____"}
                          </td>

                          {/* Est. Selling Price */}
                          <td className="py-[12px] px-[16px] bg-[#FBDAC0] whitespace-nowrap">
                            {unit?.reservePrice != null && unit?.cagr != null
                              ? `₹${calculateFinalPrice(unit.reservePrice, unit.cagr, unit?.holdingPeriodYears || 1)} Cr`
                              : "____"}
                          </td>

                          {/* Max Bid Price */}
                          <td className="py-[12px] px-[16px] bg-[#FBDAC0] whitespace-nowrap">
                            {unit?.maxBidPrice != null
                              ? `₹${unit.maxBidPrice.toFixed(1)} Cr`
                              : "____"}
                          </td>

                          {/* EMD Submission Date */}
                          <td className="py-[12px] px-[16px] whitespace-nowrap">
                            {auction?.emdSubmissionDate
                              ? formatTimestampDate(auction.emdSubmissionDate)
                              : "____"}
                          </td>

                          {/* Auction Date */}
                          <td className="py-[12px] px-[16px] whitespace-nowrap">
                            {auction?.auctionDate
                              ? formatTimestampDate(auction.auctionDate)
                              : "____"}
                          </td>

                          {/* Possession */}
                          <td className="py-[12px] px-[16px] whitespace-nowrap">
                            {toCapitalizedWords(unit?.possession || "____")}
                          </td>

                          {/* Holding Period */}
                          <td className="py-[12px] px-[16px] whitespace-nowrap">
                            {unit?.holdingPeriodYears
                              ? `${unit.holdingPeriodYears} Years`
                              : "1 Year"}
                          </td>

                          {/* Actions */}
                          <td className="py-[12px] pl-[16px] pr-[8px] border-l-[1px] md:sticky right-0 bg-[#FAFBFC] whitespace-nowrap">
                            <button
                              className="bg-[#153E3B] text-white px-3 py-1 rounded text-xs hover:bg-[#0f2f2c] transition-colors"
                              onClick={() => {
                                handleViewMore(project);
                                logEvent(
                                  analytics,
                                  "auction_table_view_details",
                                  {
                                    auction_id: project.projectId,
                                    page_type: "auction_table",
                                  }
                                );
                              }}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="sticky bottom-0 z-[1] bg-[#FAFAFA]">
            <CustomPagination />
          </div>
        </>
      )}

      {results.nbHits === 0 && status === "idle" && currentStatusState > 1 && (
        <NoPropertiesFound
          trueS={trueS}
          onResetFilters={resetAllFilters}
          title="No auction property available"
          subtitle={trueS === "true"
            ? "Due to some technical issue we're unable to show the recommended auction properties. Please try again later!"
            : "Please edit your preferences and try again."}
        />
      )}

      {(status === "loading" || status !== "idle" || isReduxLoading) && (
        <div className="flex h-[50vh]">
          <Loader />
        </div>
      )}

      {!isAuthenticated && <Footer />}
    </>
  );
};

export default AuctionTable;
