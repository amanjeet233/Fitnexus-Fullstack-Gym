@echo off
echo ========================================
echo   RESTARTING ALL SERVERS
echo ========================================
echo.

echo [1/3] Stopping all existing servers...
taskkill /F /IM java.exe /T >nul 2>&1
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 3 /nobreak >nul
echo   All processes stopped.
echo.

echo [2/3] Starting Backend (Spring Boot on port 8080)...
start "Backend Server" cmd /k "cd /d %~dp0 && echo Starting Backend Server... && mvn spring-boot:run"
timeout /t 10 /nobreak >nul
echo   Backend starting...
echo.

echo [3/3] Starting Frontend (Next.js on port 3000)...
start "Frontend Server" cmd /k "cd /d %~dp0\frontend-nextjs && echo Starting Frontend Server... && npm run dev"
timeout /t 5 /nobreak >nul
echo   Frontend starting...
echo.

echo ========================================
echo   SERVERS STARTING
echo ========================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Please wait 20-30 seconds for servers to fully start.
echo Check the opened terminal windows for startup logs.
echo.
echo Press any key to check server status...
pause >nul

echo.
echo Checking server status...
timeout /t 5 /nobreak >nul
netstat -ano | findstr ":8080 :3000" | findstr "LISTENING"
echo.
echo If you see LISTENING on both ports, servers are ready!
echo.
pause

