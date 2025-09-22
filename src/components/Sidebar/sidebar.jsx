import React, { useState, useEffect, forwardRef } from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import { Link, redirect, useNavigate } from "react-router-dom";
import sidelogo from "/assets/icons/brands/truestate-side-logo.svg";
import WishList from "/assets/icons/features/wishlist.svg";
import Compare from "/assets/icons/features/compare.svg";
import Vault from "/assets/icons/features/vault.svg";
import Requirement from "/assets/icons/status/recommended.svg";
import Auction from "/assets/icons/features/auction.svg";
import Deals from "/assets/icons/features/deals.svg";
import Properties from "/assets/icons/features/home.svg";
import Academy from "/assets/icons/features/academy.svg";
import Help from "/assets/icons/ui/help.svg";
import ArrowRight from "/assets/icons/navigation/arrow-right-alt.svg";
import BdaPlot from "/assets/icons/features/bda.svg";
import styles from "./sidebar.module.css";
import {
  fetchCompareProjects,
  selectCompareProjects,
  removeProjectFromComparison,
} from "../../slices/compareSlice";
import {
  fetchWishlistedProjects,
  selectWishlistItems,
} from "../../slices/wishlistSlice";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../../slices/userSlice";
import { selectUserPhoneNumber } from "../../slices/userAuthSlice";
import { profilePic } from "../helper/profilePicHelper.js";
import { toCapitalizedWords } from "../../utils/common.js";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase.js";
import {
  setVaultFormActive,
  setPendingRoute,
} from "../../slices/vaultConfirmationSlice.js";
import WhatsappIcon from "/assets/icons/social/whatsapp-green.svg";
// New badge animation moved to public folder
// import newBadgeAnimation from "../../assets/Animation/NEW.json";


const SidebarItem = forwardRef(
  ({ onClick, icon, label, selected, icon2 }, ref) => {
    // ✅ ADDED: Hook to detect if screen width is in tablet range
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
      const checkIsTablet = () => {
        const width = window.innerWidth;
        setIsTablet(width < 767 || width > 1023); // Adjust the range as needed
      };

      checkIsTablet(); // Initial check
      window.addEventListener("resize", checkIsTablet);

      return () => window.removeEventListener("resize", checkIsTablet);
    }, []);

    return (
      <div
        onClick={() => {
          onClick();
          logEvent(analytics, `click_sidebar_${label.toLowerCase()}`);
        }}
        className={`flex flex-row md:flex-col lg:flex-row items-center mb-0 py-[6px] px-3 cursor-pointer ${
          styles.sidebarItem
        } ${selected ? styles.selsideitem : ""}`}
        ref={ref}
      >
        <img
          src={icon}
          alt={label}
          className={`md:mb-[0.25rem] lg:mb-0 h-5 w-5 mr-3 md:mr-0 lg:mr-3 lg:h-5`}
        />
        <div
          className={` font-lato text-wrap text-left sm:text- md:text-center text-[0.8125rem] md:text-[0.75rem] lg:text-[0.8125rem] leading-[150%] ${
            styles.field
          } ${selected ? styles.seltext : ""}`}
          style={isTablet ? { textAlign: "left" } : {}}
        >
          {label}
        </div>
      </div>
    );
  }
);

const SidebarItem2 = ({ onClick, icon, label, selected, icon2 }) => (
  <div
    onClick={() => {
      onClick();
      logEvent(analytics, `click_sidebar_${label.toLowerCase()}`);
    }}
    className={` flex flex-row md:flex-col lg:flex-row items-center py-2 px-4 cursor-pointer ${
      styles.sidebarItem
    } block sm:hidden ${selected ? styles.selsideitem : ""}`}
  >
    <img
      src={icon}
      alt={label}
      className="h-8 w-8 mr-3 md:mr-0 rounded-full "
    />
    <div
      className={`text-left md:text-center text-[0.875rem] md:text-[0.75rem] lg:text-[0.875rem] ${styles.field2}`}
    >
      {label}
      <div className={`${styles.field22} flex`}>
        Edit Profile
        <img src={ArrowRight} className="ml-2" alt="" />
      </div>
    </div>
  </div>
);

