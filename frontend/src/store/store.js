import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productsReducer from './productsSlice';
import salesReducer from './salesSlice';
import navSlice from './navOptionsSlice';
import barCodeFetchedProdSlice from './barCodeFetchSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    sales: salesReducer,
    nav: navSlice,
    barCodeFetch: barCodeFetchedProdSlice,
  },
});

export default store;
