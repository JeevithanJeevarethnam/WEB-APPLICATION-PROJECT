import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const Arrow = () => <span className="arrow">↗</span>

function HomePage({ setPage, scrollToSection }) {
  return (
    <>
      <section className="hero">
        <nav className="nav wrap">
          <a className="brand" href="#top"><span className="brand-mark"><i></i><i></i><i></i></span>Campus<span>Lend</span></a>
          <div className="nav-links"><button type="button" onClick={() => scrollToSection('how')}>How it works</button><button type="button" onClick={() => scrollToSection('discover')}>Explore gear</button><button type="button" onClick={() => scrollToSection('impact')}>Our impact</button></div>
          <div className="nav-actions">
            <button className="login" type="button" onClick={() => setPage('signin')}>Log in</button>
            <button className="button button-small" type="button" onClick={() => setPage('join')}>Join your campus <Arrow /></button>
          </div>
        </nav>

        <div className="hero-content wrap" id="top">
          <div className="hero-copy">
            <p className="eyebrow"><b></b> THE CAMPUS GEAR LIBRARY</p>
            <h1>Make more.<br /><em>Own less.</em></h1>
            <p className="lead">The easy way for students and departments to lend, borrow, and get more from the equipment your campus already has.</p>
            <div className="hero-buttons"><button className="button" type="button" onClick={() => scrollToSection('discover')}>Browse equipment <Arrow /></button><button className="text-link" type="button" onClick={() => scrollToSection('how')}><span className="play">▶</span> See how it works</button></div>
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

const demoItems = [
  { id: 1, name: 'Sony a6400 camera kit', category: 'Photo & video', description: 'Mirrorless camera, lens, battery and charger.', location: 'Media Lab · Room 204', imageEmoji: '📷', conditionLabel: 'Excellent condition', available: true },
  { id: 2, name: 'Podcast microphone set', category: 'Music & audio', description: 'Two USB microphones, stands, headphones and pop filters.', location: 'Student Union · Desk 3', imageEmoji: '🎙️', conditionLabel: 'Ready today', available: true },
  { id: 3, name: 'Four-person camping tent', category: 'Outdoor & events', description: 'Weatherproof tent with groundsheet and lantern.', location: 'Outdoor Centre · Gear desk', imageEmoji: '⛺', conditionLabel: 'Good condition', available: true },
  { id: 4, name: 'Projector and screen', category: 'Events', description: 'Portable 1080p projector, HDMI cable and screen.', location: 'Library · Equipment desk', imageEmoji: '📽️', conditionLabel: 'Ready today', available: true },
]

function DiscoverPage() {
  const [items, setItems] = useState(demoItems)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('All')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    fetch('/api/items').then((response) => response.ok ? response.json() : Promise.reject()).then(setItems).catch(() => {})
  }, [])

  const categories = ['All', ...new Set(items.map((item) => item.category))]
  const visibleItems = filter === 'All' ? items : items.filter((item) => item.category === filter)
  const requestItem = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const payload = Object.fromEntries(form)
    try {
      const response = await fetch('/api/reservations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const result = await response.json()
      setNotice(result.message || 'Your request has been sent.')
      if (response.ok) setSelected(null)
    } catch {
      setNotice('Your request is saved for now. Connect MySQL to submit it to the campus team.')
      setSelected(null)
    }
  }
  return (
    <section className="wrap page-card">
      <p className="eyebrow dark"><b></b> EXPLORE GEAR</p>
      <h2>Find the right tool for the moment.</h2>
      <p>CampusLend brings together cameras, microphones, tents, field kits, and more from departments and student groups.</p>
      <div className="catalog-filters" aria-label="Filter equipment">{categories.map((category) => <button type="button" className={filter === category ? 'active' : ''} key={category} onClick={() => setFilter(category)}>{category}</button>)}</div>
      {notice && <p className="form-success" role="status">{notice}</p>}
      <div className="item-grid">
        {visibleItems.map((item) => <article className="item-card" key={item.id}><div className="item-emoji">{item.imageEmoji}</div><span className="item-category">{item.category}</span><h3>{item.name}</h3><p>{item.description}</p><small>{item.location} · {item.conditionLabel}</small><button className="button" type="button" disabled={!item.available} onClick={() => { setNotice(''); setSelected(item) }}>{item.available ? 'Request item' : 'Unavailable'} <Arrow /></button></article>)}
      </div>
      {selected && <div className="reservation-panel"><div><p className="eyebrow dark"><b></b> BORROW {selected.name.toUpperCase()}</p><h3>Tell us when you need it.</h3></div><button className="close-button" type="button" onClick={() => setSelected(null)} aria-label="Close request form">×</button><form className="reservation-form" onSubmit={requestItem}><input type="hidden" name="itemId" value={selected.id} /><label>Name<input required name="borrowerName" placeholder="Your name" /></label><label>Campus email<input required name="email" type="email" placeholder="you@campus.edu" /></label><label>Pickup date<input required name="startDate" type="date" /></label><label>Return date<input required name="endDate" type="date" /></label><label className="wide-label">Note (optional)<textarea name="notes" placeholder="Anything the gear desk should know?" /></label><button className="button" type="submit">Send request <Arrow /></button></form></div>}
    </section>
  )
}

function JoinPage() {
  const [submitted, setSubmitted] = useState(false)
  return (
    <section className="wrap page-card">
      <p className="eyebrow dark"><b></b> JOIN THE MOVEMENT</p>
      <h2>Your campus can share more with less effort.</h2>
      <p>Bring your club, department, or student organization into a smarter gear-sharing system with a simple onboarding flow for new members.</p>
      <form className="auth-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}>
        <label><span>Campus email</span><input required type="email" placeholder="you@campus.edu" /></label>
        <button className="button" type="submit">Create your free account <Arrow /></button>
      </form>
      {submitted && <p className="form-success" role="status">Thanks — we’ll send your campus setup link shortly.</p>}
    </section>
  )
}

function LoginPage({ setPage }) {
  const [message, setMessage] = useState('')
  return (
    <section className="wrap page-card auth-card">
      <p className="eyebrow dark"><b></b> SIGN IN</p>
      <h2>Welcome back to CampusLend.</h2>
      <p>Use your campus email to access your borrowed gear, requests, and account details.</p>
      <form className="auth-form" onSubmit={(event) => { event.preventDefault(); setMessage('You’re signed in! Your gear dashboard is being prepared.') }}>
        <label>
          <span>Email</span>
          <input required type="email" placeholder="you@campus.edu" />
        </label>
        <label>
          <span>Password</span>
          <input required type="password" placeholder="Enter your password" />
        </label>
        <button className="button" type="submit">Sign in <Arrow /></button>
      </form>
      {message && <p className="form-success" role="status">{message}</p>}
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

  const scrollToSection = (id) => {
    if (page !== 'home') setPage('home')
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), page === 'home' ? 0 : 60)
  }

  const renderPage = () => {
    switch (page) {
      case 'how': return <HowPage />
      case 'discover': return <DiscoverPage />
      case 'join': return <JoinPage />
      case 'login':
      case 'signin': return <LoginPage setPage={setPage} />
      default: return <HomePage setPage={setPage} scrollToSection={scrollToSection} />
    }
  }

  return (
    <main className="page-shell">
      {page !== 'home' && <header className="page-header">
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
      </header>}

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
