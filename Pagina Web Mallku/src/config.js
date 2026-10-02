export const CFG = {
  whatsapp: '5493813361950',
  moneda: '$',
  instagram: 'https://www.instagram.com/mallkucafe?igsh=MWI0dnk4bW9kcXYzdA==',
  email: 'hola@mallkucafe.com',
}

export const fmt = (n) => CFG.moneda + Number(n || 0).toLocaleString('es-AR')

/* Opciones técnicas de molienda (selector obligatorio en la tienda) */
export const MOLIENDAS = [
  'Grano Entero',
  'Espresso',
  'Moka Italiana / Volturno',
  'Filtrados / V60',
  'Prensa Francesa',
]

export const COFFEES = {
  colombia: { name: 'Colombia', region: 'Huila', foto: '/img/colombia.jpg', notaFoto: '/img/notas/nota-frutosrojos.webp', notaPrincipal: 'Frutos rojos', continent: 'america', accent: 'var(--c-colombia)', notes: 'Acidez alta y frutos rojos.', variedad: 'Caturra & Castillo', proceso: 'Lavado', altura: '1400–1800', tueste: 'Medio', price: 20000, desc: 'Un perfil vibrante y jugoso. La acidez alta y los frutos rojos lo vuelven brillante; el cuerpo medio lo mantiene equilibrado y fácil de disfrutar.', levels: { tueste: 50, acidez: 88, cuerpo: 55, intensidad: 62 } },
  brasil: { name: 'Brasil', region: 'Minas Gerais', foto: '/img/brasil.jpg', notaFoto: '/img/notas/nota-chocolate.webp', notaPrincipal: 'Chocolate', continent: 'america', accent: 'var(--c-brasil)', notes: 'Chocolate, caramelo y castañas. Intenso y sin acidez.', variedad: 'Catuaí Rojo', proceso: 'Natural', altura: '1100–1300', tueste: 'Medio +', price: 18000, desc: 'Dulce, redondo y reconfortante. Proceso natural que aporta chocolate y caramelo, con un cuerpo untuoso ideal para espresso y métodos con leche.', levels: { tueste: 72, acidez: 35, cuerpo: 86, intensidad: 80 } },
  peru: { name: 'Perú', region: 'Cajamarca', foto: '/img/peru.jpg', notaFoto: '/img/notas/nota-miel.webp', notaPrincipal: 'Miel', continent: 'america', accent: 'var(--c-peru)', notes: 'Chocolate amargo, durazno y miel. Acidez cítrica dulce y cuerpo sedoso.', variedad: 'Bourbon, Caturra & Catuaí', proceso: 'Lavado', altura: '1800–2200', tueste: 'Medio', price: 20000, desc: 'Suave y dulce, de altura elevada. Acidez baja y cuerpo medio, con miel y durazno que lo hacen delicado y muy versátil.', levels: { tueste: 50, acidez: 34, cuerpo: 56, intensidad: 55 } },
  kenya: { name: 'Kenia', region: 'Kirinyaga', foto: '/img/kenya.jpg', notaFoto: '/img/notas/nota-ciruela.webp', notaPrincipal: 'Ciruela', continent: 'africa', accent: 'var(--c-kenya)', notes: 'Ciruela, cítricos y especias.', variedad: 'SL28, SL34 & Batian', proceso: 'Lavado', altura: '1600', tueste: 'Claro', price: 23000, desc: 'Intenso y expresivo. Un tueste claro que potencia su acidez cítrica, la ciruela y un final especiado: el más aventurero de la selección.', levels: { tueste: 24, acidez: 95, cuerpo: 60, intensidad: 74 } },
  honduras: { name: 'Honduras', region: 'Cantarranas', foto: '/img/honduras.jpg', notaFoto: '/img/notas/nota-naranja.webp', notaPrincipal: 'Naranja', continent: 'america', accent: 'var(--c-honduras)', notes: 'Naranja, acidez cítrica.', variedad: 'Lempira & Catuaí', proceso: 'Lavado', altura: '1600', tueste: 'Medio –', price: 23000, desc: 'Goloso y cremoso. Naranja y azúcar morena sobre un final suave; una acidez media-alta lo mantiene fresco y luminoso.', levels: { tueste: 40, acidez: 70, cuerpo: 66, intensidad: 60 } },
}

export const ORDER = ['colombia', 'brasil', 'peru', 'kenya', 'honduras']

/* Accesorios: no llevan molienda ni datos de origen, se venden por variante de tamaño/modelo */
export const ACCESORIOS = {
  prensa: {
    key: 'prensa',
    name: 'Prensa francesa',
    foto: '/img/accesorios/prensa-francesa.jpg',
    accent: 'var(--siena)',
    desc: 'El clásico método de inmersión: cuerpo pleno y extracción pareja, sin filtro de papel.',
    variantes: [
      { id: '330ml', label: '330 ml · 1 taza', price: 20000 },
      { id: '600ml', label: '600 ml · 2 tazas', price: 25000 },
      { id: '1000ml', label: '1000 ml · 3 tazas', price: 35000 },
    ],
  },
  cafetera: {
    key: 'cafetera',
    name: 'Cafetera italiana (Moka)',
    foto: '/img/accesorios/cafetera-italiana.jpg',
    accent: 'var(--siena)',
    desc: 'La moka tradicional: café concentrado y aromático, directo a la hornalla.',
    variantes: [
      { id: '6pocillos', label: '6 pocillos', price: 40000 },
    ],
  },
}

export const ORDEN_ACCESORIOS = ['prensa', 'cafetera']

/* Códigos de descuento. `desde`/`hasta` en hora de Argentina (-03:00); fuera de ese rango
   el código se rechaza solo. El pedido se cierra por WhatsApp, así que el descuento
   viaja en el mensaje y se confirma a mano. */
export const CUPONES = {
  MALLKU10: { pct: 10, desde: '2026-10-01T00:00:00-03:00', hasta: '2026-10-04T23:59:59-03:00', motivo: 'Cumple de Mallku y Día del Café' },
  // Nombre anterior de la misma promo (arrancó al 15%): se deja andando al 10% para quien ya lo tenga
  MALLKU15: { pct: 10, desde: '2026-10-01T00:00:00-03:00', hasta: '2026-10-04T23:59:59-03:00', motivo: 'Cumple de Mallku y Día del Café' },
}

export const buscarCupon = (codigo, ahora = new Date()) => {
  const c = CUPONES[String(codigo || '').trim().toUpperCase()]
  if (!c) return { error: 'Ese código no existe.' }
  if (ahora < new Date(c.desde)) return { error: 'Ese código todavía no está activo.' }
  if (ahora > new Date(c.hasta)) return { error: 'Ese código ya venció.' }
  return { cupon: c }
}

/* Fotos del carrusel del hero (Inicio). El orden acá define el orden en pantalla. */
export const HERO_CAROUSEL = [
  { src: '/img/hero-bolsa-laguna.webp',      alt: 'Bolsa de café Mallku Colombia en alto, con un embalse de montaña de fondo' },
  { src: '/img/hero-manos-prensa.webp',      alt: 'Bolsa de café Mallku Colombia junto a una prensa francesa, con las sierras de fondo' },
  { src: '/img/hero-sirviendo-jarrito.webp', alt: 'Sirviendo café Mallku de una cafetera italiana en un jarrito de metal, al atardecer' },
  { src: '/img/hero-corazon-bolsas.webp',    alt: 'Dos manos formando un corazón sobre bolsas de café Mallku Brasil y Colombia, al atardecer' },
]
