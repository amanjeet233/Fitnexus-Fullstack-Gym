-- Updated Database Schema with Roles and Enhanced Features
CREATE DATABASE IF NOT EXISTS gms;
USE gms;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS member;
DROP TABLE IF EXISTS trainer;
DROP TABLE IF EXISTS plan;
DROP TABLE IF EXISTS user;

-- Create user table for authentication
CREATE TABLE IF NOT EXISTS user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'trainer', 'member') NOT NULL DEFAULT 'member',
    member_id VARCHAR(20) NULL,
    trainer_id VARCHAR(20) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create plan table
CREATE TABLE IF NOT EXISTS plan (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(50) NOT NULL,
    plan_type VARCHAR(50) NOT NULL, -- Basic, Plus, Premium
    duration_days INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    features TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trainer table (enhanced)
CREATE TABLE IF NOT EXISTS trainer (
    trainer_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT,
    gender VARCHAR(10),
    specialization VARCHAR(100),
    experience INT DEFAULT 0,
    salary DECIMAL(10,2),
    contact VARCHAR(100),
    email VARCHAR(100),
    address TEXT,
    join_date DATE,
    assigned_members INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create member table (enhanced with role support)
CREATE TABLE IF NOT EXISTS member (
    member_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    age INT,
    gender VARCHAR(10),
    contact VARCHAR(20),
    phone_num VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    plan_id INT,
    trainer_id VARCHAR(20),
    member_type VARCHAR(50), -- Basic, Plus, Premium
    amount_pay DECIMAL(10,2),
    date_registered DATE,
    expiry_date DATE,
    payment_date DATE,
    fees_status ENUM('Paid', 'Unpaid', 'Pending') DEFAULT 'Unpaid',
    attendance_count INT DEFAULT 0,
    status ENUM('active', 'inactive', 'expired') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES plan(plan_id) ON DELETE SET NULL,
    FOREIGN KEY (trainer_id) REFERENCES trainer(trainer_id) ON DELETE SET NULL
);

-- Create payment table
CREATE TABLE IF NOT EXISTS payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    member_id VARCHAR(20),
    member_name VARCHAR(100),
    member_type VARCHAR(50),
    amount_pay DECIMAL(10,2),
    payment_date DATE,
    due_date DATE,
    day_remaining VARCHAR(50),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES member(member_id) ON DELETE CASCADE
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    member_id VARCHAR(20) NOT NULL,
    trainer_id VARCHAR(20),
    attendance_date DATE NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    status ENUM('present', 'absent', 'late') DEFAULT 'present',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES member(member_id) ON DELETE CASCADE,
    FOREIGN KEY (trainer_id) REFERENCES trainer(trainer_id) ON DELETE SET NULL,
    UNIQUE KEY unique_member_date (member_id, attendance_date)
);

-- Create workout plan table
CREATE TABLE IF NOT EXISTS workout_plan (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    trainer_id VARCHAR(20) NOT NULL,
    member_id VARCHAR(20) NOT NULL,
    title VARCHAR(100),
    focus_area VARCHAR(100),
    session_date DATE,
    start_time TIME,
    end_time TIME,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trainer_id) REFERENCES trainer(trainer_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES member(member_id) ON DELETE CASCADE
);

-- Create progress tracking table
CREATE TABLE IF NOT EXISTS progress_entry (
    progress_id INT AUTO_INCREMENT PRIMARY KEY,
    member_id VARCHAR(20) NOT NULL,
    trainer_id VARCHAR(20) NOT NULL,
    metric VARCHAR(100),
    value VARCHAR(100),
    notes TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES member(member_id) ON DELETE CASCADE,
    FOREIGN KEY (trainer_id) REFERENCES trainer(trainer_id) ON DELETE CASCADE
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    from_role ENUM('admin', 'trainer', 'member') NOT NULL,
    from_user_id VARCHAR(50),
    to_role ENUM('admin', 'trainer', 'member') NOT NULL,
    to_user_id VARCHAR(50) NOT NULL,
    to_member_id VARCHAR(20),
    to_trainer_id VARCHAR(20),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('unread', 'read') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (to_member_id) REFERENCES member(member_id) ON DELETE CASCADE,
    FOREIGN KEY (to_trainer_id) REFERENCES trainer(trainer_id) ON DELETE CASCADE
);

-- Insert default admin user
INSERT INTO user (username, password, role) VALUES 
('admin', 'admin', 'admin');

-- Insert default plans
INSERT INTO plan (plan_name, plan_type, duration_days, price, features) VALUES
('Basic Plan', 'Basic', 30, 29.99, 'Access to gym, Basic equipment, 1 trainer session/month'),
('Plus Plan', 'Plus', 30, 49.99, 'All Basic features, Group classes, 2 trainer sessions/month'),
('Premium Plan', 'Premium', 30, 79.99, 'All Plus features, Personal trainer, Unlimited sessions, Nutrition plan');

-- Insert sample trainer
INSERT INTO trainer (trainer_id, name, age, gender, specialization, experience, salary, contact, email, join_date, status) VALUES
('T001', 'Rahul Sharma', 28, 'Male', 'Strength Training', 5, 50000.00, '9876543210', 'rahul@example.com', CURDATE(), 'active');

-- Update trainer assigned_members count trigger (simplified - can be done via application)
-- This would ideally be a trigger, but for simplicity, we'll handle it in the application

