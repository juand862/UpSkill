/**
 * types.ts — shape del estado del "explorador" (CLAUDE.md §3, §5).
 *
 * Es el único explorador en memoria + localStorage del prototipo (sin
 * backend, sin multiusuario real). Completar un módulo (Bloque 5) otorga
 * XP/monedas, desbloquea niveles, otorga sellos, actualiza racha y
 * posición en el ranking.
 */

// Escala D1–D5 parametrizable (CLAUDE.md §7) — el prototipo usa 1–5
export type RangoExplorador = 'Novato' | 'Explorador' | 'Avanzado' | 'Experto'

// Selector de rol simplificado a 2 ramas (decisión confirmada con stakeholder)
export type RolExplorador = 'tecnico' | 'no_tecnico'

export interface RachaExplorador {
  dias: number
  /** Fecha ISO (yyyy-mm-dd) de la última actividad registrada, o null si nunca hubo actividad */
  ultimaActividad: string | null
}

export interface ExplorerState {
  /** Nombre mock del explorador — ficticio, cero PII (guardrail §9) */
  nombre: string
  rol: RolExplorador
  rango: RangoExplorador
  /** Nivel de la trayectoria (1–6), ver CLAUDE.md §4 */
  nivelActual: number
  xpTotal: number
  /** XP acumulado dentro del nivel actual (para la barra de progreso) */
  xpNivelActual: number
  /** Umbral de XP para pasar al siguiente nivel */
  xpNivelObjetivo: number
  monedas: number
  racha: RachaExplorador
  /** IDs de módulos completados (Bloque 5) */
  modulosCompletados: string[]
  /** IDs de nivel con sello de misión obtenido (Bloque 6, Pasaporte) */
  sellosObtenidos: number[]
  evaluacionCompletada: boolean
  respuestasEvaluacion?: Record<string, number>
  /** IDs de recompensas ya canjeadas (Bloque 8) — solo no monetarias, CLAUDE.md §7 */
  recompensasCanjeadas: string[]
}

export const ID_EXPLORADOR_MOCK = 'COV-2026-IA-0001' // PLACEHOLDER: id ficticio, no es un dato real
