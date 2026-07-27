import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const Arrow = () => <span className="arrow">↗</span>

function HomePage({ setPage }) {
  return (
    <>
      <section className="hero">
        <nav className="nav wrap">
          <a className="brand" href="#top"><span className="brand-mark"><i></i><i></i><i></i></span>Campus<span>Lend</span></a>
          <div className="nav-links"><a href="#how">How it works</a><a href="#discover">Explore gear</a><a href="#impact">Our impact</a></div>
          <div className="nav-actions">
            <button className="login" type="button" onClick={() => setPage('signin')}>Log in</button>
            <a className="button button-small" href="#join">Join your campus <Arrow /></a>
          </div>
        </nav>

        <div className="hero-content wrap" id="top">
          <div className="hero-copy">
            <p className="eyebrow"><b></b> THE CAMPUS GEAR LIBRARY</p>
            <h1>Make more.<br /><em>Own less.</em></h1>
            <p className="lead">The easy way for students and departments to lend, borrow, and get more from the equipment your campus already has.</p>
            <div className="hero-buttons"><a className="button" href="#discover">Browse equipment <Arrow /></a><a className="text-link" href="#how"><span className="play">▶</span> See how it works</a></div>
            <div className="hero-proof"><div className="faces"><span>J</span><span>M</span><span>A</span><span>R</span></div><p><strong>2,000+ students</strong><br />sharing smarter on campus</p></div>
          </div>
          <div className="hero-art" aria-label="A camera and campus equipment illustration">
            <div className="sun"></div><div className="line line-one"></div><div className="line line-two"></div>
            <div className="shape shape-sand"></div><div className="shape shape-mint"></div>
            <div className="camera"><div className="camera-top"></div><div className="camera-flash"></div><div className="lens"><div></div></div></div>
            <div className="float-card card-a"><span className="mini-icon">⌁</span><b>Creative kit</b><small>Available today</small></div>
            <div className="float-card card-b"><span className="avatar">S</span><p><b>“Exactly what I needed”</b><small>— Sam, Film Society</small></p></div>
            <div className="sparkle sparkle-a">✦</div><div className="sparkle sparkle-b">✦</div>
          </div>
        </div>
        <div className="trusted wrap"><span>TRUSTED BY STUDENTS AT</span><div>Northstar <b>University</b></div><div className="uni-serif">Hillside College</div><div>WEST<small>FIELD</small></div><div className="uni-round">Summit</div></div>
      </section>

      <section className="intro-section wrap" id="how">
        <div><p className="eyebrow dark"><b></b> A BETTER WAY TO BORROW</p><h2>Everything you need.<br /><em>Nothing you don't.</em></h2></div>
        <p className="section-copy">From a camera for your first short film to a tent for the weekend, CampusLend brings your community's underused gear into one easy-to-use place.</p>
      </section>

      <section className="categories wrap" id="discover">
        <article className="category photo"><div className="category-art camera-icon">◉</div><p>01 / CREATE</p><h3>Photo & video</h3><a href="#photo">Explore gear <Arrow /></a></article>
        <article className="category sound"><div className="category-art mic-icon">♩</div><p>02 / MAKE NOISE</p><h3>Music & audio</h3><a href="#audio">Explore gear <Arrow /></a></article>
        <article className="category outdoor"><div className="category-art tent-icon">△</div><p>03 / GET OUTSIDE</p><h3>Outdoor & events</h3><a href="#outdoor">Explore gear <Arrow /></a></article>
      </section>

      <section className="steps" id="impact"><div className="wrap steps-inner"><div><p className="eyebrow"><b></b> SIMPLE BY DESIGN</p><h2>Good things should<br />be <em>easy to share.</em></h2></div><ol><li><span>01</span><div><h3>Find what you need</h3><p>Explore trusted equipment from departments, clubs, and students across your campus.</p></div></li><li><span>02</span><div><h3>Request in a tap</h3><p>Choose your dates, send a request, and get confirmed by the owner.</p></div></li><li><span>03</span><div><h3>Make something happen</h3><p>Pick up your gear, create your thing, and return it when you're done.</p></div></li></ol></div></section>
    </>
  )
}

function HowPage() {
  return (
    <section className="wrap page-card">
      <p className="eyebrow dark"><b></b> HOW IT WORKS</p>
      <h2>Borrowing equipment feels effortless.</h2>
      <p>Students browse what is available, request a time slot, and pick up gear from a trusted campus contact. Everything is tracked in one place so nothing gets lost.</p>
      <ul>
        <li>Search by category, department, or availability.</li>
        <li>Approve requests in seconds with a few taps.</li>
        <li>Keep campus resources moving instead of sitting idle.</li>
      </ul>
      <a className="button" href="#join">Start sharing <Arrow /></a>
    </section>
  )
}

