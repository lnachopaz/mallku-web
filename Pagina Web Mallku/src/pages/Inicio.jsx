import { useState, useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { CFG, COFFEES, ORDER } from '../config'

// ── SVG helpers ──────────────────────────────────────────────
const IcTueste     = () => <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c2 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1.5.7-2.8 1.5-3.7C10 8.5 11 6 12 3z"/></svg>
const IcAcidez     = () => <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c3.5 4 6 6.6 6 10a6 6 0 0 1-12 0c0-3.4 2.5-6 6-10z"/></svg>
const IcCuerpo     = () => <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h11v5a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5z"/><path d="M16 9h2.5a2.5 2.5 0 0 1 0 5H16"/><path d="M7 5c0-1 .5-1.5.5-2.5M11 5c0-1 .5-1.5.5-2.5"/></svg>
const IcIntensidad = () => <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>
const IcNotas      = () => <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="7"/><path d="M12 13l3-3M9 4h6"/></svg>

const LEVELS = [
  { key:'tueste',     label:'Tueste',     Icon:IcTueste },
  { key:'acidez',     label:'Acidez',     Icon:IcAcidez },
  { key:'cuerpo',     label:'Cuerpo',     Icon:IcCuerpo },
  { key:'intensidad', label:'Intensidad', Icon:IcIntensidad },
]

function wordFor(v){ if(v<35) return 'Bajo'; if(v<55) return 'Medio'; if(v<78) return 'Alto'; return 'Muy alto'; }

// ── Tarjeta de café: al hacer clic se estira a toda la fila (order:-1 la manda
// al inicio de la grilla y el resto se reordena después) mostrando el perfil ──
// La clase "in" (animación de aparición) la maneja React acá adentro, NO el observer global:
// si la agregara el observer con classList, React la pisaría al re-renderizar la tarjeta
// (al expandir/cerrar) y la tarjeta desaparecería. Además así las tarjetas que se montan
// de nuevo al cambiar de filtro también se animan bien.
function TarjetaCafe({ c, keyName, index, expanded, onToggle, irATienda }) {
  const cardRef = useRef(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setRevealed(true); io.disconnect() } },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Al expandirse la tarjeta se mueve al inicio de la grilla: la acompañamos con
  // scroll suave DESPUÉS de que termine la view transition (~600ms), para no pelearle
  useEffect(() => {
    if (!expanded) return
    const t = setTimeout(() => cardRef.current?.scrollIntoView({ behavior:'smooth', block:'nearest' }), 650)
    return () => clearTimeout(t)
  }, [expanded])

  return (
    <article
      ref={cardRef}
      className={`card${expanded ? ' expanded' : ''}${revealed ? ' in' : ''}`}
      data-reveal="self"
      data-continent={c.continent}
      style={{ '--accent': c.accent, transitionDelay: `${(index % 3) * 0.09}s`, viewTransitionName: `card-${keyName}` }}
    >
      <div className="card-main">
        <div className="card-top">
          <span className="card-badge">Origen único</span>
          <span className="card-num">0{ORDER.indexOf(keyName) + 1}</span>
        </div>

        <figure className="card-photo" onClick={() => onToggle(keyName)}>
          <img className="ph-main" src={c.foto} alt={`Bolsa de café Mallku ${c.name} · ${c.region}`} loading="lazy" />
          <img className="ph-nota" src={c.notaFoto} alt={`Nota de cata de ${c.name}`} loading="lazy" />
          <span className="card-flip-hint"><IcNotas /> {expanded ? 'Cerrar perfil' : 'Ver perfil'}</span>
        </figure>

        <h3>{c.name} <em>{c.region}</em></h3>
        <p className="card-desc">{c.desc}</p>

        <div className="card-notes">
          <span className="eyebrow-mini">Notas de cata</span>
          <p className="notes-text">{c.notes}</p>
        </div>

        <div className="meta">
          <div><span className="k">Proceso</span><span className="v">{c.proceso}</span></div>
          <div><span className="k">Altura</span><span className="v">{c.altura} msnm</span></div>
          <div><span className="k">Tueste</span><span className="v">{c.tueste}</span></div>
        </div>

        <div className="card-actions">
          <button className="card-perfil" onClick={() => onToggle(keyName)}>
            {expanded ? 'Cerrar perfil' : 'Ver perfil'} <span>{expanded ? '✕' : '→'}</span>
          </button>
          <button className="card-buy" onClick={irATienda}>
            Comprar
          </button>
        </div>
      </div>

      {/* Perfil completo: aparece suave a la derecha al expandir */}
      {expanded && (
        <div className="card-detail">
          <button className="cd-close" onClick={() => onToggle(keyName)} aria-label="Cerrar perfil">✕</button>
          <span className="eyebrow-mini">El perfil</span>
          <h4 className="cd-name">{c.name}</h4>
          <div className="cd-region">{c.region}</div>
          <p className="cd-desc">{c.desc}</p>

          <div className="exp-icons">
            <div className="ic"><IcNotas/><div><small>Notas</small><b>{c.notaPrincipal}</b></div></div>
            <div className="ic"><IcTueste/><div><small>Tueste</small><b>{c.tueste}</b></div></div>
            <div className="ic"><IcCuerpo/><div><small>Proceso</small><b>{c.proceso}</b></div></div>
          </div>

          <div className="bars cd-bars">
            {LEVELS.map(({ key, label, Icon }) => (
              <div className="bar" key={key}>
                <div className="bar-head">
                  <span className="name"><Icon/>{label}</span>
                  <span className="val">{wordFor(c.levels[key])}</span>
                </div>
                <div className="track">
                  <div className="fill" style={{ '--w': `${c.levels[key]}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}

// ── Reveal hook ──────────────────────────────────────────────
function useReveal(ref) {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target) } }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    const el = ref.current
    if(!el) return
    // Las tarjetas de café ([data-reveal="self"]) manejan su propia aparición con estado de React
    el.querySelectorAll('[data-reveal]:not([data-reveal="self"])').forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [ref])
}

// ── Componente principal ─────────────────────────────────────
export default function Inicio() {
  const navigate = useNavigate()
  const pageRef  = useRef(null)

  const [filter,      setFilter]      = useState('todos')
  const [expandedKey, setExpandedKey] = useState(null)  // café con el perfil abierto
  const [newsOk,      setNewsOk]      = useState(false)

  useReveal(pageRef)

  // Anima el reacomodo de las tarjetas con la View Transitions API: el navegador
  // "fotografía" el antes y el después y desliza cada tarjeta a su nueva posición.
  // En navegadores sin soporte, simplemente aplica el cambio directo.
  const conTransicion = (update) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => flushSync(update))
    } else {
      update()
    }
  }

  const toggleCoffee = (key) =>
    conTransicion(() => setExpandedKey((prev) => (prev === key ? null : key)))

  const cambiarFiltro = (val) =>
    conTransicion(() => { setFilter(val); setExpandedKey(null) })

  const irATienda = () => navigate('/tienda')

  const filteredOrder = ORDER.filter((k) => filter === 'todos' || COFFEES[k].continent === filter)

  return (
    <div ref={pageRef}>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="hero" id="inicio">
        {/* Foto fija de fondo */}
        <div className="hero-photo-bg">
          {/* En celular usamos una foto vertical donde las bolsas son protagonistas */}
          <picture>
            <source media="(max-width:860px)" srcSet="/img/hero-corazon-bolsas.webp" />
            <img
              src="/img/hero-full-manos-prensa.webp"
              alt="Bolsas de café Mallku al aire libre, con las sierras de Tucumán de fondo"
              fetchPriority="high"
            />
          </picture>
          <div className="hero-photo-overlay" aria-hidden="true" />
        </div>

        <div className="wrap hero-photo-content">
          <span className="eyebrow" data-reveal>Café de especialidad</span>
          <h1 className="hero-title" data-reveal style={{ transitionDelay:'.08s' }}>
            Tostado en Tucumán<br/> <em>Hecho para explorar</em>
          </h1>
          <p className="hero-sub" data-reveal style={{ transitionDelay:'.16s' }}>
            Creemos en el café que te hace pausar y respirar hondo. Seleccionamos granos excepcionales de todo el mundo y los tostamos con paciencia en Yerba Buena, buscando resaltar su dulzor natural y su frescura. Un café limpio y lleno de vida, pensado tanto para tu cocina de todos los días como para tu próxima aventura al aire libre.
          </p>
          <div className="hero-actions" data-reveal style={{ transitionDelay:'.24s' }}>
            <button className="btn btn-primary" onClick={() => document.getElementById('cafes')?.scrollIntoView({ behavior:'smooth' })}>
              Descubrí nuestros cafés <span className="arrow">→</span>
            </button>
            <Link className="btn btn-light" to="/sobre-nosotros">
              Nuestra historia
            </Link>
          </div>
          <div className="hero-scroll" data-reveal style={{ transitionDelay:'.36s' }}>
            <span className="line"/>
            Bajá para explorar
          </div>
        </div>
      </section>

      {/* ══ MARQUEE (cinta infinita: dos grupos idénticos, cada uno se desplaza -100% de su propio ancho) ══ */}
      <div className="strip" aria-hidden="true">
        <div className="marquee">
          {[0, 1].map((g) => (
            <div className="marquee-group" key={g}>
              {[...ORDER, ...ORDER].map((k, i) => (
                <span key={`${k}-${i}`}>{COFFEES[k].name} · {COFFEES[k].region}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ══ CAFÉS / PRODUCTOS ═════════════════════════════════ */}
      <section className="section alt" id="cafes">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow">Nuestros orígenes</span>
            <h2>Una geografía en cada bolsa</h2>
            <p>Single origins seleccionados a mano y tostados para revelar el carácter de su tierra. Hacé clic en una bolsa y abrí su perfil completo: tueste, acidez, cuerpo e intensidad.</p>
          </div>

          {/* Filtros */}
          <div className="filters" data-reveal>
            {[['todos','Todos'],['america','América'],['africa','África']].map(([val,label]) => (
              <button key={val} className={`chip${filter===val?' active':''}`} onClick={() => cambiarFiltro(val)}>
                {label}
              </button>
            ))}
          </div>

          {/* Grilla */}
          <div className="grid">
            {filteredOrder.map((key, i) => (
              <TarjetaCafe
                key={key}
                keyName={key}
                c={COFFEES[key]}
                index={i}
                expanded={expandedKey === key}
                onToggle={toggleCoffee}
                irATienda={irATienda}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══ NEGOCIOS: MAYORISTA & CAPACITACIONES (resumen) ═════ */}
      <section className="section alt" id="negocios">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow">Mallku para negocios</span>
            <h2>Más allá de la taza</h2>
            <p>Invitamos a los curiosos del café a vivir nuestras catas y experiencias, y acompañamos a cafeterías con soporte técnico real.</p>
          </div>

          <div className="biz-grid">
            {/* Catas & Experiencia Mallku */}
            <Link className="biz-card" to="/experiencia" data-reveal>
              <div className="biz-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 8h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/>
                  <path d="M16 9h2.5a2.5 2.5 0 0 1 0 5H16"/>
                  <path d="M8 4.5c0 1-.8 1.3-.8 2.3M11.5 4.5c0 1-.8 1.3-.8 2.3"/>
                </svg>
              </div>
              <span className="biz-tag">Catas & experiencias</span>
              <h3>Viví la experiencia Mallku: catas guiadas de nuestros orígenes</h3>
              <p>Encuentros sensoriales en nuestro espacio de Yerba Buena: catas guiadas, talleres de métodos y eventos especiales alrededor del café.</p>
              <span className="biz-card-link">Ver más <span>→</span></span>
            </Link>

            {/* Mayorista & Cafeterías */}
            <Link className="biz-card" to="/mayorista" data-reveal style={{ transitionDelay:'.1s' }}>
              <div className="biz-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 3h10l-2 7H9z"/>
                  <path d="M9 10v4a3 3 0 0 0 6 0v-4"/>
                  <path d="M10.5 17h3v4h-3z"/>
                </svg>
              </div>
              <span className="biz-tag">Mayorista & cafeterías</span>
              <h3>¿Tenés una cafetería? Llevá Mallku a tu tolva</h3>
              <p>Precios mayoristas, tostado fresco programado para tu barra y acompañamiento técnico de verdad.</p>
              <span className="biz-card-link">Ver más <span>→</span></span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ CTA BAND ══════════════════════════════════════════ */}
      <section className="cta-band">
        <div className="ghost-word">Mallku</div>
        <div className="wrap inner">
          <span className="eyebrow" data-reveal>El ritual</span>
          <h2 data-reveal style={{ transitionDelay:'.08s' }}>
            Llevá la <em>altura</em> a tu taza
          </h2>
          <button className="btn btn-primary" data-reveal style={{ transitionDelay:'.16s' }} onClick={irATienda}>
            Pedí tu café <span className="arrow">→</span>
          </button>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════ */}
      <footer className="footer" id="contacto">
        <div className="wrap">
          <div className="footer-grid footer-grid-4">
            {/* Col 1: Brand */}
            <div>
              <button className="brand" onClick={() => window.scrollTo({ top:0, behavior:'smooth' })} style={{ marginBottom:0 }}>
                <img className="mark" src="/img/logo.png" alt="" width="42" height="42" />
                <span className="word"><b>Mallku</b><span>TOSTADORES DE CAFÉ</span></span>
              </button>
              <p className="f-about">Café de especialidad tostado con precisión en Tucumán, Argentina. Granos seleccionados en origen, con el espíritu de las cumbres en cada lote.</p>
              <div className="socials">
                <a href={CFG.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s0-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zm0 1.8c-3.14 0-3.5 0-4.74.07-.9.04-1.38.19-1.7.32-.43.16-.74.36-1.06.68-.32.32-.52.63-.68 1.06-.13.32-.28.8-.32 1.7C3.8 8.5 3.8 8.86 3.8 12s0 3.5.07 4.74c.04.9.19 1.38.32 1.7.16.43.36.74.68 1.06.32.32.63.52 1.06.68.32.13.8.28 1.7.32 1.24.07 1.6.07 4.74.07s3.5 0 4.74-.07c.9-.04 1.38-.19 1.7-.32.43-.16.74-.36 1.06-.68.32-.32.52-.63.68-1.06.13-.32.28-.8.32-1.7.07-1.24.07-1.6.07-4.74s0-3.5-.07-4.74c-.04-.9-.19-1.38-.32-1.7a2.85 2.85 0 0 0-.68-1.06 2.85 2.85 0 0 0-1.06-.68c-.32-.13-.8-.28-1.7-.32C15.5 4 15.14 4 12 4zm0 3.06A4.94 4.94 0 1 1 12 17a4.94 4.94 0 0 1 0-9.88zm0 1.8a3.14 3.14 0 1 0 0 6.28 3.14 3.14 0 0 0 0-6.28zM17.84 6.6a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3z"/></svg>
                </a>
                <a href={`https://wa.me/${CFG.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                </a>
                <a href={`mailto:${CFG.email}`} aria-label="Email">
                  <svg viewBox="0 0 24 24"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.1L4.3 7h15.4L12 12.1zM4 8.6V17h16V8.6l-7.4 4.9a1 1 0 0 1-1.2 0L4 8.6z"/></svg>
                </a>
              </div>
            </div>

            {/* Col 2: Explorar */}
            <div>
              <h5>Explorar</h5>
              <ul>
                <li><Link to="/sobre-nosotros">Nosotros</Link></li>
                <li><button onClick={() => document.getElementById('cafes')?.scrollIntoView({ behavior:'smooth' })}>Cafés</button></li>
                <li><Link to="/experiencia">Experiencia</Link></li>
                <li><Link to="/mayorista">Mayorista</Link></li>
              </ul>
            </div>

            {/* Col 3: Orígenes */}
            <div>
              <h5>Orígenes</h5>
              <ul>
                {ORDER.map((key) => (
                  <li key={key}>
                    <Link to="/tienda">{COFFEES[key].name} · {COFFEES[key].region}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Newsletter */}
            <div className="news">
              <h5>Sumate al ritual</h5>
              <p>Nuevos lotes, ediciones de temporada y notas de cata. Sin spam, solo buen café.</p>
              <form onSubmit={(e) => { e.preventDefault(); setNewsOk(true); e.target.reset() }}>
                <input type="email" placeholder="Tu correo electrónico" required aria-label="Correo electrónico"/>
                <button type="submit" aria-label="Suscribirme">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </form>
              <div className="ok">{newsOk ? '¡Gracias! Te sumaste al ritual Mallku ☕' : ''}</div>
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
