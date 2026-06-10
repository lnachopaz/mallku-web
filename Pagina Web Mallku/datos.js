/* =====================================================================
   MALLKU · DATOS DEL SITIO  (FUENTE ÚNICA)
   ---------------------------------------------------------------------
   Este archivo es el "panel de control" de tu web.
   Lo leen index.html (inicio) y tienda.html (tienda).
   Lo más cómodo: editarlo desde admin.html y apretar "Publicar".
   Si querés, también podés editar a mano los textos de acá abajo.
   ===================================================================== */
window.MALLKU_DATA = {

  /* ---------- CONFIGURACIÓN GENERAL ---------- */
  config: {
    /* Tu WhatsApp en formato internacional, SOLO números.
       +54 9 381 336 1950  ->  "5493813361950" */
    whatsapp: "5493813361950",
    moneda: "$",
    instagram: "https://www.instagram.com/mallkucafe?igsh=MWI0dnk4bW9kcXYzdA==",
    email: "hola@mallkucafe.com",

    /* Textos editables del sitio (el <em>...</em> se ve en color/cursiva) */
    heroTitulo: "El origen del <em>café de especialidad</em>.",
    heroSub: "Granos de altura, tostados en pequeños lotes. Mallku es el vuelo del cóndor sobre los Andes: la búsqueda de la cima en cada taza.",
    tiendaTitulo: "Elegí tu <em>altura</em>.",
    tiendaSub: "Café de especialidad tostado en pequeños lotes. Seleccioná tu origen, en grano entero o molido para tu método, y armá tu pedido.",
    footerAbout: "Café de especialidad tostado con altura en Tucumán, Argentina. Granos seleccionados de orígenes que vuelan tan alto como el cóndor."
  },

  /* ---------- ORDEN EN QUE APARECEN LOS CAFÉS ---------- */
  orden: ["colombia", "brasil", "peru", "kenya", "honduras"],

  /* ---------- PRODUCTOS ----------
     foto: dejar "" para mostrar el recuadro vacío (placeholder).
           Para poner una foto real, usá el panel admin (arrastrar la imagen)
           o escribí una ruta, por ejemplo: "img/colombia.jpg"
     precio: solo números (sin puntos ni símbolos). Ej: 19000
     visible: false oculta el producto del sitio sin borrarlo.
     levels: niveles 0-100 para las barras del inicio. */
  productos: {

    colombia: {
      name: "Colombia", region: "Huila", continent: "america",
      accent: "#7B463F", foto: "",
      notes: "Acidez alta · Cuerpo medio · Frutos rojos",
      variedad: "Caturra & Castillo", proceso: "Lavado",
      altura: "1400–1800 msnm", tueste: "Medio", peso: "250 g",
      precio: 19000, visible: true,
      desc: "Un perfil vibrante y jugoso. La acidez alta y los frutos rojos lo vuelven brillante; el cuerpo medio lo mantiene equilibrado y fácil de disfrutar.",
      levels: { tueste: 50, acidez: 88, cuerpo: 55, intensidad: 62 }
    },

    brasil: {
      name: "Brasil", region: "Minas Gerais", continent: "america",
      accent: "#4B3528", foto: "",
      notes: "Chocolate · Caramelo · Castañas",
      variedad: "Catuaí Vermelho", proceso: "Natural",
      altura: "1100–1400 msnm", tueste: "Medio", peso: "250 g",
      precio: 18000, visible: true,
      desc: "Dulce, redondo y reconfortante. Proceso natural que aporta chocolate y caramelo, con un cuerpo untuoso ideal para espresso y métodos con leche.",
      levels: { tueste: 72, acidez: 35, cuerpo: 86, intensidad: 80 }
    },

    peru: {
      name: "Perú", region: "Cajamarca", continent: "america",
      accent: "#6E7B38", foto: "",
      notes: "Chocolate · Durazno · Miel · Frutos secos",
      variedad: "Bourbon, Caturra & Catuaí", proceso: "Lavado",
      altura: "1800–2200 msnm", tueste: "Medio", peso: "250 g",
      precio: 19000, visible: true,
      desc: "Suave y dulce, de altura elevada. Acidez baja y cuerpo medio, con miel y durazno que lo hacen delicado y muy versátil.",
      levels: { tueste: 50, acidez: 34, cuerpo: 56, intensidad: 55 }
    },

    kenya: {
      name: "Kenya", region: "Kirinyaga", continent: "africa",
      accent: "#BE4A2B", foto: "",
      notes: "Ciruela · Cítricos · Especias",
      variedad: "SL28, SL34 & Batian", proceso: "Lavado",
      altura: "1600 msnm", tueste: "Claro", peso: "250 g",
      precio: 21000, visible: true,
      desc: "Intenso y expresivo. Un tueste claro que potencia su acidez cítrica, la ciruela y un final especiado: el más aventurero de la selección.",
      levels: { tueste: 24, acidez: 95, cuerpo: 60, intensidad: 74 }
    },

    honduras: {
      name: "Honduras", region: "Cantarranas", continent: "america",
      accent: "#2E3647", foto: "",
      notes: "Naranja · Azúcar morena · Final cremoso",
      variedad: "Lempira & Catuaí", proceso: "Lavado",
      altura: "1600 msnm", tueste: "Medio –", peso: "250 g",
      precio: 20000, visible: true,
      desc: "Goloso y cremoso. Naranja y azúcar morena sobre un final suave; una acidez media-alta lo mantiene fresco y luminoso.",
      levels: { tueste: 40, acidez: 70, cuerpo: 66, intensidad: 60 }
    }

  }
};
