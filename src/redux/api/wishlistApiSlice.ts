import { apiSlice } from "./apiSlice";
import { WISHLIST_URL } from "../constants";
import { Wishlist } from "../../types";

export const wishlistApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query<Wishlist, void>({
      query: () => WISHLIST_URL,
      providesTags: ["Wishlist"],
    }),

    addToWishlist: builder.mutation<Wishlist, { productId: string }>({
      query: (data) => ({
        url: `${WISHLIST_URL}/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Wishlist"],
    }),

    removeFromWishlist: builder.mutation<Wishlist, string>({
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
