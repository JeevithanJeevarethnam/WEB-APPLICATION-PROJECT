import { checkDatabase } from '../services/health-service.js'
export async function health(_req, res) { try { await checkDatabase(); res.json({ ok: true }) } catch { res.status(503).json({ ok: false, message: 'Database is unavailable.' }) } }
