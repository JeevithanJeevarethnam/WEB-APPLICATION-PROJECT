import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const Icon = ({ children, className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)

function App() {
  const handleSubmit = (event) => {
    event.preventDefault()
    // Connect this to POST /api/auth/login when the backend is ready.
  }

  return (
    <main className="page-shell">
      <section className="showcase" aria-label="CampusLend introduction">
        <nav className="brand">
          <span className="brand-mark"><span></span><span></span><span></span></span>
          <span>Campus<span className="brand-accent">Lend</span></span>
        </nav>

        <div className="showcase-content">
          <p className="eyebrow">EQUIPMENT, WHERE YOU NEED IT</p>
          <h1>Share more.<br /><em>Waste less.</em></h1>
          <p className="intro">One trusted space for campuses to lend, borrow, and make the most of every piece of equipment.</p>
          <div className="equipment-preview" aria-hidden="true">
            <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
            <div className="camera-body"><span className="camera-lens"></span><span className="camera-top"></span></div>
            <div className="preview-card card-tripod"><Icon><path d="M12 4v10M7 20l5-6 5 6M9 8h6" /><circle cx="12" cy="4" r="2" /></Icon></div>
            <div className="preview-card card-mic"><Icon><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0M12 17v4M8 21h8" /></Icon></div>
            <div className="preview-card card-light"><Icon><path d="M12 2v3M4.9 4.9l2.1 2.1M2 12h3M4.9 19.1L7 17M12 19v3M17 17l2.1 2.1M19 12h3M17 7l2.1-2.1" /><circle cx="12" cy="12" r="5" /></Icon></div>
          </div>
        </div>

        <footer><span>© 2026 CampusLend</span><span>Made for better campuses</span></footer>
      </section>

      <section className="login-panel">
        <div className="form-wrap">
          <div className="mobile-brand brand"><span className="brand-mark"><span></span><span></span><span></span></span><span>Campus<span className="brand-accent">Lend</span></span></div>
          <p className="eyebrow form-eyebrow">WELCOME BACK</p>
          <h2>Sign in to your account</h2>
          <p className="form-subtitle">Enter your details to access your campus inventory.</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Campus email</label>
            <div className="input-wrap">
              <Icon><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></Icon>
              <input id="email" type="email" placeholder="you@university.edu" autoComplete="email" required />
            </div>
            <div className="label-row"><label htmlFor="password">Password</label><a href="#forgot">Forgot password?</a></div>
            <div className="input-wrap">
              <Icon><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></Icon>
              <input id="password" type="password" placeholder="Enter your password" autoComplete="current-password" required />
            </div>
            <label className="remember"><input type="checkbox" /><span className="check-box"></span><span>Keep me signed in</span></label>
            <button type="submit">Sign in <span>→</span></button>
          </form>

          <div className="divider"><span></span>or continue with<span></span></div>
          <button className="sso-button" type="button"><span className="sso-mark">S</span> University SSO</button>
          <p className="signup">New to CampusLend? <a href="#signup">Create an account</a></p>
        </div>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
