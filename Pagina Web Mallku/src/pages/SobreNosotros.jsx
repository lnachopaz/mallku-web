import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal'
import Footer from '../components/Footer'

/* Los 4 pilares del proceso Mallku */
const PASOS = [
  {
    titulo: 'Selección en el origen',
    texto: 'Elegimos de manera rigurosa granos de altura de las mejores regiones cafetaleras del mundo. Nos aseguramos de conocer la trazabilidad del lote y de valorar el trabajo de los productores en la finca.',
  },
  {
    titulo: 'El arte del tueste',
    texto: 'En nuestro tostadero en Yerba Buena, diseñamos perfiles de tueste específicos para cada variedad. Cuidamos cada segundo y cada grado de temperatura para desbloquear y potenciar los sabores, el dulzor y los aromas naturales que el grano trae desde su tierra.',
  },
  {
    titulo: 'Frescura garantizada',
    texto: 'Tostamos en lotes pequeños y envasamos con dedicación para que disfrutes de un café fresco, aromático y en su punto justo de desgasificación.',
  },
  {
    titulo: 'Compartir la experiencia',
    texto: 'Creemos que el buen café se disfruta más cuando se comparte. Por eso, abrimos las puertas de nuestro espacio a través de encuentros sensoriales y catas, donde aprendemos a distinguir notas, probar diferentes métodos y disfrutar juntos sin pretensiones.',
  },
]

export default function SobreNosotros() {
  const pageRef = useReveal()

  return (
    <div ref={pageRef}>

      {/* Encabezado */}
      <section className="shop-hero">
        <div className="wrap">
          <span className="eyebrow lados" data-reveal>Nosotros</span>
          <h1 data-reveal style={{ transitionDelay:'.08s' }}>El origen de <em>Mallku</em>: nuestra historia</h1>
          <p data-reveal style={{ transitionDelay:'.16s' }}>
            MALLKU nació de algo muy simple: nuestra pasión por el café de especialidad y el deseo de hacer bien las cosas, inspirados por el aire libre y el respeto por los cerros.
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="section">
        <div className="wrap philo">
          <div className="philo-visual" data-reveal>
            <div className="float-circle"/>
            <figure className="philo-photo">
              <img
                src="/img/hero-sirviendo-jarrito.webp"
                alt="Sirviendo café Mallku de una cafetera italiana en un jarrito de metal, al atardecer"
                loading="lazy"
              />
            </figure>
          </div>

          <div className="philo-copy">
            <span className="eyebrow lados" data-reveal>Nuestra historia</span>
            <h2 data-reveal style={{ transitionDelay:'.08s' }}>
              Café honesto, con <em>identidad de altura</em>
            </h2>
            <p data-reveal style={{ transitionDelay:'.14s' }}>
              <span className="drop">Somos una tostaduría enfocada en buscar la excelencia en cada grano.</span> Para nosotros, el café de especialidad no es una bebida más; es el resultado de cuidar con obsesión cada etapa, desde la finca hasta que llega a tu taza. Nos alejamos de los discursos complicados para concentrarnos en lo que de verdad importa: lograr un café limpio, dulce, con la acidez justa y lleno de vida. Un café honesto, pensado tanto para tu ritual de todas las mañanas en casa como para acompañarte a explorar nuevos lugares.
            </p>
            <p data-reveal style={{ transitionDelay:'.20s' }}>
              En la cultura aymara, <strong>MALLKU significa Montaña Sagrada</strong>, el ser protector de las cumbres. Nos inspiramos en esa fuerza para crear una marca con identidad de altura, donde la dedicación y el respeto por el proceso guían cada una de nuestras decisiones.
            </p>
            <div className="stats">
              <div className="stat" data-reveal style={{ transitionDelay:'.10s' }}><b>1400–2200</b><span>msnm de altura</span></div>
              <div className="stat" data-reveal style={{ transitionDelay:'.18s' }}><b>5</b><span>orígenes selectos</span></div>
              <div className="stat" data-reveal style={{ transitionDelay:'.26s' }}><b>250 g</b><span>tueste fresco por lote</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo trabajamos */}
      <section className="section alt">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow lados">El proceso</span>
            <h2>Cómo trabajamos nuestro café</h2>
            <p>Detrás de cada bolsa de MALLKU hay un proceso meticuloso donde el grano es el gran protagonista.</p>
          </div>

          <div className="pasos-grid">
            {PASOS.map((paso, i) => (
              <article className="paso-card" key={paso.titulo} data-reveal style={{ transitionDelay: `${(i % 2) * 0.1}s` }}>
                <span className="paso-num">0{i + 1}</span>
                <h3>{paso.titulo}</h3>
                <p>{paso.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Nuestra fundadora */}
      <section className="section">
        <div className="wrap philo">
          <div className="philo-visual" data-reveal>
            <div className="float-circle"/>
            <figure className="philo-photo">
              <img
                src="/img/nosotros-retrato.jpg"
                alt="Flor Paz, fundadora de Mallku, al aire libre entre plantas"
                loading="lazy"
              />
            </figure>
          </div>

          <div className="philo-copy">
            <span className="eyebrow lados" data-reveal>Nuestra fundadora</span>
            <blockquote className="fundadora-quote" data-reveal style={{ transitionDelay:'.10s' }}>
              <p>
                MALLKU es el reflejo de mi día a día. Como ingeniera industrial, me apasiona la precisión, la física detrás del tueste y el control de cada variable para lograr una taza perfecta. Pero como apasionada de la naturaleza y el montañismo, mi verdadero cable a tierra está en las cumbres. Creé esta marca para fusionar esos dos mundos: la rigurosidad técnica de nuestro laboratorio en Yerba Buena y el disfrute simple de preparar un café caliente mirando los cerros tucumanos. MALLKU es nuestra invitación a que te lleves un pedacito de esa libertad en cada taza.
              </p>
              <footer>— Flor Paz <span>Fundadora de MALLKU</span></footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Cierre / CTA */}
      <section className="cta-band">
        <div className="ghost-word">Mallku</div>
        <div className="wrap inner">
          <span className="eyebrow lados" data-reveal>Tostado en Tucumán</span>
          <h2 data-reveal style={{ transitionDelay:'.08s' }}>
            Hecho por apasionados, para quienes valoran el <em>sabor real</em>
          </h2>
          <p className="cta-sub" data-reveal style={{ transitionDelay:'.12s' }}>
            MALLKU es café de especialidad tostado con paciencia en Tucumán, pensado para acompañarte estés donde estés. Bienvenidos a nuestro mundo de café.
          </p>
          <Link className="btn btn-primary" to="/tienda" data-reveal style={{ transitionDelay:'.18s' }}>
            Conocé nuestros cafés <span className="arrow">→</span>
          </Link>
        </div>
      </section>

      <Footer/>
    </div>
  )
}
