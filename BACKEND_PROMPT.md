# Промпт для разработки Backend API для интернет-магазина спортивных товаров

## Контекст проекта

Разрабатывается REST API для мобильного приложения интернет-магазина спортивных товаров. Приложение использует React Native с Expo, Redux Toolkit Query (RTK Query) для работы с API. Необходимо создать полнофункциональный backend с полной Swagger/OpenAPI документацией.

## Технические требования

### Технологический стек (рекомендуемый)

- **Framework**: Node.js (Express/NestJS) или Python (FastAPI/Django)
- **База данных**: PostgreSQL или MongoDB
- **Аутентификация**: JWT access токены (без refresh токенов)
- **Документация**: Swagger/OpenAPI 3.0
- **Файлы**: Поддержка загрузки изображений товаров

### Структура API

**Base URL**: `http://84.201.188.209:3000` (или переменная окружения)

**Заголовки**:

- `Authorization: Bearer {accessToken}` - для защищенных endpoints
- `x-client-type: mobile-app` - идентификация клиента
- `Content-Type: application/json`

**Формат ответов**:

- Успешный ответ: статус 200-299, JSON тело
- Ошибка: статус 400-500, JSON с полями:
  ```json
  {
    "message": "Описание ошибки",
    "statusCode": 400,
    "error": "Bad Request"
  }
  ```

## Endpoints и структуры данных

### 1. Аутентификация (уже существует, но нужно проверить совместимость)

#### POST /auth/login

**Описание**: Вход пользователя

**Request Body**:

```typescript
{
  email: string; // email пользователя
  password: string; // пароль
}
```

**Response 200**:

```typescript
{
  accessToken: string; // JWT access token
  user: {
    profile: {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    }
  }
}
```

#### POST /auth/sign-up

**Описание**: Регистрация нового пользователя

**Request Body**:

```typescript
{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
```

**Response 200**:

```typescript
{
  accessToken: string;
}
```

#### POST /auth/sign-out

**Описание**: Выход пользователя (инвалидация токена)

**Headers**: `Authorization: Bearer {accessToken}`

**Response 200**: `{}`

#### GET /profile

**Описание**: Получение профиля текущего пользователя

**Headers**: `Authorization: Bearer {accessToken}`

**Response 200**:

```typescript
{
  id: string;
  email: string;
  name: string;          // Полное имя (firstName + lastName)
  avatar?: string | null;
}
```

---

### 2. Категории товаров

#### GET /categories

**Описание**: Получение списка всех категорий

**Query Parameters** (опционально):

- `limit?: number` - количество результатов (по умолчанию: все)
- `offset?: number` - смещение для пагинации

**Response 200**:

```typescript
Category[];

interface Category {
  id: string;              // UUID
  name: string;            // Название категории (например, "Одежда", "Обувь")
  image: string;           // URL изображения категории
  productCount?: number;   // Количество товаров в категории (опционально)
  slug: string;            // URL-friendly идентификатор
  parentId?: string | null; // ID родительской категории (для вложенных категорий)
}
```

#### GET /categories/{categoryId}

**Описание**: Получение детальной информации о категории

**Response 200**: `Category`

---

### 3. Товары (Products)

#### GET /products

**Описание**: Получение списка товаров с фильтрацией и пагинацией

**Query Parameters**:

- `categoryId?: string` - фильтр по категории
- `search?: string` - поиск по названию/описанию
- `minPrice?: number` - минимальная цена
- `maxPrice?: number` - максимальная цена
- `inStock?: boolean` - только товары в наличии
- `sortBy?: 'price' | 'rating' | 'name' | 'createdAt'` - поле для сортировки
- `sortOrder?: 'asc' | 'desc'` - порядок сортировки
- `limit?: number` - количество результатов (по умолчанию: 20)
- `offset?: number` - смещение для пагинации

**Response 200**:

