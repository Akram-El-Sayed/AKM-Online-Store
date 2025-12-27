import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
const storedDiscount =
  JSON.parse(localStorage.getItem("discount")) || 0;

const storedUsedCoupons =
  JSON.parse(localStorage.getItem("usedCoupons")) || [];

const getTotals = (items, discount = 0) => {
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return {
    subtotal,
    totalItems: items.reduce((acc, item) => acc + item.quantity, 0),
    totalAmount: Number((subtotal * (1 - discount)).toFixed(2)),
  };
};

const { subtotal, totalAmount, totalItems } =
  getTotals(storedCartItems, storedDiscount);

const cartSlice = createSlice({
  name: "cartSlice",

  initialState: {
    subtotal,
    cartItems: storedCartItems, // products
    totalAmount, // order
    totalItems,
    discount: storedDiscount,
    usedCoupons: storedUsedCoupons,
  },

  reducers: {
    addToCart: (state, action) => {
      // Product
      const item = action.payload;

      // Check Item Exist or Not
      const exist = state.cartItems.find((product) => product.id == item.id);

      if (exist) {
        // Increase Qty
        exist.quantity++;
        toast.success(`You Added This Product: ${exist.quantity} Times`);
      } else {
        // Push cartItems Set Qty = 1
        state.cartItems.push({ ...item, quantity: 1 });
        toast.success("Product Added To Cart");
      }

      // Trigger Another Action Anside One
      cartSlice.caseReducers.calcTotal(state);

      // Store cartItems LocalStorage
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      // Extract Id
      const id = action.payload;
      // Filter
      state.cartItems = state.cartItems.filter((product) => product.id != id);
      // Update Total
      cartSlice.caseReducers.calcTotal(state);
      // Store cartItems LocalStorage
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    increaseQty: (state, action) => {
      // Extract Id
      const id = action.payload;
      // Find By Id
      const item = state.cartItems.find((product) => product.id == id);
      // Exist Increase
      if (item) item.quantity++;
      // Update Total
      cartSlice.caseReducers.calcTotal(state);
      // Store cartItems LocalStorage
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    decreaseQty: (state, action) => {
      // Extract Id
      const id = action.payload;
      // Find By Id
      const item = state.cartItems.find((product) => product.id == id);
      // Check Item && Item.Qty > 1
      if (item && item.quantity > 1) item.quantity--;
      // Update Total
      cartSlice.caseReducers.calcTotal(state);
      // Store cartItems LocalStorage
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
      state.totalItems = 0;
      state.discount = 0;
      // Store cartItems LocalStorage
      localStorage.removeItem("cartItems");
    },
      confirmOrder: (state) => {
  state.cartItems = [];
  state.totalAmount = 0;
  state.totalItems = 0;
  state.discount = 0;
   state.subtotal = 0;

  localStorage.removeItem("cartItems");
  localStorage.removeItem("discount");
},
   calcTotal: (state) => {
  const { subtotal, totalAmount, totalItems } = getTotals(
    state.cartItems,
    state.discount
  );

  state.subtotal = subtotal;
  state.totalAmount = totalAmount;
  state.totalItems = totalItems;
},
   applyCoupon: (state, action) => {
  const { code, value } = action.payload;

  
  if (state.usedCoupons.includes(code)) {
    return;
  }

  state.discount = value;

  const {subtotal, totalAmount, totalItems } = getTotals(
    state.cartItems,
    state.discount
  );
  state.subtotal = subtotal
  state.totalAmount = totalAmount;
  state.totalItems = totalItems;

  state.usedCoupons.push(code);

  localStorage.setItem("discount", JSON.stringify(state.discount));
  localStorage.setItem("usedCoupons",JSON.stringify(state.usedCoupons));
},
  },
});

// Actions
export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
  calcTotal,
  applyCoupon,
  confirmOrder,
} = cartSlice.actions;

// States
export default cartSlice.reducer;
