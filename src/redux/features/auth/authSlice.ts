import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")!)
    : null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      state.error = null;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));

      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
      localStorage.setItem("expirationTime", expirationTime.toString());
    },

    logout: (state) => {
      state.userInfo = null;
      state.error = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("expirationTime");
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    checkTokenExpiration: (state) => {
      const expirationTime = localStorage.getItem("expirationTime");
      if (expirationTime && new Date().getTime() > parseInt(expirationTime)) {
        state.userInfo = null;
        localStorage.removeItem("userInfo");
        localStorage.removeItem("expirationTime");
      }
    },
  },
});

export const {
  setCredentials,
  logout,
  setLoading,
  setError,
  clearError,
  checkTokenExpiration,
} = authSlice.actions;

export default authSlice.reducer;
