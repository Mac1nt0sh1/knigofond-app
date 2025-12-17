# Исправление ошибки P1017 в NeonDB

## Ошибка: P1017 Server has closed the connection

Эта ошибка обычно возникает в NeonDB по следующим причинам:

## Причина 1: Проект приостановлен

NeonDB автоматически приостанавливает неактивные проекты на бесплатном тарифе.

**Решение:**
1. Подождите 5-10 секунд
2. Попробуйте снова выполнить команду
3. Проект автоматически "проснется" при первом запросе

## Причина 2: Использование pooler connection для миграций

Prisma миграции требуют direct connection, а не pooler.

**Решение:**

### Вариант 1: Использовать direct connection string

В NeonDB Dashboard есть два типа строк подключения:
- **Pooler connection** (с `-pooler` в hostname) - для приложения
- **Direct connection** (без `-pooler`) - для миграций

1. Откройте NeonDB Dashboard → ваш проект
2. Найдите раздел **Connection Details**
3. Скопируйте **Direct connection** (не pooler!)
4. Добавьте в `.env`:

```env
# Pooler connection (для приложения)
DATABASE_URL="postgresql://[user]:[password]@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require"

# Direct connection (для миграций)
DIRECT_URL="postgresql://[user]:[password]@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

**Обратите внимание:** В DIRECT_URL НЕТ `-pooler` в hostname!

### Вариант 2: Использовать одну строку (если нет direct)

Если в NeonDB Dashboard показана только одна строка подключения:

```env
DATABASE_URL="postgresql://[user]:[password]@[hostname]/[database]?sslmode=require"
DIRECT_URL="postgresql://[user]:[password]@[hostname]/[database]?sslmode=require"
```

Но лучше использовать direct connection для миграций.

## Причина 3: Таймаут подключения

**Решение:**
1. Убедитесь, что проект активен в NeonDB Dashboard
2. Попробуйте выполнить простой запрос через `npm run db:check`
3. Если проект приостановлен, первый запрос может занять несколько секунд

## Быстрое исправление

### Шаг 1: Получите direct connection string

1. NeonDB Dashboard → ваш проект
2. Connection Details → найдите **Direct connection** (или просто Connection string без pooler)
3. Скопируйте строку

### Шаг 2: Обновите .env

```env
DATABASE_URL="postgresql://[user]:[password]@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://[user]:[password]@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

**Важно:** 
- DATABASE_URL может содержать `-pooler` (для приложения)
- DIRECT_URL НЕ должен содержать `-pooler` (для миграций)

### Шаг 3: Попробуйте снова

```bash
npm run db:push
```

Или:

```bash
npm run db:migrate
```

## Проверка

После исправления проверьте подключение:

```bash
npm run db:check
```

## Если ничего не помогает

1. **Проверьте статус проекта в NeonDB Dashboard** - убедитесь, что он активен
2. **Попробуйте через несколько секунд** - проект может "просыпаться"
3. **Используйте Prisma Studio** для проверки подключения:
   ```bash
   npm run db:studio
   ```
4. **Проверьте логи в NeonDB Dashboard** - там может быть больше информации

