import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseApi";
import {
  CreateProductDto,
  Product,
  ProductsQueryParams,
  ProductsResponse,
  UpdateProductDto,
} from "./types/products";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Product"],
  endpoints: (build) => ({
    getProducts: build.query<ProductsResponse, ProductsQueryParams>({
      query: (params) => ({
        url: "/products",
        method: "GET",
        params,
      }),
      providesTags: ["Product"],
    }),

    getProduct: build.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    createProduct: build.mutation<Product, CreateProductDto>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: build.mutation<
      Product,
      { id: string; data: UpdateProductDto }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),

    deleteProduct: build.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
