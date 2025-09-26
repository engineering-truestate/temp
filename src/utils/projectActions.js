// src/utils/projectActions.js
import { logEvent } from "firebase/analytics";
import { removeWishlist } from "../slices/wishlistSlice";
import {
  removeProjectFromComparison,
  addProjectForComparison,
} from "../slices/compareSlice";

export const toggleWishlist = async ({
  isWishlisted,
  setIsWishlisted,
  project,
  userId,
  analytics,
  dispatch,
  updateWishlist,
  addToast,
  updateToast, // make sure updateToast is available
}) => {
  const newState = !isWishlisted;
  setIsWishlisted(newState); // Optimistic UI

  // Show loading toast immediately
  const loadingToastId = addToast(
    "Wishlist",
    "loading",
    newState ? "Adding Property" : "Removing Property"
  );

  try {
    logEvent(
      analytics,
      newState ? "added-to-wishlist" : "removed-from-wishlist",
      { name: project.projectName }
    );

    if (newState) {
      await dispatch(
        updateWishlist({
          userId,
          propertyType: project.propertyType || "preLaunch",
          projectId: project.projectId,
        })
      );

      updateToast(loadingToastId, {
        type: "success",
        heading: "Property Added to Wishlist",
        description: "The property has been added to the Wishlist.",
      });
    } else {
      await dispatch(
        removeWishlist({
          userId,
          propertyType: project.propertyType || "preLaunch",
          projectId: project.projectId,
        })
      );

      updateToast(loadingToastId, {
        type: "error",
        heading: "Property Removed from Wishlist",
        description: "The property has been removed from the Wishlist.",
      });
    }
  } catch (error) {
    console.error("Error in toggleWishlist:", error);

    updateToast(loadingToastId, {
      type: "error",
      heading: "Wishlist Action Failed",
      description:
        error.message || "An unexpected error occurred. Please try again.",
    });

    setIsWishlisted(!newState); // Revert optimistic UI
  }
};

export const toggleCompare = async ({
  isCompared,
  setIsCompared,
  project,
  type,
  analytics,
  dispatch,
  addToast,
  updateToast, // make sure updateToast is available
  compareProjects,
}) => {
  const propertyType = project.propertyType || type;
  if (propertyType === "auction") {
    addToast(
      "Compare",
      "info",
      "Compare Not Available",
      "Auction properties cannot be compared."
    );
    return;
  }
  if (!isCompared && compareProjects.length >= 4) {
    addToast(
      "Compare Limit Reached",
      "error",
      "You can only compare 4 properties at a time.",
      "Remove a property from compare before adding a new one."
    );
    return;
  }

  const newState = !isCompared;
  setIsCompared(newState); // Optimistic UI

  // Show loading toast immediately
  const loadingToastId = addToast(
    "Compare",
    "loading",
    newState ? "Adding Property" : "Removing Property"
  );

  try {
    logEvent(
      analytics,
      newState ? "added-to-compare" : "removed-from-compare",
      { name: project.projectName }
    );

    if (newState) {
      await dispatch(addProjectForComparison(project.projectId));

      updateToast(loadingToastId, {
        type: "success",
        heading: "Property Added to Compare",
        description: "The property has been added to the compare list.",
      });
    } else {
      // Assuming removal happens via some other function
      await dispatch(removeProjectFromComparison(project.projectId));
      updateToast(loadingToastId, {
        type: "error",
        heading: "Property Removed from Compare",
        description: "The property has been removed from the compare list.",
      });
    }
  } catch (error) {
    console.error("Error in toggleCompare:", error);

    updateToast(loadingToastId, {
      type: "error",
      heading: "Compare Action Failed",
      description:
        error.message || "An unexpected error occurred. Please try again.",
    });

    setIsCompared(!newState); // Revert optimistic UI
  }
};
