@echo off
echo Starting Next.js Frontend...
echo.
cd /d "%~dp0"
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
echo.
echo Starting Next.js development server...
echo Make sure the Spring Boot backend is running on port 8080
echo.
call npm run dev
pause

