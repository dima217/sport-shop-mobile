import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseApi";
import { Banner } from "./types/banner";

export const bannerApi = createApi({
  reducerPath: "bannerApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Banner"],
  endpoints: (build) => ({
    // lang is injected automatically by baseQueryWithAuth from the Redux language slice
    getBanner: build.query<Banner, void>({
      query: () => "/banner",
      providesTags: ["Banner"],
    }),
  }),
});

export const { useGetBannerQuery } = bannerApi;
