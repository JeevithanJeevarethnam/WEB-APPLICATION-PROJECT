import { pool } from '../config/database.js'
export async function listItems() { const [items] = await pool.query(`SELECT id, name, category, description, location, image_emoji AS imageEmoji, condition_label AS conditionLabel, available FROM items ORDER BY available DESC, name ASC`); return items }
export async function findItemAvailability(itemId) { const [items] = await pool.query('SELECT id, available FROM items WHERE id = ?', [itemId]); return items[0] || null }
