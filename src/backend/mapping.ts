/**
 * mapping.ts — traduce entre la fila de Postgres (snake_case, UsuarioDB)
 * y el ExplorerState del front-end (camelCase). Vive en /src/backend para
 * que /src/state no necesite saber nada sobre la forma de la tabla SQL.
 */
import type { ExplorerState } from '@/state/types'
import type { UsuarioDB } from './types'

export function usuarioDbAEstado(usuario: UsuarioDB): ExplorerState {
  return {
    nombre: usuario.nombre,
    alias: usuario.alias,
    correo: usuario.correo,
    rol: usuario.rol,
    rango: usuario.rango,
    nivelActual: usuario.nivel_actual,
    xpTotal: usuario.xp_total,
    xpNivelActual: usuario.xp_nivel_actual,
    xpNivelObjetivo: usuario.xp_nivel_objetivo,
    monedas: usuario.monedas,
    racha: { dias: usuario.racha_dias, ultimaActividad: usuario.ultima_actividad },
    modulosCompletados: usuario.cursos_completados,
    sellosObtenidos: usuario.sellos_obtenidos,
    recompensasCanjeadas: usuario.recompensas_canjeadas,
    evaluacionCompletada: usuario.evaluacion_completada,
    respuestasEvaluacion: usuario.respuestas_evaluacion ?? undefined,
    fechaRegistro: usuario.fecha_registro,
    ultimoAcceso: usuario.ultimo_acceso,
  }
}

/** Traduce el estado del front-end a las columnas que Supabase debe persistir (sin id/correo/fecha_registro) */
export function estadoAActualizacionUsuario(
  estado: ExplorerState,
): Partial<Omit<UsuarioDB, 'id' | 'correo' | 'fecha_registro'>> {
  return {
    nombre: estado.nombre,
    alias: estado.alias,
    rol: estado.rol,
    rango: estado.rango,
    nivel_actual: estado.nivelActual,
    xp_total: estado.xpTotal,
    xp_nivel_actual: estado.xpNivelActual,
    xp_nivel_objetivo: estado.xpNivelObjetivo,
    monedas: estado.monedas,
    racha_dias: estado.racha.dias,
    ultima_actividad: estado.racha.ultimaActividad,
    cursos_completados: estado.modulosCompletados,
    sellos_obtenidos: estado.sellosObtenidos,
    recompensas_canjeadas: estado.recompensasCanjeadas,
    evaluacion_completada: estado.evaluacionCompletada,
    respuestas_evaluacion: estado.respuestasEvaluacion ?? null,
  }
}
