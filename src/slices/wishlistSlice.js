import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  doc as fsDoc,
} from "firebase/firestore";
import { getUnixDateTime } from "../components/helper/dateTimeHelpers";
import {
  PROPERTY_TYPES,
  COLLECTION_BY_TYPE,
  COLLECTIONS,
} from "../constants/collections";

function ensurePropertiesShape(userDocData) {
  const props = userDocData.properties || {};
  return {
    preLaunch: Array.isArray(props.preLaunch) ? props.preLaunch : [],
    auction: Array.isArray(props.auction) ? props.auction : [],
  };
}

function findIndexByProjectId(arr, projectId) {
  return arr.findIndex((p) => p?.projectId === projectId);
}

export const updateWishlist = createAsyncThunk(
  "wishlist/updateWishlist",
  async ({ userId, propertyType, projectId, defaults = {} }, { rejectWithValue }) => {
    try {
      if (!PROPERTY_TYPES[propertyType]) {
        throw new Error("Invalid propertyType");
      }
      if (!projectId) {
        throw new Error("projectId is required");
      }
      if (!userId) {
        throw new Error("userId is required");
      }

      // 1) Check if project exists AND showOnTruEstate = true
      const collectionName = COLLECTION_BY_TYPE[propertyType];
      const pq = query(
        collection(db, collectionName),
        where("projectId", "==", projectId),
        where("showOnTruEstate", "==", true)
      );
      const ps = await getDocs(pq);
      if (ps.empty) {
        throw new Error("Project not available on TruEstate");
      }

      // 2) Locate user doc
      const userDocRef = fsDoc(db, COLLECTIONS.USERS, userId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) throw new Error("User not found");

      // 3) Normalize properties shape
      const properties = ensurePropertiesShape(userDoc.data());

      // 4) Locate array and update/create entry
      const list = properties[propertyType];
      const idx = findIndexByProjectId(list, projectId);

      const baseEntry = idx >= 0 ? { ...list[idx] } : {};

      const updatedEntry = {
        ...baseEntry,
        projectId,
        stage: baseEntry.stage ?? defaults.stage ?? "discussion initiated",
        wishlisted: true,
        added: getUnixDateTime(),
        agentId: baseEntry.agentId ?? defaults.agentId ?? null,
        agentName: baseEntry.agentName ?? defaults.agentName ?? null,
        modeOfEoi: baseEntry.modeOfEoi ?? defaults.modeOfEoi ?? null,
        requirementIds: Array.isArray(baseEntry.requirementIds)
          ? baseEntry.requirementIds
          : Array.isArray(defaults.requirementIds)
          ? defaults.requirementIds
          : [],
      };

      let nextList;
      if (idx >= 0) {
        nextList = [...list];
        nextList[idx] = updatedEntry;
      } else {
        nextList = [...list, updatedEntry];
      }

      const nextProperties = { ...properties, [propertyType]: nextList };

      // 5) Persist
      await updateDoc(userDocRef, { properties: nextProperties });

      return { userId, propertyType, projectId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeWishlist = createAsyncThunk(
  "wishlist/removeWishlist",
  async ({ userId, propertyType, projectId }, { rejectWithValue }) => {
    try {
      if (!PROPERTY_TYPES[propertyType]) {
        throw new Error("Invalid propertyType");
      }
      if (!projectId) {
        throw new Error("projectId is required");
      }
      if (!userId) {
        throw new Error("userId is required");
      }

      // ✅ Only operate if project is showOnTruEstate = true
      const collectionName = COLLECTION_BY_TYPE[propertyType];
      const pq = query(
        collection(db, collectionName),
        where("projectId", "==", projectId),
        where("showOnTruEstate", "==", true)
      );
      const ps = await getDocs(pq);
      if (ps.empty) {
        // Silently ignore — not part of wishlist
        return { userId, propertyType, projectId };
      }

      const userDocRef = fsDoc(db, COLLECTIONS.USERS, userId);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) throw new Error("User not found");

      const properties = ensurePropertiesShape(userDoc.data());
      const list = properties[propertyType];
      const idx = findIndexByProjectId(list, projectId);

      if (idx < 0) {
        // Nothing to do
        return { userId, propertyType, projectId };
      }

      const updated = {
        ...list[idx],
        wishlisted: false,
        added: getUnixDateTime(),
      };
      const nextList = [...list];
      nextList[idx] = updated;

      const nextProperties = { ...properties, [propertyType]: nextList };

      await updateDoc(userDocRef, { properties: nextProperties });

      return { userId, propertyType, projectId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchWishlistedProjects = createAsyncThunk(
  "wishlist/fetchWishlistedProjects",
  async (userId, { rejectWithValue }) => {
    try {
      // 1) Get user
      const userDocRef = fsDoc(db, COLLECTIONS.USERS, userId);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) throw new Error("User not found");

      const properties = ensurePropertiesShape(userDoc.data());

      // 2) Collect wishlisted entries from both types
      const wishlisted = [];
      for (const propertyType of Object.keys(PROPERTY_TYPES)) {
        const arr = properties[propertyType] || [];
        const picks = arr.filter((p) => p?.wishlisted === true);
        picks.forEach((p) => wishlisted.push({ ...p, propertyType }));
      }

      // 3) Enrich only if showOnTruEstate = true
      const enriched = await Promise.all(
        wishlisted.map(async (item) => {
          try {
            const collectionName = COLLECTION_BY_TYPE[item.propertyType];
            const pq = query(
              collection(db, collectionName),
              where("projectId", "==", item.projectId),
              where("showOnTruEstate", "==", true)
            );
            const ps = await getDocs(pq);

            if (!ps.empty) {
              const projectData = ps.docs[0].data();
              return {
                userStatus: item.stage ?? null,
                propertyType: item.propertyType,
                ...item,
                ...projectData,
              };
            }

            return null;
          } catch (e) {
            console.error(`Enrich failed for ${item.projectId}:`, e);
            return null;
          }
        })
      );

      return enriched.filter(Boolean);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    status: "idle",
    loading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // updateWishlist
      .addCase(updateWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateWishlist.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // removeWishlist
      .addCase(removeWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeWishlist.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(removeWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // fetchWishlistedProjects
      .addCase(fetchWishlistedProjects.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(fetchWishlistedProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlistedProjects.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectWishlistItems = (state) => state.wishlist.items;
export default wishlistSlice.reducer;
