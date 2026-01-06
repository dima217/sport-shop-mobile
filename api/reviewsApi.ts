import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseApi";
import {
  CreateReviewDto,
  Review,
  ReviewsQueryParams,
  ReviewsResponse,
  UpdateReviewDto,
} from "./types/reviews";

export const reviewsApi = createApi({
  reducerPath: "reviewsApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Review"],
  endpoints: (build) => ({
    getReviews: build.query<ReviewsResponse, ReviewsQueryParams>({
      query: (params) => {
        const { productId, ...queryParams } = params;
        const searchParams = new URLSearchParams();

        if (queryParams.limit) {
          searchParams.append("limit", queryParams.limit.toString());
        }
        if (queryParams.offset) {
          searchParams.append("offset", queryParams.offset.toString());
        }
        if (queryParams.sortBy) {
          searchParams.append("sortBy", queryParams.sortBy);
        }
        if (queryParams.sortOrder) {
          searchParams.append("sortOrder", queryParams.sortOrder);
        }
        if (queryParams.rating) {
          searchParams.append("rating", queryParams.rating.toString());
        }

        const queryString = searchParams.toString();
        return {
          url: `/products/${productId}/reviews${
            queryString ? `?${queryString}` : ""
          }`,
          method: "GET",
        };
      },
      providesTags: (result, error, params) => [
        { type: "Review", id: `LIST-${params.productId}` },
      ],
    }),

    getReview: build.query<Review, { productId: string; reviewId: string }>({
      query: ({ productId, reviewId }) =>
        `/products/${productId}/reviews/${reviewId}`,
      providesTags: (result, error, { reviewId }) => [
        { type: "Review", id: reviewId },
      ],
    }),

    createReview: build.mutation<Review, CreateReviewDto>({
      query: (body) => ({
        url: `/products/${body.productId}/reviews`,
        method: "POST",
        body: {
          rating: body.rating,
          comment: body.comment,
        },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Review", id: `LIST-${productId}` },
        { type: "Review", id: `MY-${productId}` },
      ],
    }),

    updateReview: build.mutation<
      Review,
      { productId: string; reviewId: string; data: UpdateReviewDto }
    >({
      query: ({ productId, reviewId, data }) => ({
        url: `/products/${productId}/reviews/${reviewId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { productId, reviewId }) => [
        { type: "Review", id: reviewId },
        { type: "Review", id: `LIST-${productId}` },
        { type: "Review", id: `MY-${productId}` },
      ],
    }),

    deleteReview: build.mutation<void, { productId: string; reviewId: string }>(
      {
        query: ({ productId, reviewId }) => ({
          url: `/products/${productId}/reviews/${reviewId}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, { productId, reviewId }) => [
          { type: "Review", id: reviewId },
          { type: "Review", id: `LIST-${productId}` },
          { type: "Review", id: `MY-${productId}` },
        ],
      }
    ),

    getMyReview: build.query<Review | null, string>({
      query: (productId) => `/products/${productId}/reviews/me`,
      providesTags: (result, error, productId) => [
        { type: "Review", id: `MY-${productId}` },
      ],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useGetReviewQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetMyReviewQuery,
} = reviewsApi;
