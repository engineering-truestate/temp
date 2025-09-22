// pageTrackerSlice.js   for storing the current page location and previous page location
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    showSignInModal: false,
    redirectUrl: null,
  },
  reducers: {
    setShowSignInModal:(state, action)=>{
      state.showSignInModal = action.payload.showSignInModal;
      state.redirectUrl = action.payload.redirectUrl;
    }
  },
});

export const {setShowSignInModal} = modalSlice.actions;
export default modalSlice.reducer;
