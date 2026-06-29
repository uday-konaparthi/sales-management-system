import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  navSelected : localStorage.getItem("nav") ?? "Home",
};

const navSlice = createSlice({
  name: 'nav',
  initialState,
  reducers: {
    navOptions(state, action) {
      state.navSelected = action.payload;
      localStorage.setItem("nav", action.payload);
    }
  }
});

export const { navOptions } = navSlice.actions;
export default navSlice.reducer;
