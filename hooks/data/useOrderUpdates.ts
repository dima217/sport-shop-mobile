import { ordersApi } from "@/api/ordersApi";
import {
  OrderCancelledPayload,
  OrderCreatedPayload,
  OrderStatusChangedPayload,
  OrderUpdatedPayload,
  WebSocketEvent,
} from "@/api/types/websocket";
import { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useWebSocket } from "../websocket/useWebSocket";

const WS_URL = "http://172.18.125.195:3000";

export const useOrderUpdates = (
  accessToken: string,
  onOrderUpdate?: (order: any) => void,
  isEnabled: boolean = true
) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isConnected, on, off } = useWebSocket(WS_URL, accessToken);

  useEffect(() => {
    if (!isConnected || !isEnabled) {
      return;
    }

    const handleOrderCreated = (payload: OrderCreatedPayload) => {
      // Инвалидируем список заказов, чтобы новый заказ появился
      dispatch(ordersApi.util.invalidateTags(["Order"]));
      if (onOrderUpdate) {
        onOrderUpdate(payload.order);
      }
    };

    const updateOrderInList = (updatedOrder: any) => {
      // Обновляем конкретный заказ в кэше
      dispatch(
        ordersApi.util.updateQueryData(
          "getOrder",
          updatedOrder.id,
          () => updatedOrder
        )
      );

      // Обновляем заказ в списке заказов
      // getOrders принимает void, RTK Query сериализует это как undefined
      try {
        dispatch(
          ordersApi.util.updateQueryData(
            "getOrders",
            undefined as any,
            (draft) => {
              if (draft && Array.isArray(draft)) {
                const index = draft.findIndex(
                  (o: any) => o.id === updatedOrder.id
                );
                if (index !== -1) {
                  draft[index] = updatedOrder;
                }
              }
            }
          )
        );
      } catch (e) {
        console.warn(
          "Failed to update orders list cache, invalidating tags:",
          e
        );
        dispatch(ordersApi.util.invalidateTags(["Order"]));
      }
    };

    const handleOrderUpdated = (payload: OrderUpdatedPayload) => {
      updateOrderInList(payload.order);
      if (onOrderUpdate) {
        onOrderUpdate(payload.order);
      }
    };

    const handleOrderStatusChanged = (payload: OrderStatusChangedPayload) => {
      updateOrderInList(payload.order);
      if (onOrderUpdate) {
        onOrderUpdate(payload.order);
      }
    };

    const handleOrderCancelled = (payload: OrderCancelledPayload) => {
      updateOrderInList(payload.order);
      if (onOrderUpdate) {
        onOrderUpdate(payload.order);
      }
    };

    on(WebSocketEvent.ORDER_CREATED, handleOrderCreated);
    on(WebSocketEvent.ORDER_UPDATED, handleOrderUpdated);
    on(WebSocketEvent.ORDER_STATUS_UPDATED, handleOrderStatusChanged);
    on(WebSocketEvent.ORDER_CANCELLED, handleOrderCancelled);

    return () => {
      off(WebSocketEvent.ORDER_CREATED, handleOrderCreated);
      off(WebSocketEvent.ORDER_UPDATED, handleOrderUpdated);
      off(WebSocketEvent.ORDER_STATUS_UPDATED, handleOrderStatusChanged);
      off(WebSocketEvent.ORDER_CANCELLED, handleOrderCancelled);
    };
  }, [isConnected, isEnabled, accessToken, dispatch, on, off, onOrderUpdate]);
};
