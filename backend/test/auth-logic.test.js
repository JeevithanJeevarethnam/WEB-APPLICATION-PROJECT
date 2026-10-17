import assert from 'node:assert/strict'
import { hashPassword, verifyPassword } from '../src/services/auth-service.js'
import { validateLogin, validateRegistration } from '../src/validators/auth-validator.js'
import { requireRole } from '../src/middleware/auth.js'

const registration = validateRegistration({ fullName: 'Ada Student', universityId: '1', campusId: '2', email: 'ADA@EXAMPLE.EDU', studentId: 'S-1', password: 'StrongPassword1', confirmPassword: 'StrongPassword1' })
assert.equal(registration.email, 'ada@example.edu')
assert.throws(() => validateRegistration({ ...registration, password: 'weak', confirmPassword: 'weak' }))
assert.throws(() => validateRegistration({ ...registration, password: 'StrongPassword1', confirmPassword: 'DifferentPassword1' }))
assert.throws(() => validateLogin({ email: 'not-an-email', password: 'anything' }))
const passwordHash = await hashPassword('StrongPassword1')
assert.equal(await verifyPassword('StrongPassword1', passwordHash), true)
assert.equal(await verifyPassword('IncorrectPassword1', passwordHash), false)
let allowed = false
requireRole('campus_admin')({ user: { role: 'campus_admin' } }, {}, () => { allowed = true })
assert.equal(allowed, true)
let denied
requireRole('super_admin')({ user: { role: 'student' } }, {}, (error) => { denied = error })
assert.equal(denied.statusCode, 403)
