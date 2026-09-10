# 🔍 FitNexus - Ports & Configuration Summary

## 📊 Current Port Status

| Service | Port | Status | Process ID |
|---------|------|--------|------------|
| **Frontend (Next.js)** | 3000 | ✅ **RUNNING** | 6248 |
| **Backend (Spring Boot)** | 8080 | ❌ **NOT RUNNING** | - |
| **MySQL Database** | 3306 | ✅ **RUNNING** | 6780 |
| **MySQL X Protocol** | 33060 | ✅ **RUNNING** | 6780 |

---

## ⚙️ Configuration Files

### Backend Configuration

#### `src/main/resources/application.properties`
```properties
spring.application.name=Fitnexus
server.port=${PORT:8080}

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/gms
spring.datasource.username=root
spring.datasource.password=Amanjeet@4321.
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true
```

**Database:** `gms`  
**Port:** `8080` (default, can be overridden by `PORT` environment variable)

#### `src/main/java/.../config/CorsConfig.java`
```java
allowedOrigins(
    "http://localhost:3000",      // ✅ Added for local development
    "http://localhost:3001",      // ✅ Added for alternative port
    "https://fitnexuss.netlify.app" // Production
)
```

### Frontend Configuration

#### `frontend-nextjs/lib/api.ts`
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
```

**Default API URL:** `http://localhost:8080/api`

#### `frontend-nextjs/next.config.js`
- **Port:** 3000 (default Next.js port)
- **API Rewrite:** `/api/*` → `http://localhost:8080/api/*`

#### `frontend-nextjs/package.json`
```json
{
  "scripts": {
    "dev": "next dev",      // Runs on port 3000
    "build": "next build",
    "start": "next start"
  }
}
```

---

## 🚨 Current Issues

### ❌ Backend Not Running
- **Problem:** Backend server is not listening on port 8080
- **Java Processes:** 3 Java processes running but not on port 8080
- **Solution:** Restart backend server using `start-backend.bat` or `mvn spring-boot:run`

### ✅ CORS Fixed
- **Issue:** CORS was only allowing Netlify domain
- **Fixed:** Added `http://localhost:3000` to allowed origins
- **Status:** ✅ Configuration updated, needs backend restart

---

## 🚀 How to Start Servers

### Option 1: Start Both Servers (Recommended)
```bash
restart-all-servers.bat
```

### Option 2: Start Individually

**Backend:**
```bash
start-backend.bat
# OR
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend-nextjs
npm run dev
# OR
start-nextjs.bat
```

---

## 📋 Port Summary

| Component | Port | Configuration File | Environment Variable |
|-----------|------|-------------------|---------------------|
| Frontend | 3000 | `package.json` | Next.js default |
| Backend | 8080 | `application.properties` | `PORT` (optional) |
| MySQL | 3306 | `application.properties` | - |
| MySQL X | 33060 | MySQL default | - |

---

## 🔧 Environment Variables

### Backend
- `PORT` - Override backend port (default: 8080)

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: `http://localhost:8080/api`)

---

## ✅ Verification Checklist

- [x] Frontend running on port 3000
- [x] MySQL running on port 3306
- [ ] Backend running on port 8080 ⚠️ **NEEDS RESTART**
- [x] CORS configured for localhost:3000
- [x] Database connection configured
- [x] API endpoint configured correctly

---

## 🐛 Troubleshooting

### Backend Not Starting
1. Check if port 8080 is already in use:
   ```bash
   netstat -ano | findstr ":8080"
   ```
2. Check Java installation:
   ```bash
   java -version
   ```
3. Check Maven:
   ```bash
   mvn -version
   ```
4. Check database connection:
   - Verify MySQL is running
   - Check credentials in `application.properties`
   - Test connection: `mysql -u root -p`

### Frontend Can't Connect to Backend
1. Verify backend is running on port 8080
2. Check CORS configuration (should include `http://localhost:3000`)
3. Check browser console for errors
4. Verify API URL in `frontend-nextjs/lib/api.ts`

### Database Connection Issues
1. Verify MySQL is running:
   ```bash
   netstat -ano | findstr ":3306"
   ```
2. Check database exists:
   ```sql
   SHOW DATABASES;
   USE gms;
   SHOW TABLES;
   ```
3. Verify credentials in `application.properties`

---

## 📝 Next Steps

1. **Restart Backend Server:**
   ```bash
   start-backend.bat
   ```

2. **Wait 20-30 seconds** for backend to fully start

3. **Verify Backend is Running:**
   ```bash
   netstat -ano | findstr ":8080" | findstr "LISTENING"
   ```

4. **Test API Endpoint:**
   - Open browser: `http://localhost:8080/api/members`
   - Should return JSON (empty array if no members)

5. **Test Frontend Login:**
   - Open: `http://localhost:3000/login`
   - Try logging in with: `admin` / `admin`

---

**Last Updated:** $(date)  
**Status:** Frontend ✅ | Backend ❌ | Database ✅

