// agentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDocs, query, where, collection } from "firebase/firestore";
import { db } from "../firebase"; // Ensure the path is correct
import { COLLECTIONS } from "../constants/collections";

// Thunk to fetch user details
export const fetchUserDetails = createAsyncThunk(
  "agent/fetchUserDetails",
  async (phoneNumber) => {
    const q = query(
      collection(db, "truEstateUsers"),
      where("phoneNumber", "==", phoneNumber)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      //console.log("docSnap is",docSnap.data())
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("No such document!");
    }
  }
);

// Thunk to fetch agent details
export const fetchAgentDetails = createAsyncThunk(
  "agent/fetchAgentDetails",
  async (agentId) => {
    console.log("Fetching agent details for email:", agentId);
    const q = query(collection(db, COLLECTIONS.INTERNAL_AGENTS), where("truestate.agentId", "==", agentId));
    const querySnapshot = await getDocs(q);
    console.log("Here i am",querySnapshot)
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      console.log("agent data is",docSnap.data())
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("No such document!");
    }
  }
);


const agentSlice = createSlice({
  name: "agent",
  initialState: {
    userDetails: {},
    agentDetails: {},
    tasks: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userDetails = action.payload;
        state.tasks = action.payload.tasks || [];
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchAgentDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAgentDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.agentDetails = action.payload;
      })
      .addCase(fetchAgentDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default agentSlice.reducer;
