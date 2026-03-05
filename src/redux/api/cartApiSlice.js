import { apiSlice } from "./apiSlice";
import { CART_URL } from "../constants";

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => CART_URL,
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation({
      query: (data) => ({
        url: `${CART_URL}/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `${CART_URL}/remove/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    updateShippingAddress: builder.mutation({
      query: (data) => ({
        url: `${CART_URL}/shipping`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    updatePaymentMethod: builder.mutation({
      query: (data) => ({
        url: `${CART_URL}/payment`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation({
      query: () => ({
        url: `${CART_URL}/clear`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateShippingAddressMutation,
  useUpdatePaymentMethodMutation,
  useClearCartMutation,
} = cartApiSlice;
