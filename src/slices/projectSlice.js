import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const initialState = {
  currentProject: null,
  allProjects: [], // Store all projects
  loading: false,
  error: null,
  searchTerm: '',
  sortOrder: '',
};

// Fetch all projects at once
export const fetchAllProjects = createAsyncThunk(
  'projects/fetchAllProjects',
  async (_, { rejectWithValue }) => {
    try {
      // Add a filter for assetType = 'truEstate'
      const q = query(
        collection(db, 'truEstatePreLaunch'),
        where('showOnTruEstate', '==', true)
      );

      const querySnapshot = await getDocs(q);
      const projects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("hmm",projects);
      return projects;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Fetch a project by name
export const fetchProjectByName = createAsyncThunk(
  'projects/fetchProjectByName',
  async (projectName, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, 'truEstatePreLaunch'),
        where('projectName', '==', projectName)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('Project not found');
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
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllProjects
      .addCase(fetchAllProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.allProjects = action.payload;
      })
      .addCase(fetchAllProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.allProjects = [];
      })
      // fetchProjectByName
      .addCase(fetchProjectByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectByName.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
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
export const selectAllProjects = (state) => state.projectsState.allProjects;
export const selectProjectLoading = (state) => state.projectsState.loading;
export const selectProjectError = (state) => state.projectsState.error;

export default projectsSlice.reducer;
