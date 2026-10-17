export const sessionCookieName = process.env.SESSION_COOKIE_NAME || 'campuslend_session'
export const csrfCookieName = 'campuslend_csrf'
export const sessionTtlHours = Number(process.env.SESSION_TTL_HOURS || 168)
export const cookieSecure = process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production'
export const sessionCookieOptions = { httpOnly: true, secure: cookieSecure, sameSite: 'lax', path: '/', maxAge: sessionTtlHours * 60 * 60 * 1000 }
export const csrfCookieOptions = { httpOnly: false, secure: cookieSecure, sameSite: 'lax', path: '/', maxAge: sessionTtlHours * 60 * 60 * 1000 }
