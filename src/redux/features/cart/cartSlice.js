import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
      return state;
    },

    removeFromCart: (state, action) => {
      state = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
      return state;
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    clearCartItems: (state, action) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state));
    },

    resetCart: (state) => (state = initialState),

    setCartFromBackend: (state, action) => {
      const backendCart = action.payload;
      state.cartItems = backendCart.cartItems || [];
      state.shippingAddress = backendCart.shippingAddress || {};
      state.paymentMethod = backendCart.paymentMethod || "PayPal";
      state.itemsPrice = backendCart.itemsPrice || 0;
      state.shippingPrice = backendCart.shippingPrice || 0;
      state.taxPrice = backendCart.taxPrice || 0;
      state.totalPrice = backendCart.totalPrice || 0;
      localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  savePaymentMethod,
  saveShippingAddress,
  clearCartItems,
  resetCart,
  setCartFromBackend,
} = cartSlice.actions;

export default cartSlice.reducer;
