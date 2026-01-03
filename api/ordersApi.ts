import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseApi";
import { CreateOrderDto, Order } from "./types/orders";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Order"],
  endpoints: (build) => ({
    getOrders: build.query<Order[], void>({
      query: () => ({
        url: "/orders",
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    getOrder: build.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    createOrder: build.mutation<Order, CreateOrderDto>({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order", "Cart"], // Инвалидируем и корзину, чтобы она обновилась
    }),
  }),
});

export const { useGetOrdersQuery, useGetOrderQuery, useCreateOrderMutation } =
  ordersApi;
