import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseApi";
import {
  CreateTicketDto,
  ReplyTicketDto,
  Ticket,
  TicketsQueryParams,
  TicketsResponse,
  UpdateTicketStatusDto,
} from "./types/support";

export const supportApi = createApi({
  reducerPath: "supportApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["SupportTicket"],
  endpoints: (build) => ({
    getTickets: build.query<TicketsResponse, TicketsQueryParams | void>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.offset)
          queryParams.append("offset", params.offset.toString());
        if (params?.status) queryParams.append("status", params.status);
        if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
        if (params?.sortOrder)
          queryParams.append("sortOrder", params.sortOrder);

        const queryString = queryParams.toString();
        return {
          url: `/support/tickets${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["SupportTicket"],
    }),

    getTicket: build.query<Ticket, number>({
      query: (id) => `/support/tickets/${id}`,
      providesTags: (result, error, id) => [{ type: "SupportTicket", id }],
    }),

    createTicket: build.mutation<Ticket, CreateTicketDto>({
      query: (body) => ({
        url: "/support/tickets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SupportTicket"],
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useGetTicketQuery,
  useCreateTicketMutation,
} = supportApi;

