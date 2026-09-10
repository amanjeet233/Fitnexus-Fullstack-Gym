@echo off
title FitNexus - Stop Docker Containers
color 0E

echo ===============================================================================
echo            FITNEXUS FULLSTACK GYM - STOPPING DOCKER CONTAINERS
echo ===============================================================================
echo.

cd /d "%~dp0"
docker compose down

echo.
echo [OK] All FitNexus containers stopped safely.
echo [NOTE] Database records are safely preserved in the 'mysql_data' volume.
echo.
pause
