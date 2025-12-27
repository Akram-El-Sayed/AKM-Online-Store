import { createSlice } from "@reduxjs/toolkit";

// Create

// 1. name
// 2. initialState
// 3. reducers
const userSlice = createSlice({
  name: "userSlice",
  // States Store Global
  initialState: {
    userInfo: null,
    isLoggedIn: false,
    role:null,
  },

  // Function or Action Change State
  reducers: {
    // state - action
    setUser: (state, action) => {
      // action.payload -> data -> dispatch
      state.userInfo = action.payload;
      state.isLoggedIn = true;
      state.role = action.payload.role;
    },
    clearUser: (state) => {
      state.isLoggedIn = false;
      state.userInfo = null;
      state.role = null;
    },
    updateAddress: (state, action) => {
  if (!state.userInfo) return;

  state.userInfo.address = action.payload;
  localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
},
  },
});

// Export Actions
export const {updateAddress, clearUser, setUser } = userSlice.actions;

// Export States
export default userSlice.reducer;
