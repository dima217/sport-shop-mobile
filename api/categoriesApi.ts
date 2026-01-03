import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseApi";
import {
    CategoriesQueryParams,
    Category,
    CreateCategoryDto,
    UpdateCategoryDto,
} from "./types/categories";

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Category"],
  endpoints: (build) => ({
    getCategories: build.query<Category[], CategoriesQueryParams>({
      query: (params) => ({
        url: "/categories",
        method: "GET",
        params: {
          limit: params.limit,
          offset: params.offset,
        },
      }),
      providesTags: ["Category"],
    }),

    getCategory: build.query<Category, string>({
      query: (id) => `/categories/${id}`,
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),

    createCategory: build.mutation<Category, CreateCategoryDto>({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: build.mutation<Category, { id: string; data: UpdateCategoryDto }>({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Category", id }],
    }),

    deleteCategory: build.mutation<void, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;

