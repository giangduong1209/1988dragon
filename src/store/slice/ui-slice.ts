import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store';

interface uiState {
  showStakingModal?: boolean | undefined;
}

const initialState: uiState = {
  showStakingModal: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleStakingModal(state) {
      state.showStakingModal = !state.showStakingModal;
    },
  },
});

export const { toggleStakingModal } = uiSlice.actions;

export const showStakingMobModal = (state: RootState) => state.ui.showStakingModal;
export default uiSlice.reducer;
