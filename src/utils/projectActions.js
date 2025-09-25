// src/utils/projectActions.js
import { logEvent } from "firebase/analytics";

export const toggleWishlist = async ({
  isWishlisted,
  setIsWishlisted,
  project,
  userId,
  analytics,
  dispatch,
  updateWishlist,
  fetchWishlistedProjects,
  handleRemoveProject2,
  addToast,
}) => {
  const newState = !isWishlisted;
  setIsWishlisted(newState);

  try {
    logEvent(analytics, newState ? "added-to-wishlist" : "removed-from-wishlist", {
      name: project.projectName,
    });

    if (newState) {
      await dispatch(
        updateWishlist({
          userId,
          propertyType: project.propertyType || "preLaunch",
          projectId: project.projectId,
        })
      );
      addToast("Dummy", "success", "Property Added to Wishlist", "The property has been added to the Wishlist.");
      dispatch(fetchWishlistedProjects(userId));
    } else {
      handleRemoveProject2(project.projectId);
      addToast("Dummy", "success", "Property Removed from Wishlist", "The property has been removed from the Wishlist.");
    }
  } catch (error) {
    console.error("Error in toggleWishlist:", error);
    addToast("Dummy", "error", "Wishlist Action Failed", error.message || "An unexpected error occurred. Please try again.");
    setIsWishlisted(!newState); // Revert UI
  }
};


export const toggleCompare = async ({
  isCompared,
  setIsCompared,
  project,
  type,
  analytics,
  dispatch,
  addProjectForComparison,
  fetchCompareProjects,
  addToast,
}) => {
  const propertyType = project.propertyType || type;
  if (propertyType === "auction") {
    addToast("Dummy", "info", "Compare Not Available", "Auction properties cannot be compared.");
    return;
  }

  const newState = !isCompared;
  setIsCompared(newState);

  try {
    logEvent(analytics, newState ? "added-to-compare" : "removed-from-compare", {
      name: project.projectName,
    });

    if (newState) {
      await dispatch(addProjectForComparison(project.projectId));
      addToast("Dummy", "success", "Property Added to Compare", "The property has been added to the compare list.");
    } else {
      addToast("Dummy", "success", "Property Removed from Compare", "The property has been removed from the compare list.");
    }

    dispatch(fetchCompareProjects());
  } catch (error) {
    console.error("Error in toggleCompare:", error);
    addToast("Dummy", "error", "Compare Action Failed", error.message || "An unexpected error occurred. Please try again.");
    setIsCompared(!newState); // Revert UI
  }
};
