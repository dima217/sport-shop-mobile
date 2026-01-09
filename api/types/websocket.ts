import { Category } from "./categories";
import { Order } from "./orders";
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

// События заказов
export interface OrderCreatedPayload extends WebSocketEventPayload {
  order: Order;
}

export interface OrderUpdatedPayload extends WebSocketEventPayload {
  order: Order;
}

export interface OrderStatusChangedPayload extends WebSocketEventPayload {
  orderId: string;
  oldStatus: string;
  newStatus: string;
  order: Order;
}

export interface OrderCancelledPayload extends WebSocketEventPayload {
  orderId: string;
  order: Order;
}

// События поддержки
export interface SupportTicketCreatedPayload extends WebSocketEventPayload {
  ticketId: number;
  userId: number;
  subject: string;
  status: string;
  createdAt: string;
}

export interface SupportTicketRepliedPayload extends WebSocketEventPayload {
  ticketId: number;
  userId: number;
  response: string;
  status: string;
  updatedAt: string;
}

export interface SupportTicketStatusUpdatedPayload
  extends WebSocketEventPayload {
  ticketId: number;
  userId: number;
  status: string;
  updatedAt: string;
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
  ORDER_CREATED = "order:created",
  ORDER_UPDATED = "order:updated",
  ORDER_STATUS_UPDATED = "order:status_updated",
  ORDER_CANCELLED = "order:cancelled",
  SUPPORT_TICKET_CREATED = "support:ticket_created",
  SUPPORT_TICKET_REPLIED = "support:ticket_replied",
  SUPPORT_TICKET_STATUS_UPDATED = "support:ticket_status_updated",
}
