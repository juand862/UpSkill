import { Icon } from '@/components/ui/Icon'
import { ICONO_POR_NIVEL } from '@/data/levelIcons'
import { PLANETA_POR_NIVEL } from '@/assets/espacial'
import { useTheme } from '@/theme/ThemeContext'
import type { Level } from '@/data/types'

export type EstadoNodo = 'bloqueado' | 'activo' | 'completado'

const ESTILO_POR_ESTADO: Record<EstadoNodo, string> = {
  bloqueado: 'bg-[var(--color-node-locked)] text-text-muted',
  activo: 'bg-[var(--color-node-active)] text-text-on-accent ring-4 ring-accent/30',
  completado: 'bg-[var(--color-node-done)] text-text-on-accent',
}

interface PlanetNodeProps {
  nivel: Level
  estado: EstadoNodo
  onSeleccionar: (nivel: Level) => void
}

export function PlanetNode({ nivel, estado, onSeleccionar }: PlanetNodeProps) {
  const interactivo = estado !== 'bloqueado'
  const { tema } = useTheme()

  return (
    <button
      type="button"
      disabled={!interactivo}
      onClick={() => onSeleccionar(nivel)}
      className={`group flex w-32 shrink-0 flex-col items-center gap-2 rounded-card p-2 text-center transition ${
        interactivo ? 'cursor-pointer hover:-translate-y-1' : 'cursor-not-allowed opacity-80'
      }`}
    >
      {tema === 'espacial' ? (
        // Capa ilustrativa de campaña: el planeta real del arte de referencia (CLAUDE.md §6)
        <span className="relative flex h-20 w-24 items-center justify-center">
          <span
            className={`h-20 w-24 rounded-2xl bg-cover bg-center shadow-card ${
              estado === 'bloqueado' ? 'opacity-35 grayscale' : ''
            } ${estado === 'activo' ? 'ring-4 ring-accent/50' : ''}`}
            style={{ backgroundImage: `url(${PLANETA_POR_NIVEL[nivel.id]})` }}
          />
          {estado === 'bloqueado' && (
            <span className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white">
              <Icon name="lock" className="text-base" />
            </span>
          )}
          {estado === 'activo' && (
            <span className="absolute -top-2 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-text-on-primary shadow-card">
              <Icon name="my_location" className="text-[14px]" />
            </span>
          )}
          {estado === 'completado' && (
            <span className="absolute -top-2 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-text-on-accent shadow-card">
              <Icon name="check" className="text-[14px]" />
            </span>
          )}
        </span>
      ) : (
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full shadow-card">
          <span className={`flex h-16 w-16 items-center justify-center rounded-full ${ESTILO_POR_ESTADO[estado]}`}>
            <Icon name={estado === 'bloqueado' ? 'lock' : ICONO_POR_NIVEL[nivel.id]} className="text-2xl" />
          </span>
          {estado === 'activo' && (
            <span className="absolute -top-2 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-text-on-primary shadow-card">
              <Icon name="my_location" className="text-[14px]" />
            </span>
          )}
          {estado === 'completado' && (
            <span className="absolute -top-2 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-text-on-accent shadow-card">
              <Icon name="check" className="text-[14px]" />
            </span>
          )}
        </span>
      )}

      <div>
        <p className="text-xs font-medium text-text-muted">Nivel {nivel.id}</p>
        <p className="text-sm font-semibold leading-tight">{nivel.nombre}</p>
        <span className="mt-1 inline-block rounded-full bg-surface-beige px-2 py-0.5 text-[10px] font-medium text-text-muted">
          {nivel.aaa}
        </span>
      </div>
    </button>
  )
}
