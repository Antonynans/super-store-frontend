import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: [],
  reducers: {
    addToFavorites: (state, action) => {
      if (!state.some((product) => product._id === action.payload._id)) {
        state.push(action.payload);
      }
    },
    removeFromFavorites: (state, action) => {
      return state.filter((product) => product._id !== action.payload._id);
    },
    setFavorites: (state, action) => {
      return action.payload;
    },
    setFavoritesFromBackend: (state, action) => {
      const wishlist = action.payload;
      return wishlist.products || [];
    },
  },
});

export const {
  addToFavorites,
  removeFromFavorites,
  setFavorites,
  setFavoritesFromBackend,
} = favoriteSlice.actions;
export const selectFavoriteProduct = (state) => state.favorites;
export default favoriteSlice.reducer;
