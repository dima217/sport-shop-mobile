export interface CartItem {
  id: string;
  userId?: number;
  productId: string;
  product?: import("./products").Product;
  quantity: number;
  size?: string | null;
  color?: string | null;
  price: number;
  createdAt: string;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}

export interface AddToCartDto {
  productId: string;
  quantity: number;
  size?: string | null;
  color?: string | null;
}

export interface UpdateCartItemDto {
  quantity: number;
}
