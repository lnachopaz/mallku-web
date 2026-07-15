import { useState } from 'react'
import { fmt, COFFEES, ORDER, MOLIENDAS, ACCESORIOS, ORDEN_ACCESORIOS } from '../config'
import useReveal from '../hooks/useReveal'
import Footer from '../components/Footer'
import MoliendaGuide from '../components/MoliendaGuide'

// ── Tarjeta de producto ───────────────────────────────────────
function TarjetaProducto({ producto, index, agregarAlCarrito, onAbrirGuia }) {
  const [molienda, setMolienda] = useState('')
  const [qty,      setQty]      = useState(1)
  const [added,    setAdded]    = useState(false)
  const [warn,     setWarn]     = useState(false)

  const handleAgregar = () => {
    if (!molienda) { setWarn(true); return }
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

        <div className="field-label">Molienda <span className="req">*</span></div>
        <div className={`select-wrap${warn && !molienda ? ' warn' : ''}`}>
          <select
            value={molienda}
            onChange={(e) => { setMolienda(e.target.value); setWarn(false) }}
            aria-label="Elegí el tipo de molienda"
            required
          >
            <option value="" disabled>Elegí tu molienda…</option>
            {MOLIENDAS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        {warn && !molienda && <div className="select-hint">Elegí la molienda para poder agregarlo.</div>}
        <button
          type="button"
          className="molienda-help"
          onClick={() => onAbrirGuia((valor) => { setMolienda(valor); setWarn(false) })}
        >
          ¿No sabés cuál elegir? <span>→</span>
        </button>

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

// ── Tarjeta de accesorio (sin molienda; selector de tamaño/modelo) ──
function TarjetaAccesorio({ producto, index, agregarAlCarrito }) {
  const [varianteId, setVarianteId] = useState('')
  const [qty,         setQty]       = useState(1)
  const [added,       setAdded]     = useState(false)
  const [warn,        setWarn]      = useState(false)

  const variante   = producto.variantes.find((v) => v.id === varianteId)
  const primeraVar = producto.variantes[0]

  const handleAgregar = () => {
    if (!variante) { setWarn(true); return }
    agregarAlCarrito({
      id:       `${producto.key}__${variante.id}`,
      key:      producto.key,
      name:     producto.name,
      variante: variante.label,
      accent:   producto.accent,
      foto:     producto.foto,
      qty,
      price:    variante.price,
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
        <img src={producto.foto} alt={producto.name} loading="lazy" />
      </figure>

      {/* Sello */}
      <div className="shop-stamp">
        <div className="s-badge">Accesorio</div>
        <h3>{producto.name}</h3>
      </div>

      {/* Cuerpo */}
      <div className="shop-body">
        <p className="shop-desc">{producto.desc}</p>

        <div className="shop-price">
          {fmt(variante ? variante.price : primeraVar.price)}
          <small>{variante ? variante.label : `desde ${primeraVar.label}`}</small>
        </div>

        <div className="field-label">Elegí el tamaño <span className="req">*</span></div>
        <div className={`select-wrap${warn && !variante ? ' warn' : ''}`}>
          <select
            value={varianteId}
            onChange={(e) => { setVarianteId(e.target.value); setWarn(false) }}
            aria-label={`Elegí el tamaño de ${producto.name}`}
            required
          >
            <option value="" disabled>Elegí una opción…</option>
            {producto.variantes.map((v) => (
              <option key={v.id} value={v.id}>{v.label} — {fmt(v.price)}</option>
            ))}
          </select>
        </div>
        {warn && !variante && <div className="select-hint">Elegí una opción para poder agregarlo.</div>}

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

  // Filtro de catálogo: todos | cafes | accesorios
  const [cat, setCat] = useState('todos')

  // Guarda la función "aplicar molienda" de la tarjeta que abrió la guía (o null si está cerrada)
  const [aplicarMolienda, setAplicarMolienda] = useState(null)
  const abrirGuia  = (setter) => setAplicarMolienda(() => setter)
  const cerrarGuia = () => setAplicarMolienda(null)
  const elegirEnGuia = (molienda) => { aplicarMolienda?.(molienda); cerrarGuia() }

  return (
    <div ref={pageRef}>

      {/* Encabezado */}
      <section className="shop-hero">
        <div className="wrap">
          <span className="eyebrow" data-reveal>Tienda · Tostado en Tucumán</span>
          <h1 data-reveal style={{ transitionDelay:'.08s' }}>Elegí tu <em>altura</em></h1>
          <p data-reveal style={{ transitionDelay:'.16s' }}>
            Café de especialidad tostado en pequeños lotes. Seleccioná tu origen, la molienda exacta para tu método, y armá tu pedido.
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

      {/* Filtros de catálogo */}
      <section className="shop-filterbar">
        <div className="wrap">
          <div className="filters" data-reveal>
            {[['todos','Todos'],['cafes','Cafés en grano'],['accesorios','Accesorios']].map(([val,label]) => (
              <button key={val} className={`chip${cat===val?' active':''}`} onClick={() => setCat(val)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Catálogo de cafés */}
      {cat !== 'accesorios' && (
        <section className="shop" id="catalogo">
          <div className="wrap">
            <div className="section-head" data-reveal>
              <span className="eyebrow">Single origins</span>
              <h2>Cafés en grano</h2>
              <p>Cinco orígenes, cinco personalidades. Elegí tu molienda exacta y lo tostamos fresco para tu método.</p>
            </div>
            <div className="shop-grid">
              {ORDER.map((key, i) => (
                <TarjetaProducto
                  key={key}
                  producto={{ ...COFFEES[key], key }}
                  index={i}
                  agregarAlCarrito={agregarAlCarrito}
                  onAbrirGuia={abrirGuia}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Accesorios */}
      {cat !== 'cafes' && (
        <section className="shop accesorios" id="accesorios">
          <div className="wrap">
            <div className="section-head" data-reveal>
              <span className="eyebrow">Para tu ritual</span>
              <h2>Accesorios para preparar en casa</h2>
              <p>Todo lo que necesitás para extraer lo mejor de tu café, elegido para acompañar cada método.</p>
            </div>
            <div className="shop-grid">
              {ORDEN_ACCESORIOS.map((key, i) => (
                <TarjetaAccesorio
                  key={key}
                  producto={{ ...ACCESORIOS[key] }}
                  index={i}
                  agregarAlCarrito={agregarAlCarrito}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer/>

      <MoliendaGuide
        abierta={aplicarMolienda !== null}
        onCerrar={cerrarGuia}
        onElegir={elegirEnGuia}
      />

    </div>
  )
}
