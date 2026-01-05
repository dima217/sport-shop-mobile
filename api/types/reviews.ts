export interface Review {
  id: string;
  productId: string;
  userId: number;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  limit: number;
  offset: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface CreateReviewDto {
  productId: string;
  rating: number; // 1-5
  comment: string;
}

export interface UpdateReviewDto {
  rating?: number; // 1-5
  comment?: string;
}

export interface ReviewsQueryParams {
  productId: string;
  limit?: number;
  offset?: number;
  sortBy?: "createdAt" | "rating";
  sortOrder?: "asc" | "desc";
  rating?: number; // Фильтр по рейтингу (1-5)
}
