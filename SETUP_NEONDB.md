# Настройка NeonDB для вашего проекта

## Ваши строки подключения из NeonDB:

```env
# Pooler connection (для приложения)
DATABASE_URL="postgresql://neondb_owner:npg_WB4CyvnuHlS6@ep-solitary-water-a18myb5m-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Direct connection (для миграций) - раскомментируйте DATABASE_URL_UNPOOLED
DIRECT_URL="postgresql://neondb_owner:npg_WB4CyvnuHlS6@ep-solitary-water-a18myb5m.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

## Шаг 1: Обновите .env файл

Откройте файл `.env` и добавьте/обновите эти строки:

```env
DATABASE_URL="postgresql://neondb_owner:npg_WB4CyvnuHlS6@ep-solitary-water-a18myb5m-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

DIRECT_URL="postgresql://neondb_owner:npg_WB4CyvnuHlS6@ep-solitary-water-a18myb5m.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

**Важно:**
- `DATABASE_URL` использует pooler (с `-pooler` в hostname)
- `DIRECT_URL` использует direct connection (без `-pooler`)
- Обе строки уже содержат правильные параметры SSL

## Шаг 2: Проверьте подключение

```bash
npm run db:check
```

## Шаг 3: Деплой базы данных

```bash
npm run db:push
```

Или с миграциями:

```bash
npm run db:migrate
```

## Шаг 4: Генерация Prisma Client

```bash
npm run db:generate
```

## Если возникнет ошибка P1017

Это означает, что проект приостановлен или используется pooler для миграций:

1. **Подождите 5-10 секунд** - проект может "просыпаться"
2. **Убедитесь, что DIRECT_URL использует direct connection** (без `-pooler`)
3. **Попробуйте снова**

## Настройка на Vercel

1. Vercel Dashboard → Settings → Environment Variables
2. Добавьте обе переменные:
   - `DATABASE_URL` (pooler connection)
   - `DIRECT_URL` (direct connection)
3. Пересоберите проект

