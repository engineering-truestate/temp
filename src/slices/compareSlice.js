import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  arrayUnion,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase";
import { selectUserPhoneNumber } from "./userAuthSlice";
import { APARTMENT_CONFIGURATION_KEYS } from "../constants/apartmentTypes";

// Helper: collect all unit prices for price calculations
const createDataFromConfiguration = (configuration) => {
  if (!configuration) return [];
  const allPrices = [];
  APARTMENT_CONFIGURATION_KEYS.forEach((key) => {
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

// Helper: collect list of configurations (1 BHK, 2 BHK, etc.)
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

// 🔹 Fetch projects for comparison
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
      // 1️⃣ Fetch user doc
      const q = query(
        collection(db, "truEstateUsers"),
        where("phoneNumber", "==", userPhoneNumber)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return compareProjects;

      let compareData = { prelaunch: [], auction: [] };

      querySnapshot.forEach((doc) => {
        const existingCompare = doc.data().compare;
        if (
          existingCompare &&
          typeof existingCompare === "object" &&
          !Array.isArray(existingCompare)
        ) {
          compareData = {
            prelaunch: existingCompare.prelaunch || [],
            auction: existingCompare.auction || [],
          };
        } else if (Array.isArray(existingCompare)) {
          compareData = { prelaunch: existingCompare, auction: [] };
        }
      });

      // 2️⃣ Fetch only showOnTruEstate projects
      if (compareData.prelaunch.length > 0) {
        const projectQuery = query(
          collection(db, "truEstatePreLaunch"),
          where("projectId", "in", compareData.prelaunch.slice(0, 4)),
          where("showOnTruEstate", "==", true) // 🔒 enforce TruEstate-only
        );
        const projectSnapshot = await getDocs(projectQuery);

        projectSnapshot.forEach((doc) => {
          const projectData = doc.data();
          if (!projectData.showOnTruEstate) return; // safeguard

          const transformedProject = {
            id: doc.id,
            projectId: handleUndefined(projectData.projectId),
            projectName: handleUndefined(projectData.projectName),
            images: projectData.images || [],
            investmentOverview: projectData.investmentOverview || {},
            micromarket: handleUndefined(projectData.micromarket),
            cagr: handleUndefined(projectData.investmentOverview?.cagr),
            commonPricePerSqft: handleUndefined(
              projectData.projectOverview?.pricePerSqft
            ),
            data: createDataFromConfiguration(projectData.configuration) || [],
            area: handleUndefined(
              projectData.locationAnalysis?.location ||
                projectData.projectOverview?.zone
            ),
            configurations: getConfigurationsList(projectData.configuration) || [],
            status: handleUndefined(projectData.projectOverview?.stage),
            holdingPeriod: handleUndefined(
              projectData.investmentOverview?.holdingPeriod
            ),
            truEstimate: handleUndefined(projectData.truEstimate),
            assetType: handleUndefined(projectData.assetType),
            builder: handleUndefined(projectData.builder),
            recommended:
              projectData.recommended !== undefined
                ? projectData.recommended
                : "Not Available",
            showOnTruEstate: handleUndefined(projectData.showOnTruEstate),
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

// 🔹 Remove project from comparison
export const removeProjectFromComparison = createAsyncThunk(
  "compare/removeProjectFromComparison",
  async (id, { getState, dispatch }) => {
    const state = getState();
    const userPhoneNumber = selectUserPhoneNumber(state);

    try {
      const q = query(
        collection(db, "truEstateUsers"),
        where("phoneNumber", "==", userPhoneNumber)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await updateDoc(userDoc.ref, {
          compare: arrayRemove(id),
        });
      }
    } catch (error) {
      console.error(error);
    }

    const newCompareProjects = await dispatch(fetchCompareProjects()).unwrap();
    return newCompareProjects;
  }
);

// 🔹 Add project for comparison (only if showOnTruEstate = true)
export const addProjectForComparison = createAsyncThunk(
  "compare/addProjectForComparison",
  async (id, { getState, rejectWithValue, dispatch }) => {
    const state = getState();
    const userPhoneNumber = selectUserPhoneNumber(state);

    try {
      // 1️⃣ Validate project is TruEstate
      const pq = query(
        collection(db, "truEstatePreLaunch"),
        where("projectId", "==", id),
        where("showOnTruEstate", "==", true)
      );
      const ps = await getDocs(pq);
      if (ps.empty) {
        throw new Error("Project not available on TruEstate");
      }

      // 2️⃣ Add to user doc
      const q = query(
        collection(db, "truEstateUsers"),
        where("phoneNumber", "==", userPhoneNumber)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const compareArray = userDoc.data().compare || [];
        if (compareArray.length < 4) {
          await updateDoc(userDoc.ref, {
            compare: arrayUnion(id),
          });
        }
      }

      // 3️⃣ Re-fetch latest projects
      const refreshed = await dispatch(fetchCompareProjects()).unwrap();
      return refreshed;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
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
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(removeProjectFromComparison.fulfilled, (state, action) => {
        state.projects = action.payload;
      })
      .addCase(removeProjectFromComparison.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addProjectForComparison.fulfilled, (state, action) => {
        state.projects = action.payload;
      })
      .addCase(addProjectForComparison.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const selectCompareProjects = (state) => state.compare.projects;
export const selectCompareLoading = (state) => state.compare.loading;
export const selectCompareError = (state) => state.compare.error;

export default compareSlice.reducer;
