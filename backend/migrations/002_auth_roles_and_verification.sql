-- CampusLend Phase 3 additive/auth migration. Apply only after approved 001_marketplace_foundation.sql.
-- Review in staging and take a verified backup first. This file is not executed by the application.

ALTER TABLE users
  MODIFY COLUMN role ENUM('student', 'campus_admin', 'super_admin') NOT NULL DEFAULT 'student',
  ADD COLUMN student_id VARCHAR(100) NULL AFTER display_name,
  ADD COLUMN verification_state ENUM('pending', 'verified', 'rejected', 'suspended') NOT NULL DEFAULT 'pending' AFTER status,
  ADD UNIQUE KEY users_student_id_uq (student_id),
  ADD KEY users_verification_state_idx (verification_state);

CREATE TABLE password_reset_tokens (
  id CHAR(36) NOT NULL PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY password_reset_tokens_hash_uq (token_hash),
  KEY password_reset_tokens_user_expiry_idx (user_id, expires_at),
  CONSTRAINT password_reset_tokens_user_fk FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- Record only after successful application by the approved migration runner:
-- INSERT INTO schema_migrations (version) VALUES ('002_auth_roles_and_verification');
