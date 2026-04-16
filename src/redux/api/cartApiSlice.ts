import { apiSlice } from "./apiSlice";
import { CART_URL } from "../constants";
import { Cart } from "../../types";

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<Cart, void>({
      query: () => CART_URL,
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation<Cart, { productId: string; qty: number }>({
      query: (data) => ({
        url: `${CART_URL}/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation<Cart, string>({
      query: (productId) => ({
        url: `${CART_URL}/remove/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    updateShippingAddress: builder.mutation<
      Cart,
      { address: string; city: string; postalCode: string; country: string }
    >({
      query: (data) => ({
        url: `${CART_URL}/shipping`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    updatePaymentMethod: builder.mutation<Cart, { paymentMethod: string }>({
      query: (data) => ({
        url: `${CART_URL}/payment`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation<Cart, void>({
      query: () => ({
        url: `${CART_URL}/clear`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCartQty: builder.mutation<Cart, { productId: string; qty: number }>({
      query: (data) => ({
        url: `${CART_URL}/update/${data.productId}`,
        method: "PUT",
        body: { qty: data.qty },
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
  useUpdateCartQtyMutation,
} = cartApiSlice;
