import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDocs,
  query,
  where,
  collection,
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase"; // Make sure db is initialized Firestore instance
import { getUnixDateTime } from "../components/helper/dateTimeHelpers";
import { COLLECTIONS } from "../constants/collections";


export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (phoneNumber, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, COLLECTIONS.USERS),
        where("phoneNumber", "==", phoneNumber)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      return rejectWithValue(error?.message || "Something went wrong");
    }
  }
);

export const addTask = createAsyncThunk(
  "user/addTask",
  async ({ userId, taskDetails }, { rejectWithValue }) => {
    try {


      // Find user by userId (document ID)
      const userDocRef = doc(db, COLLECTIONS.USERS, userId);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        throw new Error("User not found");
      }

      const userDoc = userDocSnap;

      // Get and update admin task count
      const adminDocRef = doc(db, COLLECTIONS.ADMIN, "lastTaskId");
      const adminDocSnap = await getDoc(adminDocRef);

      let lastCount = 0;
      if (adminDocSnap.exists()) {
        lastCount = adminDocSnap.data()?.count || 0;
      }

      const taskId = `task${(lastCount + 1).toString().padStart(3, "0")}`;

      await updateDoc(adminDocRef, { count: lastCount + 1 });

      // Create new task object
      const newTask = {
        ...taskDetails,
        taskId,
        userName: userDoc.data()?.name ?? "",
        userId: userDoc.id,
        agentId: userDoc.data()?.agentId ?? "",
        agentName: userDoc.data()?.agentName ?? "",
        added: getUnixDateTime(),
        lastModified: getUnixDateTime(),
      };

      // Save the task in Firestore
      await setDoc(doc(db, COLLECTIONS.TASKS, taskId), newTask);

      console.log("taskdetails", newTask);

      return { success: true };
    } catch (error) {
      console.log("Hare Krishnaa", error);
      return rejectWithValue(error?.message || "Something went wrong");
    }
  }
);

export const addProperty = createAsyncThunk(
  "user/addProperty",
  async (
    { phoneNumber, projectId, projectName, propertyType },
    { rejectWithValue }
  ) => {
    try {
      const usersRef = collection(db, COLLECTIONS.USERS);
      const q = query(usersRef, where("phoneNumber", "==", phoneNumber));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("User not found with the given phone number");
      }

      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;
      const userData = userDoc.data();

      if (!["auction", "preLaunch"].includes(propertyType)) {
        throw new Error(
          "Invalid propertyType. It should be either 'auction' or 'preLaunch'."
        );
      }

      const existingProperties = [
        ...(userData?.properties?.[propertyType] || []),
      ];
      const existingIndex = existingProperties.findIndex(
        (p) => p.projectId === projectId
      );

      if (existingIndex === -1) {
        const newProperty = {
          projectId,
          projectName,
          stage:
            propertyType == "auction"
              ? "enquiry initiated"
              : "discussion initiated",
          wishlisted: false,
          requirementIds: [],
          agentName: userData.agentName,
          agentId: userData.agentId,
          added: getUnixDateTime(),
          ...(propertyType === "auction"
            ? { modeOfEmd: null }
            : { modeOfEoi: null }),
        };

        existingProperties.push(newProperty);
      }

      const userRef = doc(db, COLLECTIONS.USERS, userId);
      await updateDoc(userRef, {
        [`properties.${propertyType}`]: existingProperties,
        lastModified: getUnixDateTime(),
      });

      return { userId, projectId, projectName, propertyType };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: {},
    status: "idle",
    error: null,
    isEditing: false,
  },
  reducers: {
    setEditing(state, action) {
      state.isEditing = action.payload;
    },
    toggleEditing(state) {
      state.isEditing = !state.isEditing;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.profile = {};
        state.error = action.payload;
      })

      // ✅ Add Task
      .addCase(addTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addTask.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(addTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setEditing, toggleEditing } = userSlice.actions;
export default userSlice.reducer;