```typescript
{
  products: Product[];
  total: number;        // Общее количество товаров (для пагинации)
  limit: number;
  offset: number;
}

interface Product {
  id: string;                    // UUID
  name: string;                  // Название товара
  description: string;           // Описание товара
  price: number;                 // Текущая цена в рублях (целое число, например 8990 = 8990 руб)
  oldPrice?: number | null;      // Старая цена в рублях (для скидок)
  images: string[];             // Массив URL изображений товара
  categoryId: string;            // ID категории
  category: {
    id: string;
    name: string;
  };
  rating?: number | null;        // Средний рейтинг (0-5)
  reviewCount?: number;          // Количество отзывов
  inStock: boolean;              // Есть ли в наличии
  stockQuantity?: number;        // Количество на складе
  sizes?: string[];              // Доступные размеры (для одежды/обуви)
  colors?: string[];             // Доступные цвета
  brand?: string;                // Бренд товара
  sku: string;                   // Артикул товара
  createdAt: string;             // ISO 8601 дата создания
  updatedAt: string;             // ISO 8601 дата обновления
}
```

#### GET /products/{productId}

**Описание**: Получение детальной информации о товаре

**Response 200**: `Product`

**Response 404**: Товар не найден

---

### 4. Корзина (Cart)

#### GET /cart

**Описание**: Получение корзины текущего пользователя

**Headers**: `Authorization: Bearer {accessToken}`

**Response 200**:

```typescript
{
  items: CartItem[];
  total: number;        // Общая стоимость корзины
}

interface CartItem {
  id: string;           // UUID элемента корзины
  productId: string;    // ID товара
  product: Product;     // Полная информация о товаре
  quantity: number;     // Количество товара
  size?: string | null; // Выбранный размер (если применимо)
  color?: string | null; // Выбранный цвет (если применимо)
  price: number;        // Цена на момент добавления в рублях
  createdAt: string;    // ISO 8601 дата добавления
}
```

#### POST /cart

**Описание**: Добавление товара в корзину

**Headers**: `Authorization: Bearer {accessToken}`

**Request Body**:

```typescript
{
  productId: string;
  quantity: number;     // Минимум 1
  size?: string;        // Опционально, если товар имеет размеры
  color?: string;        // Опционально, если товар имеет цвета
}
```

**Response 200**: `CartItem`

**Response 400**: Неверные данные (товар не найден, нет в наличии, неверный размер/цвет)

#### PATCH /cart/{cartItemId}

**Описание**: Обновление количества товара в корзине

**Headers**: `Authorization: Bearer {accessToken}`

**Request Body**:

```typescript
{
  quantity: number; // Новое количество (минимум 1)
}
```

**Response 200**: `CartItem`

#### DELETE /cart/{cartItemId}

**Описание**: Удаление товара из корзины

**Headers**: `Authorization: Bearer {accessToken}`

**Response 200**: `{}`

#### DELETE /cart

**Описание**: Очистка всей корзины

**Headers**: `Authorization: Bearer {accessToken}`

**Response 200**: `{}`

---

### 5. Избранное (Favorites)

#### GET /favorites

**Описание**: Получение списка избранных товаров

**Headers**: `Authorization: Bearer {accessToken}`

**Query Parameters**:

- `limit?: number`
- `offset?: number`

**Response 200**:

```typescript
{
  products: Product[];
  total: number;
}
```

#### POST /favorites/{productId}

**Описание**: Добавление товара в избранное

**Headers**: `Authorization: Bearer {accessToken}`

**Response 200**: `{ success: true }`

**Response 400**: Товар уже в избранном или не найден

#### DELETE /favorites/{productId}

**Описание**: Удаление товара из избранного

**Headers**: `Authorization: Bearer {accessToken}`

**Response 200**: `{ success: true }`

---

### 6. Заказы (Orders) - опционально для MVP

#### POST /orders

**Описание**: Создание заказа из корзины

**Headers**: `Authorization: Bearer {accessToken}`

**Request Body**:

```typescript
{
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: 'card' | 'cash';
  comment?: string;
}
```

**Response 200**:

```typescript
{
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: CartItem[];
  total: number;
  createdAt: string;
}
```

