import { useExplorer } from '@/state/explorerContext'
import { Icon } from '@/components/ui/Icon'

/**
 * PersistentHUD — monedas · nivel/rango · progreso de XP · racha.
 * Visible en todas las pantallas post-landing (CLAUDE.md §3, pantalla 6).
 */
export function PersistentHUD() {
  const {
    estado: { monedas, nivelActual, rango, xpNivelActual, xpNivelObjetivo, racha },
  } = useExplorer()

  const progreso = Math.min(100, Math.round((xpNivelActual / xpNivelObjetivo) * 100))

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      {/* Monedas */}
      <div className="flex items-center gap-1.5 rounded-full bg-surface-beige px-3 py-1.5 shadow-card">
        <Icon name="monetization_on" className="text-[18px] text-accent" />
        <span className="font-semibold">{monedas.toLocaleString('es-MX')}</span>
      </div>

      {/* Nivel + rango */}
      <div className="flex items-center gap-1.5 rounded-full bg-surface-mint px-3 py-1.5 shadow-card">
        <Icon name="public" className="text-[18px] text-primary" />
        <span className="font-semibold">Nivel {nivelActual}</span>
        <span className="text-text-muted">· {rango}</span>
      </div>

      {/* Progreso XP */}
      <div className="flex min-w-32 items-center gap-2 rounded-full bg-surface px-3 py-1.5 shadow-card">
        <Icon name="bolt" className="text-[18px] text-accent" />
        <div className="h-2 w-20 overflow-hidden rounded-full bg-[var(--color-border)]">
          <div className="h-full rounded-full bg-primary" style={{ width: `${progreso}%` }} />
        </div>
        <span className="text-xs text-text-muted">
          {xpNivelActual}/{xpNivelObjetivo} XP
        </span>
      </div>

      {/* Racha */}
      <div className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 shadow-card">
        <Icon name="local_fire_department" className="text-[18px] text-accent" />
        <span className="font-semibold">{racha.dias}</span>
        <span className="text-text-muted">días</span>
      </div>
    </div>
  )
}
