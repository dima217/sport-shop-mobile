import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseApi";

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["User"],
  endpoints: (build) => ({
    getUser: build.query<UserResponse, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    updateUser: build.mutation<
      UserResponse,
      { id: string; data: UpdateUserDto }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),
  }),
});

export const { useGetUserQuery, useUpdateUserMutation } = usersApi;
