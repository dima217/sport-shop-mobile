export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
  parentId?: string | null;
  productCount?: number; // Добавляем для фронтенда
}

export interface CategoriesQueryParams {
  limit?: number;
  offset?: number;
}

export interface CreateCategoryDto {
  name: string;
  image: string;
  slug: string;
  parentId?: string | null;
}

export interface UpdateCategoryDto {
  name?: string;
  image?: string;
  slug?: string;
  parentId?: string | null;
}
