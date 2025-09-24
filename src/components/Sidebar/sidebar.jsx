import React, { useState, useEffect, forwardRef } from "react";
import { Card, List } from "@material-tailwind/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase.js";
// Icons
import sidelogo from "/assets/icons/brands/truestate-side-logo.svg";
import Help from "/assets/icons/ui/help.svg";
import WhatsappIcon from "/assets/icons/social/whatsapp-green.svg";
import styles from "./sidebar.module.css";
// Redux slices
import { fetchCompareProjects, selectCompareProjects } from "../../slices/compareSlice";
import { fetchWishlistedProjects, selectWishlistItems } from "../../slices/wishlistSlice";
import { fetchUserProfile } from "../../slices/userSlice";
import { selectUserPhoneNumber } from "../../slices/userAuthSlice";
import { setPendingRoute } from "../../slices/vaultConfirmationSlice.js";
// Utils
import { toCapitalizedWords } from "../../utils/common.js";
import {
  SidebarItem,
  SidebarItemWithCount,
  NAVIGATION_ITEMS,
  UserProfileItem,
  routeMap
} from "./sidebarhelper.jsx";
const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/G0ukJV5Qlz9A6Ckt9hYsou?mode=ac_t";
const MAX_DISPLAY_ITEMS = 100;
const SectionHeader = ({ title }) => (
  <div
    className={`${styles.heading} mt-3 text-[.69rem] md:text-[10px] lg:text-[.69rem] text-[#0A0B0A] font-[700] px-4 md:px-0 lg:px-4 py-2 text-nowrap`}
  >
    {title}
  </div>
);

// WhatsApp Group Link Component
const WhatsAppGroupLink = () => (
  <Link
    to={WHATSAPP_GROUP_URL}
    target="_blank"
    className={`${styles.whatsappContainer} border bg-[#FAFAFA]`}
    onClick={() => logEvent(analytics, "click_join_our_group_sidebar")}
  >
    <img src={WhatsappIcon} alt="WhatsApp" />
    <span className={`font-lato font-[600] text-[14px] ${styles.whatsappText}`}>
      Join our group
    </span>
  </Link>
);

// Custom Hooks
const useResponsiveDesign = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isMobile };
};

const useSelectedItem = (location, isHelpModalOpen) => {
  const [selectedItem, setSelectedItem] = useState("/properties");

  useEffect(() => {
    if (isHelpModalOpen) {
      setSelectedItem("/help");
      return;
    }

    const pathname = location.pathname;
    const exactMatch = routeMap[pathname];
    if (exactMatch) {
      setSelectedItem(exactMatch);
      return;
    }

    for (const [route, selectedValue] of Object.entries(routeMap)) {
      if (pathname.startsWith(route)) {
        setSelectedItem(selectedValue);
        return;
      }
    }

    setSelectedItem(pathname);
  }, [location.pathname, isHelpModalOpen]);

  return [selectedItem, setSelectedItem];
};

// Help Sidebar Item Component
const HelpSidebarItem = forwardRef(({ onClick, isSelected }, ref) => (
  <SidebarItem
    onClick={onClick}
    icon={Help}
    label="Help"
    isSelected={isSelected}
    ref={ref}
  />
));

