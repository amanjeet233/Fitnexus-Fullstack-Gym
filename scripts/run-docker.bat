@echo off
setlocal enabledelayedexpansion
title FitNexus Fullstack Gym - Docker Runner
color 0B

echo ===============================================================================
echo            FITNEXUS FULLSTACK GYM - DOCKER COMPOSE LAUNCHER
echo ===============================================================================
echo.

:: 1. Check if Docker is installed
where docker >nul 2>&1
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Docker is not installed or not added to your PATH!
    echo Please install Docker Desktop: https://www.docker.com/products/docker-desktop/
    echo.
    pause
    exit /b 1
)

:: 2. Check if Docker daemon is running
echo [1/4] Checking Docker daemon status...
docker info >nul 2>&1
if %ERRORLEVEL% neq 0 (
    color 0E
    echo [WARNING] Docker Desktop is not running!
    echo Attempting to start Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe" >nul 2>&1
    echo Waiting 15 seconds for Docker Desktop to start...
    timeout /t 15 /nobreak >nul
    docker info >nul 2>&1
    if %ERRORLEVEL% neq 0 (
        color 0C
        echo [ERROR] Docker daemon is still not responding.
        echo Please open Docker Desktop manually and wait until it is running, then run this file again.
        echo.
        pause
        exit /b 1
    )
)
echo [OK] Docker daemon is running.
echo.

:: 3. Check for .env file
echo [2/4] Checking environment configuration...
if not exist "%~dp0.env" (
    if exist "%~dp0.env.example" (
        echo [INFO] .env not found. Creating from .env.example...
        copy "%~dp0.env.example" "%~dp0.env" >nul
        echo [OK] Created .env successfully.
    ) else (
        echo [WARNING] .env.example not found. Continuing with Docker Compose defaults.
    )
) else (
    echo [OK] .env file is present.
)
echo.

:: 4. Build and run containers
echo [3/4] Building and launching FitNexus containers...
echo       - fitnexus-mysql    (:3306)
echo       - fitnexus-backend  (:8080)
echo       - fitnexus-frontend (:3000)
echo.

cd /d "%~dp0"
docker compose up --build -d

if %ERRORLEVEL% neq 0 (
    color 0C
    echo.
    echo [ERROR] Failed to launch Docker containers!
    echo Please check the error messages above or run 'docker compose logs' for details.
    echo.
    pause
    exit /b 1
)

echo.
echo [4/4] Checking container status...
docker compose ps

echo.
echo ===============================================================================
echo                FITNEXUS APPLICATION IS NOW RUNNING!
echo ===============================================================================
echo.
echo   * Frontend Web UI   : http://localhost:3000
echo   * Backend REST API  : http://localhost:8080
echo   * Health Check      : http://localhost:8080/api/health
echo   * MySQL Database    : localhost:3306 (Docker internal: mysql:3306)
echo.
echo   * Default Login     : Username: admin  ^|  Password: admin
echo.
echo ===============================================================================
echo.
echo Opening FitNexus in your default browser...
start http://localhost:3000

echo.
echo [INFO] To view live logs: run 'docker compose logs -f'
echo [INFO] To stop the app:   run 'stop-docker.bat' or 'docker compose down'
echo.
pause
