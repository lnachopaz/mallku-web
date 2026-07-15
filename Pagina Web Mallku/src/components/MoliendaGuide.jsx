// ── Íconos de método de preparación ────────────────────────────
const IcGrano = () => <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4.5c3.8 0 6.5 3.4 6.5 7.2 0 4.1-3.1 7.3-7 7.3-3.6 0-6-3-6-6.7 0-4.4 3.3-7.8 6.5-7.8z"/><path d="M9 18c1.2-3.4 1.4-8.7-.8-13"/></svg>
const IcEspresso = () => <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10h8v4a3.5 3.5 0 0 1-3.5 3.5h-1A3.5 3.5 0 0 1 7 14z"/><path d="M15 11h1.6a1.8 1.8 0 0 1 0 3.6H15"/><path d="M5.5 19.5h11"/></svg>
const IcMoka = () => <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M8 20h8l-1-4H9z"/><path d="M9 16 8 9h8l-1 7"/><path d="M8 9c0-2.8 1.8-4.5 4-4.5S16 6.2 16 9"/><path d="M11 4.5V3M13 4.5V3"/></svg>
const IcV60 = () => <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8h12l-5 8h-2z"/><path d="M9 19h6"/><path d="M12 16v2.5"/></svg>
const IcPrensa = () => <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M8 9h8v9a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z"/><path d="M12 9V5"/><circle cx="12" cy="4" r="1.3"/><path d="M15 12h1.5a1.5 1.5 0 0 1 0 3H15"/></svg>

const METODOS = [
  { m: 'Grano Entero',              label: 'Tengo molinillo propio',   desc: 'Molés vos mismo, justo antes de preparar.',        Icon: IcGrano },
  { m: 'Espresso',                  label: 'Máquina de espresso',       desc: 'Molienda fina, para extraer con presión.',        Icon: IcEspresso },
  { m: 'Moka Italiana / Volturno',  label: 'Cafetera italiana / greca', desc: 'Directo a la hornalla, molienda media-fina.',      Icon: IcMoka },
  { m: 'Filtrados / V60',           label: 'Filtro, V60 o Chemex',      desc: 'Goteo lento, molienda media.',                     Icon: IcV60 },
  { m: 'Prensa Francesa',           label: 'Prensa francesa',           desc: 'Inmersión, molienda gruesa.',                      Icon: IcPrensa },
]

/* Modal compartido: se abre desde cualquier tarjeta de café, y al elegir un método
   aplica la molienda directamente en la tarjeta que lo pidió (ver Tienda.jsx). */
export default function MoliendaGuide({ abierta, onCerrar, onElegir }) {
  return (
    <>
      <div className={`overlay${abierta ? ' open' : ''}`} onClick={onCerrar} aria-hidden="true" />
      <div className={`molienda-modal${abierta ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="Guía para elegir tu molienda">
        <button className="drawer-close mg-close" onClick={onCerrar} aria-label="Cerrar">✕</button>
        <span className="eyebrow-mini">Guía rápida</span>
        <h3>¿Cómo preparás tu café?</h3>
        <p className="mg-sub">Elegí tu método y te seleccionamos la molienda ideal.</p>
        <div className="mg-grid">
          {METODOS.map(({ m, label, desc, Icon }) => (
            <button key={m} type="button" className="mg-option" onClick={() => onElegir(m)}>
              <span className="mg-icon"><Icon/></span>
              <span className="mg-text">
                <span className="mg-label">{label}</span>
                <span className="mg-desc">{desc}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