// Main Component
export default function Sidebar({
  sidebarOpen,
  toggleSidebar,
  toggleHelpModal,
  HelpmodalOpen: isHelpModalOpen,
  helpSidebarRef,
  setShowConfirmationModal,
  setShowVaultConfirmationModal,
  setConfirmFunction,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Custom hooks
  const { isMobile } = useResponsiveDesign();
  const [selectedItem, setSelectedItem] = useSelectedItem(location, isHelpModalOpen);

  // Redux selectors
  const isEditing = useSelector((state) => state.user.isEditing);
  const isVaultFormActive = useSelector((state) => state.vaultConfirmation.isVaultFormActive);
  const compareProjects = useSelector(selectCompareProjects);
  const wishlistProjects = useSelector(selectWishlistItems);
  const { profile } = useSelector((state) => state.user);
  const userPhoneNumber = useSelector(selectUserPhoneNumber);

  // Effects
  useEffect(() => {
    dispatch(fetchCompareProjects());
    dispatch(fetchWishlistedProjects());
  }, [dispatch]);

  useEffect(() => {
    if (userPhoneNumber) {
      dispatch(fetchUserProfile(userPhoneNumber));
    }
  }, [dispatch, userPhoneNumber]);

  // Event handlers
  const handleNavigation = (path) => () => {
    const navigateToPath = () => {
      const labelForAnalytics = toCapitalizedWords(path.replace("/", ""));
      setSelectedItem(path);
      navigate(path);
      logEvent(analytics, "sidebar_navigation", { name: labelForAnalytics });

      if (isMobile) {
        toggleSidebar();
      }
    };

    if (isEditing) {
      setShowConfirmationModal(true);
      setConfirmFunction(() => navigateToPath);
    } else if (isVaultFormActive) {
      setShowVaultConfirmationModal(true);
      dispatch(setPendingRoute(path));
      setConfirmFunction(() => () => {
        navigateToPath();
        logEvent(analytics, "vault_form_leaving_between_editing", {
          name: toCapitalizedWords(path.replace("/", "")),
        });
      });
    } else {
      navigateToPath();
    }
  };

  const handleHelpClick = () => {
    const clickAction = () => {
      logEvent(analytics, "click_sidebar_help");
    };

    if (isMobile) {
      navigate("/help");
      toggleSidebar();
      clickAction();
    } else {
      toggleHelpModal();
      clickAction();
    }
  };

  const handleLogoClick = () => {
    logEvent(analytics, "click_truestate_logo_sidebar", { Name: "logo_click" });
  };
  const compareCount = Math.min(compareProjects.length, MAX_DISPLAY_ITEMS);
  const wishlistCount = Math.min(wishlistProjects.length, MAX_DISPLAY_ITEMS);

  return (
    <div className={`h-full fixed ${sidebarOpen ? "w-[28vh]" : ""}`}>
      <Card
        className={`md:w-[9rem] lg:w-[12.5rem] shadow-none h-full rounded-none border-r-2 border-gray-300 pb-4 ${styles.sidebar
          } ${sidebarOpen ? "block" : "hidden"} md:block`}
      >
        <div className="border-b-2 border-gray-300 flex md:block lg:flex items-center gap-2 md:pl-0 pl-8 lg:pl-9 py-4 md:py-2 lg:py-4">
          <img
            src={sidelogo}
            alt="TruEstate Logo"
            className="md:h-[1.4rem] md:w-[1.4rem] lg:h-[1.875rem] lg:w-[1.875rem] sm:mx-0 md:mx-auto lg:mx-0 cursor-pointer"
            onClick={handleLogoClick}
          />
          <h2
            className={`${styles.sidehead} md:text-base lg:text-lg flex items-center justify-around cursor-pointer`}
            onClick={handleNavigation("/")}
          >
            <strong>TruEstate</strong>
          </h2>
        </div>
        <div className="flex flex-col justify-between h-full overflow-y-auto px-2 md:px-0 lg:px-0">
          <List className="w-[100%] min-w-0">
            <SectionHeader title="PRE INVESTMENT" />
            {NAVIGATION_ITEMS.preInvestment.map((item) => (
              <SidebarItem
                key={item.path}
                onClick={handleNavigation(item.path)}
                icon={item.icon}
                label={item.label}
                isSelected={selectedItem === item.path}
              />
            ))}
            {/* Items with counts */}
            {NAVIGATION_ITEMS.withCounts.map((item) => {
              const count = item.path === "/wishlist" ? wishlistCount : compareCount;
              return (
                <SidebarItemWithCount
                  key={item.path}
                  onClick={handleNavigation(item.path)}
                  icon={item.icon}
                  label={item.label}
                  isSelected={selectedItem === item.path}
                  count={count}
                />
              );
            })}
            {/* Post Investment Section */}
            <SectionHeader title="POST INVESTMENT" />
            {NAVIGATION_ITEMS.postInvestment.map((item) => (
              <SidebarItem
                key={item.path}
                onClick={handleNavigation(item.path)}
                icon={item.icon}
                label={item.label}
                isSelected={selectedItem === item.path}
              />
            ))}
          </List>

          {/* Bottom Section */}
          <List className="w-[100%] min-w-0 mt-auto mb-[4rem]">
            {NAVIGATION_ITEMS.bottom.map((item) => (
              <SidebarItem
                key={item.path}
                onClick={handleNavigation(item.path)}
                icon={item.icon}
                label={item.label}
                isSelected={selectedItem === item.path}
              />
            ))}
            <HelpSidebarItem
              onClick={handleHelpClick}
              isSelected={selectedItem === "/help"}
              ref={helpSidebarRef}
            />
            <WhatsAppGroupLink />
            <UserProfileItem
              profile={profile}
              isSelected={selectedItem === "/profile"}
              onClick={handleNavigation("/profile")}
            />
          </List>
        </div>
      </Card>
    </div>
  );
}