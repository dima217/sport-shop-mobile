import { supportApi } from "@/api/supportApi";
import {
  SupportTicketRepliedPayload,
  SupportTicketStatusUpdatedPayload,
  WebSocketEvent,
} from "@/api/types/websocket";
import { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useWebSocket } from "../websocket/useWebSocket";

const WS_URL = "http://172.18.125.195:3000";

export const useSupportUpdates = (
  accessToken: string,
  onTicketUpdate?: (ticket: any) => void,
  isEnabled: boolean = true
) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isConnected, on, off } = useWebSocket(WS_URL, accessToken);

  useEffect(() => {
    if (!isConnected || !isEnabled) {
      return;
    }

    const handleTicketReplied = (payload: SupportTicketRepliedPayload) => {
      // Обновляем кэш тикета
      dispatch(
        supportApi.util.updateQueryData(
          "getTicket",
          payload.ticketId,
          (draft) => {
            if (draft) {
              draft.adminResponse = payload.response;
              draft.status = payload.status as any;
              draft.updatedAt = payload.updatedAt;
            }
          }
        )
      );

      // Инвалидируем список тикетов
      dispatch(supportApi.util.invalidateTags(["SupportTicket"]));

      // Вызываем callback
      if (onTicketUpdate) {
        onTicketUpdate({
          id: payload.ticketId,
          adminResponse: payload.response,
          status: payload.status,
          updatedAt: payload.updatedAt,
        });
      }
    };

    const handleTicketStatusUpdated = (
      payload: SupportTicketStatusUpdatedPayload
    ) => {
      // Обновляем кэш тикета
      dispatch(
        supportApi.util.updateQueryData(
          "getTicket",
          payload.ticketId,
          (draft) => {
            if (draft) {
              draft.status = payload.status as any;
              draft.updatedAt = payload.updatedAt;
            }
          }
        )
      );

      // Инвалидируем список тикетов
      dispatch(supportApi.util.invalidateTags(["SupportTicket"]));

      // Вызываем callback
      if (onTicketUpdate) {
        onTicketUpdate({
          id: payload.ticketId,
          status: payload.status,
          updatedAt: payload.updatedAt,
        });
      }
    };

    on(WebSocketEvent.SUPPORT_TICKET_REPLIED, handleTicketReplied);
    on(WebSocketEvent.SUPPORT_TICKET_STATUS_UPDATED, handleTicketStatusUpdated);

    return () => {
      off(WebSocketEvent.SUPPORT_TICKET_REPLIED, handleTicketReplied);
      off(
        WebSocketEvent.SUPPORT_TICKET_STATUS_UPDATED,
        handleTicketStatusUpdated
      );
    };
  }, [isConnected, isEnabled, accessToken, dispatch, on, off, onTicketUpdate]);
};
