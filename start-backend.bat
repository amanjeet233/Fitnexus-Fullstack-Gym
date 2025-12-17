@echo off
echo ========================================
echo   STARTING BACKEND SERVER
echo ========================================
echo.

REM Set JAVA_HOME
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-25.0.1.8-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"

REM Change to project directory
cd /d "%~dp0"

echo Current directory: %CD%
echo.

echo [1] Stopping existing Java processes...
taskkill /F /IM java.exe /T >nul 2>&1
timeout /t 2 /nobreak >nul
echo   Done.
echo.

echo [2] Checking Java installation...
java -version
if %errorlevel% neq 0 (
    echo ERROR: Java not found!
    pause
    exit /b 1
)
echo.

echo [3] Starting Spring Boot Backend...
echo     Server will start on http://localhost:8080
echo     Check the new window for startup logs
echo     Look for "Started GymManagementApplication" message
echo.

start "Backend Server - Port 8080" cmd /k "set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-25.0.1.8-hotspot && set PATH=%JAVA_HOME%\bin;%PATH% && cd /d %~dp0 && echo Starting Backend Server... && echo. && mvn spring-boot:run"

timeout /t 3 /nobreak >nul

echo ========================================
echo   BACKEND STARTING
echo ========================================
echo.
echo Backend URL: http://localhost:8080
echo.
echo Please wait 20-30 seconds for server to fully start.
echo Check the "Backend Server" window for startup progress.
echo.
echo Press any key to check server status...
pause >nul

echo.
echo Checking server status...
timeout /t 10 /nobreak >nul
netstat -ano | findstr ":8080" | findstr "LISTENING"
if %errorlevel% equ 0 (
    echo.
    echo SUCCESS: Backend is running on port 8080!
) else (
    echo.
    echo Backend may still be starting. Check the Backend Server window.
)
echo.
pause

