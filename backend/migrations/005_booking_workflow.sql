-- Phase 7: apply only after approved 001-004 migrations and a verified backup.
ALTER TABLE bookings
  MODIFY status ENUM('pending','approved','rejected','cancelled','active','completed','overdue','disputed') NOT NULL DEFAULT 'pending',
  ADD COLUMN payment_status ENUM('not_required','pending_offline','confirmed_offline','refunded') NOT NULL DEFAULT 'not_required',
  ADD COLUMN pickup_owner_confirmed_at DATETIME NULL,
  ADD COLUMN pickup_borrower_confirmed_at DATETIME NULL,
  ADD COLUMN return_owner_confirmed_at DATETIME NULL,
  ADD COLUMN return_borrower_confirmed_at DATETIME NULL,
  ADD COLUMN idempotency_key CHAR(36) NULL,
  ADD UNIQUE KEY bookings_borrower_idempotency_uq (borrower_user_id, idempotency_key);
ALTER TABLE handover_records ADD COLUMN participant_role ENUM('owner','borrower') NULL;
-- Record only after the approved migration runner succeeds:
-- INSERT INTO schema_migrations (version) VALUES ('005_booking_workflow');
