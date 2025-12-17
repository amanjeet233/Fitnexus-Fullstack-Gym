# ⚡ QUICK REFERENCE - Gym Management System

## 🎯 ONE-LINER SUMMARY
**Full-stack gym management system with Next.js frontend, Spring Boot backend, and MySQL database.**

---

## 📋 FRONTEND STACK

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Next.js | 14.0.4 |
| Language | TypeScript | 5.3.3 |
| UI Library | React | 18.2.0 |
| Styling | Tailwind CSS | 3.4.0 |
| Animations | Framer Motion | 10.16.16 |
| Icons | Lucide React | 0.303.0 |
| HTTP Client | Axios | 1.6.2 |
| Date Formatting | date-fns | 2.30.0 |

---

## ⚙️ BACKEND STACK

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Spring Boot | 2.7.14 |
| Language | Java | 8 |
| Build Tool | Maven | - |
| Database | MySQL | 8.0 |
| ORM | JPA/Hibernate | - |
| JDBC Driver | MySQL Connector | 8.0.28 |

---

## 🗂️ PROJECT STRUCTURE

```
Frontend (Next.js):
/app/                    # Pages & Routes
/components/            # Reusable components
/lib/                   # Utilities & API
/public/                # Static assets

Backend (Spring Boot):
/controller/            # REST Controllers (8)
/model/                 # Entity Models (8)
/repository/            # Data Access (8)
/resources/             # Config files
```

---

## 🔌 API ENDPOINTS SUMMARY

| Controller | Base Path | Methods |
|------------|-----------|---------|
| AuthController | `/api/auth` | POST /login |
| MemberController | `/api/members` | GET, POST, PUT, DELETE |
| PaymentController | `/api/payments` | GET, POST, PUT, DELETE |
| TrainerController | `/api/trainers` | GET, POST, PUT, DELETE |
| AttendanceController | `/api/attendance` | GET, POST |
| WorkoutPlanController | `/api/workouts` | GET, POST, PUT, DELETE |
| ProgressEntryController | `/api/progress` | GET, POST, PUT, DELETE |
| FeedbackController | `/api/feedback` | GET, POST, PUT |

**Total Endpoints: 40+**

---

## 🗄️ DATABASE TABLES

1. `user` - User accounts
2. `member` - Member details
3. `trainer` - Trainer details
4. `payment` - Payment records
5. `attendance` - Attendance records
6. `workout_plan` - Workout plans
7. `progress_entry` - Progress tracking
8. `feedback` - Feedback messages

---

## 👥 USER ROLES

1. **Admin** - Full access
2. **Member** - Personal dashboard
3. **Trainer** - Trainer dashboard

---

## 🎨 KEY FEATURES

✅ Member Management (CRUD)  
✅ Payment Management  
✅ Trainer Management  
✅ Attendance Tracking  
✅ Workout Planning  
✅ Progress Tracking  
✅ Feedback System  
✅ Role-Based Access  
✅ Animated UI  
✅ Responsive Design  

---

## 🔑 LOGIN CREDENTIALS

- **Username:** `admin`
- **Password:** `admin`

---

## 🌐 PORTS

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8080
- **Database:** localhost:3306

---

## 📦 KEY DEPENDENCIES

**Frontend:**
- next, react, react-dom
- tailwindcss, framer-motion
- axios, lucide-react
- date-fns, recharts

**Backend:**
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- mysql-connector-java

---

## 🚀 COMMANDS

**Frontend:**
```bash
npm run dev      # Start development
npm run build    # Build for production
npm run start    # Start production
```

**Backend:**
```bash
mvn spring-boot:run    # Start server
mvn clean package      # Build JAR
```

---

## 💡 COMMON VIVA ANSWERS

**Q: Why Next.js?**  
A: SSR, SEO, fast routing, production-ready

**Q: Why Spring Boot?**  
A: Rapid development, auto-config, embedded server

**Q: Why MySQL?**  
A: Relational data, ACID compliance, performance

**Q: Architecture?**  
A: MVC pattern, RESTful API, Client-Server

**Q: Security?**  
A: Role-based access, CORS, input validation

---

**For detailed information, see: `VIVA-PREPARATION-GUIDE.md`**

