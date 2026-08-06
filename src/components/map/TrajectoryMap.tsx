import { useNavigate } from 'react-router-dom'
import { getLevels } from '@/data/dataService'
import { useExplorer } from '@/state/explorerContext'
import { PlanetNode, type EstadoNodo } from '@/components/map/PlanetNode'
import type { Level } from '@/data/types'

/** Resuelve el estado visual de un nivel a partir del progreso del explorador */
function calcularEstado(nivel: Level, nivelActual: number, sellosObtenidos: number[]): EstadoNodo {
  if (sellosObtenidos.includes(nivel.id)) return 'completado'
  if (nivel.id === nivelActual) return 'activo'
  if (nivel.id < nivelActual) return 'completado' // por si el sello no se registró aún
  return 'bloqueado'
}

/**
 * TrajectoryMap — los 6 niveles como "planetas" conectados por una
 * trayectoria, con estado bloqueado/activo/completado (CLAUDE.md, pantalla 3).
 */
export function TrajectoryMap() {
  const niveles = getLevels()
  const {
    estado: { nivelActual, sellosObtenidos },
  } = useExplorer()
  const navigate = useNavigate()

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex min-w-max items-start gap-0 px-2">
        {niveles.map((nivel, indice) => {
          const estadoNodo = calcularEstado(nivel, nivelActual, sellosObtenidos)
          return (
            <div key={nivel.id} className="flex items-center">
              {indice > 0 && (
                <div
                  className="mt-8 h-0.5 w-10 shrink-0 sm:w-16"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(to right, var(--color-border) 0, var(--color-border) 6px, transparent 6px, transparent 12px)',
                  }}
                />
              )}
              <PlanetNode nivel={nivel} estado={estadoNodo} onSeleccionar={(n) => navigate(`/nivel/${n.id}`)} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