#### GET /orders

**Описание**: Получение списка заказов пользователя

**Headers**: `Authorization: Bearer {accessToken}`

**Response 200**: `Order[]`

---

## Требования к Swagger/OpenAPI документации

1. **Полное описание всех endpoints** с примерами запросов и ответов
2. **Схемы данных (schemas)** для всех типов данных
3. **Примеры (examples)** для каждого endpoint
4. **Описание ошибок** с кодами статусов
5. **Security schemes** для JWT аутентификации:
   ```yaml
   components:
     securitySchemes:
       bearerAuth:
         type: http
         scheme: bearer
         bearerFormat: JWT
   ```
6. **Теги (tags)** для группировки endpoints:

   - Authentication
   - Categories
   - Products
   - Cart
   - Favorites
   - Orders

7. **Доступность через UI**: Swagger UI должен быть доступен по адресу `/api-docs` или `/swagger`

## Дополнительные требования

### Валидация данных

- Все входные данные должны валидироваться
- Возвращать понятные сообщения об ошибках
- Использовать HTTP статус коды правильно (400 для валидации, 401 для неавторизованных, 404 для не найденных, 500 для серверных ошибок)

### Безопасность

- JWT access токены с разумным временем жизни (рекомендуется: 24 часа или больше для мобильного приложения)
- Хеширование паролей (bcrypt)
- Валидация и санитизация всех входных данных
- CORS настройки для мобильного приложения

### Производительность

- Пагинация для списков товаров
- Индексы в БД для частых запросов (categoryId, price, inStock)
- Кэширование категорий (если редко меняются)

### Файлы и изображения

- Endpoint для загрузки изображений: `POST /upload/image`
- Возвращать полные URL изображений в ответах
- Поддержка форматов: JPEG, PNG, WebP
- Максимальный размер файла: 5MB

## Примеры использования с RTK Query

Backend должен быть совместим с RTK Query, что означает:

- Стандартные HTTP методы (GET, POST, PATCH, DELETE)
- JSON формат запросов и ответов
- Правильные статус коды
- Возможность использования query параметров для фильтрации

Пример структуры, которую будет использовать RTK Query:

```typescript
// productsApi.ts
export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (build) => ({
    getProducts: build.query<ProductsResponse, ProductsQueryParams>({
      query: (params) => ({
        url: "/products",
        method: "GET",
        params, // query parameters
      }),
    }),
    getProduct: build.query<Product, string>({
      query: (id) => `/products/${id}`,
    }),
    addToCart: build.mutation<CartItem, AddToCartRequest>({
      query: (body) => ({
        url: "/cart",
        method: "POST",
        body,
      }),
    }),
  }),
});
```

## Приоритеты разработки

1. **MVP (Минимально жизнеспособный продукт)**:

   - Аутентификация (уже есть, проверить совместимость)
   - Категории (GET /categories)
   - Товары (GET /products, GET /products/{id})
   - Корзина (GET, POST, PATCH, DELETE /cart)
   - Избранное (GET, POST, DELETE /favorites)

2. **Второй этап**:

   - Заказы
   - Поиск и фильтрация товаров
   - Отзывы и рейтинги

3. **Дополнительно**:
   - Админ-панель
   - Аналитика
   - Уведомления

## Критерии готовности

Backend считается готовым, когда:

- ✅ Все MVP endpoints реализованы и протестированы
- ✅ Swagger документация полная и актуальная
- ✅ Все endpoints возвращают правильные статус коды
- ✅ Валидация данных работает корректно
- ✅ JWT аутентификация работает
- ✅ API протестировано с помощью Postman/Insomnia
- ✅ Swagger UI доступен и функционален

---

**Важно**: После разработки необходимо предоставить:

1. Полную Swagger/OpenAPI спецификацию (YAML или JSON)
2. Инструкцию по запуску и настройке
3. Переменные окружения с примерами
4. SQL скрипты для создания БД (если используется SQL)
5. Примеры curl запросов для каждого endpoint
