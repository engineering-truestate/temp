import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchInvestmentReport, validateReportPayload } from "../services/reportService";

// Async thunk for fetching investment report
export const getInvestmentReport = createAsyncThunk(
  "report/getInvestmentReport",
  async (payload, { rejectWithValue }) => {
    try {
      // Validate payload first
      const validation = validateReportPayload(payload);
      if (!validation.isValid) {
        return rejectWithValue({
          message: "Invalid payload",
          errors: validation.errors,
        });
      }

      const result = await fetchInvestmentReport(payload);

      if (!result.success) {
        return rejectWithValue({
          message: result.error || "Failed to fetch investment report",
        });
      }

      return result.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message || "An unexpected error occurred",
      });
    }
  }
);

const initialState = {
  currentReport: null,
  reportData: null,
  results: null,
  loading: false,
  error: null,
  lastPayload: null,
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    clearReport: (state) => {
      state.currentReport = null;
      state.reportData = null;
      state.results = null;
      state.error = null;
      state.lastPayload = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setReportData: (state, action) => {
      state.reportData = action.payload;
    },
    setResults: (state, action) => {
      state.results = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getInvestmentReport.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.lastPayload = action.meta.arg;
      })
      .addCase(getInvestmentReport.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload;
        state.results = action.payload;
        state.error = null;
      })
      .addCase(getInvestmentReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch report";
        state.currentReport = null;
        state.results = null;
      });
  },
});

export const { clearReport, clearError, setReportData, setResults } = reportSlice.actions;

// Selectors
export const selectReportLoading = (state) => state.report.loading;
export const selectReportError = (state) => state.report.error;
export const selectCurrentReport = (state) => state.report.currentReport;
export const selectReportResults = (state) => state.report.results;
export const selectReportData = (state) => state.report.reportData;
export const selectLastPayload = (state) => state.report.lastPayload;

export default reportSlice.reducer;