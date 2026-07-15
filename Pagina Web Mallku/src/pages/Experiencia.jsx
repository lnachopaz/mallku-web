import useReveal from '../hooks/useReveal'
import { CFG } from '../config'
import Footer from '../components/Footer'

/* Los 4 momentos de una cata guiada Mallku */
const MOMENTOS = [
  {
    titulo: 'Oler antes que nada',
    texto: 'Arrancamos con el café recién molido, en seco. Cada uno huele las muestras y anota lo primero que le aparece: chocolate, frutas, caramelo, flores. No hay respuestas incorrectas.',
  },
  {
    titulo: 'Romper la costra',
    texto: 'Vertemos agua caliente sobre el café y esperamos. Al romper la capa que se forma en la superficie, se libera una nube de aromas: es el momento favorito de todos.',
  },
  {
    titulo: 'Probar con cuchara',
    texto: 'Sorbemos el café con cucharas de cata, fuerte y con aire, para que llegue a todo el paladar. Así se perciben la acidez, el dulzor, el cuerpo y las notas de cada origen.',
  },
  {
    titulo: 'Comparar y conversar',
    texto: 'Probamos varios orígenes uno al lado del otro y descubrimos juntos por qué un Kenia no se parece en nada a un Brasil. Se aprende charlando, sin tecnicismos ni pretensiones.',
  },
]

export default function Experiencia() {
  const pageRef = useReveal()
  const waTalleres = `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent('¡Hola Mallku! Quiero información y reservar mi lugar en los próximos talleres o catas guiadas.')}`

  return (
    <div ref={pageRef}>

      {/* Encabezado: las catas son las protagonistas */}
      <section className="shop-hero">
        <div className="wrap">
          <span className="eyebrow lados" data-reveal>Catas guiadas</span>
          <h1 data-reveal style={{ transitionDelay:'.08s' }}>Un viaje <em>sensorial</em> por nuestros orígenes</h1>
          <p data-reveal style={{ transitionDelay:'.16s' }}>
            Una cata es un encuentro para probar y comparar cafés de distintos orígenes, guiados paso a paso en nuestro espacio de Yerba Buena. No hace falta saber nada de café: venís, olés, probás y te sorprendés. Nosotros ponemos las muestras, las cucharas y la data; vos, la curiosidad.
          </p>
        </div>
      </section>

      {/* Galería + cómo es una cata */}
      <section className="section" id="catas">
        <div className="wrap">

          {/* Galería de fotos reales */}
          <div className="cata-gallery" data-reveal>
            <figure className="cg-main">
              <img src="/img/experiencia-cata-2.webp" alt="Cata guiada Mallku: la guía explica los orígenes frente a la mesa de cata, con las bolsas de café y los cuencos listos" loading="lazy" />
            </figure>
            <figure>
              <img src="/img/experiencia-cata-1.webp" alt="Grupo sentado alrededor de la mesa de cata en el espacio Mallku de Yerba Buena, antes de empezar" loading="lazy" />
            </figure>
            <figure>
              <img src="/img/experiencia-cata-3.webp" alt="Participantes de una cata Mallku oliendo y comparando muestras de café entre risas" loading="lazy" />
            </figure>
          </div>

          {/* Cómo es una cata, paso a paso */}
          <div className="pasos-grid cata-pasos">
            {MOMENTOS.map((m, i) => (
              <article className="paso-card" key={m.titulo} data-reveal style={{ transitionDelay: `${(i % 2) * 0.1}s` }}>
                <span className="paso-num">0{i + 1}</span>
                <h3>{m.titulo}</h3>
                <p>{m.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Detalle de cursos y talleres */}
      <section className="section alt">
        <div className="wrap philo">
          <div className="philo-visual" data-reveal>
            <div className="float-circle"/>
            <div className="biz-page-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 8h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/>
                <path d="M16 9h2.5a2.5 2.5 0 0 1 0 5H16"/>
                <path d="M8 4.5c0 1-.8 1.3-.8 2.3M11.5 4.5c0 1-.8 1.3-.8 2.3"/>
              </svg>
            </div>
          </div>

          <div className="philo-copy">
            <span className="eyebrow lados" data-reveal>Más que catas</span>
            <h2 data-reveal style={{ transitionDelay:'.08s' }}>
              Cursos, talleres y <em>eventos especiales</em>
            </h2>
            <p data-reveal style={{ transitionDelay:'.14s' }}>
              Además de las catas, organizamos talleres prácticos de métodos de preparación y eventos especiales alrededor del café. Grupos chicos, mucha práctica y el café siempre en el centro.
            </p>
            <ul className="biz-list" data-reveal style={{ transitionDelay:'.20s' }}>
              <li>Talleres de métodos: espresso, V60, prensa</li>
              <li>Catas guiadas y eventos especiales</li>
            </ul>
            <a
              className="btn btn-primary" data-reveal style={{ transitionDelay:'.26s' }}
              href={waTalleres} target="_blank" rel="noopener noreferrer"
            >
              Reservar mi lugar <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  )
}
