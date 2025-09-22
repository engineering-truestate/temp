import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { COLLECTIONS } from "../constants/collections";

export const fetchUserProperties = createAsyncThunk(
  "properties/fetchUserProperties",
  async ({ userPhoneNumber, requirementId }, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, COLLECTIONS.USERS),
        where("phoneNumber", "==", userPhoneNumber)
      );

      const snapshot = await getDocs(q);
      const doc = snapshot.docs[0];
      if (!doc) return [];

      const userData = doc.data();
      const { preLaunch = [], auction = [] } = userData.properties || {};

      const filterAndTag = (arr, type) =>
        arr
          .filter((property) =>
            property.requirementIds?.includes(requirementId)
          )
          .map((property) => ({
            ...property,
            propertyType: type,
          }));

      const preLaunchFiltered = filterAndTag(preLaunch, "preLaunch");
      const auctionFiltered = filterAndTag(auction, "auction");

      return [...preLaunchFiltered, ...auctionFiltered];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAndMergeProperties = createAsyncThunk(
  "properties/fetchAndMergeProperties",
  async (userProperties, { rejectWithValue }) => {
    try {
      const properties = [];
      const batchSize = 10;

      const getCollectionRef = (propertyType) => {
        if (propertyType === "auction") {
          return collection(db, "truEstateAuctions");
        } else if (propertyType === "preLaunch") {
          return collection(db, "truEstatePreLaunch");
        }
        return null;
      };

      const grouped = userProperties.reduce((acc, prop) => {
        if (!acc[prop.propertyType]) acc[prop.propertyType] = [];
        acc[prop.propertyType].push(prop);
        return acc;
      }, {});

      for (const [propertyType, props] of Object.entries(grouped)) {
        for (let i = 0; i < props.length; i += batchSize) {
          const batch = props.slice(i, i + batchSize);
          const ids = batch.map((prop) => prop.projectId);

          const ref = getCollectionRef(propertyType);
          if (!ref) continue;

          const q = query(ref, where("__name__", "in", ids));
          const querySnapshot = await getDocs(q);

          querySnapshot.docs.forEach((doc) => {
            const docId = doc.id;
            const assetData = doc.data();

            const userProperty = props.find((p) => p.projectId === docId);

            if (userProperty) {
              properties.push({
                ...assetData,
                id: docId,
                timestamp: userProperty.added,
                recommendedBy: userProperty.agentName,
                userStatus: userProperty.stage,
                propertyType: userProperty.propertyType,
              });
            }
          });
        }
      }

      return properties.filter((property) => property.showOnTruEstate);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const propertySlice = createSlice({
  name: "properties",
  initialState: {
    userProperties: [],
    matchedProperties: [],
    isFetching: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchUserProperties
      .addCase(fetchUserProperties.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchUserProperties.fulfilled, (state, action) => {
        state.isFetching = false;
        state.userProperties = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProperties.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })

      // Handle fetchAndMergeProperties
      .addCase(fetchAndMergeProperties.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchAndMergeProperties.fulfilled, (state, action) => {
        state.isFetching = false;
        state.matchedProperties = action.payload;
        state.error = null;
      })
      .addCase(fetchAndMergeProperties.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      });
  },
});

export default propertySlice.reducer;
