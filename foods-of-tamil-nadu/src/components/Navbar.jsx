import { useState } from 'react'

export default function Navbar({ favouriteCount }) {
  const [menuOpen, setMenuOpen] = useState(false)

  function toggleMenu() {
    setMenuOpen(prev => !prev)
  }

  function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <header className="navbar" role="banner">
      <nav className="navbar__inner" aria-label="Main navigation">
        <a
          href="#"
          className="navbar__brand"
          onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        >
          <span className="navbar__brand-icon" aria-hidden="true">🍛</span>
          <span className="navbar__brand-text">Flavours of Tamil Nadu</span>
        </a>

        {/* Desktop links */}
        <ul className="navbar__links" role="list">
          <li>
            <button className="navbar__link" onClick={() => scrollToSection('discover')}>
              Discover
            </button>
          </li>
          <li>
            <button
              className="navbar__link navbar__link--favourites"
              onClick={() => scrollToSection('discover')}
              aria-label={`Favourites — ${favouriteCount} saved`}
            >
              <span aria-hidden="true">♥</span>
              <span>Favourites</span>
              {favouriteCount > 0 && (
                <span className="navbar__badge" aria-live="polite">{favouriteCount}</span>
              )}
            </button>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className={`navbar__hamburger${menuOpen ? ' is-open' : ''}`}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={toggleMenu}
        >
          <span className="navbar__hamburger-bar" aria-hidden="true" />
          <span className="navbar__hamburger-bar" aria-hidden="true" />
          <span className="navbar__hamburger-bar" aria-hidden="true" />
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div
        id="mobile-menu"
        className={`navbar__mobile-menu${menuOpen ? ' is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <ul role="list">
          <li>
            <button className="navbar__mobile-link" onClick={() => scrollToSection('discover')}>
              Discover
            </button>
          </li>
          <li>
            <button
              className="navbar__mobile-link navbar__mobile-link--favourites"
              onClick={() => scrollToSection('discover')}
              aria-label={`Favourites — ${favouriteCount} saved`}
            >
              <span aria-hidden="true">♥</span> Favourites
              {favouriteCount > 0 && (
                <span className="navbar__badge">{favouriteCount}</span>
              )}
            </button>
          </li>
        </ul>
      </div>
    </header>
  )
}
