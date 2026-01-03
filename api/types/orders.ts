export interface DeliveryAddressDto {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CreateOrderDto {
  deliveryAddress: DeliveryAddressDto;
  paymentMethod: "card" | "cash";
  comment?: string | null;
}

export interface Order {
  id: string;
  userId: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  deliveryStreet: string;
  deliveryCity: string;
  deliveryPostalCode: string;
  deliveryCountry: string;
  paymentMethod: "card" | "cash";
  comment?: string | null;
  total: number;
  createdAt: string;
  items?: import("./cart").CartItem[];
}
