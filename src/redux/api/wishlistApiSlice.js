import { apiSlice } from "./apiSlice";
import { WISHLIST_URL } from "../constants";

export const wishlistApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: () => WISHLIST_URL,
      providesTags: ["Wishlist"],
    }),

    addToWishlist: builder.mutation({
      query: (data) => ({
        url: `${WISHLIST_URL}/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Wishlist"],
    }),

    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `${WISHLIST_URL}/remove/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApiSlice;