const SidebarItem3 = ({ onClick, icon, label, selected, count }) => (
  <div
    onClick={() => {
      onClick();
      logEvent(analytics, `click_sidebar_${label.toLowerCase()}`);
    }}
    className={`flex flex-row md:flex-col lg:flex-row items-center mb-0 py-[6px] px-3 cursor-pointer ${
      styles.sidebarItem
    } ${selected ? styles.selsideitem : ""}`}
  >
    <div className="relative">
      <img
        src={icon}
        alt={label}
        className="h-5 w-5 mr-3 md:mr-0 lg:mr-3 md:mb-[0.25rem] lg:mb-0"
      />

      {count > 0 && (
        <div
          className={`absolute md:-top-2 md:-right-2 lg:hidden hidden md:flex  ${styles.count}`}
        >
          {count}
        </div>
      )}
    </div>

    <div className="relative flex flex-row md:flex-col lg:flex-row items-center flex-grow">
      <div
        className={`font-lato text-left md:text-center truncate text-[0.8125rem] md:text-[0.75rem] lg:text-[0.8125rem] ${
          styles.field
        } ${selected ? styles.seltext : ""}`}
      >
        {label}
      </div>
      {count > 0 && (
        <div
          className={`ml-2 flex md:hidden lg:flex rounded-full  ${styles.count}`}
        >
          {count}
        </div>
      )}
    </div>
  </div>
);

const SidebarItem4 = forwardRef(
  ({ onClick, icon, label, selected, icon2 }, ref) => {
    // ✅ ADDED: Hook to detect if screen width is in tablet range
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
      const checkIsTablet = () => {
        const width = window.innerWidth;
        setIsTablet(width < 767 || width > 1023); // Adjust the range as needed
      };

      checkIsTablet(); // Initial check
      window.addEventListener("resize", checkIsTablet);

      return () => window.removeEventListener("resize", checkIsTablet);
    }, []);

    return (
      <div
        onClick={() => {
          onClick();
          logEvent(analytics, `click_sidebar_${label.toLowerCase()}`);
        }}
        className={`flex flex-row md:flex-row justify-between lg:flex-row items-center mb-0 py-[6px] px-3 cursor-pointer ${
          styles.sidebarItem
        } ${selected ? styles.selsideitem : ""}`}
        ref={ref}
      >
        <div className="flex flex-row items-center">
          <img
            src={icon}
            alt={label}
            className={`md:mb-[0.25rem] lg:mb-0 h-5 w-5 mr-5 md:mr-0 md:ml-1  lg:mr-3 lg:h-5`}
          />
          <div
            className={` font-lato text-wrap text-left sm:text- md:text-center md:ml-1 text-[0.8125rem] md:text-[0.75rem] lg:text-[0.8125rem] leading-[150%] ${
              styles.field
            } ${selected ? styles.seltext : ""}`}
            style={isTablet ? { textAlign: "left" } : {}}
          >
            {label}
          </div>
        </div>
        <div className="md:mr-2">{icon2 && icon2}</div>
      </div>
    );
  }
);

// const SidebarItem3 = ({ onClick, icon, label, selected, count }) => (
//   <div
//     onClick={onClick}
//     className={`flex flex-row md:flex-col lg:flex-row items-center py-2 ${label === `Compare` || label === `Wishlist` ? `px-5` : `px-4`} cursor-pointer ${styles.sidebarItem} ${selected ? styles.selsideitem : ''}`}
//   >
//     <img src={icon} alt={label} className={`h-5 w-5 md:h-7 md:w-7 mr-3 md:mr-0 lg:mr-3 lg:h-5 lg:w-5`} />
//     <div className="relative flex flex-row md:flex-col lg:flex-row items-center flex-grow">
//       <div className={`text-left md:text-center ${styles.field}`}>{label}</div>
//       {count > 0 && (
//         <div
//           style={{
//             width: '20px',
//             height: '20px',
//             borderRadius: '24px',
//             backgroundColor: '#0A0B0A',
//             color: 'white',
//             padding: '4px',
//             textAlign: 'center',
//             fontSize: '12px',
//             fontWeight: 'bold',
//             marginLeft: '10px',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}
//         >
//           {count}
//         </div>
//       )}
//     </div>
//   </div>
// );

