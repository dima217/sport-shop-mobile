import { authApi } from "@/api/authApi";
import { cartApi } from "@/api/cartApi";
import { categoriesApi } from "@/api/categoriesApi";
import { favoritesApi } from "@/api/favoritesApi";
import { ordersApi } from "@/api/ordersApi";
import { productsApi } from "@/api/productsApi";
import { usersApi } from "@/api/usersApi";
import authReducer from "@/store/slices/authSlice";
import languageReducer from "@/store/slices/languageSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "language"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  language: languageReducer,
  [authApi.reducerPath]: authApi.reducer,
  [productsApi.reducerPath]: productsApi.reducer,
  [categoriesApi.reducerPath]: categoriesApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
  [favoritesApi.reducerPath]: favoritesApi.reducer,
  [ordersApi.reducerPath]: ordersApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(authApi.middleware)
      .concat(productsApi.middleware)
      .concat(categoriesApi.middleware)
      .concat(cartApi.middleware)
      .concat(favoritesApi.middleware)
      .concat(ordersApi.middleware)
      .concat(usersApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
