/**
 * types.ts — shape del estado del "explorador" (CLAUDE.md §3, §5).
 *
 * Modo local (sin `correo`): un único explorador en memoria + localStorage,
 * como arrancó el prototipo — sin backend, sin multiusuario real.
 *
 * Modo identificado (con `correo` @covalto.com): el mismo estado se
 * sincroniza con la tabla `usuarios` en Supabase (src/backend/), por
 * decisión explícita del stakeholder de sumar un backend real — ver nota
 * en CLAUDE.md. Completar un módulo (Bloque 5) otorga XP/monedas,
 * desbloquea niveles, otorga sellos, actualiza racha y posición en el
 * ranking, en ambos modos.
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
  /** Nombre — mock/ficticio en modo local; real si el explorador se identificó (guardrail §9 relajado a propósito, ver CLAUDE.md) */
  nombre: string
  /** Alias público mostrado en el Ranking — no expone el nombre real ahí */
  alias: string | null
  /** Correo @covalto.com si el explorador se identificó; null en modo local anónimo */
  correo: string | null
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
  /** IDs de módulos completados (Bloque 5) — "cursos realizados" en la BD */
  modulosCompletados: string[]
  /** IDs de nivel con sello de misión obtenido (Bloque 6, Pasaporte) */
  sellosObtenidos: number[]
  evaluacionCompletada: boolean
  respuestasEvaluacion?: Record<string, number>
  /** IDs de recompensas ya canjeadas (Bloque 8) — solo no monetarias, CLAUDE.md §7 */
  recompensasCanjeadas: string[]
  /** ISO timestamp de registro real (solo modo identificado) */
  fechaRegistro: string | null
  /** ISO timestamp del último acceso real (solo modo identificado) */
  ultimoAcceso: string | null
}

export const ID_EXPLORADOR_MOCK = 'COV-2026-IA-0001' // PLACEHOLDER: id ficticio, solo para el modo local/demo
