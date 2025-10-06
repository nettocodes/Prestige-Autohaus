@echo off
echo ================================================
echo    PARANDO PRESTIGE AUTOHAUS
echo ================================================
echo.

echo Finalizando processos Node.js...
taskkill /F /IM node.exe >nul 2>&1

if errorlevel 1 (
    echo ℹ️  Nenhum processo Node.js encontrado
) else (
    echo ✅ Processos Node.js finalizados
)

echo.
echo ✅ Sistema parado com sucesso!
echo.
pause