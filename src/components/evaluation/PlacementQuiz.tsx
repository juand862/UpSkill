import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEvaluationQuestions, getLevelById, resolverUmbralPorPuntaje } from '@/data/dataService'
import { useExplorer } from '@/state/explorerContext'
import { Icon } from '@/components/ui/Icon'
import type { RolExplorador } from '@/state/types'

const OPCIONES_ROL: { valor: RolExplorador; etiqueta: string; icono: string }[] = [
  { valor: 'tecnico', etiqueta: 'Técnico', icono: 'terminal' },
  { valor: 'no_tecnico', etiqueta: 'No técnico', icono: 'work' },
]

/**
 * PlacementQuiz — autoevaluación D1–D5 (CLAUDE.md, pantalla 2).
 *
 * Opcional: no bloquea el acceso al Mapa (decisión confirmada). El
 * puntaje resultante asigna un rango y, si el explorador todavía no
 * completó ningún módulo, también sugiere su nivel de entrada.
 */
export function PlacementQuiz() {
  const preguntas = getEvaluationQuestions()
  const { estado, dispatch } = useExplorer()
  const navigate = useNavigate()

  const [respuestas, setRespuestas] = useState<Record<string, number>>({})
  const [enviado, setEnviado] = useState(estado.evaluacionCompletada)

  const todasRespondidas = preguntas.every((p) => respuestas[p.id] !== undefined)

  const elegirRespuesta = (preguntaId: string, valor: number) => {
    setRespuestas((prev) => ({ ...prev, [preguntaId]: valor }))
  }

  const enviarEvaluacion = () => {
    const puntaje = Object.values(respuestas).reduce((suma, v) => suma + v, 0)
    const umbral = resolverUmbralPorPuntaje(puntaje)
    const nivelSugerido = getLevelById(umbral.nivelSugerido)

    dispatch({
      type: 'COMPLETAR_EVALUACION',
      rango: umbral.rango,
      respuestas,
      nivelSugerido: umbral.nivelSugerido,
      xpObjetivoNivelSugerido: nivelSugerido?.xpObjetivo ?? estado.xpNivelObjetivo,
    })
    setEnviado(true)
  }

  const repetir = () => {
    setRespuestas({})
    setEnviado(false)
  }

  if (enviado) {
    return (
      <div className="mx-auto max-w-lg space-y-4 rounded-card border border-[var(--color-border)] bg-surface p-8 text-center shadow-card">
        <Icon name="military_tech" className="text-4xl text-accent" />
        <h1 className="text-xl font-bold">Tu rango de entrada es {estado.rango}</h1>
        <p className="text-sm text-text-muted">
          Guardamos tu resultado en tu Pasaporte. Puedes repetir la autoevaluación cuando quieras — no perderás
          tu progreso ya avanzado.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/mapa')}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-text-on-primary shadow-card"
          >
            Ir al mapa
          </button>
          <button
            type="button"
            onClick={() => navigate('/pasaporte')}
            className="rounded-full border border-[var(--color-border)] px-5 py-2 text-sm font-semibold"
          >
            Ver mi pasaporte
          </button>
          <button type="button" onClick={repetir} className="text-sm text-text-muted underline underline-offset-4">
            Repetir autoevaluación
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Autoevaluación de madurez IA</h1>
        <p className="mt-1 text-sm text-text-muted">
          5 preguntas cortas (escala D1–D5) para ubicarte en un rango de entrada: Novato, Explorador, Avanzado o
          Experto. Es opcional — puedes saltarla e ir directo al mapa.
        </p>
      </div>

      {/* Selector de rol mock — tronco común niveles 1-2, ramas desde el 3 (CLAUDE.md §7) */}
      <div className="rounded-card border border-[var(--color-border)] bg-surface p-4">
        <p className="text-sm font-medium">¿Cuál describe mejor tu rol?</p>
        <div className="mt-2 flex gap-2">
          {OPCIONES_ROL.map((opcion) => (
            <button
              key={opcion.valor}
              type="button"
              onClick={() => dispatch({ type: 'CAMBIAR_ROL', rol: opcion.valor })}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                estado.rol === opcion.valor
                  ? 'bg-primary text-text-on-primary'
                  : 'bg-surface-mint text-text-muted hover:text-primary'
              }`}
            >
              <Icon name={opcion.icono} className="text-[16px]" />
              {opcion.etiqueta}
            </button>
          ))}
        </div>
      </div>

      {preguntas.map((pregunta, indice) => (
        <div key={pregunta.id} className="rounded-card border border-[var(--color-border)] bg-surface p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            {indice + 1}/{preguntas.length} · {pregunta.dimension} {pregunta.etiquetaDimension}
          </p>
          <p className="mt-1 font-semibold">{pregunta.pregunta}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-5">
            {pregunta.opciones.map((opcion) => (
              <button
                key={opcion.valor}
                type="button"
                onClick={() => elegirRespuesta(pregunta.id, opcion.valor)}
                className={`rounded-card border px-2 py-2 text-center text-xs transition ${
                  respuestas[pregunta.id] === opcion.valor
                    ? 'border-accent bg-accent/15 font-semibold'
                    : 'border-[var(--color-border)] hover:border-primary'
                }`}
              >
                {opcion.texto}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-center">
        <button
          type="button"
          disabled={!todasRespondidas}
          onClick={enviarEvaluacion}
          className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 font-semibold text-text-on-primary shadow-card transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Icon name="military_tech" className="text-[18px]" />
          Ver mi rango
        </button>
      </div>
    </div>
  )
}
