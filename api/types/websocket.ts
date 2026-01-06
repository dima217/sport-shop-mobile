import { Category } from "./categories";
import { Product } from "./products";

// Базовый тип для всех WebSocket событий
export interface WebSocketEventPayload {
  timestamp: string;
}

// События товаров
export interface ProductCreatedPayload extends WebSocketEventPayload {
  product: Product;
}

export interface ProductUpdatedPayload extends WebSocketEventPayload {
  product: Product;
}

export interface ProductPriceChangedPayload extends WebSocketEventPayload {
  productId: string;
  oldPrice: number;
  newPrice: number;
  product: Product;
}

export interface ProductDiscountAppliedPayload extends WebSocketEventPayload {
  productId: string;
  discountPercent: number;
  oldPrice: number;
  newPrice: number;
  product: Product;
}

export interface ProductDiscountRemovedPayload extends WebSocketEventPayload {
  productId: string;
  discountPercent: number; // Всегда 0
  oldPrice: number;
  newPrice: number;
  product: Product;
}

export interface ProductStockChangedPayload extends WebSocketEventPayload {
  productId: string;
  oldStock: number;
  newStock: number;
  inStock: boolean;
  product: Product;
}

export interface ProductDeletedPayload extends WebSocketEventPayload {
  productId: string;
}

// События категорий
export interface CategoryCreatedPayload extends WebSocketEventPayload {
  category: Category;
}

export interface CategoryUpdatedPayload extends WebSocketEventPayload {
  category: Category;
}

export interface CategoryDeletedPayload extends WebSocketEventPayload {
  categoryId: string;
}

// Типы событий
export enum WebSocketEvent {
  PRODUCT_CREATED = "product:created",
  PRODUCT_UPDATED = "product:updated",
  PRODUCT_PRICE_CHANGED = "product:price_changed",
  PRODUCT_DISCOUNT_APPLIED = "product:discount_applied",
  PRODUCT_DISCOUNT_REMOVED = "product:discount_removed",
  PRODUCT_STOCK_CHANGED = "product:stock_changed",
  PRODUCT_DELETED = "product:deleted",
  CATEGORY_CREATED = "category:created",
  CATEGORY_UPDATED = "category:updated",
  CATEGORY_DELETED = "category:deleted",
}
