# Переход с Supabase на NeonDB

## Быстрый старт

### Шаг 1: Создайте проект в NeonDB

1. Откройте [NeonDB Dashboard](https://console.neon.tech/)
2. Войдите или зарегистрируйтесь
3. Нажмите **Create Project**
4. Заполните данные проекта
5. Скопируйте строку подключения

### Шаг 2: Обновите .env файл

Замените строки Supabase на NeonDB:

```env
# Старая строка (Supabase) - удалите
# DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Pooler connection (для приложения) - содержит -pooler в hostname
DATABASE_URL="postgresql://[user]:[password]@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require"

# Direct connection (для миграций) - БЕЗ -pooler в hostname
DIRECT_URL="postgresql://[user]:[password]@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

### Шаг 3: Перегенерируйте Prisma Client

```bash
npx prisma generate
```

### Шаг 4: Проверьте подключение

```bash
npm run db:check
```

### Шаг 5: Деплой базы данных

```bash
npm run db:push
```

Или с миграциями:

```bash
npm run db:migrate
```

### Шаг 6: Обновите переменные на Vercel

1. Vercel Dashboard → Settings → Environment Variables
2. Обновите `DATABASE_URL` на строку из NeonDB
3. Обновите `DIRECT_URL` (можно использовать ту же строку)
4. Пересоберите проект

## Основные отличия NeonDB от Supabase

| Параметр | Supabase | NeonDB |
|----------|----------|--------|
| Строк подключения | 2 (pooler + direct) | 1 (универсальная) |
| Connection pooling | Нужно настраивать | Встроен автоматически |
| SSL | Опционально | Обязателен (`?sslmode=require`) |
| Приостановка | Нет | Автоматическая на бесплатном тарифе |

## Преимущества NeonDB

- ✅ Проще настройка (одна строка подключения)
- ✅ Автоматический connection pooling
- ✅ Бесплатный тарифный план
- ✅ Автоматическое масштабирование
- ✅ Встроенные резервные копии

## Важные замечания

1. **SSL обязателен** - убедитесь, что в строке есть `?sslmode=require`
2. **Автоматическое приостановление** - на бесплатном тарифе проект может приостанавливаться при неактивности
3. **Одна строка подключения** - работает и для приложения, и для миграций

## Документация

- Подробная инструкция: `DEPLOY_NEONDB.md`
- Общая инструкция по деплою: `DEPLOY_DB.md`

