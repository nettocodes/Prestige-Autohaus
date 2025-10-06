@echo off
echo ================================================
echo        PRESTIGE AUTOHAUS - SISTEMA COMPLETO
echo ================================================
echo.
echo Iniciando o sistema...
echo.

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js não está instalado!
    echo Por favor, instale Node.js e tente novamente.
    pause
    exit /b 1
)

echo ✅ Node.js detectado
echo.

REM Verificar se as dependências estão instaladas
echo Verificando dependências...
if not exist "backend\node_modules" (
    echo Instalando dependências do backend...
    cd backend
    call npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo Instalando dependências do frontend...
    cd frontend
    call npm install
    cd ..
)

echo ✅ Dependências verificadas
echo.

echo ================================================
echo INSTRUÇÕES PARA USAR O SISTEMA:
echo ================================================
echo.
echo 1. Este script abrirá duas janelas do terminal
echo 2. Backend rodará na porta 3000
echo 3. Frontend rodará na porta 8080
echo 4. Acesse: http://localhost:8080
echo.
echo CREDENCIAIS DE ADMIN:
echo Email: admin@prestigeautohaus.com
echo Senha: admin123
echo.
echo ================================================
echo.
pause

echo Iniciando Backend...
start "Prestige Autohaus - Backend" cmd /k "cd backend && npm start"

timeout /t 3

echo Iniciando Frontend...
start "Prestige Autohaus - Frontend" cmd /k "cd frontend && npm run serve"

echo.
echo ✅ Sistema iniciado com sucesso!
echo.
echo 🌐 Frontend: http://localhost:8080
echo 📡 Backend API: http://localhost:3000
echo.
echo Pressione qualquer tecla para sair...
pause >nul