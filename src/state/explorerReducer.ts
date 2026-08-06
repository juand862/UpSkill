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
  recompensasCanjeadas: [],
}

export type ExplorerAction =
  | { type: 'CAMBIAR_ROL'; rol: ExplorerState['rol'] }
  | {
      type: 'COMPLETAR_EVALUACION'
      rango: ExplorerState['rango']
      respuestas: Record<string, number>
      /**
       * Punto de entrada sugerido por el puntaje (doc base §6: "la
       * autoevaluación se reutiliza como instrumento de nivelación"). Solo
       * reposiciona al explorador si aún no tiene módulos completados —
       * nunca le quita progreso real ya hecho.
       */
      nivelSugerido: number
      xpObjetivoNivelSugerido: number
    }
  | { type: 'REINICIAR_PROGRESO' }
  | { type: 'CANJEAR_RECOMPENSA'; recompensaId: string; costoMonedas: number }
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

    case 'COMPLETAR_EVALUACION': {
      const sinProgresoPrevio = estado.modulosCompletados.length === 0
      return {
        ...estado,
        rango: accion.rango,
        evaluacionCompletada: true,
        respuestasEvaluacion: accion.respuestas,
        ...(sinProgresoPrevio && {
          nivelActual: accion.nivelSugerido,
          xpNivelActual: 0,
          xpNivelObjetivo: accion.xpObjetivoNivelSugerido,
        }),
      }
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

    case 'CANJEAR_RECOMPENSA': {
      const yaCanjeada = estado.recompensasCanjeadas.includes(accion.recompensaId)
      const alcanza = estado.monedas >= accion.costoMonedas
      if (yaCanjeada || !alcanza) return estado // guarda también en el reducer, no solo en la UI
      return {
        ...estado,
        monedas: estado.monedas - accion.costoMonedas,
        recompensasCanjeadas: [...estado.recompensasCanjeadas, accion.recompensaId],
      }
    }

    case 'REINICIAR_PROGRESO':
      return ESTADO_INICIAL

    default:
      return estado
  }
}
