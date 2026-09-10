-- Performance Optimization: Database Indexes
-- Run this after database_setup_v2.sql

USE gms;

-- User table indexes (for authentication queries)
CREATE INDEX idx_user_username ON user(username);
CREATE INDEX idx_user_member_id ON user(member_id);
CREATE INDEX idx_user_trainer_id ON user(trainer_id);
CREATE INDEX idx_user_role ON user(role);

-- Member table indexes (most queried table)
CREATE INDEX idx_member_trainer_id ON member(trainer_id);
CREATE INDEX idx_member_status ON member(status);
CREATE INDEX idx_member_first_name ON member(first_name);
CREATE INDEX idx_member_last_name ON member(last_name);
CREATE INDEX idx_member_email ON member(email);
CREATE INDEX idx_member_phone ON member(phone_num);
CREATE INDEX idx_member_type ON member(member_type);
CREATE INDEX idx_member_registered_date ON member(date_registered);

-- Trainer table indexes
CREATE INDEX idx_trainer_name ON trainer(name);
CREATE INDEX idx_trainer_status ON trainer(status);
CREATE INDEX idx_trainer_specialization ON trainer(specialization);

-- Payment table indexes
CREATE INDEX idx_payment_member_id ON payment(member_id);
CREATE INDEX idx_payment_date ON payment(payment_date);
CREATE INDEX idx_payment_status ON payment(status);
CREATE INDEX idx_payment_amount ON payment(amount_pay);

-- Attendance table indexes
CREATE INDEX idx_attendance_member_id ON attendance(member_id);
CREATE INDEX idx_attendance_trainer_id ON attendance(trainer_id);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);
CREATE INDEX idx_attendance_status ON attendance(status);

-- Feedback table indexes
CREATE INDEX idx_feedback_to_member_id ON feedback(to_member_id);
CREATE INDEX idx_feedback_to_trainer_id ON feedback(to_trainer_id);
CREATE INDEX idx_feedback_to_user_id ON feedback(to_user_id);
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_feedback_to_role ON feedback(to_role);
CREATE INDEX idx_feedback_created_at ON feedback(created_at);

-- Progress Entry indexes
CREATE INDEX idx_progress_member_id ON progress_entry(member_id);
CREATE INDEX idx_progress_trainer_id ON progress_entry(trainer_id);
CREATE INDEX idx_progress_date ON progress_entry(entry_date);

-- Workout Plan indexes
CREATE INDEX idx_workout_member_id ON plan(member_id);
CREATE INDEX idx_workout_trainer_id ON plan(trainer_id);
CREATE INDEX idx_workout_session_date ON plan(session_date);

-- Composite indexes for common query patterns
CREATE INDEX idx_member_trainer_status ON member(trainer_id, status);
CREATE INDEX idx_payment_member_date ON payment(member_id, payment_date);
CREATE INDEX idx_attendance_member_date ON attendance(member_id, attendance_date);

-- Show all indexes
SHOW INDEX FROM member;
SHOW INDEX FROM trainer;
SHOW INDEX FROM payment;
SHOW INDEX FROM attendance;
SHOW INDEX FROM feedback;
SHOW INDEX FROM user;

