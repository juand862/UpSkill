/**
 * explorerReducer.ts — reducer del estado global del explorador.
 *
 * // PLACEHOLDER: el estado inicial es un mock de un explorador "a media
 * ruta" para que el HUD y el prototipo se vean poblados en la demo. No
 * representa a ningún colaborador real (guardrail §9, cero PII).
 *
 * El nivel actual (1–6) sigue el modelo canónico de CLAUDE.md §4, distinto
 * del "Nivel 12" numérico del arte de referencia (ese es un contador de
 * gamificación genérico; aquí el nivel = posición en la trayectoria).
 */
import type { ExplorerState } from './types'

export const ESTADO_INICIAL: ExplorerState = {
  nombre: 'Tu Nombre Aquí', // PLACEHOLDER: se reemplaza por input del usuario si el prototipo lo requiere
  rol: 'no_tecnico',
  rango: 'Explorador',
  nivelActual: 2,
  xpTotal: 820,
  xpNivelActual: 320,
  xpNivelObjetivo: 500,
  monedas: 450,
  racha: { dias: 4, ultimaActividad: null },
  modulosCompletados: [],
  sellosObtenidos: [1],
  evaluacionCompletada: false,
}

export type ExplorerAction =
  | { type: 'CAMBIAR_ROL'; rol: ExplorerState['rol'] }
  | { type: 'COMPLETAR_EVALUACION'; rango: ExplorerState['rango']; respuestas: Record<string, number> }
  | { type: 'REINICIAR_PROGRESO' }
  // Acciones de las que dependen los Bloques 3–5 (datos + mapa + detalle de nivel);
  // se declaran ya para fijar el contrato del estado, aunque hoy nada las dispara.
  | {
      type: 'COMPLETAR_MODULO'
      moduloId: string
      xp: number
      monedas: number
      /**
       * Si este módulo era el último del nivel, se otorga el sello y se
       * desbloquea el siguiente. `siguienteNivelId` lo calcula quien
       * despacha la acción (min(nivelId + 1, 6)) para que el nivel 6
       * (máximo) no intente avanzar más allá de sí mismo.
       */
      completaNivel?: { nivelId: number; siguienteNivelId: number; siguienteXpObjetivo: number }
    }

export function explorerReducer(estado: ExplorerState, accion: ExplorerAction): ExplorerState {
  switch (accion.type) {
    case 'CAMBIAR_ROL':
      return { ...estado, rol: accion.rol }

    case 'COMPLETAR_EVALUACION':
      return {
        ...estado,
        rango: accion.rango,
        evaluacionCompletada: true,
        respuestasEvaluacion: accion.respuestas,
      }

    case 'COMPLETAR_MODULO': {
      if (estado.modulosCompletados.includes(accion.moduloId)) return estado // evita doble conteo

      const xpNivelActual = estado.xpNivelActual + accion.xp
      const base: ExplorerState = {
        ...estado,
        xpTotal: estado.xpTotal + accion.xp,
        monedas: estado.monedas + accion.monedas,
        xpNivelActual,
        modulosCompletados: [...estado.modulosCompletados, accion.moduloId],
      }

      if (!accion.completaNivel) return base

      return {
        ...base,
        nivelActual: accion.completaNivel.siguienteNivelId,
        xpNivelActual: 0,
        xpNivelObjetivo: accion.completaNivel.siguienteXpObjetivo,
        sellosObtenidos: base.sellosObtenidos.includes(accion.completaNivel.nivelId)
          ? base.sellosObtenidos
          : [...base.sellosObtenidos, accion.completaNivel.nivelId],
      }
    }

    case 'REINICIAR_PROGRESO':
      return ESTADO_INICIAL

    default:
      return estado
  }
}
