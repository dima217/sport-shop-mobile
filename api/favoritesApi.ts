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
      // Фильтруем некорректные данные (товары без обязательных полей)
      transformResponse: (response: FavoritesResponse): FavoritesResponse => {
        if (!response || !response.products) {
          return { products: [], total: 0 };
        }
        // Фильтруем товары без обязательных полей
        const validProducts = response.products.filter(
          (product) => product && product.id && product.name
        );
        return {
          products: validProducts,
          total: validProducts.length,
        };
      },
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
      // Обрабатываем ошибки: если товар не найден (404), все равно инвалидируем кэш
      async onQueryStarted(productId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error: any) {
          // Если товар не найден (404) или уже удален, все равно обновляем кэш
          if (error?.status === 404 || error?.status === 400) {
            dispatch(
              favoritesApi.util.invalidateTags(["Favorite"])
            );
          }
        }
      },
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} = favoritesApi;

