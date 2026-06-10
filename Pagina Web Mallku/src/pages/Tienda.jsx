import { useState, useEffect, useRef } from 'react'
import { CFG, fmt, COFFEES, ORDER } from '../config'

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target) } }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    const el = ref.current
    if(!el) return
    el.querySelectorAll('[data-reveal]').forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])
  return ref
}

// ── Tarjeta de producto (fiel al tienda.html) ─────────────────
function TarjetaProducto({ producto, index, agregarAlCarrito }) {
  const [molienda, setMolienda] = useState('Grano')
  const [qty,      setQty]      = useState(1)
  const [added,    setAdded]    = useState(false)

  const handleAgregar = () => {
    agregarAlCarrito({
      id:       `${producto.key}__${molienda}`,
      key:      producto.key,
      name:     producto.name,
      region:   producto.region,
      accent:   producto.accent,
      molienda,
      qty,
      price:    producto.price,
    })
    setAdded(true)
    setTimeout(() => { setAdded(false); setQty(1) }, 1400)
  }

  return (
    <article
      className="shop-card"
      id={`p-${producto.key}`}
      data-reveal
      style={{ '--accent': producto.accent, transitionDelay: `${(index % 3) * 0.08}s` }}
    >
      {/* Foto del producto */}
      <figure className="shop-photo">
        <img src={producto.foto} alt={`Bolsa de café Mallku ${producto.name} · ${producto.region}`} loading="lazy" />
      </figure>

      {/* Sello de color */}
      <div className="shop-stamp">
        <div className="s-badge">Origen único · 250 g</div>
        <h3>{producto.name} <em>{producto.region}</em></h3>
        <div className="s-notes">{producto.notes}</div>
      </div>

      {/* Cuerpo */}
      <div className="shop-body">
        <div className="shop-meta">
          <div><span className="k">Proceso</span><span className="v">{producto.proceso}</span></div>
          <div><span className="k">Altura</span><span className="v">{producto.altura} msnm</span></div>
          <div><span className="k">Tueste</span><span className="v">{producto.tueste}</span></div>
        </div>

        <div className="shop-price">
          {fmt(producto.price)} <small>/ bolsa 250 g</small>
        </div>

        <div className="field-label">Molienda</div>
        <div className="molienda">
          {['Grano','Molido'].map((m) => (
            <button key={m} className={molienda===m?'active':''} onClick={() => setMolienda(m)}>
              {m==='Grano'?'Grano entero':'Molido'}
            </button>
          ))}
        </div>

        <div className="row">
          <div className="qty">
            <button onClick={() => setQty((v) => Math.max(1, v-1))} aria-label="Restar">−</button>
            <span>{qty}</span>
            <button onClick={() => setQty((v) => Math.min(99, v+1))} aria-label="Sumar">+</button>
          </div>
          <button className={`add${added?' added':''}`} onClick={handleAgregar} disabled={added}>
            {added ? '✓ Agregado' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </article>
  )
}

// ── Página Tienda ─────────────────────────────────────────────
export default function Tienda({ agregarAlCarrito }) {
  const pageRef = useReveal()

  return (
    <div ref={pageRef}>

      {/* Encabezado */}
      <section className="shop-hero">
        <div className="wrap">
          <span className="eyebrow" data-reveal>Tienda · Tostado en Tucumán</span>
          <h1 data-reveal style={{ transitionDelay:'.08s' }}>Elegí tu <em>altura</em>.</h1>
          <p data-reveal style={{ transitionDelay:'.16s' }}>
            Café de especialidad tostado en pequeños lotes. Seleccioná tu origen, en grano entero o molido para tu método, y armá tu pedido.
          </p>
          <div className="infobar" data-reveal style={{ transitionDelay:'.24s' }}>
            <div>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" strokeLinejoin="round"/>
                <circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/>
              </svg>
              Envíos a todo el país
            </div>
            <div>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 8h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" strokeLinejoin="round"/>
                <path d="M16 9h2.5a2.5 2.5 0 0 1 0 5H16"/>
                <path d="M8 4.5c0 1-.8 1.3-.8 2.3M11.5 4.5c0 1-.8 1.3-.8 2.3" strokeLinecap="round"/>
              </svg>
              Tostado fresco semanal
            </div>
            <div>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3l2.5 5 5.5.8-4 3.9 1 5.5-5-2.7-5 2.7 1-5.5-4-3.9 5.5-.8z" strokeLinejoin="round"/>
              </svg>
              Café de especialidad
            </div>
          </div>
        </div>
      </section>

      {/* Catálogo */}
      <section className="shop" id="catalogo">
        <div className="wrap">
          <div className="shop-grid">
            {ORDER.map((key, i) => (
              <TarjetaProducto
                key={key}
                producto={COFFEES[key]}
                index={i}
                agregarAlCarrito={agregarAlCarrito}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="contacto">
        <div className="wrap">
          <div className="footer-grid footer-grid-3">
            <div>
              <div className="brand" style={{ marginBottom:0 }}>
                <img className="mark" src="/img/logo.png" alt="" width="42" height="42" />
                <span className="word"><b>Mallku</b><span>TOSTADORES DE CAFÉ</span></span>
              </div>
              <p className="f-about">Café de especialidad tostado con altura en Tucumán, Argentina. Granos seleccionados de orígenes que vuelan tan alto como el cóndor.</p>
              <div className="socials">
                <a href={CFG.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s0-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zm0 1.8c-3.14 0-3.5 0-4.74.07-.9.04-1.38.19-1.7.32-.43.16-.74.36-1.06.68-.32.32-.52.63-.68 1.06-.13.32-.28.8-.32 1.7C3.8 8.5 3.8 8.86 3.8 12s0 3.5.07 4.74c.04.9.19 1.38.32 1.7.16.43.36.74.68 1.06.32.32.63.52 1.06.68.32.13.8.28 1.7.32 1.24.07 1.6.07 4.74.07s3.5 0 4.74-.07c.9-.04 1.38-.19 1.7-.32.43-.16.74-.36 1.06-.68.32-.32.52-.63.68-1.06.13-.32.28-.8.32-1.7.07-1.24.07-1.6.07-4.74s0-3.5-.07-4.74c-.04-.9-.19-1.38-.32-1.7a2.85 2.85 0 0 0-.68-1.06 2.85 2.85 0 0 0-1.06-.68c-.32-.13-.8-.28-1.7-.32C15.5 4 15.14 4 12 4zm0 3.06A4.94 4.94 0 1 1 12 17a4.94 4.94 0 0 1 0-9.88zm0 1.8a3.14 3.14 0 1 0 0 6.28 3.14 3.14 0 0 0 0-6.28zM17.84 6.6a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3z"/></svg>
                </a>
                <a href={`https://wa.me/${CFG.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <svg viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.8c2.17 0 4.2.85 5.74 2.38a8.08 8.08 0 0 1 2.38 5.73c0 4.48-3.65 8.12-8.13 8.12a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.12.82.83-3.04-.2-.31a8.04 8.04 0 0 1-1.24-4.28c0-4.48 3.65-8.12 8.13-8.12zm-2.47 4.3c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.27s.97 2.63 1.11 2.81c.14.18 1.9 2.9 4.6 3.96 2.25.89 2.71.71 3.2.67.49-.05 1.58-.65 1.8-1.27.22-.62.22-1.16.16-1.27-.07-.11-.25-.18-.52-.31-.27-.14-1.58-.78-1.83-.87-.25-.09-.43-.14-.61.14-.18.27-.7.86-.86 1.04-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.16-1.33-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.42.12-.55.12-.12.27-.32.4-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.6-1.49-.84-2.03-.22-.53-.44-.46-.61-.46h-.52z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <h5>Explorar</h5>
              <ul>
                <li><a href="#catalogo" onClick={(e) => { e.preventDefault(); document.getElementById('catalogo')?.scrollIntoView({ behavior:'smooth' }) }}>Tienda</a></li>
                <li><a href={`https://wa.me/${CFG.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
                <li><a href={CFG.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
              </ul>
            </div>

            <div>
              <h5>¿Dudas con tu pedido?</h5>
              <p className="f-about" style={{ marginTop:0 }}>Escribinos y te ayudamos a elegir tu café ideal según tu método de preparación.</p>
              <a
                href={`https://wa.me/${CFG.whatsapp}`}
                target="_blank" rel="noopener noreferrer"
                className="btn btn-light"
                style={{ marginTop:8, display:'inline-flex' }}
              >
                Hablar por WhatsApp
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Mallku · Tostadores de Café. Tostado con altura en Tucumán, Argentina.</span>
            <span><a href={CFG.instagram} target="_blank" rel="noopener noreferrer">@mallkucafe</a></span>
          </div>
        </div>
      </footer>

    </div>
  )
}
