import { pool } from '../config/database.js'
export async function createLegacyReservation({ itemId, borrowerName, email, startDate, endDate, notes }) { const [result] = await pool.execute(`INSERT INTO reservations (item_id, borrower_name, email, start_date, end_date, notes) VALUES (?, ?, ?, ?, ?, ?)`, [itemId, borrowerName, email, startDate, endDate, notes]); return result.insertId }
