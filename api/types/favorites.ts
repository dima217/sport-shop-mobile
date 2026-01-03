import { Product } from "./products";

export interface FavoritesResponse {
  products: Product[];
  total: number;
}

export interface FavoritesQueryParams {
  limit: number;
  offset: number;
}
