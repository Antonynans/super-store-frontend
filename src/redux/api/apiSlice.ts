import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";
import { logout, setCredentials } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth.userInfo?.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  const isUnauthorized =
    result.error &&
    (result.error.status === 401 || result.error.status === 403);

  if (isUnauthorized) {
    if (typeof args === "object" && args.url?.includes("/refresh-token")) {
      api.dispatch(logout());
      api.dispatch(apiSlice.util.resetApiState());
      window.location.href = "/login";
      return result;
    }

    const refreshResult = await baseQuery(
      { url: "/api/users/refresh-token", method: "POST" },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      api.dispatch(setCredentials(refreshResult.data));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
      api.dispatch(apiSlice.util.resetApiState());
      window.location.href = "/login";
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Product", "Category", "User", "Cart", "Wishlist", "Order"],
  endpoints: (builder) => ({}),
});
