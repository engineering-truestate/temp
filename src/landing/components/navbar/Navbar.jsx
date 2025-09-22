import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
const logo = '/assets/shared/images/trustate-logo-text.svg';
import building from "/assets/images/banners/build.svg";
import "./Navbar.css";
import building1 from "/assets/images/banners/building1.svg";

import { logEvent } from "firebase/analytics";
import { analytics } from "../../../firebase";

import InvManager from "../../../utils/InvManager";
import { useDispatch } from "react-redux";
import { setShowSignInModal } from "../../../slices/modalSlice.js";
import SignInButton from "../button/SignInButton.jsx";

// Logo Section Component
const LogoSection = () => (
  <div className="flex items-center">
    <NavLink to="/" aria-label="Go to Home Page">
      <img src={logo} className="h-6 md:h-9" alt="TruEstate Logo" />
    </NavLink>
  </div>
);

// Hamburger Menu Component
const HamburgerMenu = ({ isMenuOpen, toggleMenu }) => (
  <div className="lg:hidden flex items-center">
    <button
      className={`hamburger ${isMenuOpen ? "open" : ""}`}
      onClick={() => {
        toggleMenu();
        logEvent(analytics, "click_outside_nav_hamburgermenu", {
          Name: "nav_hamburgermenu",
        });
      }}
      aria-expanded={isMenuOpen}
      aria-label="Toggle Navigation Menu"
    >
      <div className="line"></div>
      <div className="line"></div>
      <div className="line"></div>
    </button>
  </div>
);

// isProductActive function for determining active product links
const isProductActive = (pathname) => {
  return pathname.startsWith("/products") || pathname === "/products/vault";
};

// NavLinkItem Component
const NavLinkItem = ({
  to,
  label,
  description,
  showIcon,
  icon,
  forwardIcon,
  className,
  closeDropdown,
  isActive,
}) => (
  <NavLink
    to={to}
    aria-label={`Go to ${label}`}
    onClick={closeDropdown}
    className={({ isActive: linkIsActive }) =>
      (isActive !== undefined ? isActive : linkIsActive)
        ? `xl:font-semibold text-gray-900 flex items-center cursor-pointer group ${className}`
        : `hover:text-gray-500 flex items-center cursor-pointer group ${className}`
    }
    style={{ padding: "12px" }}
  >
    <div className="flex gap-3">
      {showIcon &&
        icon && ( // Render the icon if available
          <img
            src={icon}
            alt={label}
            className="h-7 w-7 mb-0.5" // Adjusted image size
          />
        )}
      <div className="flex flex-col gap-0">
        {" "}
        {/* Container for label and description */}
        <div className="flex gap-1 items-center">
          {" "}
          {/* Flex container for label and icon */}
          <span className="">{label}</span> {/* Link label */}
          {showIcon &&
            forwardIcon && ( // Conditional rendering of forward icon
              <img
                src={forwardIcon} // Source for the forward icon
                alt="Forward Icon" // Accessibility label for the icon
                className="ml-2 h-4 w-4 opacity-0 transform translate-x-[-5px] group-hover:translate-x-0 group-hover:opacity-50 transition-all duration-300 ease-in-out" // Styles for the icon
              />
            )}
        </div>
        {description && ( // Conditional rendering of the description paragraph
          <p className="text-gray-500 text-paragraph-xxs">{description}</p> // Description text with styling
        )}
      </div>
    </div>
  </NavLink>
);

