import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseApi";
import {
  AddToCartDto,
  CartItem,
  CartResponse,
  UpdateCartItemDto,
} from "./types/cart";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Cart"],
  endpoints: (build) => ({
    getCart: build.query<CartResponse, void>({
      query: () => ({
        url: "/cart",
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),

    addToCart: build.mutation<CartItem, AddToCartDto>({
      query: (body) => ({
        url: "/cart",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCartItem: build.mutation<
      CartItem,
      { id: string; data: UpdateCartItemDto }
    >({
      query: ({ id, data }) => ({
        url: `/cart/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    removeCartItem: build.mutation<void, string>({
      query: (id) => ({
        url: `/cart/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: build.mutation<void, void>({
      query: () => ({
        url: "/cart",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi;
