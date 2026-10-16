import 'dotenv/config'
import express from 'express'
import mysql from 'mysql2/promise'

const app = express()
const port = Number(process.env.PORT || 3001)

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'campuslend',
  waitForConnections: true,
  connectionLimit: 10,
})

app.use(express.json())

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ ok: true })
  } catch {
    res.status(503).json({ ok: false, message: 'Database is unavailable.' })
  }
})

app.get('/api/items', async (_req, res, next) => {
  try {
    const [items] = await pool.query(`
      SELECT id, name, category, description, location, image_emoji AS imageEmoji,
             condition_label AS conditionLabel, available
      FROM items ORDER BY available DESC, name ASC`)
    res.json(items)
  } catch (error) { next(error) }
})

app.post('/api/reservations', async (req, res, next) => {
  const { itemId, borrowerName, email, startDate, endDate, notes = '' } = req.body
  if (!itemId || !borrowerName || !email || !startDate || !endDate) {
    return res.status(400).json({ message: 'Please complete all required fields.' })
  }
  if (new Date(endDate) < new Date(startDate)) {
    return res.status(400).json({ message: 'Return date must be after the pickup date.' })
  }
  try {
    const [items] = await pool.query('SELECT id, available FROM items WHERE id = ?', [itemId])
    if (!items.length || !items[0].available) return res.status(409).json({ message: 'That item is no longer available.' })
    const [result] = await pool.execute(
      `INSERT INTO reservations (item_id, borrower_name, email, start_date, end_date, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [itemId, borrowerName, email, startDate, endDate, notes],
    )
    res.status(201).json({ id: result.insertId, message: 'Your request has been sent.' })
  } catch (error) { next(error) }
})

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ message: 'Something went wrong. Please try again.' })
})

app.listen(port, () => console.log(`CampusLend API listening on http://localhost:${port}`))
