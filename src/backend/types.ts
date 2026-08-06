/**
 * types.ts — shape de la fila `usuarios` tal como la devuelve Supabase.
 * Refleja 1:1 las columnas de supabase/migrations/0001_usuarios.sql
 * (snake_case, como las devuelve la API de Postgres/PostgREST).
 */
import type { RangoExplorador, RolExplorador } from '@/state/types'

export interface UsuarioDB {
  id: string
  nombre: string
  alias: string | null
  correo: string
  rol: RolExplorador
  rango: RangoExplorador
  nivel_actual: number
  xp_total: number
  xp_nivel_actual: number
  xp_nivel_objetivo: number
  monedas: number
  racha_dias: number
  ultima_actividad: string | null
  cursos_completados: string[]
  sellos_obtenidos: number[]
  recompensas_canjeadas: string[]
  evaluacion_completada: boolean
  respuestas_evaluacion: Record<string, number> | null
  fecha_registro: string
  ultimo_acceso: string
}

/** Datos requeridos para registrar a un explorador nuevo */
export interface NuevoUsuarioInput {
  nombre: string
  alias?: string
  correo: string
  rol: RolExplorador
}
