// userAuthSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  arrayUnion,
  collection,
  addDoc,
  setDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  runTransaction,
  where,
} from "firebase/firestore";
import {
  getUnixDateTime,
  getUnixDateTimeOneDayLater,
} from "../components/helper/dateTimeHelpers";
import { generateUniqueId } from "../components/helper/generateUniqueId";
import { db } from "../firebase";

export const userAuthSlice = createSlice({
  name: "userAuth",
  initialState: {
    loading: false,
    error: null,
    userDoc: null,
    userDocId: null, // Initial state for storing document ID
    userPhoneNumber: null,
  },
  reducers: {
    setUserDoc: (state, action) => {
      if (action.payload && action.payload.docData) {
        state.userDoc = action.payload.docData;
        state.userDocId = action.payload.docId;
      } else {
        state.userDoc = null;
        state.userDocId = null;
      }
    },
    setUserPhoneNumber: (state, action) => {
      state.userPhoneNumber = action.payload;
    },
    setProperties: (state, action) => {
      if (action.payload.newProperty) {
        state.userDoc.propertiesAdded = [
          ...state.userDoc.propertiesAdded,
          action.payload.newProperty,
        ];
      }
    },
    setFinancialDetails: (state, action) => {
      if (action.payload.updateProperty) {
        state.userDoc.propertiesAdded = state.userDoc.propertiesAdded.map(
          (property) => {
            if (
              (action.payload.updateProperty.internalId &&
                action.payload.updateProperty.internalId ===
                  property.internalId) ||
              property.projectName === action.payload.updateProperty.projectName
            ) {
              property.financialDetails =
                action.payload.updateProperty.financialDetails;
            }
            return property;
          }
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addVaultForm.pending, (state) => {
        state.loading = true;
      })
      .addCase(addVaultForm.fulfilled, (state, action) => {
        state.loading = false;
        const vaultForm = state.userDoc.vaultForm || [];
        vaultForm.push(action.payload);
        state.userDoc.vaultForm = vaultForm;
      })
      .addCase(addVaultForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const addVaultForm = createAsyncThunk(
  "userAuth/addVaultForm",
  async ({ formData, formId, projectId, projectName, reportUrl }, { getState, rejectWithValue }) => {
    try {
      if (!formId || !projectName) {
        return rejectWithValue("Missing required parameters: formId and projectName are required");
      }

      const state = getState();
      if (!state?.userAuth?.userDoc?.phoneNumber) {
        return rejectWithValue("User phone number not found in state");
      }

      const { phoneNumber } = state.userAuth.userDoc;

      const q = query(
        collection(db, "truEstateUsers"),
        where("phoneNumber", "==", phoneNumber)
      );
      
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return rejectWithValue("User not found in database");
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data(); 
      const userName = userData.name; 
      if (!userDoc?.id) {
        return rejectWithValue("Invalid user document found");
      }

      console.log("user********", userDoc.id);

      const tasksCollectionRef = collection(db, "truEstateTasks");
      const tasksSnapshot = await getDocs(tasksCollectionRef);
      const taskCount = tasksSnapshot.size || 0;

      let nextTaskId = '1';
      if (taskCount >= 1000) {
        nextTaskId = `task${taskCount + 1}`;
      } else {
        nextTaskId = `task${(taskCount + 1).toString().padStart(3, '0')}`;
      }

      if (!nextTaskId) {
        return rejectWithValue("Failed to generate task ID");
      }

      const taskRef = doc(db, "truEstateTasks", nextTaskId);
      console.log("taskRef", nextTaskId);
      console.log('form data', formData)

      if (typeof getUnixDateTime !== 'function' || typeof getUnixDateTimeOneDayLater !== 'function') {
        return rejectWithValue("Required utility functions are not available");
      }
      const newTask = {
        ...formData,
        taskId: nextTaskId,
        taskName: "price-update",
        projectName: projectName,
        vaultFormId: formId,
        agentId: 'TRUES03',
        agentName: userName,
        actionType: "Message",
        createdTimestampstamp: getUnixDateTime(),
        schedule: getUnixDateTimeOneDayLater(),
        taskType: "vault-form",
        userId: userDoc.id,
        userPhoneNumber: phoneNumber,
        projectId:projectId,
        propertyType:"preLaunch",
        status: "pending",
      };

      const requiredFields = ['taskId', 'taskName', 'projectName', 'userId', 'userPhoneNumber'];
      const missingFields = requiredFields.filter(field => !newTask[field]);
      
      if (missingFields.length > 0) {
        return rejectWithValue(`Missing required task fields: ${missingFields.join(', ')}`);
      }

      await setDoc(taskRef, newTask);

      // const userDocRef = doc(db, "truEstateUsers", userDoc.id);

      // await updateDoc(userDocRef, {
      //   vaultForms: arrayUnion(formId)
      // });
      
      //console.log("FormId added to vaultFormId array:", formId);

      return { 
        id: formId, 
        projectName,
        taskId: nextTaskId,
        message: "Task created successfully"
      };

    } catch (error) {
      console.error("Error in addVaultForm:", error);
      
      if (error.code === 'permission-denied') {
        return rejectWithValue("Permission denied: Unable to access database");
      } else if (error.code === 'unavailable') {
        return rejectWithValue("Database service is currently unavailable. Please try again later");
      } else if (error.code === 'not-found') {
        return rejectWithValue("Database collection not found");
      } else if (error.message) {
        return rejectWithValue(`Database error: ${error.message}`);
      } else {
        return rejectWithValue("An unexpected error occurred while saving data");
      }
    }
  }
);

// export const raiseVaultRequest = createAsyncThunk(
//   'userAuth/raiseVaultRequest',
//   async ({requestType, vaultFormId}, {getState, rejectWithValue }) => {
//     try {
//       const {phoneNumber} = getState().userAuth.userDoc;

//       const q = query(collection(db, 'truEstateUsers'), where('phoneNumber', '==', phoneNumber));
//       const querySnapshot = await getDocs(q);

//       if (querySnapshot.empty) {
//         throw new Error('User not found');
//       }

//       const userDoc = querySnapshot.docs[0];

//       const userDocRef = doc(db, 'truEstateUsers', userDoc.id);

//       await updateDoc(userDocRef, {
//         requestType
//       });
//       return {id: formId, projectName};
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const {
  setUserDoc,
  setUserPhoneNumber,
  setProperties,
  setFinancialDetails,
} = userAuthSlice.actions;
export const selectUserDoc = (state) => state.userAuth.userDoc;
export const selectUserDocId = (state) => state.userAuth.userDocId;
export const selectUserPhoneNumber = (state) => state.userAuth.userPhoneNumber;
export const propertiesAdded = (state) =>
  state.userAuth.userDoc.propertiesAdded;

export const subscribeToUserDoc =
  ({ phoneNumber }) =>
  async (dispatch) => {
    const usersRef = collection(db, "truEstateUsers");
    let docRef = null;

    if (phoneNumber) {
      const phoneQuery = query(
        usersRef,
        where("phoneNumber", "==", phoneNumber)
      );
      const phoneSnapshot = await getDocs(phoneQuery);
      if (!phoneSnapshot.empty) {
        docRef = phoneSnapshot.docs[0].ref;

        dispatch(
          setUserDoc({
            docData: phoneSnapshot.docs[0].data(),
            docId: phoneSnapshot.docs[0].id,
          })
        );
        dispatch(setUserPhoneNumber(phoneSnapshot.docs[0].data().phoneNumber));
      }
    }
  };

export const clearUserDocSubscription = () => (dispatch) => {
  dispatch(setUserDoc(null)); // Clear the user document state
  dispatch(setUserPhoneNumber(null));
};

export default userAuthSlice.reducer;
