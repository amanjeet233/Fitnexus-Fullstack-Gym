# 🚀 FitNexus Fullstack Gym — Complete Deployment Guide

This document contains everything you need to run, deploy, and manage the **FitNexus Fullstack Gym Management System** both locally using Docker and in production environments.

---

## 📑 Table of Contents
1. [⚡ Quick Start for Windows (Single-Click)](#-quick-start-for-windows-single-click)
2. [🏗️ System Architecture](#️-system-architecture)
3. [🐳 Local Docker Deployment (Single-Command CLI)](#-local-docker-deployment-single-command-cli)
4. [⚙️ Environment Variables Reference](#️-environment-variables-reference)
5. [💾 Database & Data Persistence](#-database--data-persistence)
6. [☁️ Cloud & Production Deployment](#️-cloud--production-deployment)
7. [🛠️ Useful Maintenance & Debugging Commands](#️-useful-maintenance--debugging-commands)
8. [🔍 Troubleshooting Common Issues](#-troubleshooting-common-issues)

---

## ⚡ Quick Start for Windows (Single-Click)

The repository provides automated batch scripts in the root directory:

| Action | Script to Run | What it Does |
| :--- | :--- | :--- |
| **Start Application** | **`run-docker.bat`** | Verifies Docker, generates `.env`, builds & starts all 3 containers, opens `http://localhost:3000` |
| **Stop Application** | **`stop-docker.bat`** | Gracefully stops containers while **preserving** all database records |
| **Reset Database** | **`reset-docker.bat`** | Wipes volume and starts fresh with original seed data (`admin`/`admin`) |

> **Host Requirements:** You only need **Docker Desktop** installed and running.  
> You do **NOT** need Java, Maven, Node.js, npm, or MySQL installed on your host machine.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   User Web Browser                     │
└───────────┬────────────────────────────────┬───────────┘
            │ http://localhost:3000          │ http://localhost:8080/api
            ▼                                ▼
┌────────────────────────┐      ┌────────────────────────┐
│   fitnexus-frontend    │      │    fitnexus-backend    │
│  (Next.js 14 / Node20) │      │  (Spring Boot / JRE17) │
│       Port 3000        │      │       Port 8080        │
└────────────────────────┘      └───────────┬────────────┘
                                            │ mysql:3306 (Docker internal network)
                                            ▼
                                ┌────────────────────────┐
                                │     fitnexus-mysql     │
                                │      (MySQL 8.0)       │
                                │  Port 3306 (Internal)  │
                                └────────────────────────┘
```

### Verified Endpoints & Credentials
- **Frontend URL**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8080](http://localhost:8080)
- **Backend Health Check**: [http://localhost:8080/api/health](http://localhost:8080/api/health)
- **Default Admin Login**:
  - **Username**: `admin`
  - **Password**: `admin`
  - **Role**: `admin`

---

## 🐳 Local Docker Deployment (Single-Command CLI)

### 1. Clone the Repository
```bash
git clone https://github.com/amanjeet233/Fitnexus-Fullstack-Gym.git
cd Fitnexus-Fullstack-Gym
```

### 2. Configure Environment
```bash
# Linux / macOS
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

### 3. Build and Run All Services
```bash
docker compose up --build -d
```

### 4. Check Status
```bash
docker compose ps
```
All three services should show `Up (healthy)`.

---

## ⚙️ Environment Variables Reference

Configure these in your local `.env` file (copied from [`.env.example`](file:///d:/CU/SEM%205/PROJECT/Gym-Management-System-master/.env.example)):

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `MYSQL_ROOT_PASSWORD` | `gmsrootpassword` | MySQL root administrative password |
| `MYSQL_DATABASE` | `gms` | Database name initialized on startup |
| `MYSQL_USER` | `gmsuser` | Application database username |
| `MYSQL_PASSWORD` | `gmspassword` | Application database password |
| `DB_HOST` | `mysql` | Internal Docker hostname for MySQL service |
| `DB_PORT` | `3306` | MySQL port inside Docker network |
| `DB_NAME` | `gms` | Target database for Spring Boot backend |
| `DB_USERNAME` | `gmsuser` | Backend database connection username |
| `DB_PASSWORD` | `gmspassword` | Backend database connection password |
| `SERVER_PORT` | `8080` | Port exposed by Spring Boot container |
| `CORS_ALLOWED_ORIGINS`| `http://localhost:3000` | Allowed browser origins (comma-separated) |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080/api` | API URL accessed by the user's browser |
| `FRONTEND_PORT` | `3000` | Port exposed by Next.js frontend container |

> ⚠️ **Important Networking Distinction:**
> - The **Browser** reaches the backend via **`http://localhost:8080`** (host port).
> - The **Backend container** reaches MySQL via **`mysql:3306`** (Docker internal DNS).
> - **Never** set `NEXT_PUBLIC_API_URL` to `http://backend:8080`, because `backend` cannot be resolved by an external client browser!

---

## 💾 Database & Data Persistence

### Automatic Initialization
When launched for the first time, Docker mounts [`database/database_setup_v2.sql`](file:///d:/CU/SEM%205/PROJECT/Gym-Management-System-master/database/database_setup_v2.sql) into `/docker-entrypoint-initdb.d/01-init.sql:ro`.  
This automatically creates the following tables and seed data:
- `user` (Default admin: `admin` / `admin`)
- `plan` (Basic Plan, Plus Plan, Premium Plan)
- `trainer` (Sample trainer `T001` - Rahul Sharma)
- `member`, `payment`, `attendance`, `workout_plan`, `progress_entry`, `feedback`

### Persistent Volume
All data is stored in the Docker named volume:
```yaml
volumes:
  mysql_data:
```
- Running `docker compose down` stops the containers **without** losing data.
- Creating members, payments, or attendance records will persist across machine reboots.

### How to Completely Reset the Database
If you wish to wipe test data and return to the initial state:
```bash
# 1. Stop containers and destroy the volume
docker compose down -v

# 2. Rebuild and start fresh
docker compose up --build -d
```
*(Or double-click **`reset-docker.bat`** on Windows).*

---

## ☁️ Cloud & Production Deployment

### Option A: Cloud VM / VPS with Docker Compose (Recommended)
Supported on: **AWS EC2, DigitalOcean Droplet, Linode, Hetzner, Google Compute Engine, Azure VM**

1. Provision an **Ubuntu 22.04 LTS** server (Minimum: 2 vCPU, 4GB RAM).
2. Install Docker & Docker Compose:
   ```bash
   sudo apt-get update
   sudo apt-get install -y docker.io docker-compose-v2 git
   sudo systemctl enable --now docker
   ```
3. Clone repo and enter directory:
   ```bash
   git clone https://github.com/amanjeet233/Fitnexus-Fullstack-Gym.git
   cd Fitnexus-Fullstack-Gym
   cp .env.example .env
   ```
4. Edit `.env` with production settings:
   - Change `MYSQL_ROOT_PASSWORD` and `MYSQL_PASSWORD` to strong unique passwords.
   - Set `CORS_ALLOWED_ORIGINS=https://yourdomain.com`
   - Set `NEXT_PUBLIC_API_URL=https://yourdomain.com/api` (or `https://api.yourdomain.com/api`)
5. Launch services:
   ```bash
   docker compose up --build -d
   ```
6. Setup Nginx Reverse Proxy & SSL (Certbot):
   ```nginx
   # Nginx proxy example
   server {
       server_name yourdomain.com;

       location /api/ {
           proxy_pass http://127.0.0.1:8080/api/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

---

### Option B: Cloud PaaS (Railway + Vercel)
For the complete step-by-step production cloud deployment guide with MySQL on Railway, Spring Boot backend on Railway, and Next.js frontend on Vercel, refer to:
👉 **[`CLOUD_DEPLOYMENT.md`](CLOUD_DEPLOYMENT.md)**

Quick Reference:
- **MySQL Database**: Deploy managed MySQL on Railway; import [`database/schema_cloud.sql`](database/schema_cloud.sql).
- **Backend Service (Railway)**:
  - Root directory: `backend`
  - Uses `backend/Dockerfile` & `backend/railway.json`
  - Add MySQL reference variables (`MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQL_URL`)
  - Set `CORS_ALLOWED_ORIGINS=https://<YOUR-VERCEL-DOMAIN>.vercel.app`
- **Frontend Service (Vercel)**:
  - Root directory: `frontend-nextjs`
  - Framework: Next.js
  - Build command: `npm run build`
  - Environment variable: `NEXT_PUBLIC_API_URL=https://<YOUR-RAILWAY-BACKEND-URL>/api`

---

## 🛠️ Useful Maintenance & Debugging Commands

```bash
# View live logs for all services
docker compose logs -f

# View live logs for backend only
docker compose logs -f backend

# View live logs for frontend only
docker compose logs -f frontend

# View live logs for mysql only
docker compose logs -f mysql

# Check resource usage of running containers
docker stats

# Connect to the MySQL shell inside the container
docker exec -it fitnexus-mysql mysql -u gmsuser -pgmspassword gms

# Connect to backend container shell
docker exec -it fitnexus-backend sh

# Inspect container healthcheck status
docker inspect --format='{{json .State.Health}}' fitnexus-backend
docker inspect --format='{{json .State.Health}}' fitnexus-frontend
docker inspect --format='{{json .State.Health}}' fitnexus-mysql
```

---

## 🔍 Troubleshooting Common Issues

### 1. "Docker daemon is not running"
- **Cause**: Docker Desktop is not started.
- **Solution**: Open Docker Desktop from your Start menu and wait until the status icon turns green ("Engine running"), then re-run `run-docker.bat`.

### 2. Port Conflict: "Bind for 0.0.0.0:8080 failed: port is already allocated"
- **Cause**: Another local service (e.g. Apache, Tomcat, or another Docker container) is using port 8080, 3000, or 3306.
- **Solution**:
  - Find what is holding port 8080 on Windows:
    ```powershell
    netstat -ano | findstr :8080
    ```
  - Stop the conflicting container or process:
    ```powershell
    # If Docker container:
    docker stop <container_id>
    # If Windows process:
    taskkill /PID <PID> /F
    ```

### 3. "Cannot connect to server / Network Error" on Login
- **Cause**: Backend container is starting up or `NEXT_PUBLIC_API_URL` is misconfigured.
- **Solution**:
  - Check health endpoint in your browser: [http://localhost:8080/api/health](http://localhost:8080/api/health).
  - Verify backend logs: `docker compose logs backend --tail 50`.
  - Ensure `.env` has `NEXT_PUBLIC_API_URL=http://localhost:8080/api`.

### 4. Database Seed Data Missing
- **Cause**: Existing volume was created before the initialization script.
- **Solution**: Run a clean reset:
  ```bash
  docker compose down -v
  docker compose up --build -d
  ```
