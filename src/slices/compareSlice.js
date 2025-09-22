import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  arrayUnion,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase";
import { selectUserPhoneNumber } from "./userAuthSlice";
import { APARTMENT_CONFIGURATION_KEYS } from "../constants/apartmentTypes";

// Async thunk to fetch the compare projects
// Helper function to create data array from configuration for price calculations
const createDataFromConfiguration = (configuration) => {
  if (!configuration) return [];

  const allPrices = [];
  const configKeys = APARTMENT_CONFIGURATION_KEYS;

  configKeys.forEach((key) => {
    if (configuration[key] && Array.isArray(configuration[key])) {
      configuration[key].forEach((unit) => {
        if (unit.currentPrice) {
          allPrices.push({ totalPrice: unit.currentPrice });
        }
      });
    }
  });

  return allPrices;
};

// Helper function to get configurations list
const getConfigurationsList = (configuration) => {
  if (!configuration) return [];

  const configs = [];
  const configMap = {
    studio: "Studio",
    oneBHK: "1 BHK",
    oneBHKPlus: "1 BHK+",
    twoBHK: "2 BHK",
    twoBHKPlus: "2 BHK+",
    threeBHK: "3 BHK",
    threeBHKPlus: "3 BHK+",
    fourBHK: "4 BHK",
    fourBHKPlus: "4 BHK+",
    fiveBHK: "5 BHK",
    fiveBHKPlus: "5 BHK+",
    sixBHK: "6 BHK",
  };

  Object.keys(configMap).forEach((key) => {
    if (
      configuration[key] &&
      Array.isArray(configuration[key]) &&
      configuration[key].length > 0
    ) {
      configs.push(configMap[key]);
    }
  });

  return configs;
};

export const fetchCompareProjects = createAsyncThunk(
  "compare/fetchCompareProjects",
  async (arg = null, { getState, rejectWithValue }) => {
    const state = getState();
    const userPhoneNumber = selectUserPhoneNumber(state);
    let compareProjects = [];

    const handleUndefined = (value) =>
      value === undefined || value === null || value === "undefined"
        ? "Not Available"
        : value;

    try {
      // 1️⃣ Fetch user document by phone number
      const q = query(
        collection(db, "truEstateUsers"),
        where("phoneNumber", "==", userPhoneNumber)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return compareProjects;

      let compareData = { prelaunch: [], auction: [] };

      querySnapshot.forEach((doc) => {
        const existingCompare = doc.data().compare;

        if (existingCompare && typeof existingCompare === "object" && !Array.isArray(existingCompare)) {
          compareData = {
            prelaunch: existingCompare.prelaunch || [],
            auction: existingCompare.auction || [],
          };
        } else if (existingCompare && Array.isArray(existingCompare)) {
          compareData = { prelaunch: existingCompare, auction: [] };
        }
      });

      // 2️⃣ Fetch project details from truEstatePreLaunch
      if (compareData.prelaunch.length > 0) {
        const projectQuery = query(
          collection(db, "truEstatePreLaunch"),
          where("projectId", "in", compareData.prelaunch.slice(0, 4))
        );
        const projectSnapshot = await getDocs(projectQuery);

        projectSnapshot.forEach((doc) => {
          const projectData = doc.data();

          // Only include projects with showOnTruEstate === true
          if (!projectData.showOnTruEstate) return;

          const transformedProject = {
            id: doc.id,
            projectId: handleUndefined(projectData.projectId),
            projectName: handleUndefined(projectData.projectName),
            images: projectData.images || [],
            investmentOverview: projectData.investmentOverview || {},
            micromarket: handleUndefined(projectData.micromarket),
            cagr: handleUndefined(projectData.investmentOverview?.cagr),
            commonPricePerSqft: handleUndefined(projectData.projectOverview?.pricePerSqft),
            data: createDataFromConfiguration(projectData.configuration) || [],
            area: handleUndefined(projectData.locationAnalysis?.location || projectData.projectOverview?.zone),
            configurations: getConfigurationsList(projectData.configuration) || [],
            status: handleUndefined(projectData.projectOverview?.stage),
            holdingPeriod: handleUndefined(projectData.investmentOverview?.holdingPeriod),
            truEstimate: handleUndefined(projectData.truEstimate),
            assetType: handleUndefined(projectData.assetType),
            builder: handleUndefined(projectData.builder),
            recommended: projectData.recommended !== undefined ? projectData.recommended : "Not Available",
          };

          compareProjects.push(transformedProject);
        });
      }

      return compareProjects;
    } catch (error) {
      console.error("🚨 Error fetching compare projects:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to remove a project from comparison
export const removeProjectFromComparison = createAsyncThunk(
  "compare/removeProjectFromComparison",
  async (id, { getState, dispatch }) => {
    const state = getState();
    const userPhoneNumber = selectUserPhoneNumber(state);

    try {
      // Step 1: Query the truEstateUsers collection to find the document for the current user
      const q = query(
        collection(db, "truEstateUsers"),
        where("phoneNumber", "==", userPhoneNumber)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const compareArray = userDoc.data().compare || [];

        // Step 2: Update the compare array in Firestore by removing the id
        await updateDoc(userDoc.ref, {
          compare: arrayRemove(id),
        });
      }
    } catch (error) {}

    // Re-fetch the compare projects to get the updated list
    const newCompareProjects = await dispatch(fetchCompareProjects()).unwrap();
    return newCompareProjects;
  }
);

export const addProjectForComparison = createAsyncThunk(
  "compare/addProjectForComparison",
  async (id, { getState }) => {
    const state = getState();
    const userPhoneNumber = selectUserPhoneNumber(state);

    try {
      // Step 1: Query the truEstateUsers collection to find the document for the current user
      const q = query(
        collection(db, "truEstateUsers"),
        where("phoneNumber", "==", userPhoneNumber)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const compareArray = userDoc.data().compare || [];

        // Step 2: Update the compare array in Firestore by adding the id
        if (compareArray.length < 4) {
          // Ensure only 4 projects can be added for comparison
          await updateDoc(userDoc.ref, {
            compare: arrayUnion(id),
          });
        }
        return userDoc.data();
      }
    } catch (error) {}

    // Re-fetch the compare projects to get the updated list
  }
);

const compareSlice = createSlice({
  name: "compare",
  initialState: {
    projects: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompareProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompareProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
        state.loading = false;
      })
      .addCase(fetchCompareProjects.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(removeProjectFromComparison.fulfilled, (state, action) => {
        state.projects = action.payload;
      })
      .addCase(removeProjectFromComparison.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(addProjectForComparison.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(addProjectForComparison.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const selectCompareProjects = (state) => state.compare.projects;
export const selectCompareLoading = (state) => state.compare.loading;
export const selectCompareError = (state) => state.compare.error;

export default compareSlice.reducer;
