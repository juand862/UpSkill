/**
 * supabaseClient.ts — único punto de conexión a la base de datos real.
 *
 * Todo lo demás en /src/backend habla con la base de datos exclusivamente
 * a través de este cliente, nunca importando @supabase/supabase-js
 * directamente en otro lugar — así el día que cambie el backend, solo se
 * toca este archivo y usersService.ts (mismo principio de aislamiento de
 * datos que CLAUDE.md §7 pide para los mocks en /src/data).
 *
 * Variables de entorno requeridas (ver .env.example):
 *   VITE_SUPABASE_URL       — URL del proyecto Supabase
 *   VITE_SUPABASE_ANON_KEY  — clave pública "anon" (NO la service_role)
 *
 * Sin estas variables, isSupabaseConfigured queda en false y el resto de
 * la app cae de vuelta al modo local/demo (localStorage) sin romperse —
 * así el prototipo sigue siendo demostrable incluso sin un proyecto
 * Supabase configurado (por ejemplo, en este entorno de desarrollo).
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null

if (!isSupabaseConfigured && import.meta.env.DEV) {
  // eslint-disable-next-line no-console -- aviso de setup solo en desarrollo
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY no están configuradas. ' +
      'La app sigue funcionando en modo local (localStorage); ver README para conectar la BD real.',
  )
}
