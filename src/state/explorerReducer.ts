/**
 * explorerReducer.ts — reducer del estado global del explorador.
 *
 * // PLACEHOLDER: el estado inicial es un mock de un explorador "a media
 * ruta" para que el HUD y el prototipo se vean poblados en la demo cuando
 * nadie se ha identificado con su correo (modo local/anónimo). No
 * representa a ningún colaborador real.
 *
 * Cuando el explorador se identifica con un correo @covalto.com
 * (IDENTIFICAR_USUARIO), el estado pasa a reflejar su fila real en la
 * base de datos (src/backend/) — ver la nota de alcance en CLAUDE.md.
 *
 * El nivel actual (1–6) sigue el modelo canónico de CLAUDE.md §4, distinto
 * del "Nivel 12" numérico del arte de referencia (ese es un contador de
 * gamificación genérico; aquí el nivel = posición en la trayectoria).
 */
import type { ExplorerState } from './types'

export const ESTADO_INICIAL: ExplorerState = {
  nombre: 'Tu Nombre Aquí', // PLACEHOLDER: modo local/demo — se reemplaza al identificarse con un correo real
  alias: null,
  correo: null,
  rol: 'no_tecnico',
  rango: 'Explorador',
  nivelActual: 2,
  xpTotal: 820, // acumulado "de niveles previos" — no se reconcilia módulo a módulo, es solo flavor de demo
  xpNivelActual: 0, // sin módulos del nivel 2 pre-marcados como completados, la barra empieza en 0 (consistente)
  xpNivelObjetivo: 300, // = xpObjetivo real del nivel 2 en levels.json (Exploración)
  monedas: 450,
  racha: { dias: 4, ultimaActividad: null },
  modulosCompletados: [],
  sellosObtenidos: [1],
  evaluacionCompletada: false,
  recompensasCanjeadas: [],
  fechaRegistro: null,
  ultimoAcceso: null,
}

/** Progreso "en cero" para un explorador real recién registrado o que reinicia su progreso real */
const PROGRESO_CERO: Pick<
  ExplorerState,
  | 'rango'
  | 'nivelActual'
  | 'xpTotal'
  | 'xpNivelActual'
  | 'xpNivelObjetivo'
  | 'monedas'
  | 'racha'
  | 'modulosCompletados'
  | 'sellosObtenidos'
  | 'recompensasCanjeadas'
  | 'evaluacionCompletada'
  | 'respuestasEvaluacion'
> = {
  rango: 'Novato',
  nivelActual: 1,
  xpTotal: 0,
  xpNivelActual: 0,
  xpNivelObjetivo: 260, // = xpObjetivo real del nivel 1 en levels.json (Despegue)
  monedas: 0,
  racha: { dias: 0, ultimaActividad: null },
  modulosCompletados: [],
  sellosObtenidos: [],
  recompensasCanjeadas: [],
  evaluacionCompletada: false,
  respuestasEvaluacion: undefined,
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
  // Identidad real (BD) — un explorador identificado reemplaza el estado
  // local/demo por su fila real; cerrar sesión vuelve al modo local.
  | { type: 'IDENTIFICAR_USUARIO'; estado: ExplorerState }
  | { type: 'CERRAR_SESION' }
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

    case 'IDENTIFICAR_USUARIO':
      return accion.estado

    case 'CERRAR_SESION':
      return ESTADO_INICIAL

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

      const sellosConEste = base.sellosObtenidos.includes(accion.completaNivel.nivelId)
        ? base.sellosObtenidos
        : [...base.sellosObtenidos, accion.completaNivel.nivelId]

      // Nivel máximo (6): otorga el sello pero no hay siguiente nivel al
      // que avanzar, así que no reinicia la barra de XP del nivel actual.
      const esNivelMaximo = accion.completaNivel.siguienteNivelId === accion.completaNivel.nivelId
      if (esNivelMaximo) return { ...base, sellosObtenidos: sellosConEste }

      return {
        ...base,
        nivelActual: accion.completaNivel.siguienteNivelId,
        xpNivelActual: 0,
        xpNivelObjetivo: accion.completaNivel.siguienteXpObjetivo,
        sellosObtenidos: sellosConEste,
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
      // Identificado (BD real): conserva identidad, reinicia el progreso a cero.
      // Modo local/demo: vuelve al mock inicial de siempre.
      return estado.correo ? { ...estado, ...PROGRESO_CERO } : ESTADO_INICIAL

    default:
      return estado
  }
}
