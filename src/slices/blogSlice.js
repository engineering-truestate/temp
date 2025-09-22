// src/features/blog/blogSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const fetchBlogs = createAsyncThunk("blogs/fetchBlogs", async () => {
  const snapshot = await getDocs(collection(db, "eden_blogs"));
  const blogs = snapshot.docs.map((doc) => doc.data());
  return blogs;
});

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default blogSlice.reducer;