// Mobile Menu
const MobileMenu = ({ isMenuOpen, navLinks, bannerHeight, navbarHeight }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  // Calculate total offset (banner + navbar)
  const totalOffset = bannerHeight + navbarHeight;

  return (
    <div
      id="mobile-menu"
      className={`fixed inset-0 bg-white z-40 flex flex-col overflow-hidden transition-all duration-500 ease-in-out 
        ${isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"} border-t-[1px] border-ShadedWhite`}
      style={{ top: `${totalOffset}px` }}
      aria-expanded={isMenuOpen}
    >
      <div className=" px-4 md:px-20 lg:px-24 flex-1 overflow-y-auto w-full items-center py-2">
        {/* Main container with padding and full width for mobile and desktop views */}

        <ul className="flex flex-col gap-3 font-subheading text-heading-medium-xs md:text-heading-medium-sm text-GreenBlack justify-center w-full bg-white">
          {/* List of navigation links with full width and flex column layout for mobile responsiveness */}

          {/* Home Link */}
          <li
            className="border-b border-gray-200 hover:border-gray-700 md:mx-0 mt-4"
            onClick={() => {
              logEvent(analytics, "click_nav_Home");
            }}
          >
            <NavLinkItem to="/" label="Home" className=" !px-0" />
            {/* Navigation item for Home */}
          </li>

          {/* Properties comes first in mobile */}
          <li
            className="border-b border-gray-200 hover:border-gray-700 md:mx-0"
            onClick={() => {
              logEvent(analytics, "click_nav_Properties");
            }}
          >
            <NavLinkItem
              to="/properties"
              label="Properties"
              className=" !px-0"
              isActive={location.pathname === "/properties"}
            />
          </li>

          {/* Vault comes second in mobile */}
          <li
            className="border-b border-gray-200 hover:border-gray-700  md:mx-0"
            onClick={() => {
              logEvent(analytics, "click_nav_Vault");
            }}
          >
            <NavLinkItem
              to={isAuthenticated ? "/vault/investment" : "/products/vault"}
              label="Vault"
              className=" !px-0"
              isActive={isProductActive(location.pathname)}
            />
          </li>

          {/* Dynamic NavLinks rendered based on navLinks array (excluding Properties) */}
          {navLinks
            .filter((link) => link.label !== "Properties")
            .map((link) => (
              <li
                key={link.to}
                className="border-b border-gray-200 hover:border-gray-700 mx- md:mx-0"
                onClick={() => {
                  logEvent(analytics, `click_nav_${link.label}`);
                }}
              >
                <NavLinkItem
                  to={link.to}
                  label={link.label}
                  className="!px-0"
                />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

// Main Navbar Component
const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bannerHeight, setBannerHeight] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(64); // Default navbar height

  // Refs for measuring heights
  const bannerRef = useRef(null);
  const navbarRef = useRef(null);

  // const [isBannerVisible, setIsBannerVisible] = useState(true);
  const isBannerVisible = false; // Set to true for testing
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const showSignInModal = useSelector((state) => state.modal.showSignInModal);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Function to measure banner and navbar heights
  const measureHeights = () => {
    let totalBannerHeight = 0;

    // Measure banner height
    if (bannerRef.current) {
      totalBannerHeight = bannerRef.current.offsetHeight;
    }

    // Measure navbar height
    let currentNavbarHeight = 64; // fallback
    if (navbarRef.current) {
      currentNavbarHeight = navbarRef.current.offsetHeight;
    }

    setBannerHeight(totalBannerHeight);
    setNavbarHeight(currentNavbarHeight);
  };

  // Effect to measure heights on mount and window resize
  useEffect(() => {
    measureHeights();

    const handleResize = () => {
      measureHeights();
    };

    window.addEventListener("resize", handleResize);

    // Also measure after a short delay to ensure DOM is fully rendered
    const timer = setTimeout(measureHeights, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [isBannerVisible, showSignInModal]); // Re-measure when banner visibility or modal state changes

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Updated navLinks - removed Properties as it's now hardcoded
  const navLinks = [
    { to: "/properties", label: "Properties" }, // Keep this for mobile filtering
    // { to: "/about", label: "About" },
    // { to: "/career", label: "Career" },
    { to: "/auction", label: "Auction Properties" },
    { to: "/insights", label: "Blogs" },
    { to: "/contact", label: "Contact" },
  ];

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleBDAClick = () => {
    logEvent(analytics, "click_investment_report", {
      Name: "front_investment_report",
    });
    navigate("/new-launches");
  };

  return (
    <>
      {
        <div className="sticky top-0 z-[50]">
          {/* ✅ Top Banner - Your custom banner code */}
          {
            <div className="left-0 w-full bg-[#FAFAFA]" ref={bannerRef}>
              <div className="px-0 sm:px-[7.5%]">
                <div
                  className={`hidden sm:flex w-full h-[53px] ${showSignInModal ? "bg-gradient-to-r from-[#276B32] to-[#1E4E51] bg-opacity-0" : "bg-gradient-to-r from-[#276B32] to-[#1E4E51]"} rounded-b-[12px] items-center justify-center relative overflow-hidden`}
                  onClick={() => {
                    handleBDAClick();
                  }}
                >
                  <img
                    src={building}
                    alt="background"
                    className="absolute right-0 w-[116px] mix-blend-multiply
 opacity-0.1 top-0 h-full object-cover left-72 md:left-16 lg:left-24 2xl:left-72 overflow-hidden md:right-2 "
                  />
                  <div className="flex items-center gap-3 relative z-10 px-2">
                    {/* <span className="text-white font-bold text-[16px] font-[Montserrat]">Explore all</span> */}
                    {/* <img src={banner} alt="banner icon" className="h-[24px] w-[27px]" /> */}
                    <span className="text-white font-bold text-[16px] md:ml-2  font-[Montserrat]">
                      Compare new launches near Bengaluru airport by Tata,
                      Sattva and others
                    </span>
                    <button className="ml-5 md:ml-3 flex items-center gap-1 bg-white text-black text-[13px] font-[Lato] pl-2.5 md:pl-1 pr-2 py-1 md:px-1 rounded-md hover:shadow">
                      <div className="flex flex-row items-center px-1 gap-1">
                        <span className="text-nowrap">View report</span>
                        <span className="text-[15px] text-bold ml-1.4">→</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div
                  className={`block sm:hidden w-full h-[81px] ${showSignInModal ? "bg-gradient-to-r from-[#276B32] to-[#1E4E51] bg-opacity-0" : "bg-gradient-to-r from-[#276B32] to-[#1E4E51]"} relative overflow-hidden py-2 px-0`}
                  onClick={() => {
                    handleBDAClick();
                  }}
                >
                  <img
                    src={building1}
                    alt="background"
                    className="absolute right-4 bottom-0  object-cover h-[50px] w-[90px] vs:h-[78px] vs:w-[92px] sr:w-[90px] sr:h-[78px] sl:h-[78px] sl:w-[93px] opacity-0.6 mix-blend-multiply overflow-hidden"
                  />
                  <div className="relative z-10 flex flex-col gap-2 justify-center px-4">
                    <span className="text-white font-semibold font-[Montserrat] text-[13px]">
                      Compare new launches near Bengaluru airport by Tata,
                      Sattva and others
                    </span>
                    <button className="w-fit flex items-center gap-0.5 bg-white text-black text-[12px]  font-[Lato] pl-1.5 pr-1 py-0.5 rounded-md hover:shadow">
                      View Report
                      <span className="text-[13px] font-bold ml-1 mr-1">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }

          {/* ✅ Original Navbar */}
          <div
            className="bg-[#FAFAFA] w-full flex flex-col items-center !overflow-visible"
            ref={navbarRef}
          >
            <div className="w-full md:px-20 lg:px-24 ">
              {isBannerVisible && (
                <div className="w-full bg-GableGreen text-white py-3 md:py-2 flex md:flex-row justify-center items-center relative sm:rounded-lg md:mt-2 mb-0 font-body">
                  <span className="text-paragraph-xxs md:text-paragraph-md">
                    Get Your E-khata Transfer Now
                  </span>
                  <a
                    href={`https://wa.me/${InvManager.phoneNumber}?text=${"Hi, I'm interested in availing your services to transfer my Khata to E-Khata. Could you please guide me through the process and let me know the details?"}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 md:ml-4 underline text-label-xs md:text-label-sm text-gray-300"
                    onClick={() => {
                      logEvent(analytics, "click_outside_nav_know_more", {
                        Name: "outside_nav_know_more",
                      });
                    }}
                  >
                    Know more
                  </a>

                  {/* Adjusted position for close button */}
                  <button
                    onClick={() => {
                      logEvent(analytics, "click_outside_nav_close", {
                        Name: "nav_close_know_more",
                      });
                    }}
                    className="absolute right-3 top-[22%] sm:right-4 sm:top-[15%] text-white text-lg"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>

            <div className="border-b py-0 z- top-0 w-full flex items-center h-16 px-4">
              <div className="w-full px-1 md:px-20 lg:px-24 py-3 xl:py-0 mx-auto flex justify-between relative">
                <div className="flex items-center gap-2 sm:gap-4">
                  <HamburgerMenu
                    isMenuOpen={isMenuOpen}
                    toggleMenu={toggleMenu}
                  />
                  <LogoSection />
                </div>

                <ul className="lg:flex gap-2 font-subheading md:text-heading-medium-xs text-GreenBlack items-center hidden">
                  <li
                    onClick={() => {
                      logEvent(analytics, "click_navbar_home");
                    }}
                  >
                    <NavLinkItem
                      to="/"
                      label="Home"
                      isActive={location.pathname === "/"}
                    />
                  </li>

                  {/* Properties comes first now */}
                  <li
                    onClick={() => {
                      logEvent(analytics, "click_navbar_properties");
                    }}
                  >
                    <NavLinkItem
                      to="/properties"
                      label="Properties"
                      isActive={location.pathname === "/properties"}
                    />
                  </li>

                  {/* Vault comes second now */}
                  <li className="relative flex items-center space-x-2 py-3">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => {
                        logEvent(analytics, "click_navbar_vault");
                      }}
                    >
                      <NavLinkItem
                        to={
                          isAuthenticated
                            ? "/vault/investment"
                            : "/products/vault"
                        }
                        label="Vault"
                        isActive={isProductActive(location.pathname)}
                      />
                    </div>
                  </li>

                  {/* Other nav links (excluding Properties since it's now hardcoded) */}
                  {navLinks
                    .filter((link) => link.label !== "Properties")
                    .map((link) => (
                      <li
                        key={link.to}
                        onClick={() => {
                          logEvent(analytics, `click_navbar_${link.label}`);
                        }}
                      >
                        <NavLinkItem
                          to={link.to}
                          label={link.label}
                          isActive={location.pathname === link.to}
                        />
                      </li>
                    ))}
                </ul>

                <div className="lg:flex gap-3 items-center justify-center">
                  {/* Button for Sign in */}
                  {!isAuthenticated ? (
                    <SignInButton
                      label="Sign up/Log in"
                      onClick={() =>
                        dispatch(
                          setShowSignInModal({
                            showSignInModal: true,
                            redirectUrl: "/properties",
                          })
                        )
                      }
                      classes="font-body lg:text-label-sm !bg-GableGreen !text-white"
                      eventName="click_outside_navbar_sign/log" // Tracking event name
                      eventCategory="CTA" // Tracking category
                      eventAction="click" // Tracking action
                      eventLabel="sign_up_cta_navbar" // Tracking label for Sign In button
                    />
                  ) : (
                    <SignInButton
                      label="Continue to Dashboard"
                      onClick={() => navigate("/properties")}
                      classes="font-body lg:text-label-sm !bg-GableGreen !text-white"
                      eventName="click_outside_nav_dashboard" // Tracking event name
                      eventCategory="CTA" // Tracking category
                      eventAction="click" // Tracking action
                      eventLabel="sign_up_cta_navbar" // Tracking label for Sign In button
                    />
                  )}
                </div>
              </div>

              <MobileMenu
                isMenuOpen={isMenuOpen}
                closeMenu={closeMenu}
                navLinks={navLinks}
                isDropdownOpen={isDropdownOpen}
                toggleDropdown={toggleDropdown}
                bannerHeight={bannerHeight}
                navbarHeight={navbarHeight}
              />
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default Navbar;