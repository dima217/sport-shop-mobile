import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseApi";

/**
 * Admin-only API for user management.
 * For updating current user profile, use authApi.updateProfile instead.
 */
export interface UpdateUserDto {
  role?: "user" | "admin";
  isBanned?: boolean;
}

export interface UserResponse {
  id: number;
  uuid: string;
  email: string;
  role: string;
  isBanned: boolean;
  isOAuthUser: boolean;
  profile?: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["User"],
  endpoints: (build) => ({
    /**
     * Get user by ID (Admin only)
     * Endpoint: GET /users/{id}
     */
    getUser: build.query<UserResponse, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    /**
     * Update user (Admin only) - for role and ban status
     * Endpoint: PUT /users/{id}
     * For updating current user profile, use authApi.updateProfile
     */
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

    /**
     * Delete user (Admin only)
     * Endpoint: DELETE /users/{id}
     */
    deleteUser: build.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "User", id }],
    }),
  }),
});

export const { useGetUserQuery, useUpdateUserMutation, useDeleteUserMutation } =
  usersApi;
