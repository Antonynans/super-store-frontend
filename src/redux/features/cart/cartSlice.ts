import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  product: {
    _id: string;
    name: string;
    images: string[];
    price: number;
    countInStock: number;
  };
  name: string;
  images: string[];
  price: number;
  qty: number;
  _id: string;
  countInStock: number;
  createdAt?: string;
  updatedAt?: string;
}

interface CartState {
  cartItems: CartItem[];
  shippingAddress: Record<string, any>;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}

const initialState: CartState = {
  cartItems: [],
  shippingAddress: {},
  paymentMethod: "PayPal",
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;

      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        existItem.qty = Math.min(
          existItem.qty + item.qty,
          existItem.countInStock || item.countInStock,
        );
      } else {
        state.cartItems.push(item);
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
    },

    clearCartItems: (state) => {
      state.cartItems = [];
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },

    resetCart: () => initialState,

    setCartFromBackend: (state, action) => {
      const backendCart = action.payload;

      state.cartItems = backendCart.cartItems || [];
      state.shippingAddress = backendCart.shippingAddress || {};
      state.paymentMethod = backendCart.paymentMethod || "PayPal";
      state.itemsPrice = backendCart.itemsPrice || 0;
      state.shippingPrice = backendCart.shippingPrice || 0;
      state.taxPrice = backendCart.taxPrice || 0;
      state.totalPrice = backendCart.totalPrice || 0;
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
