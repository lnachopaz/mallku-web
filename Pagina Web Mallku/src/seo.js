/*
 * SEO por ruta.
 *
 * Como el sitio es una SPA, el <head> del index.html es siempre el mismo.
 * Google renderiza el JavaScript, así que actualizar el título y la descripción
 * al cambiar de ruta hace que cada página aparezca en el buscador con su propio
 * texto en vez de repetir el de la home.
 */

export const SITE_URL = 'https://mallkucafe.com'

const OG_IMAGE = `${SITE_URL}/og-image.jpg`

/* Título y descripción de cada ruta del router.
   Regla práctica: título hasta ~60 caracteres, descripción hasta ~155.
   Más largo que eso, Google lo corta con "…". */
export const SEO = {
  '/': {
    title: 'Mallku · Café de Especialidad | Tostadores en Tucumán',
    description:
      'Mallku Café: tostadores de café de especialidad en Tucumán, Argentina. Granos de altura de Colombia, Brasil, Perú, Kenia y Honduras, tostados en pequeños lotes.',
  },
  '/tienda': {
    title: 'Tienda · Comprar Café de Especialidad | Mallku',
    description:
      'Comprá café de especialidad en grano o molido. Colombia, Brasil, Perú, Kenia y Honduras, tostados en pequeños lotes. Elegí tu molienda y recibilo en casa.',
  },
  '/sobre-nosotros': {
    title: 'Sobre Nosotros · Nuestra Historia | Mallku Café',
    description:
      'Quiénes somos y por qué tostamos como tostamos. La historia de Mallku, tostadores de café de especialidad en Tucumán, Argentina.',
  },
  '/experiencia': {
    title: 'Experiencias y Catas de Café | Mallku',
    description:
      'Catas y experiencias de café de especialidad con Mallku. Aprendé a distinguir orígenes, procesos y métodos de preparación.',
  },
  '/mayorista': {
    title: 'Venta Mayorista de Café de Especialidad | Mallku',
    description:
      'Café de especialidad para cafeterías, restaurantes y comercios. Precios mayoristas, asesoramiento en molienda y provisión constante.',
  },
}

const FALLBACK = SEO['/']

/* Busca la etiqueta <meta> y le cambia el content.
   Si no existe (no debería pasar, están todas en index.html), la crea. */
function setMeta(selector, value) {
  let el = document.head.querySelector(selector)

  if (!el) {
    const match = selector.match(/\[(name|property)="([^"]+)"\]/)
    if (!match) return
    const [, kind, key] = match
    el = document.createElement('meta')
    el.setAttribute(kind, key)
    document.head.appendChild(el)
  }

  el.setAttribute('content', value)
}

function setCanonical(url) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', url)
}

/* Aplica el SEO correspondiente a una ruta. */
export function applySeo(pathname) {
  const data = SEO[pathname] || FALLBACK
  const url = pathname === '/' ? `${SITE_URL}/` : `${SITE_URL}${pathname}`

  document.title = data.title
  setCanonical(url)

  setMeta('meta[name="description"]', data.description)

  setMeta('meta[property="og:title"]', data.title)
  setMeta('meta[property="og:description"]', data.description)
  setMeta('meta[property="og:url"]', url)
  setMeta('meta[property="og:image"]', OG_IMAGE)

  setMeta('meta[name="twitter:title"]', data.title)
  setMeta('meta[name="twitter:description"]', data.description)
  setMeta('meta[name="twitter:image"]', OG_IMAGE)
}
