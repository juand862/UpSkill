import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getLevelById, getModulesByLevel } from '@/data/dataService'
import { useExplorer } from '@/state/explorerContext'
import { ModuleCard } from '@/components/level/ModuleCard'
import { Icon } from '@/components/ui/Icon'
import { PlaceholderScreen } from '@/components/ui/PlaceholderScreen'

const NIVEL_MAXIMO = 6

export function LevelDetailPage() {
  const { levelId } = useParams()
  const nivelId = Number(levelId)
  const nivel = getLevelById(nivelId)
  const navigate = useNavigate()
  const {
    estado: { nivelActual, sellosObtenidos, modulosCompletados, rol },
    dispatch,
  } = useExplorer()
  const [sonrisaSello, setSonrisaSello] = useState(false)

  if (!nivel) {
    return (
      <PlaceholderScreen
        icono="error"
        titulo="Nivel no encontrado"
        bloque={5}
        descripcion="Este nivel no existe en la trayectoria. Vuelve al mapa para elegir uno válido."
      />
    )
  }

  const desbloqueado = sellosObtenidos.includes(nivel.id) || nivel.id <= nivelActual
  const modulos = getModulesByLevel(nivel.id, rol)
  const completados = modulos.filter((m) => modulosCompletados.includes(m.id))
  const nivelYaCompletado = sellosObtenidos.includes(nivel.id)

  if (!desbloqueado) {
    return (
      <div className="space-y-4">
        <PlaceholderScreen
          icono="lock"
          titulo={`${nivel.nombre} está bloqueado`}
          bloque={4}
          descripcion="Completa los niveles anteriores en el mapa de trayectoria para desbloquear este contenido."
        />
        <div className="text-center">
          <Link to="/mapa" className="text-sm font-medium text-primary underline underline-offset-4">
            Volver al mapa
          </Link>
        </div>
      </div>
    )
  }

  const completarModulo = (moduloId: string) => {
    const modulo = modulos.find((m) => m.id === moduloId)
    if (!modulo || modulosCompletados.includes(moduloId)) return

    const pendientesTrasEste = modulos.filter(
      (m) => m.id !== moduloId && !modulosCompletados.includes(m.id),
    )
    const esUltimoDelNivel = pendientesTrasEste.length === 0

    const siguienteNivelId = Math.min(nivel.id + 1, NIVEL_MAXIMO)
    const siguienteNivel = getLevelById(siguienteNivelId)

    dispatch({
      type: 'COMPLETAR_MODULO',
      moduloId: modulo.id,
      xp: modulo.xp,
      monedas: modulo.monedas,
      completaNivel: esUltimoDelNivel
        ? {
            nivelId: nivel.id,
            siguienteNivelId,
            siguienteXpObjetivo: siguienteNivel?.xpObjetivo ?? nivel.xpObjetivo,
          }
        : undefined,
    })

    if (esUltimoDelNivel) setSonrisaSello(true)
  }

  return (
    <div className="space-y-6">
      <Link to="/mapa" className="flex items-center gap-1 text-sm text-text-muted hover:text-primary">
        <Icon name="arrow_back" className="text-[16px]" />
        Mapa de trayectoria
      </Link>

      <div className="rounded-card border border-[var(--color-border)] bg-surface p-6 shadow-card">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-surface-beige px-2.5 py-0.5 text-xs font-semibold text-text-muted">
            Nivel {nivel.id} · {nivel.aaa}
          </span>
          {nivelYaCompletado && (
            <span className="flex items-center gap-1 rounded-full bg-surface-mint px-2.5 py-0.5 text-xs font-semibold text-primary">
              <Icon name="check_circle" className="text-[14px]" />
              Sello obtenido
            </span>
          )}
        </div>
        <h1 className="mt-2 text-2xl font-bold">{nivel.nombre}</h1>
        <p className="mt-1 text-sm text-text-muted">{nivel.senalDominio}</p>
        <p className="mt-3 text-sm font-medium text-text-muted">
          {completados.length}/{modulos.length} módulos completados
        </p>
      </div>

      {sonrisaSello && (
        <div className="flex items-center justify-between gap-3 rounded-card bg-accent/15 px-5 py-4 text-sm">
          <span className="flex items-center gap-2 font-semibold text-primary">
            <Icon name="workspace_premium" />
            ¡Sello de {nivel.nombre} obtenido! Desbloqueaste el siguiente nivel.
          </span>
          <button
            type="button"
            onClick={() => navigate('/mapa')}
            className="shrink-0 rounded-full bg-primary px-4 py-1.5 font-semibold text-text-on-primary"
          >
            Ver mapa
          </button>
        </div>
      )}

      <div className="space-y-3">
        {modulos.map((modulo) => (
          <ModuleCard
            key={modulo.id}
            modulo={modulo}
            completado={modulosCompletados.includes(modulo.id)}
            onCompletar={() => completarModulo(modulo.id)}
          />
        ))}
      </div>
    </div>
  )
}
