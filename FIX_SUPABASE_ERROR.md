# Исправление ошибки подключения к Supabase

Если вы видите ошибку:
```
Can't reach database server at `aws-1-ap-northeast-1.pooler.supabase.com:6543`
```

Это означает, что приложение все еще пытается подключиться к старой базе данных Supabase.

## Решение:

### 1. Проверьте .env файл

Убедитесь, что в `.env` указан SQLite:

```env
DATABASE_URL="file:./dev.db"
```

**Удалите или закомментируйте** все строки с Supabase или NeonDB.

### 2. Очистите кэш Next.js

```powershell
Remove-Item -Path ".next" -Recurse -Force
```

### 3. Перегенерируйте Prisma Client

```powershell
npx prisma generate
```

### 4. Перезапустите dev сервер

```powershell
npm run dev
```

### 5. Если ошибка на Vercel (продакшен)

1. Откройте Vercel Dashboard → Ваш проект → **Settings** → **Environment Variables**
2. Удалите или обновите `DATABASE_URL` на SQLite (но SQLite не работает на Vercel!)
3. Для продакшена нужен PostgreSQL (NeonDB или Supabase)

**Важно:** SQLite работает только локально. Для продакшена на Vercel нужен PostgreSQL.

### 6. Очистите кэш браузера

- Нажмите `Ctrl+Shift+R` (Windows) или `Cmd+Shift+R` (Mac) для жесткой перезагрузки
- Или откройте DevTools → Application → Clear Storage → Clear site data

### 7. Проверьте системные переменные окружения

В PowerShell:

```powershell
Get-ChildItem Env: | Where-Object { $_.Name -like "*DATABASE*" }
```

Если найдены старые переменные, удалите их или обновите.

