# Удаление поддержки аватарок пользователей из Backend API

## Контекст

В мобильном приложении принято решение отказаться от загрузки и хранения аватарок пользователей. Вместо этого используется отображение первой буквы имени пользователя на цветном фоне круга (как в большинстве современных приложений).

## Требуемые изменения в Backend API

### 1. Удаление поля `avatarUrl` из всех ответов API

#### POST /auth/login

**Текущий Response:**

```typescript
{
  accessToken: string;
  user: {
    profile: {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl: string | null; // ❌ УДАЛИТЬ
    }
  }
}
```

**Новый Response:**

```typescript
{
  accessToken: string;
  user: {
    profile: {
      id: string;
      firstName: string;
      lastName: string;
    }
  }
}
```

#### GET /profile

**Текущий Response:**

```typescript
{
  id: string;
  email: string;
  name: string;
  avatar?: string | null;  // ❌ УДАЛИТЬ
}
```

**Новый Response:**

```typescript
{
  id: string;
  email: string;
  name: string;
}
```

### 2. Удаление поля `avatarUrl` из запросов обновления профиля

#### PUT /users/{id}

**Текущий Request Body:**

```typescript
{
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;  // ❌ УДАЛИТЬ
}
```

**Новый Request Body:**

```typescript
{
  firstName?: string;
  lastName?: string;
}
```

**Текущий Response:**

```typescript
{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null; // ❌ УДАЛИТЬ
}
```

**Новый Response:**

```typescript
{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}
```

### 3. Удаление поля `avatarUrl` из ответов с информацией о пользователях в отзывах

#### GET /reviews (в ответах с информацией о пользователе)

**Текущий Response (в объекте `user`):**

```typescript
{
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;  // ❌ УДАЛИТЬ
  }
}
```

**Новый Response:**

```typescript
{
  user?: {
    id: number;
    firstName: string;
    lastName: string;
  }
}
```

### 4. Изменения в базе данных

**Рекомендуется:**

- Удалить колонку `avatarUrl` из таблицы пользователей (users/profiles)
- Или оставить колонку, но не использовать её в API (для обратной совместимости, если есть старые данные)

**Миграция (пример для PostgreSQL):**

```sql
-- Вариант 1: Полное удаление колонки
ALTER TABLE users DROP COLUMN IF EXISTS avatar_url;

-- Вариант 2: Оставить колонку, но не использовать (если нужна обратная совместимость)
-- Ничего не делать, просто не возвращать поле в API
```

### 5. Удаление endpoints для загрузки аватарок (если есть)

Если существуют endpoints для загрузки аватарок, их следует удалить или пометить как deprecated:

- `POST /users/{id}/avatar` - удалить
- `DELETE /users/{id}/avatar` - удалить
- `GET /users/{id}/avatar` - удалить

## Важные замечания

1. **Обратная совместимость**: Если в базе данных уже есть данные с `avatarUrl`, их можно игнорировать. Поле просто не должно возвращаться в API ответах.

2. **Валидация**: Убрать валидацию для поля `avatarUrl` из всех DTO и схем валидации.

3. **Swagger/OpenAPI документация**: Обновить документацию, удалив все упоминания `avatarUrl` из схем данных.

4. **Тесты**: Обновить все тесты, убрав проверки и использование `avatarUrl`.

## Примеры изменений в коде

### TypeScript/Node.js (NestJS пример)

**До:**

```typescript
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string | null; // ❌ УДАЛИТЬ
}
```

**После:**

```typescript
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}
```

### Python (FastAPI пример)

**До:**

```python
class UpdateUserDto(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    avatarUrl: Optional[str] = None  # ❌ УДАЛИТЬ
```

**После:**

```python
class UpdateUserDto(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
```

## Проверка изменений

После внесения изменений необходимо проверить:

1. ✅ POST /auth/login не возвращает `avatarUrl`
2. ✅ GET /profile не возвращает `avatar`
3. ✅ PUT /users/{id} не принимает и не возвращает `avatarUrl`
4. ✅ GET /reviews не возвращает `avatarUrl` в объекте `user`
5. ✅ Swagger документация обновлена
6. ✅ Все тесты проходят

## Дата вступления в силу

Изменения должны быть внесены **немедленно**, так как фронтенд уже обновлен и не использует поле `avatarUrl`.

---

**Примечание**: Если в базе данных есть существующие данные с аватарками, их можно оставить для истории, но они не должны использоваться в API. Фронтенд будет генерировать аватарки на основе первой буквы имени пользователя.
