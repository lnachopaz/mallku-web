/* =====================================================================
   MALLKU · Cliente de Supabase (login de clientes + base de datos)
   ---------------------------------------------------------------------
   Las claves se cargan desde el archivo .env.local (ver .env.example y
   CONFIGURAR-SUPABASE.md). Si todavía no están configuradas, el sitio
   funciona normal pero sin login (authEnabled = false).
   ===================================================================== */
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const authEnabled = Boolean(url && key)
export const supabase = authEnabled ? createClient(url, key) : null
