import { apiSlice } from "./apiSlice";
import { ORDERS_URL, PAYPAL_URL } from "../constants";
import { Order } from "../../types";

type CreateOrderPayload = {
  orderItems: Array<{
    _id: string;
    name: string;
    qty: number;
    price: number;
    images: string[];
  }>;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
};

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<Order, CreateOrderPayload>({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["Order"],
    }),

    getOrderDetails: builder.query<Order, string>({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    payOrder: builder.mutation<Order, { orderId: string; details: any }>({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: details,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "Order", id: orderId },
      ],
    }),

    getPaypalClientId: builder.query<{ clientId: string }, void>({
      query: () => ({
        url: PAYPAL_URL,
      }),
    }),

    getMyOrders: builder.query<Order[], void>({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Order"],
    }),

    getOrders: builder.query<Order[], void>({
      query: () => ({
        url: ORDERS_URL,
      }),
      providesTags: ["Order"],
    }),

    deliverOrder: builder.mutation<Order, string>({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, orderId) => [
        { type: "Order", id: orderId },
      ],
    }),

    getTotalOrders: builder.query<{ total: number }, void>({
      query: () => `${ORDERS_URL}/total-orders`,
    }),

    getTotalSales: builder.query<{ total: number }, void>({
      query: () => `${ORDERS_URL}/total-sales`,
    }),

    getTotalSalesByDate: builder.query<
      { sales: { _id: string; total: number }[] },
      void
    >({
      query: () => `${ORDERS_URL}/total-sales-by-date`,
    }),

    getOrdersByDate: builder.query<
      { orders: { _id: string; count: number }[] },
      void
    >({
      query: () => `${ORDERS_URL}/total-orders-by-date`,
    }),
  }),
});

export const {
  useGetTotalOrdersQuery,
  useGetTotalSalesQuery,
  useGetTotalSalesByDateQuery,
  useGetOrdersByDateQuery,
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useGetMyOrdersQuery,
  useDeliverOrderMutation,
  useGetOrdersQuery,
} = orderApiSlice;
