import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { getUnixDateTime } from "../components/helper/dateTimeHelpers";
import { COLLECTIONS } from "../constants/collections";

// Generate unique task ID
const generateTaskId = async () => {
  const adminDocRef = doc(db, "truestateAdmin", "lastTaskId");
  const adminDocSnap = await getDoc(adminDocRef);

  let lastCount = 0;
  if (adminDocSnap.exists()) {
    lastCount = adminDocSnap.data()?.count || 0;
  }

  const taskId = `task${(lastCount + 1).toString().padStart(3, "0")}`;
  await updateDoc(adminDocRef, { count: lastCount + 1 });

  return taskId;
};

// Create task using userId
export const createTask = createAsyncThunk(
  "task/createTask",
  async ({ userId, taskDetails }, { rejectWithValue }) => {
    try {
      if (!userId) {
        throw new Error("userId is required");
      }

      // Get user document directly using userId
      const userDocRef = doc(db, COLLECTIONS.USERS, userId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        throw new Error("User not found");
      }

      const userData = userDoc.data();
      const taskId = await generateTaskId();

      // Create new task object
      const newTask = {
        ...taskDetails,
        taskId,
        userName: userData?.name ?? "",
        userId: userId,
        agentId: userData?.agentId ?? "",
        agentName: userData?.agentName ?? "",
        added: getUnixDateTime(),
        lastModified: getUnixDateTime(),
      };

      // Save the task in Firestore
      await setDoc(doc(db, COLLECTIONS.TASKS, taskId), newTask);

      return newTask;
    } catch (error) {
      return rejectWithValue(error?.message || "Something went wrong");
    }
  }
);

// Legacy: Append task to user document using phoneNumber (for backward compatibility)
export const appendTask = createAsyncThunk(
  "task/appendTask",
  async ({ userPhoneNumber, task }, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, COLLECTIONS.USERS),
        where("phoneNumber", "==", userPhoneNumber)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDocRef = querySnapshot.docs[0].ref;
        await updateDoc(userDocRef, {
          tasks: arrayUnion(task),
        });
      } else {
        throw new Error("User not found");
      }

      return task;
    } catch (error) {
      return rejectWithValue(error?.message || "Something went wrong");
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(appendTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(appendTask.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(appendTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default taskSlice.reducer;
