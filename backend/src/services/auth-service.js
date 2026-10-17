import bcrypt from 'bcrypt'
import { createHash, randomBytes, randomUUID } from 'node:crypto'
import { pool } from '../config/database.js'
import { sessionTtlHours } from '../config/auth.js'

const hashToken = (value) => createHash('sha256').update(value).digest('hex')
export const hashPassword = (password) => bcrypt.hash(password, 12)
export const verifyPassword = (password, passwordHash) => bcrypt.compare(password, passwordHash)

export async function getUniversityCampus(universityId, campusId) {
  const [rows] = await pool.execute('SELECT c.id AS campus_id, u.id AS university_id, u.email_domain FROM campuses c JOIN universities u ON u.id = c.university_id WHERE u.id = ? AND c.id = ? AND u.status = \'active\' AND c.status = \'active\'', [universityId, campusId])
  return rows[0] || null
}
export async function listUniversities() {
  const [rows] = await pool.query('SELECT u.id, u.name, u.email_domain AS emailDomain, c.id AS campusId, c.name AS campusName FROM universities u LEFT JOIN campuses c ON c.university_id = u.id AND c.status = \'active\' WHERE u.status = \'active\' ORDER BY u.name, c.name')
  const universities = new Map()
  for (const row of rows) { if (!universities.has(row.id)) universities.set(row.id, { id: row.id, name: row.name, emailDomain: row.emailDomain, campuses: [] }); if (row.campusId) universities.get(row.id).campuses.push({ id: row.campusId, name: row.campusName }) }
  return [...universities.values()]
}
export async function createUser({ fullName, campusId, email, studentId, passwordHash, verificationState }) {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const status = verificationState === 'verified' ? 'active' : 'pending'
    const [result] = await connection.execute('INSERT INTO users (email, password_hash, display_name, role, status, verification_state, student_id) VALUES (?, ?, ?, \'student\', ?, ?, ?)', [email, passwordHash, fullName, status, verificationState, studentId || null])
    await connection.execute('INSERT INTO user_campuses (user_id, campus_id, is_primary) VALUES (?, ?, TRUE)', [result.insertId, campusId])
    await connection.commit()
    return result.insertId
  } catch (error) { await connection.rollback(); throw error } finally { connection.release() }
}
export async function findUserByEmail(email) { const [rows] = await pool.execute('SELECT id, email, password_hash, display_name, role, status, verification_state FROM users WHERE email = ?', [email]); return rows[0] || null }
export async function createSession(userId) {
  const id = randomUUID(); const secret = randomBytes(32).toString('base64url'); const expiresAt = new Date(Date.now() + sessionTtlHours * 60 * 60 * 1000)
  await pool.execute('INSERT INTO user_sessions (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)', [id, userId, hashToken(secret), expiresAt])
  return `${id}.${secret}`
}
export async function getSessionUser(sessionToken) {
  const [id, secret] = String(sessionToken || '').split('.')
  if (!id || !secret) return null
  const [rows] = await pool.execute(`SELECT u.id, u.email, u.display_name AS fullName, u.role, u.status, u.verification_state AS verificationState
    FROM user_sessions s JOIN users u ON u.id = s.user_id
    WHERE s.id = ? AND s.token_hash = ? AND s.revoked_at IS NULL AND s.expires_at > UTC_TIMESTAMP()`, [id, hashToken(secret)])
  return rows[0] || null
}
export async function revokeSession(sessionToken) { const [id] = String(sessionToken || '').split('.'); if (id) await pool.execute('UPDATE user_sessions SET revoked_at = UTC_TIMESTAMP() WHERE id = ? AND revoked_at IS NULL', [id]) }
export async function updateVerification({ userId, state, actor }) {
  const status = state === 'verified' ? 'active' : state === 'suspended' ? 'suspended' : 'pending'
  if (actor.role === 'super_admin') {
    const [result] = await pool.execute('UPDATE users SET verification_state = ?, status = ? WHERE id = ? AND role = \'student\'', [state, status, userId])
    return result.affectedRows
  }
  const [result] = await pool.execute(`UPDATE users target JOIN user_campuses target_campus ON target_campus.user_id = target.id JOIN user_campuses admin_campus ON admin_campus.campus_id = target_campus.campus_id
    SET target.verification_state = ?, target.status = ? WHERE target.id = ? AND target.role = 'student' AND admin_campus.user_id = ?`, [state, status, userId, actor.id])
  return result.affectedRows
}
