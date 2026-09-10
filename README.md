# 💪 FitNexus - Full Stack Gym Management System

A modern, comprehensive gym management system built with **Spring Boot** (Backend) and **Next.js** (Frontend). FitNexus provides a complete solution for managing gym members, trainers, payments, attendance, progress tracking, and feedback.

![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7.14-brightgreen.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)

## 🎯 Features

### Admin Features
- 📊 **Dashboard** - Real-time statistics and analytics
- 👥 **Member Management** - Add, edit, view, and manage gym members
- 💳 **Payment Management** - Track payments, dues, and revenue
- 👨‍🏫 **Trainer Management** - Manage trainer profiles and assignments
- 📝 **Feedback System** - Send and manage feedback to members and trainers
- 📈 **Reports & Analytics** - View comprehensive reports

### Member Features
- 🏠 **Member Dashboard** - Personalized dashboard with stats
- 📅 **Attendance Tracking** - View attendance history
- 📋 **Workout Plans** - Access assigned workout plans
- 📊 **Progress Tracking** - Track fitness progress over time
- 💬 **Feedback** - Receive and view feedback from trainers
- 👤 **Profile Management** - Update personal information

### Trainer Features
- 🏠 **Trainer Dashboard** - Overview of assigned members
- 👥 **Member Management** - View and manage assigned members
- 📝 **Workout Plans** - Create and manage workout plans
- 📊 **Progress Updates** - Update member progress
- 📅 **Attendance** - Mark and track member attendance
- 💬 **Feedback** - Send feedback to members

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 2.7.14
- **Language**: Java 8
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA
- **Build Tool**: Maven

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java JDK 8+** (or Java 11+ recommended)
- **Maven 3.6+**
- **Node.js 18+**
- **npm** or **yarn**
- **MySQL 8.0+**
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/amanjeet233/Fitnexus-Fullstack-Gym.git
cd Fitnexus-Fullstack-Gym
```

### 2. Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE gym_management;
```

2. Run the database setup script:
```bash
mysql -u root -p gym_management < database/database_setup_v2.sql
```

Or import the SQL file using MySQL Workbench or phpMyAdmin.

### 3. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Update database credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gym_management
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. Start the backend server:

**Option A: Using Maven**
```bash
cd backend
mvn spring-boot:run
```

**Option B: Using Batch File (Windows)**
```bash
start-backend.bat
```

The backend will start on `http://localhost:8080`

### 4. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

**Or use the batch file (Windows):**
```bash
start-nextjs.bat
```

The frontend will start on `http://localhost:3000`

### 5. Quick Start (Both Servers)

**Windows Users:**
```bash
restart-all-servers.bat
```

This will start both backend and frontend servers automatically.

## 🔐 Default Login Credentials

- **Username**: `admin`
- **Password**: `admin`

## 📁 Project Structure

```
Fitnexus-Fullstack-Gym/
├── backend/                         # Spring Boot Backend (Java 8/11/21)
│   ├── src/                         # Source code (controller, model, repository, config)
│   ├── pom.xml                      # Maven configuration
│   └── README.md                    # Backend guide
├── database/                        # Database schemas, migrations & indexes
│   ├── database_setup_v2.sql        # Main DB schema & seed data
│   ├── database_indexes.sql         # Performance optimization indexes
│   ├── RESET-MEMBERS-AND-PAYMENTS.sql # Testing data reset script
│   └── README.md                    # Database instructions
├── docs/                            # Project documentation & guides
│   ├── PERFORMANCE-OPTIMIZATION-GUIDE.md
│   ├── PORTS-AND-CONFIG-SUMMARY.md
│   ├── QUICK-REFERENCE.md
│   └── README.md                    # Documentation index
├── frontend-nextjs/                 # Next.js 14 Frontend Application
│   ├── app/                         # App Router pages & layouts
│   ├── components/                  # UI components (shadcn/ui, framer-motion)
│   ├── lib/                         # API client & helpers
│   └── public/                      # Static assets
├── scripts/                         # Startup and maintenance scripts
│   ├── start-backend.bat            # Backend startup script
│   ├── start-frontend.bat           # Frontend startup script
│   ├── restart-all-servers.bat      # Full system restart script
│   └── README.md                    # Scripts guide
├── restart-all-servers.bat          # Root convenience starter (Both servers)
├── start-backend.bat                # Root convenience starter (Backend)
└── README.md                        # Project documentation
```

## 🌐 API Endpoints

The backend provides RESTful APIs at `http://localhost:8080/api`:

- **Authentication**: `/api/auth/login`
- **Members**: `/api/members`
- **Trainers**: `/api/trainers`
- **Payments**: `/api/payments`
- **Attendance**: `/api/attendance`
- **Workout Plans**: `/api/workout-plans`
- **Progress**: `/api/progress`
- **Feedback**: `/api/feedback`

## 🎨 Features in Detail

### Dashboard Analytics
- Total members count
- Total revenue tracking
- Payment transactions
- Active trainers count

### Member Management
- Complete CRUD operations
- Advanced search and filtering
- Export to CSV functionality
- Member type categorization

### Payment System
- Payment tracking and history
- Dues management
- Revenue analytics
- Payment reminders

### Attendance System
- Daily attendance tracking
- Attendance history
- Statistics and reports

### Progress Tracking
- Weight tracking
- Body measurements
- Progress visualization
- Historical data

## 🔧 Configuration

### Backend Configuration

Edit `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/gym_management
spring.datasource.username=root
spring.datasource.password=your_password

# Server Configuration
server.port=8080

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### Frontend Configuration

The frontend connects to the backend API. For production, set the environment variable:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## 📦 Build & Deploy

### Backend Build

```bash
cd backend
mvn clean package
java -jar target/GymManagementSystem-1.0-SNAPSHOT.jar
```

### Frontend Build

```bash
cd frontend-nextjs
npm run build
npm start
```

## 🐛 Troubleshooting

### Backend Issues

1. **Port 8080 already in use**: Change the port in `application.properties`
2. **Database connection error**: Verify MySQL is running and credentials are correct
3. **Maven build fails**: Ensure Java JDK is properly installed

### Frontend Issues

1. **Port 3000 already in use**: Next.js will automatically use the next available port
2. **API connection error**: Ensure backend is running on `http://localhost:8080`
3. **Module not found**: Run `npm install` again

## 📝 Database Scripts

All database scripts are organized in the [`database/`](file:///database/) directory:
- [`database/database_setup_v2.sql`](file:///database/database_setup_v2.sql) - Main database schema
- [`database/database_indexes.sql`](file:///database/database_indexes.sql) - Performance optimization indexes
- [`database/RESET-MEMBERS-AND-PAYMENTS.sql`](file:///database/RESET-MEMBERS-AND-PAYMENTS.sql) - Reset script for testing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Amanjeet**

- GitHub: [@amanjeet233](https://github.com/amanjeet233)

## 🙏 Acknowledgments

- Spring Boot Team
- Next.js Team
- shadcn/ui for amazing UI components
- All open-source contributors

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

⭐ If you find this project helpful, please give it a star!

