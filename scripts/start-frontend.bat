@echo off
echo ========================================
echo   STARTING FITNEXUS FRONTEND (NEXT.JS)
echo ========================================
echo.

set "PROJECT_ROOT=%~dp0.."
cd /d "%PROJECT_ROOT%\frontend-nextjs"

echo Frontend Directory: %CD%
echo.

if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

echo Starting Next.js development server on port 3000...
echo Make sure the backend server is running on port 8080!
echo.
call npm run dev
pause
