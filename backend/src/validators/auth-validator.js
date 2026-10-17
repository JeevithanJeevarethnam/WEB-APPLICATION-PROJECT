import { AppError } from '../errors/app-error.js'
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export function validateRegistration(payload = {}) {
  const fullName = typeof payload.fullName === 'string' ? payload.fullName.trim() : ''
  const universityId = Number(payload.universityId); const campusId = Number(payload.campusId)
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : ''
  const studentId = typeof payload.studentId === 'string' ? payload.studentId.trim() : ''
  const password = typeof payload.password === 'string' ? payload.password : ''; const confirmPassword = typeof payload.confirmPassword === 'string' ? payload.confirmPassword : ''
  if (!fullName || !Number.isSafeInteger(universityId) || universityId < 1 || !Number.isSafeInteger(campusId) || campusId < 1 || !email || !password || !confirmPassword) throw new AppError('Please complete all required fields.', 400)
  if (fullName.length > 120 || email.length > 255 || studentId.length > 100 || !emailPattern.test(email)) throw new AppError('Please provide valid registration details.', 400)
  if (password !== confirmPassword) throw new AppError('Passwords do not match.', 400)
  if (password.length < 12 || password.length > 128 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) throw new AppError('Use a password with at least 12 characters, an uppercase letter, a lowercase letter, and a number.', 400)
  return { fullName, universityId, campusId, email, studentId, password }
}
export function validateLogin(payload = {}) { const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : ''; const password = typeof payload.password === 'string' ? payload.password : ''; if (!email || !password || !emailPattern.test(email)) throw new AppError('Email or password is incorrect.', 401); return { email, password } }
