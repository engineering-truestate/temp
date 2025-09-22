import React, { useState, useRef, useEffect } from "react";
import styles from "./ProjectDetails.module.css";
import ListIconLeft from "/assets/icons/ui/info.svg";
import ListIconRight from "/assets/icons/ui/info.svg";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";

const TruReportHeading = ({
  assetType = "all",
  type,
  isRounded,
  truReportData,
  activeTruReportTab,
  handleChange,
}) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    const scrollLeftPos = scrollRef.current.scrollLeft;
    const maxScrollLeft =
      scrollRef.current.scrollWidth - scrollRef.current.clientWidth;

    setCanScrollLeft(scrollLeftPos > 0);
    setCanScrollRight(scrollLeftPos < maxScrollLeft - 2);
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -150, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 150, behavior: "smooth" });
  };

  const propertyToBeConsidered = (tab) => {
    if (type === "area") {
      return `${tab?.area} Sq ft`;
    } else if (assetType == "villa") {
      return `P: ${tab?.carpetArea || tab?.plotArea} Sq ft | SBUA: ${tab?.sbua} Sq ft`;
    } else if (type === "carpetArea" && tab?.carpetArea) {
      return `${tab?.carpetArea} Sq ft`;
    } else if (type === "plotArea" && tab?.plotArea) {
      return `${tab?.plotArea} Sq ft`;
    } else if (tab?.sbua) {
      return `${tab?.sbua} Sq ft`;
    }

    return tab;
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check
      return () => {
        if (scrollRef.current) {
          scrollRef.current.removeEventListener("scroll", handleScroll);
        }
      };
    }
  }, []);

  return (
    <>
      <div className={`${styles.ScrollableContainer}  h-fit mt-3`}>
        <div className="relative">
          {canScrollLeft && (
            <button
              onClick={() => {
                scrollLeft();
                logEvent(analytics, `click_chng_config_property`, {
                  Name: `chng_config_property`,
                });
              }}
              className={`${styles.ScrollButton} left-0`}
            >
              <img src={ListIconLeft} alt="Scroll Left" className="w-auto" />
            </button>
          )}
          <div
            className={`flex overflow-x-auto space-x-2 ${styles.ScrollableList}`}
            ref={scrollRef}
          >
            {truReportData &&
              truReportData.length > 0 &&
              truReportData.map((tab, index) => (
                <button
                  key={index}
                  className={`${styles.configbutton}  ${isRounded && "rounded-[60px]"} ${propertyToBeConsidered(activeTruReportTab) === propertyToBeConsidered(tab) ? styles.configselected : ""}`}
                  onClick={() => {
                    handleChange(tab);
                    logEvent(analytics, `click_chng_config_property`, {
                      Name: `chng_config_property`,
                    });
                  }}
                >
                  <p
                    className={`${styles.configbuttontext}  ${propertyToBeConsidered(activeTruReportTab) === propertyToBeConsidered(tab) ? `text-white` : ""} text-nowrap`}
                  >
                    {propertyToBeConsidered(tab)}
                  </p>
                </button>
              ))}
          </div>
          {canScrollRight && (
            <button
              onClick={() => {
                scrollRight();
                logEvent(analytics, `click_chng_config_property`, {
                  Name: `chng_config_property`,
                });
              }}
              className={`${styles.ScrollButton} right-0`}
            >
              <img src={ListIconRight} alt="Scroll Right" className="w-auto" />
            </button>
          )}
        </div>
        {canScrollLeft && <div className={`${styles.FadeLeft}`} />}
        {canScrollRight && <div className={`${styles.FadeRight}`} />}
      </div>
    </>
  );
};

export default TruReportHeading;
