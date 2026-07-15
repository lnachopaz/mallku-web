import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { authEnabled } from '../supabase'

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export default function Navbar({ totalItems, onCartClick, user, onUserClick }) {
  const [scrolled,    setScrolled]    = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { pathname }  = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') setMenuAbierto(false) }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [])

  const cerrarMenu = () => {
    setMenuAbierto(false)
    document.body.style.overflow = ''
  }

  const toggleMenu = () => {
    const next = !menuAbierto
    setMenuAbierto(next)
    document.body.style.overflow = next ? 'hidden' : ''
  }

  const scrollYCerrar = (id) => { cerrarMenu(); setTimeout(() => scrollTo(id), 100) }

  // Cierra el menú mobile cada vez que cambia de página (sincroniza con el router, no con estado interno)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { cerrarMenu() }, [pathname])

  const esTienda  = pathname === '/tienda'

  return (
    <>
      <header className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="wrap nav-inner">

          {/* Logo */}
          <Link className="brand" to="/" aria-label="Mallku inicio">
            <img className="mark" src="/img/logo-mark.png" alt="" width="42" height="42" />
            <span className="word"><b>Mallku</b><span>TOSTADORES DE CAFÉ</span></span>
          </Link>

          {/* Links desktop */}
          <nav className="nav-links" aria-label="Navegación principal">
            <Link to="/">Inicio</Link>
            <Link to="/sobre-nosotros">Nosotros</Link>
            <Link to="/experiencia">Experiencia</Link>
            <Link to="/mayorista">Mayorista</Link>
            <a href="#contacto" onClick={(e) => { e.preventDefault(); scrollTo('contacto') }}>Contacto</a>
          </nav>

          {/* CTA derecha */}
          <div className="nav-cta">
            {authEnabled && (
              <button className="user-btn" onClick={onUserClick} aria-label={user ? 'Mi cuenta' : 'Ingresar'} title={user ? 'Mi cuenta' : 'Ingresar'}>
                {user ? (
                  <span className="user-initial">{(user.email || '?').charAt(0).toUpperCase()}</span>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="8" r="3.6"/>
                    <path d="M5 20c1.2-3.6 4-5.2 7-5.2s5.8 1.6 7 5.2" strokeLinecap="round"/>
                  </svg>
                )}
              </button>
            )}
            {esTienda ? (
              <button className="cart-btn" onClick={onCartClick} aria-label={`Carrito · ${totalItems} ítems`}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 7h12l1.2 12.2a1 1 0 0 1-1 1.1H5.8a1 1 0 0 1-1-1.1L6 7z" strokeLinejoin="round"/>
                  <path d="M9 7a3 3 0 0 1 6 0" strokeLinecap="round"/>
                </svg>
                <span key={totalItems} className={`cart-badge${totalItems > 0 ? ' show' : ''}`}>{totalItems}</span>
              </button>
            ) : (
              <Link className="btn btn-primary" to="/tienda">
                Ir a la tienda <span className="arrow">→</span>
              </Link>
            )}
            <button className="nav-toggle" onClick={toggleMenu} aria-label="Abrir menú" aria-expanded={menuAbierto}>
              <span/><span/><span/>
            </button>
          </div>

        </div>
      </header>

      {/* Menú mobile */}
      <div className={`nav-mobile${menuAbierto ? ' open' : ''}`} aria-hidden={!menuAbierto}>
        <Link to="/" onClick={cerrarMenu}>Inicio</Link>
        <Link to="/sobre-nosotros" onClick={cerrarMenu}>Nosotros</Link>
        <Link to="/experiencia" onClick={cerrarMenu}>Experiencia</Link>
        <Link to="/mayorista" onClick={cerrarMenu}>Mayorista</Link>
        <button onClick={() => scrollYCerrar('contacto')}>Contacto</button>
        {/* En mobile el CTA del navbar se oculta: este es el acceso a la tienda */}
        <Link className="btn btn-primary" to="/tienda" onClick={cerrarMenu}>
          Ir a la tienda <span className="arrow">→</span>
        </Link>
      </div>
    </>
  )
}
