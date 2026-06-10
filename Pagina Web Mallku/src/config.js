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
  colombia: { name: 'Colombia', region: 'Huila', foto: '/img/colombia.jpg', continent: 'america', accent: 'var(--c-colombia)', notes: 'Acidez alta · Cuerpo medio · Frutos rojos', variedad: 'Caturra & Castillo', proceso: 'Lavado', altura: '1400–1800', tueste: 'Medio', price: 19000, desc: 'Un perfil vibrante y jugoso. La acidez alta y los frutos rojos lo vuelven brillante; el cuerpo medio lo mantiene equilibrado y fácil de disfrutar.', levels: { tueste: 50, acidez: 88, cuerpo: 55, intensidad: 62 } },
  brasil: { name: 'Brasil', region: 'Minas Gerais', foto: '/img/brasil.jpg', continent: 'america', accent: 'var(--c-brasil)', notes: 'Chocolate · Caramelo · Castañas', variedad: 'Catuaí Rojo', proceso: 'Natural', altura: '1100–1300', tueste: 'Medio +', price: 18000, desc: 'Dulce, redondo y reconfortante. Proceso natural que aporta chocolate y caramelo, con un cuerpo untuoso ideal para espresso y métodos con leche.', levels: { tueste: 72, acidez: 35, cuerpo: 86, intensidad: 80 } },
  peru: { name: 'Perú', region: 'Cajamarca', foto: '/img/peru.jpg', continent: 'america', accent: 'var(--c-peru)', notes: 'Chocolate · Durazno · Miel · Frutos secos', variedad: 'Bourbon, Caturra & Catuaí', proceso: 'Lavado', altura: '1800–2200', tueste: 'Medio', price: 19000, desc: 'Suave y dulce, de altura elevada. Acidez baja y cuerpo medio, con miel y durazno que lo hacen delicado y muy versátil.', levels: { tueste: 50, acidez: 34, cuerpo: 56, intensidad: 55 } },
  kenya: { name: 'Kenya', region: 'Kirinyaga', foto: '/img/kenya.jpg', continent: 'africa', accent: 'var(--c-kenya)', notes: 'Ciruela · Cítricos · Especias', variedad: 'SL28, SL34 & Batian', proceso: 'Lavado', altura: '1600', tueste: 'Claro', price: 19500, desc: 'Intenso y expresivo. Un tueste claro que potencia su acidez cítrica, la ciruela y un final especiado: el más aventurero de la selección.', levels: { tueste: 24, acidez: 95, cuerpo: 60, intensidad: 74 } },
  honduras: { name: 'Honduras', region: 'Cantarranas', foto: '/img/honduras.jpg', continent: 'america', accent: 'var(--c-honduras)', notes: 'Naranja · Azúcar morena · Final cremoso', variedad: 'Lempira & Catuaí', proceso: 'Lavado', altura: '1600', tueste: 'Medio –', price: 20000, desc: 'Goloso y cremoso. Naranja y azúcar morena sobre un final suave; una acidez media-alta lo mantiene fresco y luminoso.', levels: { tueste: 40, acidez: 70, cuerpo: 66, intensidad: 60 } },
}

export const ORDER = ['colombia', 'brasil', 'peru', 'kenya', 'honduras']
