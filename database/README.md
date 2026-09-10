# 🗄️ Database Scripts & Migrations

This folder contains the database initialization scripts, schemas, indexes, and utility scripts for the **FitNexus Gym Management System**.

## 📁 Files Overview

| File | Description | When to Run |
| :--- | :--- | :--- |
| [`database_setup_v2.sql`](file:///database/database_setup_v2.sql) | Main database schema including users, roles, trainers, plans, attendance, and seed data. | Initial setup or fresh database reset. |
| [`database_indexes.sql`](file:///database/database_indexes.sql) | Performance optimization indexes for foreign keys, queries, and lookups. | Run after initial schema setup. |
| [`RESET-MEMBERS-AND-PAYMENTS.sql`](file:///database/RESET-MEMBERS-AND-PAYMENTS.sql) | Resets test member data and payment records without wiping system configuration. | Development and testing. |

---

## 🚀 Execution Instructions

### 1. Initial Setup
Run the main setup script against your MySQL database:

```bash
mysql -u root -p gms < database_setup_v2.sql
```

### 2. Apply Performance Indexes
Apply additional indexes for query optimization:

```bash
mysql -u root -p gms < database_indexes.sql
```

### 3. Reset Test Data (Optional)
To clear sample members and transactions during testing:

```bash
mysql -u root -p gms < RESET-MEMBERS-AND-PAYMENTS.sql
```
