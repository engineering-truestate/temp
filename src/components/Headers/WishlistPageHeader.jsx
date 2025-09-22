import React from "react";
import { useSelector } from "react-redux";
import PageSortBy from "../InstantSearch/PageSortBy";
import styles from "../MainContent.module.css";

const WishlistPageHeader = ({
  selectedSortOption,
  setSelectedSortOption,
  isVisible = true,
}) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div
      className={`${
        isAuthenticated
          ? "sticky top-16"
          : "sticky top-0 px-4 md:px-20 lg:px-24"
      } z-10 flex h-10vh ${styles.wholesearch}`}
    >
      <div className="flex flex-col h-auto w-[100%]">
        {/* Wishlist Controls */}
        <div
          className={`flex flex-row flex-wrap my-4 mb-4 ${
            isAuthenticated ? "px-4 md:px-8" : ""
          } gap-2`}
        >
          <div className="flex gap-4 sm:gap-2 flex-row w-fit">
            <div className="text-lg font-semibold text-gray-700">
              Your Wishlist
            </div>
          </div>

          {/* Sort By Component for Wishlist */}
          {isVisible && (
            <PageSortBy
              selectedSortOption={selectedSortOption}
              onSortChange={setSelectedSortOption}
              isVisible={isVisible}
              className="ml-auto"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistPageHeader;