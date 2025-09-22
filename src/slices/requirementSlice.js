import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  arrayUnion,
  arrayRemove,
  updateDoc,
  doc,
  runTransaction,
  getDoc,
} from "firebase/firestore";
import { getUnixDateTime } from "../components/helper/dateTimeHelpers";
import { db } from "../firebase";
import { COLLECTIONS } from "../constants/collections";

const generateRequirementId = async () => {
  const counterRef = doc(db, COLLECTIONS.ADMIN, "lastRequirement");

  return await runTransaction(db, async (transaction) => {
    const counterSnap = await transaction.get(counterRef);
    let currentCount = 0;

    if (counterSnap.exists()) {
      currentCount = counterSnap.data().count || 0;
    } else {
      transaction.set(counterRef, { count: 0 });
    }

    const newCount = currentCount + 1;
    const newRequirementId = `REQ${newCount.toString().padStart(3, "0")}`;

    transaction.update(counterRef, { count: newCount });
    return newRequirementId;
  });
};

export const saveRequirement = createAsyncThunk(
  "requirement/saveRequirement",
  async ({ userId, requirement }, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("Missing userId");

      const id = await generateRequirementId();

      const {
        maxBudget = 1500,
        minBudget = null,
        areas = [],
        budgetForAuction = null,
        budgetForPreLaunch = null,
        budgetForExclusiveOpp = null,
        productType = [],
        strategy = [],
        typeOfInvestment = [],
        assetType = [],
        floor = [],
        facing = [],
        projectType = [],
        loan = [],
        microMarket = [],
        plotArea = null,
        villaConfiguration = null,
        sbuaSize = null,
        whenPlanning = [],
        holdingPeriod = null,
        loanPercent = null,
        vastu = null,
        apartmentConfiguration = null,
        preferredBuilderName = [],
        auctionIds = [],
        preLaunchIds = [],
        notes = null,
        showTruestate = true,
        fromTruestate = true,
        added = getUnixDateTime(),
        status = "open",
      } = requirement || {};

      const requirementToSave = {
        id,
        maxBudget,
        minBudget,
        areas,
        budgetForAuction,
        budgetForPreLaunch,
        budgetForExclusiveOpp,
        productType,
        strategy,
        typeOfInvestment,
        assetType,
        floor,
        facing,
        projectType,
        loan,
        microMarket,
        plotArea,
        villaConfiguration,
        sbuaSize,
        whenPlanning,
        holdingPeriod,
        loanPercent,
        vastu,
        apartmentConfiguration,
        preferredBuilderName,
        auctionIds,
        preLaunchIds,
        notes,
        showTruestate,
        fromTruestate,
        added,
        status,
      };

      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) throw new Error("User not found");

      await updateDoc(userRef, {
        requirements: arrayUnion(requirementToSave),
        lastModified: getUnixDateTime(),
      });

      return requirementToSave;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRequirements = createAsyncThunk(
  "requirement/fetchRequirements",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("Missing userId");

      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const snap = await getDoc(userRef);
      if (!snap.exists()) throw new Error("User not found");

      const data = snap.data() || {};
      const allReqs = Array.isArray(data.requirements) ? data.requirements : [];
      const requirements = allReqs.filter((r) => r?.showTruestate === true);
      return requirements;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllRequirements = createAsyncThunk(
  "requirement/fetchAllRequirements",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("Missing userId");

      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const snap = await getDoc(userRef);
      if (!snap.exists()) throw new Error("User not found");

      const data = snap.data() || {};
      const allReqs = Array.isArray(data.requirements) ? data.requirements : [];
      const requirements = allReqs.filter((r) => r?.deleted !== true);
      return requirements;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteRequirement = createAsyncThunk(
  "requirement/deleteRequirement",
  async ({ userId, requirementId }, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("Missing userId");
      if (!requirementId) throw new Error("Missing requirementId");

      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const snap = await getDoc(userRef);
      if (!snap.exists()) throw new Error("User not found");

      const data = snap.data() || {};
      const currentReqs = Array.isArray(data.requirements)
        ? data.requirements
        : [];

      const requirements = currentReqs.filter((r) => r?.id !== requirementId);

      const cleanIds = (arr = []) =>
        arr.map((item) => ({
          ...item,
          requirementIds: (item?.requirementIds || []).filter(
            (id) => id !== requirementId
          ),
        }));

      const properties = {
        ...(data.properties || {}),
        auctions: cleanIds(data.properties?.auctions),
        preLaunch: cleanIds(data.properties?.preLaunch),
      };

      await updateDoc(userRef, {
        requirements,
        properties,
        lastModified: getUnixDateTime(),
      });

      return requirementId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update an existing requirement
export const updateRequirement = createAsyncThunk(
  "requirement/updateRequirement",
  async ({ userId, requirementId, updates }, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("Missing userId");
      if (!requirementId) throw new Error("Missing requirementId");

      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) throw new Error("User not found");

      const userData = userSnap.data();
      const requirements = userData.requirements || [];

      // Find and update the requirement
      const updatedRequirements = requirements.map(req => {
        if (req.id === requirementId) {
          return {
            ...req,
            ...updates,
            lastModified: getUnixDateTime()
          };
        }
        return req;
      });

      await updateDoc(userRef, {
        requirements: updatedRequirements,
        lastModified: getUnixDateTime()
      });

      return {
        id: requirementId,
        changes: {
          ...updates,
          lastModified: getUnixDateTime()
        }
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update requirement field
export const updateRequirementField = createAsyncThunk(
  "requirement/updateRequirementField",
  async ({ userId, requirementId, field, value }, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("Missing userId");
      if (!requirementId) throw new Error("Missing requirementId");

      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) throw new Error("User not found");

      const userData = userSnap.data();
      const requirements = userData.requirements || [];

      // Find and update the specific field
      const updatedRequirements = requirements.map(req => {
        if (req.id === requirementId) {
          return {
            ...req,
            [field]: value,
            lastModified: getUnixDateTime()
          };
        }
        return req;
      });

      await updateDoc(userRef, {
        requirements: updatedRequirements,
        lastModified: getUnixDateTime()
      });

      return {
        id: requirementId,
        field,
        value,
        lastModified: getUnixDateTime()
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Generate next requirement ID
export const generateRequirementIdAsync = createAsyncThunk(
  "requirement/generateRequirementId",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("Missing userId");

      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) throw new Error("User not found");

      const userData = userSnap.data();
      const requirements = userData.requirements || [];

      // Generate next requirement ID
      const existingIds = requirements.map(req => {
        const match = req.id.match(/REQ(\d+)/);
        return match ? parseInt(match[1]) : 0;
      });

      const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
      const nextId = `REQ${(maxId + 1).toString().padStart(3, '0')}`;

      return nextId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const requirementSlice = createSlice({
  name: "requirement",
  initialState: {
    requirements: [],
    status: "idle",
    error: null,
    activeRequirementId: null,
    loadingById: {},
    errorById: {},
    nextRequirementId: "REQ001"
  },
  reducers: {
    // Set active requirement
    setActiveRequirement: (state, action) => {
      state.activeRequirementId = action.payload;
    },

    // Clear errors
    clearError: (state) => {
      state.error = null;
    },

    // Clear error for specific requirement
    clearRequirementError: (state, action) => {
      const requirementId = action.payload;
      delete state.errorById[requirementId];
    },

    // Local update for optimistic updates
    updateRequirementLocal: (state, action) => {
      const { id, changes } = action.payload;
      const index = state.requirements.findIndex(req => req.id === id);
      if (index !== -1) {
        state.requirements[index] = { ...state.requirements[index], ...changes };
      }
    },

    // Set next requirement ID
    setNextRequirementId: (state, action) => {
      state.nextRequirementId = action.payload;
    },

    // Reset state
    resetRequirements: (state) => {
      state.requirements = [];
      state.status = "idle";
      state.error = null;
      state.activeRequirementId = null;
      state.loadingById = {};
      state.errorById = {};
      state.nextRequirementId = "REQ001";
    }
  },
  extraReducers: (builder) => {
    builder
      // Save
      .addCase(saveRequirement.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveRequirement.fulfilled, (state, action) => {
        state.requirements.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(saveRequirement.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })

      // Fetch visible
      .addCase(fetchRequirements.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRequirements.fulfilled, (state, action) => {
        state.requirements = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchRequirements.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })

      // Fetch all
      .addCase(fetchAllRequirements.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllRequirements.fulfilled, (state, action) => {
        state.requirements = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchAllRequirements.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })

      // Delete
      .addCase(deleteRequirement.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteRequirement.fulfilled, (state, action) => {
        state.requirements = state.requirements.filter(
          (req) => req.id !== action.payload
        );
        state.status = "succeeded";
      })
      .addCase(deleteRequirement.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })

      // Update requirement
      .addCase(updateRequirement.pending, (state, action) => {
        const requirementId = action.meta.arg.requirementId;
        state.loadingById[requirementId] = true;
        delete state.errorById[requirementId];
      })
      .addCase(updateRequirement.fulfilled, (state, action) => {
        const { id, changes } = action.payload;
        state.loadingById[id] = false;
        const index = state.requirements.findIndex(req => req.id === id);
        if (index !== -1) {
          state.requirements[index] = { ...state.requirements[index], ...changes };
        }
      })
      .addCase(updateRequirement.rejected, (state, action) => {
        const requirementId = action.meta.arg.requirementId;
        state.loadingById[requirementId] = false;
        state.errorById[requirementId] = action.payload;
      })

      // Update requirement field
      .addCase(updateRequirementField.pending, (state, action) => {
        const requirementId = action.meta.arg.requirementId;
        state.loadingById[requirementId] = true;
        delete state.errorById[requirementId];
      })
      .addCase(updateRequirementField.fulfilled, (state, action) => {
        const { id, field, value } = action.payload;
        state.loadingById[id] = false;
        const index = state.requirements.findIndex(req => req.id === id);
        if (index !== -1) {
          state.requirements[index] = {
            ...state.requirements[index],
            [field]: value,
            lastModified: action.payload.lastModified
          };
        }
      })
      .addCase(updateRequirementField.rejected, (state, action) => {
        const requirementId = action.meta.arg.requirementId;
        state.loadingById[requirementId] = false;
        state.errorById[requirementId] = action.payload;
      })

      // Generate requirement ID
      .addCase(generateRequirementIdAsync.fulfilled, (state, action) => {
        state.nextRequirementId = action.payload;
      });
  },
});

// Export actions
export const {
  setActiveRequirement,
  clearError,
  clearRequirementError,
  updateRequirementLocal,
  setNextRequirementId,
  resetRequirements
} = requirementSlice.actions;

// Selectors
export const selectAllRequirements = (state) => state.requirement.requirements;
export const selectRequirementById = (state, requirementId) =>
  state.requirement.requirements.find(req => req.id === requirementId);
export const selectRequirementsLoading = (state) => state.requirement.status === "loading";
export const selectRequirementsError = (state) => state.requirement.error;
export const selectActiveRequirementId = (state) => state.requirement.activeRequirementId;
export const selectActiveRequirement = (state) => {
  const activeId = selectActiveRequirementId(state);
  return activeId ? selectRequirementById(state, activeId) : null;
};
export const selectRequirementLoadingById = (state, requirementId) =>
  state.requirement.loadingById[requirementId] || false;
export const selectRequirementErrorById = (state, requirementId) =>
  state.requirement.errorById[requirementId] || null;
export const selectNextRequirementId = (state) => state.requirement.nextRequirementId;

// Selector for requirements by status
export const selectRequirementsByStatus = (state, status) =>
  selectAllRequirements(state).filter(req => req.status === status);

// Selector for submitted requirements
export const selectSubmittedRequirements = (state) =>
  selectAllRequirements(state).filter(req => req.status === "submitted" || req.submit === true);

// Selector for draft requirements
export const selectDraftRequirements = (state) =>
  selectAllRequirements(state).filter(req => req.status === "open" || req.submit === false);

export default requirementSlice.reducer;