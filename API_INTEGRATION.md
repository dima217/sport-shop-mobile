# Интеграция API с RTK Query

## Созданные API endpoints

На основе Swagger спецификации созданы следующие RTK Query API:

### 1. Products API (`api/productsApi.ts`)

- `useGetProductsQuery` - получение списка товаров с фильтрацией
- `useGetProductQuery` - получение деталей товара
- `useCreateProductMutation` - создание товара (Admin)
- `useUpdateProductMutation` - обновление товара (Admin)
- `useDeleteProductMutation` - удаление товара (Admin)

**Пример использования:**

```typescript
import { useGetProductsQuery } from "@/api";

const { data, isLoading, error } = useGetProductsQuery({
  categoryId: "1",
  limit: 20,
  offset: 0,
  sortBy: "price",
  sortOrder: "asc",
});
```

### 2. Categories API (`api/categoriesApi.ts`)

- `useGetCategoriesQuery` - получение списка категорий
- `useGetCategoryQuery` - получение категории по ID
- `useCreateCategoryMutation` - создание категории (Admin)
- `useUpdateCategoryMutation` - обновление категории (Admin)
- `useDeleteCategoryMutation` - удаление категории (Admin)

**Пример использования:**

```typescript
import { useGetCategoriesQuery } from "@/api";

const { data: categories } = useGetCategoriesQuery({
  limit: 10,
  offset: 0,
});
```

### 3. Cart API (`api/cartApi.ts`)

- `useGetCartQuery` - получение корзины пользователя
- `useAddToCartMutation` - добавление товара в корзину
- `useUpdateCartItemMutation` - обновление количества товара
- `useRemoveCartItemMutation` - удаление товара из корзины
- `useClearCartMutation` - очистка корзины

**Пример использования:**

```typescript
import { useGetCartQuery, useAddToCartMutation } from "@/api";

const { data: cart } = useGetCartQuery();
const [addToCart] = useAddToCartMutation();

// Добавить товар в корзину
await addToCart({
  productId: "123",
  quantity: 1,
  size: "42",
  color: "Черный",
}).unwrap();
```

### 4. Favorites API (`api/favoritesApi.ts`)

- `useGetFavoritesQuery` - получение избранных товаров
- `useAddToFavoritesMutation` - добавление в избранное
- `useRemoveFromFavoritesMutation` - удаление из избранного

**Пример использования:**

```typescript
import { useGetFavoritesQuery, useAddToFavoritesMutation } from "@/api";

const { data: favorites } = useGetFavoritesQuery({ limit: 20, offset: 0 });
const [addToFavorites] = useAddToFavoritesMutation();

await addToFavorites("product-id").unwrap();
```

### 5. Orders API (`api/ordersApi.ts`)

- `useGetOrdersQuery` - получение списка заказов
- `useGetOrderQuery` - получение заказа по ID
- `useCreateOrderMutation` - создание заказа из корзины

**Пример использования:**

```typescript
import { useCreateOrderMutation } from "@/api";

const [createOrder] = useCreateOrderMutation();

await createOrder({
  deliveryAddress: {
    street: "ул. Ленина, д. 10",
    city: "Москва",
    postalCode: "123456",
    country: "Россия",
  },
  paymentMethod: "card",
  comment: "Позвонить перед доставкой",
}).unwrap();
```

## Типы данных

Все типы находятся в `api/types/`:

- `products.ts` - Product, ProductsResponse, ProductsQueryParams
- `categories.ts` - Category, CategoriesQueryParams
- `cart.ts` - CartItem, CartResponse, AddToCartDto
- `favorites.ts` - FavoritesResponse, FavoritesQueryParams
- `orders.ts` - Order, CreateOrderDto, DeliveryAddressDto
- `auth.ts` - SignInRequest, SignInResponse, etc.

## Интеграция в компоненты

### Пример: Обновление HomeScreen для использования API

```typescript
import { useGetProductsQuery } from "@/api";

export const HomeScreen = () => {
  const { data, isLoading } = useGetProductsQuery({
    limit: 6,
    offset: 0,
    sortBy: "rating",
    sortOrder: "desc",
  });

  if (isLoading) return <ActivityIndicator />;

  return (
    <FlatList
      data={data?.products || []}
      renderItem={({ item }) => <ProductCard product={item} />}
    />
  );
};
```

### Пример: Обновление CartList для использования API

```typescript
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} from "@/api";

export const CartList = () => {
  const { data: cart, isLoading } = useGetCartQuery();
  const [updateItem] = useUpdateCartItemMutation();
  const [removeItem] = useRemoveCartItemMutation();

  const handleQuantityChange = async (id: string, quantity: number) => {
    await updateItem({ id, data: { quantity } }).unwrap();
  };

  const handleRemove = async (id: string) => {
    await removeItem(id).unwrap();
  };

  // ... остальной код
};
```

## Важные замечания

1. **Все защищенные endpoints требуют авторизации** - токен автоматически добавляется через `baseQueryWithAuth`
2. **Автоматическая инвалидация кэша** - при мутациях автоматически обновляются связанные запросы через `invalidatesTags`
3. **Обработка ошибок** - RTK Query автоматически обрабатывает ошибки, при 401 токен очищается
4. **Типы совместимы** - все типы соответствуют Swagger спецификации

## Следующие шаги

1. Заменить mock данные в компонентах на реальные API вызовы
2. Добавить обработку состояний загрузки и ошибок
3. Реализовать пагинацию где необходимо
4. Добавить оптимистичные обновления для лучшего UX
