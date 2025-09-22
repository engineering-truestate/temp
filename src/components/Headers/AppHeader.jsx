import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { Typography } from "@material-tailwind/react";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";
import InvManagerIcon from "/assets/icons/brands/investment-manager.svg";
import PageSearchBox from "../InstantSearch/PageSearchBox";
import styles from "../MainContent.module.css";

const AppHeader = ({
  sidebarOpen,
  toggleSidebar,
  toggleAgentModal,
  pageTitle,
  children,
  className = "",
}) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= 768 && window.innerWidth < 1024
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine if search should be shown based on page type and screen size
  const shouldShowSearch = () => {
    const pathname = location.pathname;
    const isSearchPage = pathname.startsWith("/properties") || pathname.startsWith("/auction");
    const isDesktop = !(isMobile || isTablet);
    return isSearchPage && isDesktop;
  };

  const handleSidebarClick = () => {
    toggleSidebar();
    logEvent(analytics, `click_sidebar`, {
      Name: "sidebar",
    });
  };

  return (
    <div className={`sticky top-0 left-0 z-10 ${className}`}>
      <div
        className={`flex flex-row justify-between top-0 h-16 border-b-2 border-gray-300 items-center py-2 pl-4 ${styles.headingbar}`}
      >
        <div className="flex items-center">
          <button
            className={`md:hidden p-1 top-3 left-4 z-10 ${
              sidebarOpen ? "hidden" : "block"
            } rounded border-2 border-gray-300`}
            onClick={handleSidebarClick}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <Typography className={`ml-4 md:ml-4 ${styles.mainhead}`}>
            {pageTitle}
          </Typography>
        </div>

        <div className="flex flex-row gap-2 items-center">
          {/* Page-specific content (search box, etc.) */}
          {children}

          {/* Search box for properties and auction pages on desktop */}
          {shouldShowSearch() && <PageSearchBox />}

          {/* Investment Manager Button */}
          <div className="flex justify-between items-center right-0 mr-4 md:mr-8 h-[37px]">
            <button
              className={`border px-3 py-2 rounded-md flex items-center justify-center ${styles.actionButton2}`}
              onClick={toggleAgentModal}
            >
              <img
                src={InvManagerIcon}
                alt="IM"
                className="md:w-6 md:h-6 md:mr-2 w-6 h-6"
              />
              <div
                id="step-1"
                className={`hidden sm:hidden md:block lg:block ${styles.agnme}`}
              >
                Inv. Manager
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;