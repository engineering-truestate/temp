// pageTrackerSlice.js   for storing the current page location and previous page location
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDocs, query, where, collection } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure the path is correct

const pageTrackerSlice = createSlice({
  name: 'pageTracker',
  initialState: {
    currentPage: null,
    previousPage: null
  },
  reducers: {
    setPage:(state, action)=>{
     state.currentPage = action.payload.currentPage;
     state.previousPage = action.payload.previousPage;
    }
  },
});

export const {setPage} = pageTrackerSlice.actions;
export default pageTrackerSlice.reducer;
