/**
 * Скрипт для проверки подключения к базе данных
 * Запуск: node scripts/check-db-connection.js
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function checkConnection() {
  console.log('🔍 Проверка подключения к базе данных...\n');
  
  // Проверка переменных окружения
  console.log('📋 Переменные окружения:');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Установлен' : '❌ Не установлен');
  
  if (!process.env.DATABASE_URL) {
    console.error('\n❌ DATABASE_URL не установлен в .env файле');
    return;
  }
  
  const dbUrl = process.env.DATABASE_URL;
  
  // Проверка типа базы данных
  console.log('\n📝 Тип базы данных:');
  if (dbUrl.startsWith('file:')) {
    console.log('✅ SQLite');
    const dbPath = dbUrl.replace('file:', '').replace('./', '');
    const fullPath = path.join(process.cwd(), dbPath);
    
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      console.log(`✅ Файл базы данных существует: ${dbPath}`);
      console.log(`   Размер: ${(stats.size / 1024).toFixed(2)} KB`);
    } else {
      console.log(`ℹ️  Файл базы данных еще не создан: ${dbPath}`);
      console.log('   Будет создан при первом запуске');
    }
  } else if (dbUrl.includes('postgresql://')) {
    console.log('✅ PostgreSQL (NeonDB/Supabase)');
    console.log('⚠️  Для SQLite используйте: DATABASE_URL="file:./dev.db"');
  } else {
    console.log('⚠️  Неизвестный формат');
  }
  
  // Попытка подключения
  console.log('\n🔌 Попытка подключения...');
  try {
    const prisma = new PrismaClient();
    
    // Простой запрос для проверки
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Подключение успешно!');
    console.log('✅ Запрос выполнен успешно:', result);
    
    // Проверка таблиц
    try {
      const tables = await prisma.$queryRaw`
        SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'
      `;
      
      if (tables.length > 0) {
        console.log(`\n📊 Найдено таблиц: ${tables.length}`);
        console.log('   Таблицы:', tables.map(t => t.name).join(', '));
      } else {
        console.log('\n📊 Таблицы еще не созданы');
        console.log('   Выполните: npm run db:push');
      }
    } catch (error) {
      // Для PostgreSQL используем другой запрос
      if (dbUrl.includes('postgresql://')) {
        const tables = await prisma.$queryRaw`
          SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
        `;
        if (tables.length > 0) {
          console.log(`\n📊 Найдено таблиц: ${tables.length}`);
        }
      }
    }
    
    await prisma.$disconnect();
    console.log('\n✅ Все проверки пройдены! База данных доступна.');
  } catch (error) {
    console.error('\n❌ Ошибка подключения:');
    console.error('Код ошибки:', error.code);
    console.error('Сообщение:', error.message);
    
    if (error.code === 'P1001') {
      console.error('\n💡 База данных недоступна');
      console.error('   Для SQLite: проверьте путь к файлу');
      console.error('   Для PostgreSQL: проект может быть приостановлен');
    } else if (error.message.includes('no such table')) {
      console.error('\n💡 Таблицы еще не созданы');
      console.error('   Выполните: npm run db:push');
    }
  }
}

checkConnection().catch(console.error);

