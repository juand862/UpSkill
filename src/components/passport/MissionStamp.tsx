import { Icon } from '@/components/ui/Icon'
import { ICONO_POR_NIVEL } from '@/data/levelIcons'
import type { Level } from '@/data/types'

interface MissionStampProps {
  nivel: Level
  obtenido: boolean
}

/** Un sello de misión del Pasaporte — uno por nivel (CLAUDE.md, pantalla 5) */
export function MissionStamp({ nivel, obtenido }: MissionStampProps) {
  return (
    <div
      className={`flex flex-col items-center gap-1.5 rounded-card border-2 p-3 text-center ${
        obtenido
          ? 'border-accent bg-surface-beige'
          : 'border-dashed border-[var(--color-border)] bg-surface opacity-60'
      }`}
    >
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          obtenido ? 'bg-accent text-text-on-accent' : 'bg-[var(--color-node-locked)] text-text-muted'
        }`}
      >
        <Icon name={obtenido ? ICONO_POR_NIVEL[nivel.id] : 'lock'} className="text-xl" />
      </span>
      <p className="text-xs font-semibold leading-tight">{nivel.nombre}</p>
      <p className="text-[10px] text-text-muted">Nivel {nivel.id}</p>
    </div>
  )
}
