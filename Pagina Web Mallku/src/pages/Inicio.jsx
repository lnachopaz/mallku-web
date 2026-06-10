import { useState, useEffect, useRef, useCallback } from 'react'
import { CFG, fmt, COFFEES, ORDER } from '../config'

// ── SVG helpers ──────────────────────────────────────────────
const Bean = ({ cls }) => (
  <svg className={`bean ${cls}`} viewBox="0 0 44 60">
    <ellipse cx="22" cy="30" rx="16" ry="27" fill="#4E3220"/>
    <path d="M22 6 C13 18 31 42 22 54" stroke="#2C1B10" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
  </svg>
)

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

// ── Reveal hook ──────────────────────────────────────────────
function useReveal(ref) {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target) } }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    const el = ref.current
    if(!el) return
    el.querySelectorAll('[data-reveal]').forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [ref])
}

// ── Componente principal ─────────────────────────────────────
export default function Inicio({ navegar }) {
  const pageRef      = useRef(null)
  const heroVisRef   = useRef(null)
  const barsRef      = useRef(null)

  const [filter,      setFilter]      = useState('todos')
  const [activeKey,   setActiveKey]   = useState('colombia')
  const [barsVisible, setBarsVisible] = useState(false)
  const [newsOk,      setNewsOk]      = useState(false)

  useReveal(pageRef)

  // Parallax hero
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches
    if(reduceMotion) return
    let scrollY = 0, mouseX = 0, mouseY = 0
    const els = heroVisRef.current?.querySelectorAll('[data-parallax]') || []

    const apply = () => {
      els.forEach((el) => {
        const depth = parseFloat(el.dataset.parallax)
        const ty  = scrollY * depth * 0.6
        const mx  = mouseX * depth * 30
        const my  = mouseY * depth * 22
        const base = el.classList.contains('bag') || el.classList.contains('bag-photo') ? 'rotate(-2.5deg)' : ''
        el.style.transform = `translate3d(${mx}px,${ty - my}px,0) ${base}`
      })
    }
    const onScroll = () => { scrollY = window.scrollY; apply() }
    const onMove   = (e) => {
      const r = heroVisRef.current.getBoundingClientRect()
      mouseX = ((e.clientX - r.left) / r.width - 0.5) * 2
      mouseY = ((e.clientY - r.top)  / r.height - 0.5) * 2
      apply()
    }
    const onLeave  = () => { mouseX = 0; mouseY = 0; apply() }

    window.addEventListener('scroll', onScroll, { passive: true })
    heroVisRef.current?.addEventListener('mousemove', onMove)
    heroVisRef.current?.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('scroll', onScroll)
      heroVisRef.current?.removeEventListener('mousemove', onMove)
      heroVisRef.current?.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  // Observer para animar barras
  useEffect(() => {
    if(!barsRef.current) return
    const io = new IntersectionObserver(
      ([e]) => { if(e.isIntersecting) setBarsVisible(true) },
      { threshold: 0.3 }
    )
    io.observe(barsRef.current)
    return () => io.disconnect()
  }, [])

  const selectCoffee = useCallback((key, scroll = false) => {
    setActiveKey(key)
    if(scroll) document.getElementById('experiencia')?.scrollIntoView({ behavior:'smooth' })
  }, [])

  const activeCoffee  = COFFEES[activeKey]
  const filteredOrder = ORDER.filter((k) => filter === 'todos' || COFFEES[k].continent === filter)

  return (
    <div ref={pageRef}>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="hero" id="inicio">
        {/* Cresta montañosa SVG */}
        <svg className="hero-bg-ridge" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true">
          <path fill="#E4DAC6" d="M0,220 L240,120 L420,200 L660,80 L900,210 L1140,110 L1320,190 L1440,150 L1440,320 L0,320 Z"/>
          <path fill="#D8CBB2" opacity=".7" d="M0,260 L280,180 L520,250 L780,160 L1020,250 L1280,180 L1440,240 L1440,320 L0,320 Z"/>
        </svg>

        <div className="wrap hero-grid">
          {/* Texto */}
          <div className="hero-copy">
            <span className="eyebrow" data-reveal>Café de especialidad · Tostado en Tucumán</span>
            <h1 className="hero-title" data-reveal style={{ transitionDelay:'.08s' }}>
              El origen del <em>café de especialidad</em>.
            </h1>
            <p className="hero-sub" data-reveal style={{ transitionDelay:'.16s' }}>
              Granos de altura, tostados en pequeños lotes. Mallku es el vuelo del cóndor sobre los Andes: la búsqueda de la cima en cada taza.
            </p>
            <div className="hero-actions" data-reveal style={{ transitionDelay:'.24s' }}>
              <button className="btn btn-primary" onClick={() => document.getElementById('cafes')?.scrollIntoView({ behavior:'smooth' })}>
                Descubrí nuestros cafés <span className="arrow">→</span>
              </button>
              <button className="btn btn-ghost" onClick={() => document.getElementById('origen')?.scrollIntoView({ behavior:'smooth' })}>
                Nuestra historia
              </button>
            </div>
            <div className="hero-scroll" data-reveal style={{ transitionDelay:'.36s' }}>
              <span className="line"/>
              Bajá para explorar
            </div>
          </div>

          {/* Visual */}
          <div className="hero-visual" ref={heroVisRef} id="heroVisual">
            <div className="glow"  data-parallax="0.05"/>
            <div className="ring"  data-parallax="0.03"/>
            <div className="ring r2" data-parallax="0.02"/>

            {/* Bolsa real */}
            <div className="bag-photo" data-parallax="0.12">
              <img
                src="/img/hero-bag.webp"
                alt="Bolsa de café de especialidad Mallku · Colombia, Huila"
                fetchPriority="high"
              />
              <div className="bag-shadow" aria-hidden="true"/>
            </div>

            {/* Granos flotantes */}
            <Bean cls="b1" data-parallax="0.18"/>
            <Bean cls="b2" data-parallax="0.22"/>
            <Bean cls="b3" data-parallax="0.15"/>
            <Bean cls="b4" data-parallax="0.26"/>
          </div>
        </div>
      </section>

      {/* ══ MARQUEE ═══════════════════════════════════════════ */}
      <div className="strip" aria-hidden="true">
        <div className="marquee">
          <span>Colombia</span><span>Brasil</span><span>Perú</span><span>Kenya</span><span>Honduras</span>
          <span>Colombia</span><span>Brasil</span><span>Perú</span><span>Kenya</span><span>Honduras</span>
        </div>
      </div>

      {/* ══ FILOSOFÍA / ORIGEN ════════════════════════════════ */}
      <section className="section" id="origen">
        <div className="wrap philo">
          {/* Visual con cóndor */}
          <div className="philo-visual" data-reveal>
            <div className="float-circle"/>
            <img
              className="logo-seal"
              src="/img/logo.png"
              alt="Logo de Mallku · Tostadores de Café"
              loading="lazy"
            />
            <div className="alt-tag">
              <div><b>1400–2200</b><small>msnm · altura de cultivo</small></div>
            </div>
          </div>

          {/* Texto */}
          <div className="philo-copy">
            <span className="eyebrow" data-reveal>Filosofía</span>
            <h2 data-reveal style={{ transitionDelay:'.08s' }}>
              Mallku, el <em>señor de las alturas</em>.
            </h2>
            <p data-reveal style={{ transitionDelay:'.14s' }}>
              <span className="drop">En lengua andina, <strong>Mallku</strong> es el cóndor</span>: guardián de las cumbres, símbolo de las alturas que separan lo común de lo excepcional. Ese mismo espíritu guía cada grano que seleccionamos.
            </p>
            <p data-reveal style={{ transitionDelay:'.20s' }}>
              El café de especialidad nace en altura. Entre los 1400 y 2200 msnm el grano madura lento, gana densidad y desarrolla la complejidad que se siente en taza: acidez vibrante, cuerpo definido y notas que cuentan su origen. Nosotros lo honramos con un <strong>tueste artesanal en pequeños lotes</strong>, en el corazón de Tucumán.
            </p>
            <div className="stats">
              <div className="stat" data-reveal style={{ transitionDelay:'.10s' }}><b>1400–2200</b><span>msnm de altura</span></div>
              <div className="stat" data-reveal style={{ transitionDelay:'.18s' }}><b>5</b><span>orígenes selectos</span></div>
              <div className="stat" data-reveal style={{ transitionDelay:'.26s' }}><b>250 g</b><span>tueste fresco por lote</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CAFÉS / PRODUCTOS ═════════════════════════════════ */}
      <section className="section alt" id="cafes">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow">Nuestros orígenes</span>
            <h2>Una geografía en cada bolsa.</h2>
            <p>Single origins seleccionados a mano y tostados para revelar el carácter de su tierra. Pasá el cursor sobre cada café para descubrir su perfil.</p>
          </div>

          {/* Filtros */}
          <div className="filters" data-reveal>
            {[['todos','Todos'],['america','América'],['africa','África']].map(([val,label]) => (
              <button key={val} className={`chip${filter===val?' active':''}`} onClick={() => setFilter(val)}>
                {label}
              </button>
            ))}
          </div>

          {/* Grilla */}
          <div className="grid">
            {filteredOrder.map((key, i) => {
              const c = COFFEES[key]
              return (
                <article
                  key={key}
                  className="card"
                  data-reveal
                  data-continent={c.continent}
                  style={{ '--accent': c.accent, transitionDelay: `${(i % 3) * 0.09}s` }}
                >
                  <div className="card-top">
                    <span className="card-badge">Origen único</span>
                    <span className="card-num">0{ORDER.indexOf(key) + 1}</span>
                  </div>
                  <figure className="card-photo">
                    <img src={c.foto} alt={`Bolsa de café Mallku ${c.name} · ${c.region}`} loading="lazy" />
                  </figure>
                  <h3>{c.name} <em>{c.region}</em></h3>
                  <p className="notes">{c.notes}</p>
                  <div className="meta">
                    <div><span className="k">Proceso</span><span className="v">{c.proceso}</span></div>
                    <div><span className="k">Altura</span><span className="v">{c.altura} msnm</span></div>
                    <div><span className="k">Tueste</span><span className="v">{c.tueste}</span></div>
                  </div>
                  <div className="card-price">{fmt(c.price)} <small style={{ fontFamily:'Montserrat,sans-serif', fontSize:'10px', fontWeight:500, color:'var(--muted)', letterSpacing:'.1em' }}>/ 250g</small></div>
                  <div className="card-actions">
                    <button className="card-perfil" onClick={() => selectCoffee(key, true)}>
                      Ver perfil <span>→</span>
                    </button>
                    <button className="card-buy" onClick={() => navegar('tienda')}>
                      Comprar
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ EXPERIENCIA / PERFIL ══════════════════════════════ */}
      <section className="section" id="experiencia" style={{ '--accent': activeCoffee.accent }}>
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow">El perfil</span>
            <h2>Conocé cada taza.</h2>
            <p>Elegí un origen y descubrí su tueste, acidez, cuerpo e intensidad en un desglose visual.</p>
          </div>

          {/* Tabs */}
          <div className="exp-tabs" data-reveal>
            {ORDER.map((key) => (
              <button
                key={key}
                className={`exp-tab${activeKey === key ? ' active' : ''}`}
                onClick={() => selectCoffee(key, false)}
              >
                {COFFEES[key].name}
              </button>
            ))}
          </div>

          <div className="exp" data-reveal>
            {/* Info */}
            <div className="exp-info">
              <h3>{activeCoffee.name}</h3>
              <div className="region">{activeCoffee.region}</div>
              <p className="desc">{activeCoffee.desc}</p>
              <div className="exp-icons">
                <div className="ic"><IcNotas/><div><small>Notas</small><b>{activeCoffee.notes.split(' · ')[0]}</b></div></div>
                <div className="ic"><IcTueste/><div><small>Tueste</small><b>{activeCoffee.tueste}</b></div></div>
                <div className="ic"><IcCuerpo/><div><small>Proceso</small><b>{activeCoffee.proceso}</b></div></div>
              </div>
            </div>

            {/* Barras */}
            <div className="bars" ref={barsRef}>
              {LEVELS.map(({ key, label, Icon }) => (
                <div className="bar" key={key}>
                  <div className="bar-head">
                    <span className="name"><Icon/>{label}</span>
                    <span className="val">{wordFor(activeCoffee.levels[key])}</span>
                  </div>
                  <div className="track">
                    <div
                      className="fill"
                      style={{ width: barsVisible ? `${activeCoffee.levels[key]}%` : '0' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA BAND ══════════════════════════════════════════ */}
      <section className="cta-band">
        <div className="ghost-word">Mallku</div>
        <div className="wrap inner">
          <span className="eyebrow" data-reveal>El ritual</span>
          <h2 data-reveal style={{ transitionDelay:'.08s' }}>
            Llevá la <em>altura</em> a tu taza.
          </h2>
          <button className="btn btn-primary" data-reveal style={{ transitionDelay:'.16s' }} onClick={() => navegar('tienda')}>
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
              <p className="f-about">Café de especialidad tostado con altura en Tucumán, Argentina. Granos seleccionados de orígenes que vuelan tan alto como el cóndor.</p>
              <div className="socials">
                <a href={CFG.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s0-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zm0 1.8c-3.14 0-3.5 0-4.74.07-.9.04-1.38.19-1.7.32-.43.16-.74.36-1.06.68-.32.32-.52.63-.68 1.06-.13.32-.28.8-.32 1.7C3.8 8.5 3.8 8.86 3.8 12s0 3.5.07 4.74c.04.9.19 1.38.32 1.7.16.43.36.74.68 1.06.32.32.63.52 1.06.68.32.13.8.28 1.7.32 1.24.07 1.6.07 4.74.07s3.5 0 4.74-.07c.9-.04 1.38-.19 1.7-.32.43-.16.74-.36 1.06-.68.32-.32.52-.63.68-1.06.13-.32.28-.8.32-1.7.07-1.24.07-1.6.07-4.74s0-3.5-.07-4.74c-.04-.9-.19-1.38-.32-1.7a2.85 2.85 0 0 0-.68-1.06 2.85 2.85 0 0 0-1.06-.68c-.32-.13-.8-.28-1.7-.32C15.5 4 15.14 4 12 4zm0 3.06A4.94 4.94 0 1 1 12 17a4.94 4.94 0 0 1 0-9.88zm0 1.8a3.14 3.14 0 1 0 0 6.28 3.14 3.14 0 0 0 0-6.28zM17.84 6.6a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3z"/></svg>
                </a>
                <a href={`https://wa.me/${CFG.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <svg viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.8c2.17 0 4.2.85 5.74 2.38a8.08 8.08 0 0 1 2.38 5.73c0 4.48-3.65 8.12-8.13 8.12a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.12.82.83-3.04-.2-.31a8.04 8.04 0 0 1-1.24-4.28c0-4.48 3.65-8.12 8.13-8.12zm-2.47 4.3c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.27s.97 2.63 1.11 2.81c.14.18 1.9 2.9 4.6 3.96 2.25.89 2.71.71 3.2.67.49-.05 1.58-.65 1.8-1.27.22-.62.22-1.16.16-1.27-.07-.11-.25-.18-.52-.31-.27-.14-1.58-.78-1.83-.87-.25-.09-.43-.14-.61.14-.18.27-.7.86-.86 1.04-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.16-1.33-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.42.12-.55.12-.12.27-.32.4-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.6-1.49-.84-2.03-.22-.53-.44-.46-.61-.46h-.52z"/></svg>
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
                <li><button onClick={() => document.getElementById('origen')?.scrollIntoView({ behavior:'smooth' })}>Origen</button></li>
                <li><button onClick={() => document.getElementById('cafes')?.scrollIntoView({ behavior:'smooth' })}>Cafés</button></li>
                <li><button onClick={() => document.getElementById('experiencia')?.scrollIntoView({ behavior:'smooth' })}>Experiencia</button></li>
                <li><button onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}>Inicio</button></li>
              </ul>
            </div>

            {/* Col 3: Orígenes */}
            <div>
              <h5>Orígenes</h5>
              <ul>
                {ORDER.map((key) => (
                  <li key={key}>
                    <button onClick={() => navegar('tienda')}>{COFFEES[key].name} · {COFFEES[key].region}</button>
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
