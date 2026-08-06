import { Icon } from '@/components/ui/Icon'
import { ICONO_POR_NIVEL } from '@/data/levelIcons'
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

  return (
    <button
      type="button"
      disabled={!interactivo}
      onClick={() => onSeleccionar(nivel)}
      className={`group flex w-32 shrink-0 flex-col items-center gap-2 rounded-card p-2 text-center transition ${
        interactivo ? 'cursor-pointer hover:-translate-y-1' : 'cursor-not-allowed opacity-80'
      }`}
    >
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
