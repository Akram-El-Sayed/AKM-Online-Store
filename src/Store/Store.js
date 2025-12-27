import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./Slices/UserSlice"
import cartReducer from "./Slices/cartSlice";
import ordersReducer from './Slices/orderSlice'

// Store States Global
export const Store = configureStore({
  // Each Slice Export Reducer -> return States
  reducer: {
    // user -> useSelector(state => state.user)
   user: userReducer,
    // cart -> useSelector(state => state.cart)
     cart: cartReducer,

     orders: ordersReducer,
  },
});
