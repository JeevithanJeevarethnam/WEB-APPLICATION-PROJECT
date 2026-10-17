-- CampusLend Phase 2 additive migration. Review and apply once in staging before production.
-- Requires the existing campuslend database plus items and reservations from database.sql.
-- Do not run database.sql as part of this migration.

CREATE TABLE schema_migrations (
  version VARCHAR(100) NOT NULL PRIMARY KEY,
  applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE universities (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  email_domain VARCHAR(255) NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY universities_name_uq (name),
  UNIQUE KEY universities_email_domain_uq (email_domain)
) ENGINE=InnoDB;

CREATE TABLE campuses (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  university_id INT UNSIGNED NOT NULL,
  name VARCHAR(160) NOT NULL,
  address VARCHAR(255) NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY campuses_university_name_uq (university_id, name),
  CONSTRAINT campuses_university_fk FOREIGN KEY (university_id) REFERENCES universities(id)
) ENGINE=InnoDB;

CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NULL,
  display_name VARCHAR(120) NOT NULL,
  role ENUM('student', 'lender', 'moderator', 'administrator') NOT NULL DEFAULT 'student',
  status ENUM('pending', 'active', 'suspended') NOT NULL DEFAULT 'pending',
  email_verified_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY users_email_uq (email),
  KEY users_status_role_idx (status, role)
) ENGINE=InnoDB;

CREATE TABLE user_campuses (
  user_id INT UNSIGNED NOT NULL,
  campus_id INT UNSIGNED NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  verified_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, campus_id),
  KEY user_campuses_campus_idx (campus_id),
  CONSTRAINT user_campuses_user_fk FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT user_campuses_campus_fk FOREIGN KEY (campus_id) REFERENCES campuses(id)
) ENGINE=InnoDB;

CREATE TABLE categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  parent_category_id INT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY categories_name_uq (name),
  UNIQUE KEY categories_slug_uq (slug),
  CONSTRAINT categories_parent_fk FOREIGN KEY (parent_category_id) REFERENCES categories(id)
) ENGINE=InnoDB;

ALTER TABLE items
  ADD COLUMN owner_user_id INT UNSIGNED NULL,
  ADD COLUMN campus_id INT UNSIGNED NULL,
  ADD COLUMN category_id INT UNSIGNED NULL,
  ADD COLUMN updated_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ADD KEY items_owner_idx (owner_user_id),
  ADD KEY items_campus_category_availability_idx (campus_id, category_id, available),
  ADD CONSTRAINT items_owner_user_fk FOREIGN KEY (owner_user_id) REFERENCES users(id),
  ADD CONSTRAINT items_campus_fk FOREIGN KEY (campus_id) REFERENCES campuses(id),
  ADD CONSTRAINT items_category_fk FOREIGN KEY (category_id) REFERENCES categories(id);

CREATE TABLE equipment_images (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  item_id INT UNSIGNED NOT NULL,
  storage_key VARCHAR(512) NOT NULL,
  alt_text VARCHAR(255) NULL,
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY equipment_images_item_storage_uq (item_id, storage_key),
  KEY equipment_images_item_sort_idx (item_id, sort_order),
  CONSTRAINT equipment_images_item_fk FOREIGN KEY (item_id) REFERENCES items(id)
) ENGINE=InnoDB;

CREATE TABLE equipment_rental_pricing (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  item_id INT UNSIGNED NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'LKR',
  daily_rate DECIMAL(10,2) NOT NULL,
  deposit_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  effective_from DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  effective_until DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY equipment_pricing_item_effective_idx (item_id, effective_from),
  CONSTRAINT equipment_pricing_item_fk FOREIGN KEY (item_id) REFERENCES items(id)
) ENGINE=InnoDB;

