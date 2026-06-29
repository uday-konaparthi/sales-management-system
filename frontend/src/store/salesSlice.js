import { createSlice } from '@reduxjs/toolkit';

const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchSalesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSalesSuccess(state, action) {
      state.loading = false;
      state.items = action.payload;
    },
    fetchSalesFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addSale(state, action) {
      state.items.push(action.payload);
    }
  }
});

export const {
  fetchSalesStart,
  fetchSalesSuccess,
  fetchSalesFailure,
  addSale
} = salesSlice.actions;

export default salesSlice.reducer;
