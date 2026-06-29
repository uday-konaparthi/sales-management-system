import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fetchedProds : null,
  selectedProd : null,
  showProdList: false,
};

const barCodeFetchedProdSlice = createSlice({
  name: 'barCodeFetchedProds',
  initialState,
  reducers: {
    setFetchedProds(state, action) {
      state.fetchedProds = action.payload
    },
    setSelectedProd(state, action) {
      state.selectedProd = action.payload
    },
    setShowProdList(state) {
      state.showProdList = !state.showProdList
    }
  }
});

export const { setFetchedProds, setSelectedProd, setShowProdList } = barCodeFetchedProdSlice.actions;
export default barCodeFetchedProdSlice.reducer;
