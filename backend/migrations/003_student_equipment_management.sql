-- Phase 5: review, back up, and apply only after approved 001 and 002 migrations.
ALTER TABLE items
  ADD COLUMN brand VARCHAR(100) NULL,
  ADD COLUMN model VARCHAR(100) NULL,
  ADD COLUMN pickup_location VARCHAR(255) NULL,
  ADD COLUMN rental_type ENUM('free','paid') NOT NULL DEFAULT 'free',
  ADD COLUMN rental_price_per_day DECIMAL(10,2) NULL,
  ADD COLUMN available_from DATE NULL,
  ADD COLUMN available_until DATE NULL,
  ADD COLUMN rental_terms TEXT NULL,
  ADD COLUMN listing_status ENUM('active','inactive','deleted') NOT NULL DEFAULT 'active',
  ADD COLUMN deleted_at DATETIME NULL,
  ADD KEY items_owner_status_idx (owner_user_id, listing_status);

ALTER TABLE equipment_images
  ADD COLUMN mime_type VARCHAR(100) NULL,
  ADD COLUMN file_size INT UNSIGNED NULL;

-- Record only after successful application by the approved migration runner:
-- INSERT INTO schema_migrations (version) VALUES ('003_student_equipment_management');
