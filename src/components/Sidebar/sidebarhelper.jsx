import React, { forwardRef } from "react";
import { ListItem, ListItemPrefix } from "@material-tailwind/react";

// Icons
import WishList from "/assets/icons/features/wishlist.svg";
import Compare from "/assets/icons/features/compare.svg";
import Vault from "/assets/icons/features/vault.svg";
import Requirement from "/assets/icons/status/recommended.svg";
import Auction from "/assets/icons/features/auction.svg";
import Deals from "/assets/icons/features/deals.svg";
import Properties from "/assets/icons/features/home.svg";
import Academy from "/assets/icons/features/academy.svg";
import ArrowRight from "/assets/icons/navigation/arrow-right-alt.svg";

// Utils
import { profilePic } from "../helper/profilePicHelper.js";
import { toCapitalizedWords } from "../../utils/common.js";
import styles from "./sidebar.module.css";

// Route mapping
const routeMap = {
  "/properties": "/properties",
  "/auction": "/auction",
  "/auction/bda-auction": "/auction/bda-auction", 
  "/opportunities": "/opportunities",
  "/requirement": "/requirement",
  "/wishlist": "/wishlist",
  "/vault": "/vault",
  "/compare": "/compare",
  "/blog": "/blog",
  "/profile": "/profile",
};

// Navigation items with icons included
const NAVIGATION_ITEMS = {
  preInvestment: [
    { path: "/properties", icon: Properties, label: "Properties" },
    { path: "/auction", icon: Auction, label: "Auction Properties" },
    { path: "/opportunities", icon: Deals, label: "Exclusive Opportunities" },
    { path: "/requirement", icon: Requirement, label: "Request" },
  ],
  postInvestment: [
    { path: "/vault", icon: Vault, label: "Vault" },
  ],
  bottom: [
    { path: "/blog", icon: Academy, label: "Blogs" },
  ],
  withCounts: [
    { path: "/wishlist", icon: WishList, label: "Wish List" },
    { path: "/compare", icon: Compare, label: "Compare" },
  ]
};

// Sidebar Item Component
const SidebarItem = forwardRef(({ onClick, icon, label, isSelected }, ref) => (
  <div
    onClick={onClick}
    className={`flex flex-row md:flex-col lg:flex-row items-center mb-0 py-[6px] px-3 cursor-pointer ${
      styles.sidebarItem
    } ${isSelected ? styles.selsideitem : ""}`}
    ref={ref}
  >
    <img
      src={icon}
      alt={label}
      className="md:mb-[0.25rem] lg:mb-0 h-5 w-5 mr-3 md:mr-0 lg:mr-3 lg:h-5 flex-shrink-0"
    />
    <div
      className={`font-lato text-wrap text-left md:text-center text-[0.8125rem] md:text-[0.75rem] lg:text-[0.8125rem] leading-[150%] flex-grow min-w-0 ${
        styles.field
      } ${isSelected ? styles.seltext : ""}`}
    >
      {label}
    </div>
  </div>
));

// Sidebar Item with Count Component
const SidebarItemWithCount = ({ onClick, icon, label, isSelected, count }) => (
  <div
    onClick={onClick}
    className={`flex flex-row md:flex-col lg:flex-row items-center mb-0 py-[6px] px-3 cursor-pointer ${
      styles.sidebarItem
    } ${isSelected ? styles.selsideitem : ""}`}
  >
    <div className="relative flex-shrink-0">
      <img
        src={icon}
        alt={label}
        className="h-5 w-5 mr-3 md:mr-0 lg:mr-3 md:mb-[0.25rem] lg:mb-0"
      />
      {count > 0 && (
        <div className={`absolute md:-top-2 md:-right-2 lg:hidden hidden md:flex ${styles.count}`}>
          {count}
        </div>
      )}
    </div>
    <div className="relative flex flex-row md:flex-col lg:flex-row items-center flex-grow min-w-0">
      <div
        className={`font-lato text-left md:text-left lg:text-left truncate text-[0.8125rem] md:text-[0.75rem] lg:text-[0.8125rem] ${
          styles.field
        } ${isSelected ? styles.seltext : ""}`}
      >
        {label}
      </div>
      {count > 0 && (
        <div className={`ml-2 flex md:hidden lg:flex rounded-full ${styles.count}`}>
          {count}
        </div>
      )}
    </div>
  </div>
);

// User Profile Item Component
const UserProfileItem = ({ profile, isSelected, onClick }) => (
  <ListItem
    className={`md:block lg:flex border mt-2 ${
      isSelected ? "bg-[#BFE9E6] border-r-[0.25rem]" : ""
    }`}
    onClick={onClick}
  >
    <ListItemPrefix className="mr-2 md:mr-0 lg:mr-2 flex-shrink-0">
      <img
        src={profilePic(profile.name)}
        alt="User Profile"
        className="w-8 h-8 rounded-full max-w-none"
      />
    </ListItemPrefix>
    <div className="lg:flex flex-col truncate min-w-0">
      <p className={`${styles.username} text-center`}>
        <strong className={`${styles.username} text-nowrap text-[0.875rem] md:text-[0.625rem] lg:text-[0.875rem]`}>
          {toCapitalizedWords(profile.name)}
        </strong>
      </p>
      <div className="flex md:hidden lg:flex text-center pl-2">
        <p className={`${styles.checkpr} truncate`}>Check profile</p>
        <img src={ArrowRight} alt="Arrow" />
      </div>
    </div>
  </ListItem>
);

export { 
  SidebarItem, 
  SidebarItemWithCount, 
  NAVIGATION_ITEMS, 
  UserProfileItem, 
  routeMap 
};