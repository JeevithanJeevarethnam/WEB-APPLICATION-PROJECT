-- Phase 6: apply only after approved migrations 001-003.
ALTER TABLE items ADD KEY items_public_marketplace_idx (listing_status, available, campus_id, category, rental_type, rental_price_per_day, created_at);
ALTER TABLE users ADD KEY users_public_verified_idx (verification_state, status);
