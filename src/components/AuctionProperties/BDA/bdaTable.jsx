import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { analytics } from "../../../firebase";
import "../../Table/Table.css";
import Loader from "../../Loader";
import { selectLoader } from "../../../slices/loaderSlice";
import { useHits, useInstantSearch } from "react-instantsearch";
import CustomPagination from "../../CustomPagination.jsx";
import { logEvent } from "firebase/analytics";
import Footer from "../../../landing/pages/home/Footer";
import InvManager from "../../../utils/InvManager";
import WhatsappIcon from "/assets/icons/social/whatsapp-3.svg";
import { useNavigate } from "react-router-dom";
import NoPropertiesFound from "../../NoPropertiesFound/NoPropertiesFound.jsx";
import {
  customRound,
  formatCost,
  formatCostSuffix,
  formatMonthYear,
  formatTimestampDate,
  formatToOneDecimal,
  toCapitalizedWords,
  upperCaseProperties,
} from "../../../utils/common.js";
import BdaPropertyDetailModal from "./bdaPropertyDetailModal.jsx";
// TruEstate icon moved to public folder
// import truEstateIcon from "../../../assets/Icons/properties/TruEstateIcon.svg";
import { formatDate } from "../../../utils/common.js";

const BdaTable = ({ trueS, currentPage }) => {
  const [selectedMapProject, setSelectedMapProject] = useState(null);
  const [currentStatusState, setCurrentStatusState] = useState(0);
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const { searchTerm } = useSelector((state) => state.projectsState);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isReduxLoading = useSelector(selectLoader);
  const { loading } = useSelector((state) => state.projectsState);
  const { indexUiState, setIndexUiState, status } = useInstantSearch();
  const navigate = useNavigate();
  let { hits, results } = useHits();
  const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(
      window.innerWidth >= 768 && window.innerWidth < 1024
    );

    const [isDesktop, setIsDesktop] = useState(
      window.innerWidth >= 1024 && window.innerWidth <= 1280
    );

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
        setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        setIsDesktop(window.innerWidth >= 1024 && window.innerWidth <= 1280);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return { isMobile, isTablet, isDesktop };
  };

  const { isMobile, isTablet, isDesktop } = useIsMobile();

  // Debug logs (can be removed once everything works)
  console.log("BDA Table hits:", hits?.length, "records found");
  console.log("Sample BDA record:", hits?.[0]);
  console.log(
    "Recommended values in hits:",
    hits?.map((h) => ({ siteNo: h.siteNo, recommended: h.recommended }))
  );

  useEffect(() => {
    setCurrentStatusState((prev) => prev + 1);
  }, [status]);

  const formatPrice = (price) => {
    if (price) {
      return formatCost(parseInt(price));
    } else return "____";
  };

  const formatPriceInCrores = (price) => {
    if (price) {
      return `₹${(price / 100).toFixed(2)} Cr`;
    } else return "____";
  };

  const formatPriceInLacs = (price) => {
    if (price) {
      if (price >= 100) {
        return formatPriceInCrores(price);
      }
      return `₹${price} Lac`;
    } else return "____";
  };

  const handleViewMore = (project) => {
    setSelectedProperty(project);
    setPropertyModalOpen(true);
  };

  const resetAllFilters = () => {
    logEvent(analytics, "bda_auction_reset_all_filters", {
      event_category: "interaction",
      event_label: "All Filters Cleared",
      page_type: "bda_auction",
    });

    setIndexUiState((prevState) => ({
      ...prevState,
      refinementList: {},
      query: "",
      menu: {},
      range: {},
    }));
  };

  const handleOpenWhatsapp = (property) => {
    const phoneNumber = InvManager.phoneNumber;
    const message = `Hi - I’m interested in the auction of BDA Plot ${property.siteNo} ${property.layoutName}`;
    navigator.clipboard.writeText(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}/?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      {hits && hits.length > 0 && (
        <>
          <div
            className={`w-full flex-col mb-3 px-4 md:px-8 ${
              isAuthenticated ? "" : `${styles.authpadding}`
            }`}
          >
            <div
              className={`rounded-[8px] overflow-hidden border border-[#E0E0E0] bg-[#FAFBFC] ${
                isMobile || isTablet
                  ? "h-[calc(100vh-270px)]"
                  : "h-[calc(100vh-200px)]"
              }`}
            >
              <div className="table-container">
                <table
                  className={`w-full min-w-[1600px] border-collapse border-spacing-0 text-left cursor-default`}
                >
                  <thead className="bg-[#FAFBFC] font-montserrat font-semibold text-[12px] text-[#2B2928] sticky top-0 z-10">
                    <tr>
                      <th className="border-b border-[#E3E3E3] py-[12px] pl-[24px] pr-[8px] text-left w-[150px] border-r-[1px] md:sticky left-0 bg-[#FAFBFC] whitespace-nowrap max-w-[210px]">
                        Site No. & Layout
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[130px] whitespace-nowrap">
                        Micro Market
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[120px] whitespace-nowrap">
                        Plot Area (Sq ft)
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[120px] whitespace-nowrap">
                        Dimensions (ft)
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[130px] whitespace-nowrap">
                        Reserve Price
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[120px] whitespace-nowrap">
                        Price/Sq ft
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[130px] whitespace-nowrap">
                        EMD Price
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[130px] whitespace-nowrap">
                        EMD Date
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] px-[16px] text-left w-[130px] whitespace-nowrap">
                        Auction Date
                      </th>
                      <th className="border-b border-[#E3E3E3] py-[12px] pl-[16px] pr-[8px] text-left w-[132px] border-l-[1px] md:sticky right-0 bg-[#FAFBFC] whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-lato text-[14px] leading-[21px] text-[#5A5555] bg-[#FAFBFC] flex-col justify-start text-left z-0">
                    {hits.map((project, index) => (
                      <tr
                        key={project.objectID || index}
                        className="hover:bg-[#F5F6F7] border-b border-[#E3E3E3]"
                        onClick={() => setSelectedProperty(project)}
                      >
                        {/* Site No */}
                        <td className="py-[12px] pl-[24px] pr-[8px] border-r-[1px] md:sticky left-0 bg-[#FAFBFC] whitespace-wrap ">
                          <div
                            className="text-[#2B2928]  min-w-[180px] overflow-hidden font-medium cursor-pointer flex flex-row gap-4 justify-between w-full"
                            onClick={() => {
                              handleViewMore(project);
                              logEvent(
                                analytics,
                                "bda_auction_table_view_details",
                                {
                                  site_no: project.siteNo,
                                  page_type: "bda_auction_table",
                                }
                              );
                            }}
                          >
                            <div className="line-clamp-2">
                              {project.siteNo + ": " + project.layoutName ||
                                "____"}
                            </div>
                            {project.recommended && (
                              <div className="flex flex-row items-center min-w-[20px] justify-center">
                                <img
                                  src="/assets/properties/icons/truestate-badge.svg"
                                  className="h-5 w-5"
                                  alt="Recommended"
                                />
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Layout Name */}
                        {/* <td className="py-[12px] px-[16px] whitespace-nowrap">
                          <div className="text-[#2B2928] font-medium">
                            {toCapitalizedWords(project.layoutName || "____")}
                          </div>
                        </td> */}

                        {/* Micro Market */}
                        <td className="py-[12px] px-[16px] whitespace-nowrap">
                          {project.micromarket || "____"}
                        </td>

                        {/* Plot Area */}
                        <td className="py-[12px] px-[16px] whitespace-nowrap">
                          {project.plotArea
                            ? `${project.plotArea.toLocaleString()}`
                            : "____"}
                        </td>

                        {/* Dimensions */}
                        <td className="py-[12px] px-[16px] whitespace-nowrap">
                          {project.northToSouth && project.eastToWest
                            ? `${project.northToSouth} x ${project.eastToWest}`
                            : "____"}
                        </td>

                        {/* Reserve Price */}
                        <td className="py-[12px] px-[16px] whitespace-nowrap">
                          {formatPriceInLacs(project.reservePrice)}
                        </td>

                        {/* Price Per Sq ft */}
                        <td className="py-[12px] px-[16px] whitespace-nowrap">
                          {project.pricePerSqft
                            ? `₹${project.pricePerSqft.toLocaleString()}`
                            : "____"}
                        </td>

                        {/* EMD Price */}
                        <td className="py-[12px] px-[16px] whitespace-nowrap">
                          {formatPriceInLacs(project.emdPrice)}
                        </td>

                        {/* EMD Date */}
                        <td className="py-[12px] px-[16px] whitespace-nowrap">
                          {project.emdDate
                            ? formatDate(project.emdDate)
                            : "____"}
                        </td>

                        {/* Auction Date */}
                        <td className="py-[12px] px-[16px] whitespace-nowrap">
                          {project.auctionDate
                            ? formatDate(project.auctionDate)
                            : "____"}
                        </td>

                        {/* Actions */}
                        <td className="py-[12px] pl-[16px] min-w-[145px] pr-[8px] border-l-[1px] md:sticky right-0 bg-[#FAFBFC] whitespace-nowrap">
                          <button
                            className="bg-[#153E3B] text-white px-3 py-1.5 w-fit flex flex-row gap-2 rounded text-xs hover:bg-[#0f2f2c] transition-colors"
                            onClick={() => {
                              handleOpenWhatsapp(project);
                              logEvent(
                                analytics,
                                "bda_auction_table_view_details",
                                {
                                  site_no: project.siteNo,
                                  page_type: "bda_auction_table",
                                }
                              );
                            }}
                          >
                            <img
                              src={WhatsappIcon}
                              alt="Whatsapp"
                              className="w-4 h-4"
                            />
                            Enquire Now
                          </button>
                        </td>
                      </tr>
                    ))}
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
          title="No BDA auction property available"
          subtitle={trueS === "true"
            ? "Due to some technical issue we're unable to show the recommended BDA auction properties. Please try again later!"
            : "Please edit your preferences and try again."}
        />
      )}

      {(status === "loading" || status !== "idle" || isReduxLoading) && (
        <div className="flex h-[50vh]">
          <Loader />
        </div>
      )}

      {!isAuthenticated && <Footer />}
      {propertyModalOpen && (
        <BdaPropertyDetailModal
          isOpen={propertyModalOpen}
          onClose={() => {
            setPropertyModalOpen(false);
            setSelectedProperty(null);
          }}
          property={selectedProperty}
        />
      )}
    </>
  );
};

export default BdaTable;
