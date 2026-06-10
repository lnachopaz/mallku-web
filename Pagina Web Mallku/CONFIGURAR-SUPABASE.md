# Configurar el login de clientes (Supabase) — paso a paso

El sitio ya tiene todo el código del login y la base de datos. Solo falta
conectarlo a tu propio proyecto de Supabase (gratis). Son ~15 minutos.

> Mientras no hagas estos pasos, la página funciona igual que siempre,
> solo que sin el botón de "Ingresar".

---

## 1. Crear la cuenta y el proyecto

1. Entrá a [supabase.com](https://supabase.com) → **Start your project** → registrate (podés usar tu cuenta de Google o GitHub).
2. **New project** → poné:
   - **Name:** `mallku`
   - **Database Password:** inventá una y guardala (no la vas a necesitar a diario).
   - **Region:** South America (São Paulo) — la más cercana.
3. Esperá 1-2 minutos a que se cree.

## 2. Crear las tablas (clientes y pedidos)

1. En el menú izquierdo: **SQL Editor** → **New query**.
2. Abrí el archivo `supabase-setup.sql` (está en esta carpeta), copiá TODO su contenido y pegalo.
3. Botón **Run**. Tiene que decir "Success".

## 3. Copiar las 2 claves al proyecto

1. En el menú izquierdo: **Settings** (engranaje) → **API**.
2. Vas a ver dos valores:
   - **Project URL** (algo como `https://abcdefgh.supabase.co`)
   - **anon public** key (un texto largo)
3. En la carpeta del proyecto, copiá el archivo `.env.example` y renombralo a **`.env.local`**.
4. Completalo así (con TUS valores):

```
VITE_SUPABASE_URL=https://abcdefgh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...todo-el-texto-largo
```

5. Guardá. Si el `npm run dev` estaba corriendo, cerralo y volvé a correrlo.

> La clave "anon" es pública por diseño: es segura de usar en el navegador
> porque la base de datos tiene reglas (RLS) que solo dejan a cada cliente
> ver SUS propios datos. Nunca copies la clave "service_role".

## 4. El login por email ya funciona ✅

Con eso solo, el botón de cuenta (arriba a la derecha) ya permite ingresar
con email: el cliente escribe su correo y le llega un enlace de acceso
(sin contraseñas).

## 5. (Opcional pero recomendado) Activar "Continuar con Google"

1. En Supabase: **Authentication** → **Sign In / Up** → **Auth Providers** → **Google** → Enable.
2. Te va a pedir un **Client ID** y **Client Secret** de Google. Para eso:
   - Entrá a [console.cloud.google.com](https://console.cloud.google.com) → creá un proyecto "Mallku".
   - **APIs & Services** → **OAuth consent screen** → completá nombre y mail → tipo "External".
   - **Credentials** → **Create credentials** → **OAuth Client ID** → tipo "Web application".
   - En **Authorized redirect URIs** pegá la URL que te muestra Supabase en la pantalla del provider (algo como `https://abcdefgh.supabase.co/auth/v1/callback`).
   - Copiá el Client ID y el Secret a Supabase → **Save**.

## 6. Cuando subas el sitio a Vercel

1. En Supabase: **Authentication** → **URL Configuration**:
   - **Site URL:** la URL real del sitio (ej: `https://mallku.vercel.app`)
   - **Redirect URLs:** agregá también `http://localhost:5173` para seguir probando en tu compu.
2. En Vercel: **Settings** → **Environment Variables** → agregá las mismas dos variables
   (`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`) y redeployá.

---

## ¿Qué ganás con esto?

- **Historial de compras:** cada pedido por WhatsApp de un cliente logueado queda guardado en su cuenta.
- **Direcciones fijas:** el cliente carga su dirección una vez y los pedidos salen con ella.
- **Tu base de datos de clientes:** en Supabase → **Authentication** → **Users** tenés la lista de mails para preventas y eventos. Y en **Table Editor** → `pedidos` ves todo lo que se pidió.

## ¿Dónde veo los datos?

- **Lista de clientes:** Supabase → Authentication → Users.
- **Pedidos:** Supabase → Table Editor → tabla `pedidos`.
- **Direcciones:** Supabase → Table Editor → tabla `perfiles`.
