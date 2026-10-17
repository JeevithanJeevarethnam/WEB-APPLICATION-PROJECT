# Migrations

These files are reviewable, additive SQL artifacts; Phase 2 does not execute them. Apply them through an approved migration runner that records `schema_migrations.version` only after a successful transaction or documented successful run.

`001_marketplace_foundation.sql` requires the existing `items` and `reservations` tables. It creates marketplace tables and adds only nullable ownership, campus, and normalized-category references to `items`. Existing equipment stays unassigned, and no historical reservation is converted to a booking or connected to a user.

`002_auth_roles_and_verification.sql` must follow `001`. It changes the as-yet-unpopulated Phase 2 role enum to the approved Phase 3 roles (`student`, `campus_admin`, `super_admin`), adds verification and optional student-ID fields, and creates password-reset token storage. If `001` has been applied and contains `lender`, `moderator`, or `administrator` users, decide and document a role mapping before applying `002`; do not run it blindly.

MySQL DDL can auto-commit, so a failed run may require manual inspection and a forward-fix migration rather than a transaction rollback. Do not rerun a partially applied file. Take and verify a restorable backup before staging and production runs.
