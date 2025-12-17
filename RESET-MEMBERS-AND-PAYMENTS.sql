-- Reset Members and Payments Data
-- This script will delete all members and their related data (payments, attendance, etc.)
USE gms;

-- Disable foreign key checks temporarily to avoid constraint issues
SET FOREIGN_KEY_CHECKS = 0;

-- Delete all payments first (though they'll be cascade deleted with members)
DELETE FROM payment;

-- Delete all attendance records (cascade delete with members)
DELETE FROM attendance;

-- Delete all workout plans (cascade delete with members)
DELETE FROM workout_plan;

-- Delete all progress entries (cascade delete with members)
DELETE FROM progress_entry;

-- Delete feedback entries related to members
DELETE FROM feedback WHERE to_member_id IS NOT NULL;

-- Delete user accounts that are linked to members
DELETE FROM user WHERE member_id IS NOT NULL;

-- Delete all members (this will cascade delete remaining related data)
DELETE FROM member;

-- Reset AUTO_INCREMENT counters
ALTER TABLE payment AUTO_INCREMENT = 1;
ALTER TABLE attendance AUTO_INCREMENT = 1;
ALTER TABLE workout_plan AUTO_INCREMENT = 1;
ALTER TABLE progress_entry AUTO_INCREMENT = 1;
ALTER TABLE feedback AUTO_INCREMENT = 1;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Show confirmation
SELECT 'All members and payments have been reset successfully!' AS Status;
SELECT COUNT(*) AS Remaining_Members FROM member;
SELECT COUNT(*) AS Remaining_Payments FROM payment;

