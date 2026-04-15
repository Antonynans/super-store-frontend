import { UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const uploadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadProductImage: builder.mutation<
      {
        url(url: any): unknown; image: string; message: string 
},
      FormData
    >({
      query: (formData) => ({
        url: UPLOAD_URL,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useUploadProductImageMutation } = uploadApiSlice;
