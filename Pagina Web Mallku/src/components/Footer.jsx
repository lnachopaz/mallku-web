import { Link } from 'react-router-dom'
import { CFG } from '../config'

/* Footer compartido por Tienda y las páginas internas (Sobre nosotros, Experiencia, Mayorista).
   Inicio.jsx tiene su propio footer de 4 columnas con newsletter y no usa este componente. */
export default function Footer() {
  return (
    <footer className="footer" id="contacto">
      <div className="wrap">
        <div className="footer-grid footer-grid-3">
          <div>
            <div className="brand" style={{ marginBottom:0 }}>
              <img className="mark" src="/img/logo.png" alt="" width="42" height="42" />
              <span className="word"><b>Mallku</b><span>TOSTADORES DE CAFÉ</span></span>
            </div>
            <p className="f-about">Café de especialidad tostado con precisión en Tucumán, Argentina. Granos seleccionados en origen, con el espíritu de las cumbres en cada lote.</p>
            <div className="socials">
              <a href={CFG.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s0-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zm0 1.8c-3.14 0-3.5 0-4.74.07-.9.04-1.38.19-1.7.32-.43.16-.74.36-1.06.68-.32.32-.52.63-.68 1.06-.13.32-.28.8-.32 1.7C3.8 8.5 3.8 8.86 3.8 12s0 3.5.07 4.74c.04.9.19 1.38.32 1.7.16.43.36.74.68 1.06.32.32.63.52 1.06.68.32.13.8.28 1.7.32 1.24.07 1.6.07 4.74.07s3.5 0 4.74-.07c.9-.04 1.38-.19 1.7-.32.43-.16.74-.36 1.06-.68.32-.32.52-.63.68-1.06.13-.32.28-.8.32-1.7.07-1.24.07-1.6.07-4.74s0-3.5-.07-4.74c-.04-.9-.19-1.38-.32-1.7a2.85 2.85 0 0 0-.68-1.06 2.85 2.85 0 0 0-1.06-.68c-.32-.13-.8-.28-1.7-.32C15.5 4 15.14 4 12 4zm0 3.06A4.94 4.94 0 1 1 12 17a4.94 4.94 0 0 1 0-9.88zm0 1.8a3.14 3.14 0 1 0 0 6.28 3.14 3.14 0 0 0 0-6.28zM17.84 6.6a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3z"/></svg>
              </a>
              <a href={`https://wa.me/${CFG.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h5>Explorar</h5>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/sobre-nosotros">Sobre nosotros</Link></li>
              <li><Link to="/experiencia">Experiencia</Link></li>
              <li><Link to="/mayorista">Mayorista</Link></li>
              <li><Link to="/tienda">Tienda</Link></li>
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
  )
}
