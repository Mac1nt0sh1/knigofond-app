# Исправление ошибки подключения к Supabase

## Ошибка: P1000 Authentication failed

Эта ошибка означает, что учетные данные базы данных неверны. Вот как исправить:

## Шаг 1: Получение правильных строк подключения

### В Supabase Dashboard:

1. Откройте [Supabase Dashboard](https://app.supabase.com/)
2. Выберите ваш проект
3. Перейдите в **Settings** → **Database**
4. Найдите раздел **Connection string**

### Для DATABASE_URL (Pooler - для приложения):
- Выберите **Connection pooling** → **Session mode**
- Скопируйте строку подключения
- Должна быть на порту **6543** с `?pgbouncer=true`

### Для DIRECT_URL (Direct - для миграций):
- Выберите **Connection string** → **URI**
- Скопируйте строку подключения
- Должна быть на порту **5432** БЕЗ `pgbouncer`

## Шаг 2: Проверка пароля

### Если пароль содержит специальные символы:

Специальные символы в пароле нужно закодировать в URL-формат:

| Символ | Кодировка |
|--------|-----------|
| `@` | `%40` |
| `#` | `%23` |
| `$` | `%24` |
| `%` | `%25` |
| `&` | `%26` |
| `+` | `%2B` |
| `=` | `%3D` |
| `?` | `%3F` |
| `/` | `%2F` |
| `:` | `%3A` |
| `;` | `%3B` |
| ` ` (пробел) | `%20` |

### Пример:

Если ваш пароль: `MyP@ss#123`

То в строке подключения должно быть: `MyP%40ss%23123`

### Автоматическое кодирование в PowerShell:

```powershell
# Закодировать пароль
$password = "YourPassword@123"
$encoded = [System.Web.HttpUtility]::UrlEncode($password)
Write-Host $encoded
```

Или используйте онлайн-кодировщик: https://www.urlencoder.org/

## Шаг 3: Правильный формат строк подключения

### DATABASE_URL (Pooler):
```
postgresql://postgres.[PROJECT_REF]:[ENCODED_PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

### DIRECT_URL (Direct):
```
postgresql://postgres.[PROJECT_REF]:[ENCODED_PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

**Важно:** 
- Для DIRECT_URL НЕ должно быть `?pgbouncer=true`
- Порт должен быть **5432** (не 6543)
- Пароль должен быть URL-закодирован, если содержит специальные символы

## Шаг 4: Обновление .env файла

Откройте файл `.env` и обновите строки:

```env
# Pooler connection (для приложения)
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[ENCODED_PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection (для миграций и db push)
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[ENCODED_PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

## Шаг 5: Проверка подключения

### Вариант 1: Использовать DIRECT_URL для db push

Временно установите DIRECT_URL как DATABASE_URL для миграций:

```powershell
# В PowerShell
$env:DATABASE_URL = $env:DIRECT_URL
npx prisma db push
```

### Вариант 2: Использовать migrate вместо push

```powershell
npx prisma migrate dev --name init
```

Это автоматически использует DIRECT_URL из схемы.

## Шаг 6: Проверка IP адреса в Supabase

1. Откройте Supabase Dashboard
2. Перейдите в **Settings** → **Database** → **Connection pooling**
3. Проверьте раздел **Allowed IP addresses**
4. Убедитесь, что ваш IP не заблокирован
5. Если нужно, добавьте ваш IP или используйте "Allow all IPs" для разработки

## Шаг 7: Тестирование подключения

После исправления попробуйте снова:

```powershell
npx prisma db push
```

Или:

```powershell
npx prisma migrate dev --name init
```

## Альтернативный способ: Получить новый пароль

Если ничего не помогает:

1. В Supabase Dashboard → **Settings** → **Database**
2. Найдите раздел **Database password**
3. Нажмите **Reset database password**
4. Скопируйте новый пароль
5. Обновите строки подключения в `.env`

## Быстрая проверка формата

Убедитесь, что ваши строки подключения:
- ✅ Начинаются с `postgresql://`
- ✅ Содержат правильный project-ref
- ✅ Пароль закодирован (если содержит спецсимволы)
- ✅ DATABASE_URL использует порт 6543 с `?pgbouncer=true`
- ✅ DIRECT_URL использует порт 5432 БЕЗ `?pgbouncer=true`
- ✅ Обе строки заканчиваются на `/postgres`