function DiscoverPage() {
  return (
    <section className="wrap page-card">
      <p className="eyebrow dark"><b></b> EXPLORE GEAR</p>
      <h2>Find the right tool for the moment.</h2>
      <p>CampusLend brings together cameras, microphones, tents, field kits, and more from departments and student groups.</p>
      <div className="categories" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', padding: 0, marginTop: '24px' }}>
        <article className="category photo"><p>01 / CREATE</p><h3>Photo & video</h3><a href="#">Browse gear <Arrow /></a></article>
        <article className="category sound"><p>02 / MAKE NOISE</p><h3>Music & audio</h3><a href="#">Browse gear <Arrow /></a></article>
        <article className="category outdoor"><p>03 / GET OUTSIDE</p><h3>Outdoor & events</h3><a href="#">Browse gear <Arrow /></a></article>
      </div>
    </section>
  )
}

function JoinPage() {
  return (
    <section className="wrap page-card">
      <p className="eyebrow dark"><b></b> JOIN THE MOVEMENT</p>
      <h2>Your campus can share more with less effort.</h2>
      <p>Bring your club, department, or student organization into a smarter gear-sharing system with a simple onboarding flow for new members.</p>
      <a className="button" href="#">Create your free account <Arrow /></a>
    </section>
  )
}

function LoginPage({ setPage }) {
  return (
    <section className="wrap page-card auth-card">
      <p className="eyebrow dark"><b></b> SIGN IN</p>
      <h2>Welcome back to CampusLend.</h2>
      <p>Use your campus email to access your borrowed gear, requests, and account details.</p>
      <form className="auth-form">
        <label>
          <span>Email</span>
          <input type="email" placeholder="you@campus.edu" />
        </label>
        <label>
          <span>Password</span>
          <input type="password" placeholder="Enter your password" />
        </label>
        <button className="button" type="button">Sign in <Arrow /></button>
      </form>
      <p className="auth-link"><button type="button" onClick={() => setPage('home')}>Back to home</button></p>
    </section>
  )
}

function App() {
  const [page, setPage] = useState(() => {
    if (typeof window === 'undefined') return 'home'
    const hash = window.location.hash.replace('#', '')
    return ['home', 'how', 'discover', 'join', 'login', 'signin'].includes(hash) ? hash : 'home'
  })

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace('#', '')
      if (['home', 'how', 'discover', 'join', 'login', 'signin'].includes(hash)) {
        setPage(hash)
      } else {
        setPage('home')
      }
    }

    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [])

  useEffect(() => {
    if (window.location.hash !== `#${page}`) {
      window.history.replaceState(null, '', `#${page}`)
    }
  }, [page])

  const renderPage = () => {
    switch (page) {
      case 'how': return <HowPage />
      case 'discover': return <DiscoverPage />
      case 'join': return <JoinPage />
      case 'login':
      case 'signin': return <LoginPage setPage={setPage} />
      default: return <HomePage setPage={setPage} />
    }
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <div className="wrap page-nav">
          <a className="brand" href="#home" onClick={(event) => { event.preventDefault(); setPage('home') }}>
            <span className="brand-mark"><i></i><i></i><i></i></span>Campus<span>Lend</span>
          </a>
          <nav className="page-nav-links" aria-label="Main navigation">
            <button className={`page-toggle ${page === 'home' ? 'active' : ''}`} type="button" onClick={() => setPage('home')}>Home</button>
            <button className={`page-toggle ${page === 'how' ? 'active' : ''}`} type="button" onClick={() => setPage('how')}>How it works</button>
            <button className={`page-toggle ${page === 'discover' ? 'active' : ''}`} type="button" onClick={() => setPage('discover')}>Explore gear</button>
            <button className={`page-toggle ${page === 'join' ? 'active' : ''}`} type="button" onClick={() => setPage('join')}>Join</button>
          </nav>
        </div>
      </header>

      <div className="page-content">{renderPage()}</div>

      <footer className="footer">
        <div className="wrap footer-inner">
          <a className="brand" href="#home" onClick={(event) => { event.preventDefault(); setPage('home') }}>
            <span className="brand-mark"><i></i><i></i><i></i></span>Campus<span>Lend</span>
          </a>
          <p>© 2026 CampusLend. Made for better campuses.</p>
          <div><a href="#terms">Terms</a><a href="#privacy">Privacy</a><a href="#contact">Contact</a></div>
        </div>
      </footer>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
