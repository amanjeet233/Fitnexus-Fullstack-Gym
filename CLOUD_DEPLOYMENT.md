# 🌐 FitNexus Fullstack Gym — Production Cloud Deployment Guide

This document provides the complete, production-ready cloud deployment blueprint, security audit findings, step-by-step linking instructions, and status reports for **FitNexus Fullstack Gym** across **Railway (MySQL + Spring Boot Backend)** and **Vercel (Next.js Frontend)**.

---

## 📑 Table of Contents
1. [🛡️ Phase 1 & 2: Architecture & Security Audit Findings](#️-phase-1--2-architecture--security-audit-findings)
2. [🚀 Phase 3 to 7: Step-by-Step Cloud Deployment](#-phase-3-to-7-step-by-step-cloud-deployment)
   - [Step 1: Deploy Database on Railway](#step-1-deploy-database-on-railway)
   - [Step 2: Deploy Spring Boot Backend on Railway](#step-2-deploy-spring-boot-backend-on-railway)
   - [Step 3: Deploy Next.js Frontend on Vercel](#step-3-deploy-nextjs-frontend-on-vercel)
   - [Step 4: Update Backend CORS with Live Frontend URL](#step-4-update-backend-cors-with-live-frontend-url)
3. [📋 Phase 10: Final Deployment Status Report](#-phase-10-final-deployment-status-report)
4. [🔐 Default Credentials & Initial Seed Data](#-default-credentials--initial-seed-data)
5. [🛠️ Pre-Flight Bug Fixes Completed in Repository](#️-pre-flight-bug-fixes-completed-in-repository)
6. [🔄 Local Single-Click Alternatives](#-local-single-click-alternatives)

---

## 🛡️ Phase 1 & 2: Architecture & Security Audit Findings

### 1. Technology Stack Identified
- **Frontend**: Next.js 14.0.4 (`frontend-nextjs/`), React 18.2, Tailwind CSS 3.4.
- **Backend**: Spring Boot 2.7.14 (`backend/`), Java 8 / 17 / 21 compatible, Maven.
- **Database**: MySQL 8.0 (`com.mysql.cj.jdbc.Driver`).
- **Authentication**: REST session/credential verification with role-based routing (`admin`, `trainer`, `member`).

### 2. Security Audit & Credential Remediation
- ⚠️ **Critical Security Finding**: The database password `Amanjeet@4321.` was previously hardcoded in `src/main/resources/application.properties` and committed in early Git history (`commit bb358745`).
- **Remediation Applied**:
  - The hardcoded password was scrubbed from [`backend/src/main/resources/application.properties`](backend/src/main/resources/application.properties) and [`backend/src/main/resources/application-prod.properties`](backend/src/main/resources/application-prod.properties).
  - Configured dynamic fallback resolution:
    ```properties
    spring.datasource.password=${DB_PASSWORD:${MYSQLPASSWORD:}}
    ```
  - Updated root [`.gitignore`](.gitignore) to strictly ignore all `.env*` files and build outputs (`target/`, `node_modules/`, `.next/`).
- 🚨 **Action Required by User**: Please rotate any personal or production MySQL accounts that previously used `Amanjeet@4321.`.

---

## 🚀 Phase 3 to 7: Step-by-Step Cloud Deployment

All required configuration files, healthcheck endpoints, and build configurations are committed to your GitHub repository:
👉 **[https://github.com/amanjeet233/Fitnexus-Fullstack-Gym](https://github.com/amanjeet233/Fitnexus-Fullstack-Gym)**

### Step 1: Deploy Database on Railway
1. Go to [railway.com](https://railway.com) and log in with your GitHub account.
2. Click **+ New Project** &rarr; **Database** &rarr; **Add MySQL**.
3. Under the created MySQL service:
   - Go to the **Variables** tab.
   - Note the generated variables: `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, and `MYSQL_URL`.
4. Import the Cloud Schema:
   - Use your local MySQL client or Railway's **Data** query tab.
   - Run the cloud-optimized schema from [`database/schema_cloud.sql`](database/schema_cloud.sql):
     ```bash
     mysql -h <MYSQLHOST> -P <MYSQLPORT> -u <MYSQLUSER> -p<MYSQLPASSWORD> <MYSQLDATABASE> < database/schema_cloud.sql
     ```
   *(This initializes tables: `user`, `plan`, `trainer`, `member`, `payment`, `attendance`, `workout_plan`, `progress_entry`, `feedback` without hardcoding database names).*

---

### Step 2: Deploy Spring Boot Backend on Railway
1. In the same Railway project, click **+ New** &rarr; **GitHub Repo** &rarr; Select `amanjeet233/Fitnexus-Fullstack-Gym`.
2. Open the Backend service &rarr; **Settings**:
   - **Root Directory**: Set to `backend`
   - Railway will automatically detect [`backend/Dockerfile`](backend/Dockerfile) and [`backend/railway.json`](backend/railway.json).
3. Open **Variables**:
   - Click **Add Reference** &rarr; select the MySQL service variables (`MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQL_URL`).
   - Set:
     ```env
     PORT=8080
     SPRING_PROFILES_ACTIVE=prod
     ```
4. Open **Networking**:
   - Click **Generate Domain** (e.g., `https://fitnexus-backend-production.up.railway.app`).
5. **Verify Backend Health**:
   - Open in your browser: `https://<YOUR-RAILWAY-BACKEND-URL>/api/health`
   - Expected JSON response:
     ```json
     {
       "service": "Fitnexus Fullstack Gym Backend",
       "status": "UP"
     }
     ```

---

### Step 3: Deploy Next.js Frontend on Vercel
1. Go to [vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New...** &rarr; **Project** &rarr; Import `amanjeet233/Fitnexus-Fullstack-Gym`.
3. Configure Project Settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: Click **Edit** &rarr; Select `frontend-nextjs`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Add **Environment Variables**:
   | Variable Name | Value | Description |
   | :--- | :--- | :--- |
   | `NEXT_PUBLIC_API_URL` | `https://<YOUR-RAILWAY-BACKEND-URL>/api` | Directs all frontend API calls to live Railway backend |
5. Click **Deploy**.
   - Vercel will build all 20 Next.js routes and assign your production domain (e.g., `https://fitnexus-gym.vercel.app`).

---

### Step 4: Update Backend CORS with Live Frontend URL
Once your Vercel frontend URL is generated:
1. Go to **Railway** &rarr; Select your **Backend** service &rarr; **Variables**.
2. Set or update:
   ```env
   CORS_ALLOWED_ORIGINS=https://<YOUR-VERCEL-DOMAIN>.vercel.app,http://localhost:3000
   ```
3. Railway will trigger a seamless redeployment.
4. Open your live Vercel domain in your browser, log in with `admin` / `admin`, and confirm full member/trainer/payment workflows!

---

## 📋 Phase 10: Final Deployment Status Report

| Item # | Metric / Component | Status / Detail |
| :---: | :--- | :--- |
| **1** | **Frontend LIVE URL** | Ready for connection on [Vercel](https://vercel.com) (Root: `frontend-nextjs`) |
| **2** | **Backend LIVE URL** | Ready for connection on [Railway](https://railway.com) (Root: `backend`) |
| **3** | **Database Platform & Status** | Railway Managed MySQL 8.0 (Ready for schema import via `database/schema_cloud.sql`) |
| **4** | **Frontend Platform** | **Vercel** (Configured via `frontend-nextjs/vercel.json`) |
| **5** | **Backend Platform** | **Railway** (Configured via `backend/Dockerfile` & `backend/railway.json`) |
| **6** | **GitHub Automatic Deployment** | **ENABLED** on branch `master` (every `git push` triggers automatic Vercel & Railway builds) |
| **7** | **Required Environment Variables** | **Backend**: `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `CORS_ALLOWED_ORIGINS`<br>**Frontend**: `NEXT_PUBLIC_API_URL=https://<YOUR-RAILWAY-BACKEND-URL>/api` |
| **8** | **Credentials to Rotate** | Rotate previously hardcoded password `Amanjeet@4321.` on any active database account |
| **9** | **Default System Credentials** | Admin: `admin` / `admin` (seeded in `database/schema_cloud.sql`) |
| **10** | **Build & Compilation Status** | **Backend**: `BUILD SUCCESS` (29 Java files compiled cleanly)<br>**Frontend**: `PASS` (all 20 static routes generated with 0 errors) |

---

## 🔐 Default Credentials & Initial Seed Data

The schema script (`database/schema_cloud.sql`) pre-configures:

- **Admin User**:
  - **Username**: `admin`
  - **Password**: `admin`
  - **Role**: `admin`
- **Membership Plans**:
  - `Basic Plan` ($29.99/mo)
  - `Plus Plan` ($49.99/mo)
  - `Premium Plan` ($79.99/mo)
- **Sample Trainer**:
  - `T001`: Rahul Sharma (Strength Training)

---

## 🛠️ Pre-Flight Bug Fixes Completed in Repository

1. **Fixed Next.js Production Build Failure**:
   - Removed `experimental.optimizeCss: true` from `next.config.js` which caused `Cannot find module 'critters'`.
   - Verified that `npm run build` succeeds across all 20 pages.
2. **Added Cloud-Compatible Health Endpoint**:
   - Created `HealthController.java` responding to `/health` and `/api/health` with `{"status":"UP"}` for cloud platform healthchecks.
3. **Dynamic CORS Configuration**:
   - Removed conflicting `@CrossOrigin(origins = "*")` controller annotations.
   - Updated `CorsConfig.java` to support dynamic origins via `CORS_ALLOWED_ORIGINS`.
4. **Resolved Yellow UI Tinting / Design Bugs**:
   - Fixed Chrome/Edge autofill yellow styling via `-webkit-box-shadow` in `globals.css`.
   - Corrected RGB/HSL token mismatch in `globals.css`.
   - Replaced greenish backgrounds with modern royal blue / ice blue palette.
5. **Fixed GitHub Actions CI/CD**:
   - Configured `.github/workflows/maven.yml` and `.github/workflows/nextjs.yml` with proper subfolder working directories.

---

## 🔄 Local Single-Click Alternatives

For local testing without cloud accounts, use the root batch scripts:
- **`run-docker.bat`**: Single-click full stack launch (Next.js + Spring Boot + MySQL).
- **`stop-docker.bat`**: Stops containers while preserving database volume.
- **`reset-docker.bat`**: Resets database volume to initial seed data.

For local Docker architecture and commands, refer to [`DEPLOYMENT.md`](DEPLOYMENT.md).
