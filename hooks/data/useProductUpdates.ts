import { categoriesApi } from "@/api/categoriesApi";
import { productsApi } from "@/api/productsApi";
import {
  CategoryCreatedPayload,
  CategoryDeletedPayload,
  CategoryUpdatedPayload,
  ProductCreatedPayload,
  ProductDeletedPayload,
  ProductDiscountAppliedPayload,
  ProductDiscountRemovedPayload,
  ProductPriceChangedPayload,
  ProductStockChangedPayload,
  ProductUpdatedPayload,
  WebSocketEvent,
} from "@/api/types/websocket";
import { AppDispatch, store } from "@/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useWebSocket } from "../websocket/useWebSocket";

const WS_URL = "http://172.18.125.195:3000";

export const useProductUpdates = (
  accessToken: string,
  onProductUpdate?: (product: any) => void,
  onCategoryUpdate?: (category: any) => void,
  isEnabled: boolean = true
) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isConnected, on, off } = useWebSocket(WS_URL, accessToken);

  useEffect(() => {
    if (!isConnected || !isEnabled) {
      return;
    }

    const updateProductInAllLists = (updatedProduct: any) => {
      dispatch(
        productsApi.util.updateQueryData(
          "getProduct",
          updatedProduct.id,
          () => updatedProduct
        )
      );

      const state = store.getState() as any;
      const cachedQueries = state.productsApi?.queries || {};

      Object.keys(cachedQueries).forEach((queryKey) => {
        if (queryKey.startsWith("getProducts(")) {
          try {
            const argsMatch = queryKey.match(/getProducts\((.*)\)/);
            if (argsMatch) {
              const argsString = argsMatch[1];
              const args = JSON.parse(argsString);

              dispatch(
                productsApi.util.updateQueryData(
                  "getProducts",
                  args,
                  (draft) => {
                    if (draft && draft.products) {
                      const index = draft.products.findIndex(
                        (p: any) => p.id === updatedProduct.id
                      );
                      if (index !== -1) {
                        draft.products[index] = updatedProduct;
                      }
                    }
                  }
                )
              );
            }
          } catch (e) {
            console.warn("Failed to update cached query:", queryKey, e);
          }
        }
      });
    };

    const handleProductCreated = (payload: ProductCreatedPayload) => {
      console.log("Product created:", payload.product.name);
      dispatch(productsApi.util.invalidateTags(["Product"]));
      onProductUpdate?.(payload.product);
    };

    const handleProductUpdated = (payload: ProductUpdatedPayload) => {
      console.log("Product updated:", payload.product.name);
      updateProductInAllLists(payload.product);
      onProductUpdate?.(payload.product);
    };

    const handlePriceChanged = (payload: ProductPriceChangedPayload) => {
      console.log(
        `Price changed: ${payload.product.name} - ${payload.oldPrice} -> ${payload.newPrice}`
      );
      updateProductInAllLists(payload.product);
      onProductUpdate?.(payload.product);
    };

    const handleDiscountApplied = (payload: ProductDiscountAppliedPayload) => {
      console.log(
        `Discount applied: ${payload.product.name} - ${payload.discountPercent}%`
      );
      updateProductInAllLists(payload.product);
      onProductUpdate?.(payload.product);
    };

    const handleDiscountRemoved = (payload: ProductDiscountRemovedPayload) => {
      console.log(`Discount removed: ${payload.product.name}`);
      updateProductInAllLists(payload.product);
      onProductUpdate?.(payload.product);
    };

    const handleStockChanged = (payload: ProductStockChangedPayload) => {
      console.log(
        `Stock changed: ${payload.product.name} - ${payload.oldStock} -> ${payload.newStock}`
      );
      updateProductInAllLists(payload.product);
      onProductUpdate?.(payload.product);
    };

    const handleProductDeleted = (payload: ProductDeletedPayload) => {
      console.log("Product deleted:", payload.productId);
      const productId = payload.productId;

      dispatch(
        productsApi.util.invalidateTags([{ type: "Product", id: productId }])
      );

      dispatch(productsApi.util.invalidateTags(["Product"]));
    };

    const handleCategoryCreated = (payload: CategoryCreatedPayload) => {
      console.log("Category created:", payload.category.name);
      dispatch(categoriesApi.util.invalidateTags(["Category"]));
      onCategoryUpdate?.(payload.category);
    };

    const handleCategoryUpdated = (payload: CategoryUpdatedPayload) => {
      console.log("Category updated:", payload.category.name);
      dispatch(
        categoriesApi.util.updateQueryData(
          "getCategory",
          payload.category.id,
          () => payload.category
        )
      );
      dispatch(categoriesApi.util.invalidateTags(["Category"]));
      onCategoryUpdate?.(payload.category);
    };

    const handleCategoryDeleted = (payload: CategoryDeletedPayload) => {
      console.log("Category deleted:", payload.categoryId);
      const categoryId = payload.categoryId;

      dispatch(
        categoriesApi.util.invalidateTags([
          { type: "Category", id: categoryId },
        ])
      );

      dispatch(categoriesApi.util.invalidateTags(["Category"]));
    };

    on(WebSocketEvent.PRODUCT_CREATED, handleProductCreated);
    on(WebSocketEvent.PRODUCT_UPDATED, handleProductUpdated);
    on(WebSocketEvent.PRODUCT_PRICE_CHANGED, handlePriceChanged);
    on(WebSocketEvent.PRODUCT_DISCOUNT_APPLIED, handleDiscountApplied);
    on(WebSocketEvent.PRODUCT_DISCOUNT_REMOVED, handleDiscountRemoved);
    on(WebSocketEvent.PRODUCT_STOCK_CHANGED, handleStockChanged);
    on(WebSocketEvent.PRODUCT_DELETED, handleProductDeleted);
    on(WebSocketEvent.CATEGORY_CREATED, handleCategoryCreated);
    on(WebSocketEvent.CATEGORY_UPDATED, handleCategoryUpdated);
    on(WebSocketEvent.CATEGORY_DELETED, handleCategoryDeleted);

    return () => {
      off(WebSocketEvent.PRODUCT_CREATED, handleProductCreated);
      off(WebSocketEvent.PRODUCT_UPDATED, handleProductUpdated);
      off(WebSocketEvent.PRODUCT_PRICE_CHANGED, handlePriceChanged);
      off(WebSocketEvent.PRODUCT_DISCOUNT_APPLIED, handleDiscountApplied);
      off(WebSocketEvent.PRODUCT_DISCOUNT_REMOVED, handleDiscountRemoved);
      off(WebSocketEvent.PRODUCT_STOCK_CHANGED, handleStockChanged);
      off(WebSocketEvent.PRODUCT_DELETED, handleProductDeleted);
      off(WebSocketEvent.CATEGORY_CREATED, handleCategoryCreated);
      off(WebSocketEvent.CATEGORY_UPDATED, handleCategoryUpdated);
      off(WebSocketEvent.CATEGORY_DELETED, handleCategoryDeleted);
    };
  }, [
    isConnected,
    isEnabled,
    dispatch,
    on,
    off,
    onProductUpdate,
    onCategoryUpdate,
  ]);
};
