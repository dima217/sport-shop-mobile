import { secureStore } from "@/services/secureStore";
import { clearAuth, setBanned } from "@/store/slices/authSlice";
import {
  BaseQueryFn,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Alert } from "react-native";
import { FetchArgsWithAuth } from "./types/base";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "http://10.39.10.195:3000",
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
  // Inject ?lang= from Redux into every GET request so the server
  // returns content translated into the user's selected language.
  const state = api.getState() as { language?: { currentLanguage?: string } };
  const lang = state.language?.currentLanguage;

  if (lang) {
    if (typeof args === "string") {
      // String-style arg (e.g. `/products/${id}`) → convert to object form
      args = { url: args, params: { lang } };
    } else {
      const method = (args.method ?? "GET").toUpperCase();
      if (method === "GET") {
        // Caller-provided params take precedence if they already include `lang`
        args = { ...args, params: { lang, ...args.params } };
      }
    }
  }

  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const errorMessage =
      (result.error.data as any)?.message ||
      (result.error.data as any)?.error ||
      "";

    if (errorMessage === "Your account has been banned.") {
      api.dispatch(setBanned());
      await secureStore.setAccessToken(null);

      Alert.alert(
        "Account Banned",
        "Your account has been banned by an administrator. Please contact support for more information.",
        [{ text: "OK" }]
      );
    } else {
      api.dispatch(clearAuth());
      await secureStore.setAccessToken(null);
    }
  }

  return result;
};
