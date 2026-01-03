import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseApi";
import { FavoritesQueryParams, FavoritesResponse } from "./types/favorites";

export const favoritesApi = createApi({
  reducerPath: "favoritesApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Favorite"],
  endpoints: (build) => ({
    getFavorites: build.query<FavoritesResponse, FavoritesQueryParams>({
      query: (params) => ({
        url: "/favorites",
        method: "GET",
        params: {
          limit: params.limit,
          offset: params.offset,
        },
      }),
      providesTags: ["Favorite"],
    }),

    addToFavorites: build.mutation<{ success: boolean }, string>({
      query: (productId) => ({
        url: `/favorites/${productId}`,
        method: "POST",
      }),
      invalidatesTags: ["Favorite"],
    }),

    removeFromFavorites: build.mutation<{ success: boolean }, string>({
      query: (productId) => ({
        url: `/favorites/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Favorite"],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} = favoritesApi;

