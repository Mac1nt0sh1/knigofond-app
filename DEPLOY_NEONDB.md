# Быстрый старт: Деплой на NeonDB

## Что такое NeonDB?

NeonDB - это serverless PostgreSQL база данных с автоматическим масштабированием и встроенным connection pooling.

## Преимущества NeonDB:

- ✅ Простая настройка (одна строка подключения)
- ✅ Автоматический connection pooling
- ✅ Бесплатный тарифный план
- ✅ Автоматическое масштабирование
- ✅ Встроенные резервные копии

## Шаг 1: Создание проекта в NeonDB

1. Откройте [NeonDB Dashboard](https://console.neon.tech/)
2. Войдите или зарегистрируйтесь (можно через GitHub)
3. Нажмите **Create Project**
4. Заполните:
   - **Project name**: `knigofond-app` (или любое другое)
   - **Region**: выберите ближайший к вам
   - **PostgreSQL version**: оставьте по умолчанию (обычно 16)
5. Нажмите **Create Project**

## Шаг 2: Получение строк подключения

1. После создания проекта откройте его
2. Найдите раздел **Connection Details** или нажмите на название проекта
3. Скопируйте **ДВЕ** строки подключения:

### Pooler connection (для приложения):
- Содержит `-pooler` в hostname
- Формат: `postgresql://[user]:[password]@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require`
- Используется для `DATABASE_URL`

### Direct connection (для миграций):
- БЕЗ `-pooler` в hostname
- Формат: `postgresql://[user]:[password]@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
- Используется для `DIRECT_URL`

**Важно:** Для миграций Prisma нужен direct connection, иначе может возникнуть ошибка P1017.

## Шаг 3: Настройка .env файла

Откройте файл `.env` и добавьте:

```env
# Pooler connection (для приложения) - содержит -pooler в hostname
DATABASE_URL="postgresql://[user]:[password]@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require"

# Direct connection (для миграций) - БЕЗ -pooler в hostname
DIRECT_URL="postgresql://[user]:[password]@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

**Важно:** 
- `DATABASE_URL` использует pooler connection (с `-pooler`)
- `DIRECT_URL` использует direct connection (без `-pooler`) - это важно для миграций!

**Важно:** Замените `[user]`, `[password]`, `[hostname]`, `[database]` на реальные значения из NeonDB Dashboard.

## Шаг 4: Деплой базы данных

### Вариант 1: Быстрый деплой (рекомендуется)

```bash
npm run db:push
```

### Вариант 2: С миграциями

```bash
# Создать первую миграцию
npm run db:migrate

# Или с именем
npx prisma migrate dev --name init
```

## Шаг 5: Генерация Prisma Client

```bash
npm run db:generate
```

## Шаг 6: Проверка подключения

```bash
npm run db:check
```

## Шаг 7: Настройка на Vercel

1. Откройте Vercel Dashboard → Ваш проект → **Settings** → **Environment Variables**
2. Добавьте:
   - `DATABASE_URL` - строка подключения из NeonDB
   - `DIRECT_URL` - можно использовать ту же строку или оставить пустым
3. Пересоберите проект (Redeploy)

## Особенности NeonDB

### Автоматическое приостановление

NeonDB автоматически приостанавливает неактивные проекты на бесплатном тарифе. При первом запросе проект автоматически "просыпается" (может занять несколько секунд).

### Connection Pooling

NeonDB автоматически управляет connection pooling, поэтому не нужно настраивать отдельные строки для pooler и direct подключений.

### SSL

Все подключения к NeonDB требуют SSL. Убедитесь, что в строке подключения есть `?sslmode=require`.

## Решение проблем

### Ошибка P1017: Server has closed the connection

Эта ошибка обычно означает:
1. Проект приостановлен - подождите несколько секунд и попробуйте снова
2. Используется pooler connection для миграций - нужен direct connection

**Решение:**
- Убедитесь, что `DIRECT_URL` использует direct connection (без `-pooler` в hostname)
- Подробнее см. `FIX_NEONDB_P1017.md`

### Ошибка подключения

1. Проверьте, что проект в NeonDB активен (не приостановлен)
2. Убедитесь, что строка подключения скопирована полностью
3. Проверьте, что в строке есть `?sslmode=require`
4. Если пароль содержит спецсимволы, закодируйте их в URL
5. Убедитесь, что используете правильный тип connection (pooler для DATABASE_URL, direct для DIRECT_URL)

### Проект приостановлен

Если проект приостановлен, просто сделайте любой запрос к базе данных - он автоматически "проснется" через несколько секунд.

### Пароль с спецсимволами

Если пароль содержит специальные символы, закодируйте их:
- Используйте онлайн-кодировщик: https://www.urlencoder.org/
- Или в PowerShell: `[System.Web.HttpUtility]::UrlEncode("ваш_пароль")`

## Полезные ссылки

- [NeonDB Dashboard](https://console.neon.tech/)
- [NeonDB Документация](https://neon.tech/docs)
- [Prisma + NeonDB](https://neon.tech/docs/guides/prisma)

