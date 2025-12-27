import { createSlice } from "@reduxjs/toolkit";



const loadOrders = (userId) => {
  try {
    const data = localStorage.getItem(`orders_${userId}`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveOrders = (userId, orders) => {
  localStorage.setItem(`orders_${userId}`, JSON.stringify(orders));

};

const orderSilece = createSlice({
    name:'orders',
    initialState:{
        orders: [],
        userId: null,
    },
    reducers:{
    initOrders: (state, action) => {
      state.userId = action.payload;
      state.orders = loadOrders(action.payload);
    },
    createorder: (state, action)=>{
            state.orders.push(action.payload)
            saveOrders(state.userId, state.orders)
        },
    updateOrderStatus: (state, action) => {
      const { id, status } = action.payload;
      const orders = state.orders.find(o => o.id === id);
      if (orders) {
        orders.status = status;
        saveOrders(state.userId, state.orders);
      }
    },
    clearOrders: (state) => {
      state.orders = [];
      saveOrders(state.userId, []);
    },
    }
})
export const {initOrders, createorder , updateOrderStatus , clearOrders} = orderSilece.actions
export default orderSilece.reducer