export default function SidebarWithLogo({
  sidebarOpen,
  toggleSidebar,
  toggleHelpModal,
  HelpmodalOpen,
  toggleAgentModal,
  helpSidebarRef,
  setShowConfirmationModal,
  setShowVaultConfirmationModal,
  setConfirmFunction,
}) {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState("/properties");
  const [isMobile, setIsMobile] = useState(false);
  const isEditing = useSelector((state) => state.user.isEditing);
  const isVaultFormActive = useSelector(
    (state) => state.vaultConfirmation.isVaultFormActive
  );

  useEffect(() => {
    if (HelpmodalOpen) {
      setSelectedItem("/help");
    } else {
      setSelectedItem(location.pathname);
      if (location.pathname.startsWith("/properties")) {
        setSelectedItem("/properties");
      } else if (location.pathname === "/auction") {
        setSelectedItem("/auction");
      } else if (location.pathname === "/auction/bda-auction") {
        setSelectedItem("/auction/bda-auction");
      } else if (location.pathname.startsWith("/requirement")) {
        setSelectedItem("/requirement");
      } else if (location.pathname.startsWith("/wishlist")) {
        setSelectedItem("/wishlist");
      } else if (location.pathname.startsWith("/vault")) {
        setSelectedItem("/vault");
      } else if (location.pathname.startsWith("/compare")) {
        setSelectedItem("/compare");
      } else if (location.pathname.startsWith("/blog")) {
        setSelectedItem("/blog");
      }
    }
  }, [location.pathname, HelpmodalOpen]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleNavigation = (path) => () => {
    if (isEditing) {
      setShowConfirmationModal(true);
      setConfirmFunction(() => () => {
        const labelForAnalytics = toCapitalizedWords(path.replace("/", ""));
        setSelectedItem(path);
        navigate(path);
        logEvent(analytics, "sidebar_navigation", { name: labelForAnalytics });
        if (isMobile) {
          toggleSidebar();
        }
      });
    } else if (isVaultFormActive) {
      setShowVaultConfirmationModal(true);
      dispatch(setPendingRoute(path));
      setConfirmFunction(() => () => {
        const labelForAnalytics = toCapitalizedWords(path.replace("/", ""));
        setSelectedItem(path);
        navigate(path);
        logEvent(analytics, "vault_form_leaving_between_editing", {
          name: labelForAnalytics,
        });
        if (isMobile) {
          toggleSidebar();
        }
      });
    } else {
      navigate(path);
      const labelForAnalytics = toCapitalizedWords(path.replace("/", ""));
      setSelectedItem(path);

      logEvent(analytics, "sidebar_navigation", { name: labelForAnalytics });
      if (isMobile) {
        toggleSidebar();
      }
    }
  };

  const handleClick = () => {
    if (isMobile) {
      navigate("/help");
      toggleSidebar();
    } else {
      toggleHelpModal();
    }
  };

  const dispatch = useDispatch();
  const compareProjects = useSelector(selectCompareProjects);

  const maxCompareItems = 100;
  const projectsToShow = compareProjects.slice(0, maxCompareItems); // Limit the number of projects displayed

  useEffect(() => {
    dispatch(fetchCompareProjects());
    compareProjects;
  }, [dispatch]);

  const wishlistProjects = useSelector(selectWishlistItems);

  useEffect(() => {
    dispatch(fetchWishlistedProjects());
  }, [dispatch]);

  const projectsTowishlist = wishlistProjects.slice(0, maxCompareItems); // Limit the number of projects displayed

  const { profile, status, error } = useSelector((state) => state.user);
  const userPhoneNumber = useSelector(selectUserPhoneNumber);

  useEffect(() => {
    if (userPhoneNumber) {
      dispatch(fetchUserProfile(userPhoneNumber));
    }
  }, [dispatch, userPhoneNumber]);

  return (
    <div className={`h-full fixed ${sidebarOpen ? "w-[28vh]" : ""}`}>
      <Card
        className={`md:w-[9rem] lg:w-[12.5rem] shadow-none h-full rounded-none border-r-2 border-gray-300 pb-4 ${
          styles.sidebar
        } ${sidebarOpen ? "block" : "hidden"} md:block`}
      >
        <div className=" border-b-2 border-gray-300 flex md:block lg:flex items-center gap-2 md:pl-0 pl-8 lg:pl-9 py-4 md:py-2 lg:py-4">
          <img
            src={sidelogo}
            alt="brand"
            className="md:h-[1.4rem] md:w-[1.4rem] lg:h-[1.875rem] lg:w-[1.875rem] sm:mx-0 md:mx-auto lg:mx-0"
            onClick={() => {
              logEvent(analytics, "click_truestate_logo_sidebar", {
                Name: "logo_click",
              });
            }}
          />
          <h2
            className={`${styles.sidehead} md:text-base lg:text-lg flex items-center justify-around`}
            variant="h5"
            color="black"
            onClick={handleNavigation("/")}
            style={{ cursor: "pointer" }}
          >
            <strong className="">TruEstate</strong>
          </h2>
        </div>

        {/* Make the sidebar content scrollable */}
        <div className="flex flex-col justify-between h-full overflow-y-auto px-2 md:px-0  lg:px-0">
          <List className="w-[100%] min-w-0">
            <div
              className={`${styles.heading} mt-3 text-[.69rem]   md:text-[10px]  lg:text-[.69rem] text-[#0A0B0A] font-[700] px-4 md:px-0 lg:px-4 py-2 text-nowrap`}
            >
              PRE INVESTMENT
            </div>
            <SidebarItem
              onClick={handleNavigation("/properties")}
              icon={Properties}
              label="Properties"
              selected={selectedItem === "/properties"}
            />
            {/* <SidebarItem4
              onClick={handleNavigation("/auction/bda-auction")}
              icon={BdaPlot}
              label={"BDA Plot"}
              selected={selectedItem === "/auction/bda-auction"}
              icon2={
                <div
                  className="w-2 h-2 rounded-full bg-red-500 animate-pulse"
                  style={{
                    animation: "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                  }}
                />
              }
            /> */}
            <SidebarItem
              onClick={handleNavigation("/auction")}
              icon={Auction}
              label="Auction Properties"
              selected={selectedItem === "/auction"}
            />
            <SidebarItem
              onClick={handleNavigation("/opportunities")}
              icon={Deals}
              label="Exclusive Opportunities"
              selected={selectedItem === "/opportunities"}
            />
            <SidebarItem
              onClick={handleNavigation("/requirement")}
              icon={Requirement}
              label="Request"
              selected={selectedItem === "/requirement"}
            />
            <SidebarItem3
              onClick={handleNavigation("/wishlist")}
              icon={WishList}
              label="Wish List"
              selected={selectedItem === "/wishlist"}
              count={projectsTowishlist.length}
            />
            <SidebarItem3
              onClick={handleNavigation("/compare")}
              icon={Compare}
              label="Compare"
              selected={selectedItem === "/compare"}
              count={projectsToShow.length}
            />
            <div
              className={`${styles.heading} text-[.69rem]  md:text-[10px]  lg:text-[.69rem] text-[#0A0B0A]  font-[700] px-4 md:px-0 lg:px-4 py-2 mt-6 text-nowrap`}
            >
              POST INVESTMENT
            </div>
            <SidebarItem
              onClick={handleNavigation("/vault")}
              icon={Vault}
              label="Vault"
              selected={selectedItem === "/vault"}
            />
          </List>

          {/* Bottom items section remains at the bottom */}
          <List className="w-[100%] min-w-0 mt-auto mb-[4rem]">
            <SidebarItem
              onClick={handleNavigation("/blog")}
              icon={Academy}
              label="Blogs"
              selected={selectedItem === "/blog"}
            />
            <SidebarItem
              onClick={handleClick}
              icon={Help}
              label="Help"
              selected={selectedItem === "/help"}
              ref={helpSidebarRef}
            />

            {/* whatsapp group icon  */}
            <Link
              to={"https://chat.whatsapp.com/G0ukJV5Qlz9A6Ckt9hYsou?mode=ac_t"}
              target="_blank"
              className={`${styles.whatsappContainer} border bg-[#FAFAFA]`}
              onClick={() => {
                logEvent(analytics, "click_join_our_group_sidebar");
              }}
            >
              <img className="" src={WhatsappIcon} />
              <span
                className={`font-lato font-[600] text-[14px] ${styles.whatsappText} `}
              >
                Join our group
              </span>
            </Link>

            <ListItem
              className={`md:block lg:flex border mt-2 ${
                selectedItem === "/profile"
                  ? "bg-[#BFE9E6] border-r-[0.25rem]"
                  : ""
              }`}
              onClick={handleNavigation("/profile")}
            >
              <ListItemPrefix className="mr-2 md:mr-0 lg:mr-2">
                <img
                  src={profilePic(profile.name)}
                  alt="User"
                  className="w-8 h-8 rounded-full max-w-none"
                />
              </ListItemPrefix>

              <div className="lg:flex flex-col truncate">
                <p color="black" className={`${styles.username}  text-center`}>
                  <strong
                    className={`${styles.username} text-nowrap text-[0.875rem] md:text-[0.625rem] lg:text-[0.875rem]`}
                  >
                    {toCapitalizedWords(profile.name)}
                  </strong>
                </p>
                <div className="flex md:hidden lg:flex text-center pl-2">
                  <p className={`${styles.checkpr} truncate`}>Check profile</p>
                  <img src={ArrowRight} alt="Arrow" />
                </div>
              </div>
            </ListItem>
          </List>
        </div>
      </Card>
    </div>
  );
}
