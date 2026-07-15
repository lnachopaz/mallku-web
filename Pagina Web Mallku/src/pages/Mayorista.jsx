import useReveal from '../hooks/useReveal'
import { CFG } from '../config'
import Footer from '../components/Footer'

export default function Mayorista() {
  const pageRef = useReveal()
  const waMayorista = `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent('¡Hola Mallku! Tengo una cafetería y quiero recibir el catálogo mayorista y asesoramiento técnico (post-cosecha / calibración).')}`

  return (
    <div ref={pageRef}>

      {/* Encabezado */}
      <section className="shop-hero">
        <div className="wrap">
          <span className="eyebrow" data-reveal>Mayorista & soporte técnico</span>
          <h1 data-reveal style={{ transitionDelay:'.08s' }}>Llevá Mallku a tu <em>tolva</em></h1>
          <p data-reveal style={{ transitionDelay:'.16s' }}>
            Precios mayoristas, tostado fresco programado para tu barra y acompañamiento técnico de verdad para que cada extracción salga a la altura.
          </p>
        </div>
      </section>

      {/* Detalle */}
      <section className="section">
        <div className="wrap philo">
          <div className="philo-visual" data-reveal>
            <div className="float-circle"/>
            <div className="biz-page-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 3h10l-2 7H9z"/>
                <path d="M9 10v4a3 3 0 0 0 6 0v-4"/>
                <path d="M10.5 17h3v4h-3z"/>
              </svg>
            </div>
          </div>

          <div className="philo-copy">
            <span className="eyebrow" data-reveal>Mayorista & soporte técnico</span>
            <h2 data-reveal style={{ transitionDelay:'.08s' }}>
              ¿Tenés una cafetería? <em>Llevá Mallku</em> a tu tolva
            </h2>
            <p data-reveal style={{ transitionDelay:'.14s' }}>
              Precios mayoristas, tostado fresco programado para tu barra y acompañamiento técnico de verdad para que cada extracción salga a la altura.
            </p>
            <ul className="biz-list" data-reveal style={{ transitionDelay:'.20s' }}>
              <li>Catálogo mayorista y precios por volumen</li>
              <li>Consultoría post-cosecha y control de calidad</li>
              <li>Calibración de molinos y recetas de extracción</li>
            </ul>
            <a
              className="btn btn-primary" data-reveal style={{ transitionDelay:'.26s' }}
              href={waMayorista} target="_blank" rel="noopener noreferrer"
            >
              Pedir catálogo mayorista <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  )
}
