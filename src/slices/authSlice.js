// slices/authSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { clearUserDocSubscription } from "./userAuthSlice";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { COLLECTIONS } from "../constants/collections";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    userData: null,
  },
  reducers: {
    signIn: (state, action) => {
      // console.log('auth')
      state.isAuthenticated = true;
      state.userData = {
        phoneNumber: action.payload.phoneNumber,
        userId: action.payload.userId,
        name: action.payload.name,
      };
    },
    signOut: (state) => {
      // console.log(state,'state');
      state.isAuthenticated = false;
      state.userData = null;
    },
  },
});

export const { signIn, signOut } = authSlice.actions;

export const logout = () => (dispatch) => {
  dispatch(clearUserDocSubscription());
  dispatch(signOut());
};

export const setDbCheck = (phoneNumber) => async (dispatch) => {
  const usersRef = collection(db, COLLECTIONS.USERS);
  if (phoneNumber) {
    const phoneQuery = query(usersRef, where("phoneNumber", "==", phoneNumber));
    const phoneSnapshot = await getDocs(phoneQuery);
    if (phoneSnapshot.empty) {
      dispatch(logout());
    }
  } else {
    dispatch(logout());
  }
};

export default authSlice.reducer;
