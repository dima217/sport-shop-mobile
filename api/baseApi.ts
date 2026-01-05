import { secureStore } from "@/services/secureStore";
import { clearAuth } from "@/store/slices/authSlice";
import {
  BaseQueryFn,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { FetchArgsWithAuth } from "./types/base";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "http://192.168.12.195:3000",
  credentials: "include",
  prepareHeaders: async (headers, { getState }) => {
    const token = await secureStore.getAccessToken();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("x-client-type", "mobile-app");

    return headers;
  },
});

export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgsWithAuth,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(clearAuth());
    await secureStore.setAccessToken(null);
  }

  return result;
};
