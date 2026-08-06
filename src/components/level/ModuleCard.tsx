import { Icon } from '@/components/ui/Icon'
import type { Module } from '@/data/types'

interface ModuleCardProps {
  modulo: Module
  completado: boolean
  onCompletar: () => void
}

const FUENTE_LABEL: Record<Module['fuenteConceptual'], string> = {
  F1: 'F1 · Formación Google',
  F2: 'F2 · Labs EUC',
  AKB: 'AKB · Skills',
}

/**
 * ModuleCard — un módulo dentro del detalle de nivel.
 *
 * Refleja visualmente la métrica dual no negociable (CLAUDE.md §5): los
 * módulos "aplica" (aplicar IA a trabajo real) se destacan con el acento
 * de marca y muestran más XP que los "aprende" (consumir contenido).
 */
export function ModuleCard({ modulo, completado, onCompletar }: ModuleCardProps) {
  const esAplica = modulo.tipo === 'aplica'

  return (
    <div
      className={`flex flex-col gap-3 rounded-card border bg-surface p-5 shadow-card sm:flex-row sm:items-center sm:justify-between ${
        esAplica ? 'border-accent/40' : 'border-[var(--color-border)]'
      }`}
    >
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              esAplica ? 'bg-accent text-text-on-accent' : 'bg-surface-mint text-primary'
            }`}
          >
            {esAplica ? 'Aplica · trabajo real' : 'Aprende'}
          </span>
          <span className="text-xs text-text-muted">{FUENTE_LABEL[modulo.fuenteConceptual]}</span>
        </div>
        <h3 className="mt-2 font-semibold">{modulo.titulo}</h3>
        <p className="mt-1 text-sm text-text-muted">{modulo.descripcion}</p>
        <div className="mt-2 flex items-center gap-3 text-sm">
          <span className={`flex items-center gap-1 font-semibold ${esAplica ? 'text-accent' : 'text-text-muted'}`}>
            <Icon name="bolt" className="text-[16px]" />
            {modulo.xp} XP
          </span>
          <span className="flex items-center gap-1 text-text-muted">
            <Icon name="monetization_on" className="text-[16px]" />
            {modulo.monedas}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onCompletar}
        disabled={completado}
        className={`flex shrink-0 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold shadow-card transition ${
          completado
            ? 'cursor-default bg-surface-mint text-primary'
            : 'bg-primary text-text-on-primary hover:shadow-card-hover'
        }`}
      >
        <Icon name={completado ? 'check_circle' : 'play_circle'} className="text-[18px]" />
        {completado ? 'Completado' : 'Completar'}
      </button>
    </div>
  )
}
