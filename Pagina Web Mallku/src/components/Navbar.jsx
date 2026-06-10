import { useState, useEffect } from 'react'

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export default function Navbar({ paginaActual, navegar, totalItems, onCartClick }) {
  const [scrolled,    setScrolled]    = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)

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

  const irYCerrar = (pagina) => { navegar(pagina); cerrarMenu() }
  const scrollYCerrar = (id) => { cerrarMenu(); setTimeout(() => scrollTo(id), 100) }

  const esTienda = paginaActual === 'tienda'

  return (
    <>
      <header className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="wrap nav-inner">

          {/* Logo */}
          <button className="brand" onClick={() => navegar('inicio')} aria-label="Mallku inicio">
            <img className="mark" src="/img/logo.png" alt="" width="42" height="42" />
            <span className="word"><b>Mallku</b><span>TOSTADORES DE CAFÉ</span></span>
          </button>

          {/* Links desktop */}
          <nav className="nav-links" aria-label="Navegación principal">
            {esTienda ? (
              <>
                <button onClick={() => navegar('inicio')}>Inicio</button>
                <button onClick={() => { navegar('inicio'); setTimeout(() => scrollTo('origen'), 300) }}>Origen</button>
                <button onClick={() => scrollTo('catalogo')}>Tienda</button>
                <button onClick={() => { navegar('inicio'); setTimeout(() => scrollTo('contacto'), 300) }}>Contacto</button>
              </>
            ) : (
              <>
                <a href="#origen"      onClick={(e) => { e.preventDefault(); scrollTo('origen') }}>Origen</a>
                <a href="#cafes"       onClick={(e) => { e.preventDefault(); scrollTo('cafes') }}>Cafés</a>
                <a href="#experiencia" onClick={(e) => { e.preventDefault(); scrollTo('experiencia') }}>Experiencia</a>
                <a href="#contacto"    onClick={(e) => { e.preventDefault(); scrollTo('contacto') }}>Contacto</a>
              </>
            )}
          </nav>

          {/* CTA derecha */}
          <div className="nav-cta">
            {esTienda ? (
              <button className="cart-btn" onClick={onCartClick} aria-label={`Carrito · ${totalItems} ítems`}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 7h12l1.2 12.2a1 1 0 0 1-1 1.1H5.8a1 1 0 0 1-1-1.1L6 7z" strokeLinejoin="round"/>
                  <path d="M9 7a3 3 0 0 1 6 0" strokeLinecap="round"/>
                </svg>
                <span className={`cart-badge${totalItems > 0 ? ' show' : ''}`}>{totalItems}</span>
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => navegar('tienda')}>
                Ir a la tienda <span className="arrow">→</span>
              </button>
            )}
            <button className="nav-toggle" onClick={toggleMenu} aria-label="Abrir menú" aria-expanded={menuAbierto}>
              <span/><span/><span/>
            </button>
          </div>

        </div>
      </header>

      {/* Menú mobile */}
      <div className={`nav-mobile${menuAbierto ? ' open' : ''}`} aria-hidden={!menuAbierto}>
        {esTienda ? (
          <>
            <button onClick={() => irYCerrar('inicio')}>Inicio</button>
            <button onClick={() => { irYCerrar('inicio'); setTimeout(() => scrollTo('origen'), 300) }}>Origen</button>
            <button onClick={() => { cerrarMenu(); setTimeout(() => scrollTo('catalogo'), 100) }}>Tienda</button>
            <button onClick={() => { irYCerrar('inicio'); setTimeout(() => scrollTo('contacto'), 300) }}>Contacto</button>
          </>
        ) : (
          <>
            <button onClick={() => scrollYCerrar('origen')}>Origen</button>
            <button onClick={() => scrollYCerrar('cafes')}>Cafés</button>
            <button onClick={() => scrollYCerrar('experiencia')}>Experiencia</button>
            <button onClick={() => scrollYCerrar('contacto')}>Contacto</button>
            <button className="btn btn-light" onClick={() => irYCerrar('tienda')}>Ir a la tienda</button>
          </>
        )}
      </div>
    </>
  )
}
