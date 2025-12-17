# Быстрое исправление ошибки подключения

## Для NeonDB

NeonDB использует одну строку подключения. Убедитесь, что:
1. Строка подключения скопирована полностью из NeonDB Dashboard
2. В строке есть `?sslmode=require`
3. Проект в NeonDB активен (не приостановлен)

## Проблема: P1000 Authentication failed

## Решение 1: Использовать скрипт (рекомендуется)

### В PowerShell:

```powershell
.\scripts\fix-db-push.ps1
```

Этот скрипт автоматически:
- Загрузит переменные из .env
- Временно установит DIRECT_URL как DATABASE_URL
- Выполнит `prisma db push`
- Восстановит оригинальный DATABASE_URL

## Решение 2: Вручную в PowerShell

```powershell
# 1. Загрузите переменные из .env (если еще не загружены)
Get-Content .env | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim().Trim('"').Trim("'")
        [Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
}

# 2. Временно используйте DIRECT_URL
$env:DATABASE_URL = $env:DIRECT_URL

# 3. Выполните миграцию
npx prisma migrate dev --name init

# Или db push
npx prisma db push
```

## Решение 3: Проверьте .env файл

Убедитесь, что в `.env` файле есть ОБЕ переменные:

```env
# Pooler (для приложения) - порт 6543
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct (для миграций) - порт 5432
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
```

**Важно:**
- DIRECT_URL должен быть на порту **5432**
- DIRECT_URL НЕ должен содержать `?pgbouncer=true`
- Если пароль содержит спецсимволы, закодируйте их (см. FIX_DB_CONNECTION.md)

## Решение 4: Используйте migrate вместо push

`prisma migrate dev` автоматически использует DIRECT_URL из схемы:

```powershell
npx prisma migrate dev --name init
```

## Решение 5: Проверьте подключение

```powershell
npm run db:check
```

Этот скрипт проверит:
- Наличие переменных окружения
- Формат строк подключения
- Подключение к базе данных

## Если ничего не помогает:

1. **Сбросьте пароль в Supabase:**
   - Supabase Dashboard → Settings → Database
   - Нажмите "Reset database password"
   - Скопируйте новый пароль
   - Обновите DIRECT_URL в .env

2. **Проверьте IP адрес:**
   - Supabase Dashboard → Settings → Database → Connection pooling
   - Убедитесь, что ваш IP не заблокирован
   - Включите "Allow all IPs" для разработки

3. **Используйте строку подключения напрямую:**
   - В Supabase Dashboard скопируйте Connection string (URI)
   - Убедитесь, что используете правильный формат

