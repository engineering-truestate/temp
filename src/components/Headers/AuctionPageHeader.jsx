import React from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import InvManager from "../../utils/InvManager";
import AuctionFilters from "../AuctionProperties/AuctionFilters";
import CustomRefinement from "../CustomRefinement";
import styles from "../MainContent.module.css";

const AuctionPageHeader = ({
  auctionView,
  handleViewToggle,
}) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <>i
      {/* Auction Guide Banner */}
      <div
        className="pt-8 md:py-8 md:px-4 bg-[linear-gradient(to_left,#FAF1CE,#F5E39D)] font-montserrat cursor-pointer"
        onClick={() => window.open("/auction-guide", "_blank")}
      >
        <h2 className="text-center text-lg sm:text-2xl font-bold mb-5">
          Beginner&#39;s Guide to Auctions
        </h2>
        <div className="block md:hidden relative">
          <Swiper
            modules={[Pagination]}
            spaceBetween={12}
            slidesPerView={"auto"}
            pagination={{
              clickable: true,
            }}
            style={{
              "--swiper-pagination-color": "#043933",
              "--swiper-pagination-bullet-inactive-color": "#999999",
              "--swiper-pagination-bullet-inactive-opacity": "0.3",
              "--swiper-pagination-bullet-horizontal-gap": "6px",
            }}
            className="pb-10 px-4"
          >
            {[
              {
                label: "What is an Auction?",
                icon: "/assets/auction/icons/auction.svg",
                section: "what-is-auction",
              },
              {
                label: "Benefits of Auction",
                icon: "/assets/auction/icons/benefits.svg",
                section: "benefits",
              },
              {
                label: "How is it Different?",
                icon: "/assets/auction/icons/difference.svg",
                section: "difference",
              },
              {
                label: "Due Diligence Checklist",
                icon: "/assets/auction/icons/checklist.svg",
                section: "checklist",
              },
              {
                label: "Why TruEstate",
                icon: "/assets/auction/icons/truestate-auction.svg",
                section: "why-truestate",
              },
              {
                label: "Wants to know more?",
                icon: "/assets/auction/icons/phone-auction.svg",
                isWhatsapp: true,
              },
            ].map((item, index) => (
              <SwiperSlide
                key={index}
                className="!w-[160px] !h-[105px] flex-shrink-0"
                onClick={() => {
                  if (item.isWhatsapp) {
                    const phoneNumber = InvManager.phoneNumber;
                    const message = encodeURIComponent(
                      "Hi - I would like to know more about Auction Properties at TruEstate"
                    );
                    window.open(
                      `https://wa.me/${phoneNumber}?text=${message}`,
                      "_blank"
                    );
                  } else {
                    window.open(
                      `/auction-guide?section=${item.section}`,
                      "_blank"
                    );
                  }
                }}
              >
                <div className="bg-white bg-opacity-[45%] border-2 border-white rounded-lg px-[14px] py-[10px] relative overflow-hidden flex items-start h-full">
                  <p className="text-base font-semibold text-gray-800">
                    {item.label}
                  </p>
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="absolute bottom-0 -right-8 w-[143px] h-[60px] object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Grid layout for desktop */}
        <div className="hidden md:flex flex-wrap justify-center gap-3">
          {[
            {
              label: "What is an Auction?",
              icon: "/assets/auction/icons/auction.svg",
              section: "what-is-auction",
            },
            {
              label: "Benefits of Auction",
              icon: "/assets/auction/icons/benefits.svg",
              section: "benefits",
            },
            {
              label: "How is it Different?",
              icon: "/assets/auction/icons/difference.svg",
              section: "difference",
            },
            {
              label: "Due Diligence Checklist",
              icon: "/assets/auction/icons/checklist.svg",
              section: "checklist",
            },
            {
              label: "Why TruEstate",
              icon: "/assets/auction/icons/truestate-auction.svg",
              section: "why-truestate",
            },
            {
              label: "Need Help?",
              icon: "/assets/auction/icons/phone-auction.svg",
              isWhatsapp: true
            },
          ].map((item, index) => (
            <div
              key={index}
              onClick={() => {
                if (item.isWhatsapp) {
                  const phoneNumber = InvManager.phoneNumber;
                  const message = encodeURIComponent(
                    "Hi - I would like to know more about Auction Properties at TruEstate"
                  );
                  window.open(
                    `https://wa.me/${phoneNumber}?text=${message}`,
                    "_blank"
                  );
                } else {
                  window.open(
                    `/auction-guide?section=${item.section}`,
                    "_blank"
                  );
                }
              }}
              className="w-[160px] h-[105px] bg-white bg-opacity-[45%] border-2 border-white rounded-lg px-[14px] py-[10px] relative overflow-hidden flex items-start cursor-pointer transform transition-transform duration-300 hover:scale-105"
            >
              <p className="text-base font-semibold text-gray-800">
                {item.label}
              </p>
              <img
                src={item.icon}
                alt={item.label}
                className="absolute bottom-0 -right-8 w-[143px] h-[60px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Filters and View Toggle Section */}
      <div className="flex flex-col h-auto w-[100%]">
        <div
          className={`sticky ${
            isAuthenticated ? "top-[64px]" : "top-[0px]"
          } bg-[#F5F6F7] z-[1]`}
        >
          <AuctionFilters />
          <div
            className={`flex flex-row sticky top-[120px] md:top-[133px] bg-white py-4 ${
              isAuthenticated ? `px-4 md:px-8` : ``
            } gap-2`}
          >
            {/* Grid/Table/Map buttons */}
            <div
              className="flex gap-4 sm:gap-2 flex-row w-fit sticky overflow-x-auto overflow-y-hidden top-0 bg-white z-[3]"
              style={{
                scrollbarWidth: "none",
                "-ms-overflow-style": "none",
                position: "sticky",
                top: "0",
              }}
            >
              <div className="flex flex-row border border-gray-400 rounded-lg p-1 w-[fit-content] h-[fit-content] min-w-max">
                <button
                  onClick={() => {
                    handleViewToggle("grid", "auction");
                  }}
                  className={`px-2 py-1 rounded flex flex-row gap-2 ${
                    auctionView === "grid" ? styles.btnsty : styles.btnsty1
                  } ${auctionView === "grid" ? styles.selected1 : ""}`}
                >
                  <img
                    src="/assets/properties/icons/view-grid.svg"
                    className={`w-[18px] h-[18px] ${
                      auctionView === "grid" ? styles.selected : ""
                    }`}
                  />
                  Grid
                </button>
                <button
                  onClick={() => {
                    handleViewToggle("table", "auction");
                  }}
                  className={`px-2 py-1 rounded flex flex-row gap-2 ${
                    auctionView === "table" ? styles.btnsty : styles.btnsty1
                  } ${auctionView === "table" ? styles.selected1 : ""}`}
                >
                  <img
                    src="/assets/properties/icons/view-table.svg"
                    className={`w-[18px] h-[18px] ${
                      auctionView === "table" ? styles.selected : ""
                    }`}
                  />
                  Table
                </button>
                <button
                  onClick={() => {
                    handleViewToggle("map", "auction");
                  }}
                  className={`px-2 py-1 rounded flex flex-row gap-2 ${
                    auctionView === "map" ? styles.btnsty : styles.btnsty1
                  } ${auctionView === "map" ? styles.selected1 : ""}`}
                >
                  <img
                    src="/assets/properties/icons/view-map.svg"
                    className={`w-[18px] h-[18px] ${
                      auctionView === "map" ? styles.selected : ""
                    }`}
                  />
                  Map
                </button>
              </div>

              <div className="flex-none">
                <CustomRefinement
                  attribute="auctions.recommended"
                  type="Auction"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuctionPageHeader;