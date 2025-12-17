/**
 * Скрипт для выполнения SQL запросов к NeonDB
 * Использование: node scripts/run-sql.js "SELECT * FROM users"
 * Или: npm run db:sql "SELECT * FROM users"
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function runSQL() {
  const query = process.argv[2];
  
  if (!query) {
    console.log('📝 Использование:');
    console.log('  node scripts/run-sql.js "SELECT * FROM users"');
    console.log('  npm run db:sql "SELECT * FROM users"');
    console.log('\nПримеры запросов:');
    console.log('  npm run db:sql "SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'"');
    console.log('  npm run db:sql "SELECT COUNT(*) FROM users"');
    console.log('  npm run db:sql "SELECT version()"');
    return;
  }

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL не установлен');
    return;
  }

  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Выполнение SQL запроса...\n');
    console.log('📝 Запрос:', query);
    console.log('');
    
    const start = Date.now();
    
    // Выполняем SQL запрос
    const result = await prisma.$queryRawUnsafe(query);
    
    const duration = Date.now() - start;
    
    console.log(`⏱️  Время выполнения: ${duration}ms\n`);
    console.log('✅ Результат:');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('\n❌ Ошибка при выполнении запроса:');
    console.error('Код:', error.code);
    console.error('Сообщение:', error.message);
    
    if (error.code === 'P1017') {
      console.error('\n💡 Проект может быть приостановлен');
      console.error('   Попробуйте снова через несколько секунд');
    } else if (error.message.includes('does not exist')) {
      console.error('\n💡 Таблица или объект не существует');
      console.error('   Убедитесь, что таблицы созданы: npm run db:push');
    }
  } finally {
    await prisma.$disconnect();
  }
}

runSQL().catch(console.error);

