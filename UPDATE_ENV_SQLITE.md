# Обновление .env для SQLite

## Откройте файл .env и измените:

### Было (NeonDB):
```env
DATABASE_URL="postgresql://neondb_owner:npg_WB4CyvnuHlS6@ep-solitary-water-a18myb5m-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
DIRECT_URL="postgresql://neondb_owner:npg_WB4CyvnuHlS6@ep-solitary-water-a18myb5m.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### Стало (SQLite):
```env
DATABASE_URL="file:./dev.db"
```

**Удалите или закомментируйте строку DIRECT_URL** - она не нужна для SQLite.

## После обновления:

1. Перегенерируйте Prisma Client:
   ```bash
   npx prisma generate
   ```

2. Проверьте подключение:
   ```bash
   npm run db:check
   ```

3. База данных уже создана! Файл находится в `prisma/dev.db`

