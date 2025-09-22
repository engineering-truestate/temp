import { createSlice } from '@reduxjs/toolkit';

export const vaultConfirmationSlice = createSlice({
  name: 'vaultConfirmation',
  initialState: {
    isVaultFormActive: false, // Controls unsaved changes modal visibility
    pendingRoute: null,       // Stores the pending route when the modal is open
  },
  reducers: {
    setVaultFormActive: (state, action) => {
      state.isVaultFormActive = action.payload; // Opens or closes modal
    },
    setPendingRoute: (state, action) => {
      state.pendingRoute = action.payload; // Sets route to navigate after confirmation
    },
    clearPendingRoute: (state) => {
      state.pendingRoute = null; // Clears pending route if navigation is canceled
    },
  },
});

export const { setVaultFormActive, setPendingRoute, clearPendingRoute } = vaultConfirmationSlice.actions;
export default vaultConfirmationSlice.reducer;
