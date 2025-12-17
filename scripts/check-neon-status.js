/**
 * Скрипт для проверки статуса NeonDB проекта
 * Показывает, активен ли проект или был приостановлен
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function checkStatus() {
  console.log('🔍 Проверка статуса NeonDB проекта...\n');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL не установлен');
    return;
  }

  const prisma = new PrismaClient();
  
  try {
    console.log('📡 Отправка запроса к базе данных...');
    const start = Date.now();
    
    // Простой запрос для проверки
    await prisma.$queryRaw`SELECT 1 as test`;
    
    const duration = Date.now() - start;
    
    console.log(`\n⏱️  Время ответа: ${duration}ms\n`);
    
    if (duration > 5000) {
      console.log('⚠️  Проект был приостановлен (Idle) и только что активировался');
      console.log('   Это нормально для бесплатного тарифа NeonDB');
      console.log('   Последующие запросы будут быстрее\n');
    } else if (duration > 2000) {
      console.log('🟡 Проект активируется или есть небольшая задержка');
      console.log('   Это может быть нормально для первого запроса\n');
    } else {
      console.log('✅ Проект активен и готов к работе');
      console.log('   Время ответа в норме\n');
    }
    
    // Дополнительная проверка - список таблиц
    try {
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `;
      
      if (tables.length > 0) {
        console.log('📊 Найдено таблиц:', tables.length);
        console.log('   Таблицы:', tables.map(t => t.table_name).join(', '));
      } else {
        console.log('📊 Таблицы еще не созданы');
        console.log('   Выполните: npm run db:push');
      }
    } catch (error) {
      console.log('📊 Не удалось получить список таблиц (это нормально, если таблиц еще нет)');
    }
    
  } catch (error) {
    console.error('\n❌ Ошибка при проверке статуса:');
    console.error('Код:', error.code);
    console.error('Сообщение:', error.message);
    
    if (error.code === 'P1017') {
      console.error('\n💡 Проект может быть приостановлен');
      console.error('   Попробуйте снова через несколько секунд');
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkStatus().catch(console.error);

