-- Quick fix: Add feedback table if it doesn't exist
USE gms;

-- Create feedback table if not exists
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

SELECT 'Feedback table created successfully!' AS Status;

