import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase';
import { collection, query, limit, getDocs, startAfter, getDoc, doc, where, or, and, orderBy, getCountFromServer, startAt } from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom';



const initialState = {
  currentProject: null,
  loading: false,
  error: null,
  // Legacy state for compatibility
  searchTerm: '',
  sortOrder: '',
};

export const fetchProjectByName = createAsyncThunk(
  'projects/fetchProjectByName',
  async (projectName, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, "truEstatePreLaunch"),
        where("projectName", "==", projectName)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("Project not found");
      }

      const projectDoc = querySnapshot.docs[0];
      return { id: projectDoc.id, ...projectDoc.data() };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Legacy async thunks for compatibility - these should be migrated to appropriate slices
export const fetchTableProjects = createAsyncThunk(
  'projects/fetchTableProjects',
  async (pageNumber, { rejectWithValue }) => {
    return rejectWithValue('fetchTableProjects has been deprecated. Please migrate to appropriate service.');
  }
);

export const fetchInitialProjects = createAsyncThunk(
  'projects/fetchInitialProjects',
  async (_, { rejectWithValue }) => {
    return rejectWithValue('fetchInitialProjects has been deprecated. Please migrate to appropriate service.');
  }
);

export const fetchMoreProjects = createAsyncThunk(
  'projects/fetchMoreProjects',
  async (_, { rejectWithValue }) => {
    return rejectWithValue('fetchMoreProjects has been deprecated. Please migrate to appropriate service.');
  }
);

export const fetchAllProjectsAtOnce = createAsyncThunk(
  'projects/fetchAllProjectsAtOnce',
  async (_, { rejectWithValue }) => {
    return rejectWithValue('fetchAllProjectsAtOnce has been deprecated. Please migrate to appropriate service.');
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (projectId, { rejectWithValue }) => {
    return rejectWithValue('fetchProjectById has been deprecated. Please migrate to appropriate service.');
  }
);









const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearProject: (state) => {
      state.currentProject = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Legacy reducers for compatibility
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectByName.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
        state.error = null;
      })
      .addCase(fetchProjectByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentProject = null;
      });
  },
});

export const { clearProject, clearError, setSearchTerm, setSortOrder } = projectsSlice.actions;

// Selectors
export const selectCurrentProject = (state) => state.projectsState.currentProject;
export const selectProjectLoading = (state) => state.projectsState.loading;
export const selectProjectError = (state) => state.projectsState.error;

export default projectsSlice.reducer;
