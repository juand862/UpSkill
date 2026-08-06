/**
 * usersService.ts — capa de acceso a la tabla `usuarios` en Supabase.
 * Equivalente "backend real" de src/data/dataService.ts: el resto de la
 * app llama a estas funciones, nunca a `supabase` directamente.
 */
import { supabase, isSupabaseConfigured } from './supabaseClient'
import type { NuevoUsuarioInput, UsuarioDB } from './types'

const TABLA = 'usuarios'

/** Valida el dominio @covalto.com en el cliente (la BD también lo valida — defensa en profundidad) */
export function validarCorreoCovalto(correo: string): boolean {
  return /^[a-z0-9._%+-]+@covalto\.com$/i.test(correo.trim())
}

function requerirSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase no está configurado (faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). ' +
        'Revisa el README para conectar la base de datos real.',
    )
  }
  return supabase
}

/** Busca un usuario existente por correo. null si no existe. */
export async function obtenerUsuarioPorCorreo(correo: string): Promise<UsuarioDB | null> {
  const cliente = requerirSupabase()
  const { data, error } = await cliente
    .from(TABLA)
    .select('*')
    .ilike('correo', correo.trim())
    .maybeSingle()

  if (error) throw error
  return data
}

/** Crea un usuario nuevo con progreso en cero (Nivel 1, sin XP/sellos/monedas) */
export async function crearUsuario(datos: NuevoUsuarioInput): Promise<UsuarioDB> {
  if (!validarCorreoCovalto(datos.correo)) {
    throw new Error('El correo debe ser del dominio @covalto.com')
  }
  const cliente = requerirSupabase()
  const { data, error } = await cliente
    .from(TABLA)
    .insert({
      nombre: datos.nombre.trim(),
      alias: datos.alias?.trim() || null,
      correo: datos.correo.trim().toLowerCase(),
      rol: datos.rol,
    })
    .select('*')
    .single()

  if (error) throw error
  return data
}

/** Actualiza el progreso de un usuario existente (upsert parcial por correo) */
export async function actualizarProgresoUsuario(
  correo: string,
  cambios: Partial<Omit<UsuarioDB, 'id' | 'correo' | 'fecha_registro'>>,
): Promise<void> {
  const cliente = requerirSupabase()
  const { error } = await cliente.from(TABLA).update(cambios).ilike('correo', correo.trim())
  if (error) throw error
}

/** Top N usuarios reales por XP, para el Ranking (Bloque 8) */
export async function listarRankingUsuarios(limite = 10): Promise<UsuarioDB[]> {
  const cliente = requerirSupabase()
  const { data, error } = await cliente
    .from(TABLA)
    .select('*')
    .order('xp_total', { ascending: false })
    .limit(limite)

  if (error) throw error
  return data ?? []
}

export { isSupabaseConfigured }
