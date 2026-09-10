# ☕ FitNexus Backend (Spring Boot)

Spring Boot REST API backend service for the FitNexus Gym Management System.

## 🛠️ Tech Details

- **Framework**: Spring Boot 2.7.14
- **Language**: Java 8+ (Compatible with JDK 11, 17, 21)
- **Database**: MySQL 8.0 (JPA / Hibernate 5.6)
- **Default Port**: `8080` (Configurable via `PORT` environment variable)

## 📁 Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/mycompany/gymmanagementsystem/
│   │   │   ├── config/        # Security, CORS & Web Configuration
│   │   │   ├── controller/    # REST API Controllers
│   │   │   ├── model/         # JPA Entity Classes
│   │   │   └── repository/    # Spring Data JPA Repositories
│   │   └── resources/
│   │       └── application.properties # Database & application configuration
│   └── test/                  # Unit & integration tests
└── pom.xml                    # Maven dependencies & build setup
```

## 🚀 Running the Backend

From the project root:
```bash
# Using batch script
.\start-backend.bat
```

Or directly inside this `backend/` directory:
```bash
mvn spring-boot:run
```

## 📦 Packaging

```bash
mvn clean package -DskipTests
java -jar target/GymManagementSystem-1.0-SNAPSHOT.jar
```
