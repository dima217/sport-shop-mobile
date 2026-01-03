export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number | null;
  images: string[];
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  rating?: number | null;
  reviewCount?: number;
  inStock: boolean;
  stockQuantity?: number | null;
  sizes?: string[] | null;
  colors?: string[] | null;
  brand?: string | null;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  limit: number;
  offset: number;
}

export interface ProductsQueryParams {
  categoryId?: string;
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  sizes?: string[];
  colors?: string[];
  minRating?: number;
  inStock?: boolean;
  sortBy?: "price" | "rating" | "name" | "createdAt" | "reviewCount";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  oldPrice?: number | null;
  images: string[];
  categoryId: string;
  inStock?: boolean;
  stockQuantity?: number | null;
  sizes?: string[] | null;
  colors?: string[] | null;
  brand?: string | null;
  sku: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  oldPrice?: number | null;
  images?: string[];
  categoryId?: string;
  inStock?: boolean;
  stockQuantity?: number | null;
  sizes?: string[] | null;
  colors?: string[] | null;
  brand?: string | null;
  sku?: string;
}
