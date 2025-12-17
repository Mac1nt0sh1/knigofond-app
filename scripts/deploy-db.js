/**
 * Скрипт для деплоя базы данных с индикатором прогресса
 */

require('dotenv').config();
const { execSync } = require('child_process');

console.log('🚀 Начинаю деплой базы данных...\n');
console.log('⏳ Это может занять 30-60 секунд, если проект был приостановлен\n');
console.log('📡 Отправка запроса к NeonDB...\n');

try {
  // Выполняем prisma db push
  execSync('npx prisma db push', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n✅ База данных успешно развернута!');
  console.log('\n📝 Следующие шаги:');
  console.log('   1. npm run db:generate - сгенерировать Prisma Client');
  console.log('   2. npm run db:status - проверить статус');
  console.log('   3. npm run db:studio - открыть Prisma Studio');
  
} catch (error) {
  console.error('\n❌ Ошибка при деплое:');
  if (error.status === null) {
    console.error('   Команда была прервана');
    console.error('   Попробуйте снова - проект может "просыпаться"');
  } else {
    console.error('   Код ошибки:', error.status);
  }
  process.exit(1);
}

