@echo off
title FitNexus - Reset Docker Database & Containers
color 0C

echo ===============================================================================
echo            FITNEXUS FULLSTACK GYM - RESET DATABASE AND REBUILD
echo ===============================================================================
echo.
echo [WARNING] This will destroy the database volume (mysql_data) and re-initialize
echo           the database with initial tables and seed data (admin/admin).
echo.
set /p confirm="Are you sure you want to reset everything? (Y/N): "
if /i "%confirm%" neq "Y" (
    echo Operation cancelled by user.
    pause
    exit /b 0
)

echo.
echo [1/2] Stopping containers and removing volume...
cd /d "%~dp0"
docker compose down -v

echo.
echo [2/2] Rebuilding and launching containers with fresh database...
docker compose up --build -d

echo.
echo Container status:
docker compose ps

echo.
echo [OK] FitNexus has been reset and started cleanly!
echo   * Web UI:  http://localhost:3000
echo   * API:     http://localhost:8080
echo   * Login:   admin / admin
echo.
pause