CREATE TABLE bookings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  legacy_reservation_id INT UNSIGNED NULL,
  item_id INT UNSIGNED NOT NULL,
  borrower_user_id INT UNSIGNED NULL,
  lender_user_id INT UNSIGNED NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('pending', 'approved', 'declined', 'cancelled', 'collected', 'returned', 'overdue', 'completed') NOT NULL DEFAULT 'pending',
  currency CHAR(3) NOT NULL DEFAULT 'LKR',
  daily_rate DECIMAL(10,2) NULL,
  deposit_amount DECIMAL(10,2) NULL,
  borrower_note TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY bookings_legacy_reservation_uq (legacy_reservation_id),
  KEY bookings_item_dates_status_idx (item_id, start_date, end_date, status),
  KEY bookings_borrower_status_idx (borrower_user_id, status),
  KEY bookings_lender_status_idx (lender_user_id, status),
  CONSTRAINT bookings_legacy_reservation_fk FOREIGN KEY (legacy_reservation_id) REFERENCES reservations(id),
  CONSTRAINT bookings_item_fk FOREIGN KEY (item_id) REFERENCES items(id),
  CONSTRAINT bookings_borrower_fk FOREIGN KEY (borrower_user_id) REFERENCES users(id),
  CONSTRAINT bookings_lender_fk FOREIGN KEY (lender_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE booking_status_history (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id INT UNSIGNED NOT NULL,
  status ENUM('pending', 'approved', 'declined', 'cancelled', 'collected', 'returned', 'overdue', 'completed') NOT NULL,
  changed_by_user_id INT UNSIGNED NULL,
  note VARCHAR(1000) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY booking_status_history_booking_created_idx (booking_id, created_at),
  CONSTRAINT booking_status_history_booking_fk FOREIGN KEY (booking_id) REFERENCES bookings(id),
  CONSTRAINT booking_status_history_user_fk FOREIGN KEY (changed_by_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE handover_records (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id INT UNSIGNED NOT NULL,
  handover_type ENUM('pickup', 'return') NOT NULL,
  recorded_by_user_id INT UNSIGNED NULL,
  occurred_at DATETIME NOT NULL,
  location VARCHAR(255) NULL,
  condition_notes TEXT NULL,
  evidence_storage_key VARCHAR(512) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY handover_records_booking_type_idx (booking_id, handover_type),
  CONSTRAINT handover_records_booking_fk FOREIGN KEY (booking_id) REFERENCES bookings(id),
  CONSTRAINT handover_records_user_fk FOREIGN KEY (recorded_by_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE reviews (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id INT UNSIGNED NOT NULL,
  reviewer_user_id INT UNSIGNED NOT NULL,
  reviewee_user_id INT UNSIGNED NOT NULL,
  rating TINYINT UNSIGNED NOT NULL,
  comment TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY reviews_booking_reviewer_uq (booking_id, reviewer_user_id),
  KEY reviews_reviewee_created_idx (reviewee_user_id, created_at),
  CONSTRAINT reviews_booking_fk FOREIGN KEY (booking_id) REFERENCES bookings(id),
  CONSTRAINT reviews_reviewer_fk FOREIGN KEY (reviewer_user_id) REFERENCES users(id),
  CONSTRAINT reviews_reviewee_fk FOREIGN KEY (reviewee_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE notifications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  type VARCHAR(80) NOT NULL,
  payload JSON NOT NULL,
  read_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY notifications_user_read_created_idx (user_id, read_at, created_at),
  CONSTRAINT notifications_user_fk FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE disputes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id INT UNSIGNED NOT NULL,
  opened_by_user_id INT UNSIGNED NOT NULL,
  assigned_to_user_id INT UNSIGNED NULL,
  status ENUM('open', 'under_review', 'resolved', 'closed') NOT NULL DEFAULT 'open',
  reason VARCHAR(255) NOT NULL,
  details TEXT NULL,
  resolution TEXT NULL,
  resolved_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY disputes_booking_status_idx (booking_id, status),
  KEY disputes_assignee_status_idx (assigned_to_user_id, status),
  CONSTRAINT disputes_booking_fk FOREIGN KEY (booking_id) REFERENCES bookings(id),
  CONSTRAINT disputes_opened_by_fk FOREIGN KEY (opened_by_user_id) REFERENCES users(id),
  CONSTRAINT disputes_assigned_to_fk FOREIGN KEY (assigned_to_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE user_sessions (
  id CHAR(36) NOT NULL PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  revoked_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY user_sessions_token_hash_uq (token_hash),
  KEY user_sessions_user_expiry_idx (user_id, expires_at),
  CONSTRAINT user_sessions_user_fk FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- Record this only after every statement above succeeds in the migration runner:
-- INSERT INTO schema_migrations (version) VALUES ('001_marketplace_foundation');
