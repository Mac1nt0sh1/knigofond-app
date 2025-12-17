# PowerShell скрипт для исправления db push с использованием DIRECT_URL
# Запуск: .\scripts\fix-db-push.ps1

Write-Host "🔧 Исправление подключения для prisma db push..." -ForegroundColor Cyan
Write-Host ""

# Проверка наличия .env файла
if (-not (Test-Path ".env")) {
    Write-Host "❌ Файл .env не найден!" -ForegroundColor Red
    exit 1
}

# Загрузка переменных окружения
Get-Content .env | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim().Trim('"').Trim("'")
        [Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
}

# Проверка DIRECT_URL
if (-not $env:DIRECT_URL) {
    Write-Host "❌ DIRECT_URL не установлен в .env файле!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Добавьте DIRECT_URL в .env файл:" -ForegroundColor Yellow
    Write-Host 'DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"' -ForegroundColor Gray
    exit 1
}

Write-Host "✅ DIRECT_URL найден" -ForegroundColor Green
Write-Host ""

# Временно устанавливаем DIRECT_URL как DATABASE_URL
$originalDatabaseUrl = $env:DATABASE_URL
$env:DATABASE_URL = $env:DIRECT_URL

Write-Host "🔄 Временно используем DIRECT_URL для миграций..." -ForegroundColor Yellow
Write-Host ""

try {
    # Выполняем db push
    Write-Host "📤 Выполняю prisma db push..." -ForegroundColor Cyan
    npx prisma db push
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Успешно! База данных синхронизирована." -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Ошибка при выполнении db push" -ForegroundColor Red
    }
} finally {
    # Восстанавливаем оригинальный DATABASE_URL
    $env:DATABASE_URL = $originalDatabaseUrl
    Write-Host ""
    Write-Host "🔄 Восстановлен оригинальный DATABASE_URL" -ForegroundColor Yellow
}

