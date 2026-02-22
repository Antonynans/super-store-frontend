import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    return headers;
  },
});

export const apiSlice = createApi({
   reducerPath: "api",
  baseQuery: baseQuery,
  tagTypes: ["Product", "Category", "User"],
  endpoints: (builder) => ({}),
});
