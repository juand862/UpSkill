import { Icon } from '@/components/ui/Icon'
import type { CategoriaRecompensa, Reward } from '@/data/types'

const CATEGORIA: Record<CategoriaRecompensa, { icono: string; etiqueta: string }> = {
  reconocimiento: { icono: 'star', etiqueta: 'Reconocimiento' },
  tiempo_protegido: { icono: 'schedule', etiqueta: 'Tiempo protegido' },
  acceso_eventos: { icono: 'confirmation_number', etiqueta: 'Acceso a eventos' },
  visibilidad: { icono: 'visibility', etiqueta: 'Visibilidad' },
}

interface RewardCardProps {
  reward: Reward
  monedasDisponibles: number
  canjeada: boolean
  onCanjear: () => void
}

/**
 * RewardCard — catálogo de recompensas 100% no monetarias (CLAUDE.md §7).
 * `placeholder: true` en el dato de origen marca que esto es un mock: sin
 * lógica de dinero/becas, solo reconocimiento y beneficios simbólicos.
 */
export function RewardCard({ reward, monedasDisponibles, canjeada, onCanjear }: RewardCardProps) {
  const { icono, etiqueta } = CATEGORIA[reward.categoria]
  const alcanza = monedasDisponibles >= reward.costoMonedas

  return (
    <div className="flex flex-col gap-3 rounded-card border border-[var(--color-border)] bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 rounded-full bg-surface-mint px-2.5 py-1 text-xs font-semibold text-primary">
          <Icon name={icono} className="text-[16px]" />
          {etiqueta}
        </span>
        <span className="rounded-full bg-surface-beige px-2 py-0.5 text-[10px] font-medium text-text-muted">
          Placeholder
        </span>
      </div>
      <h3 className="font-semibold">{reward.titulo}</h3>
      <p className="text-sm text-text-muted">{reward.descripcion}</p>
      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="flex items-center gap-1 text-sm font-semibold">
          <Icon name="monetization_on" className="text-[16px] text-accent" />
          {reward.costoMonedas}
        </span>
        <button
          type="button"
          onClick={onCanjear}
          disabled={canjeada || !alcanza}
          className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
            canjeada
              ? 'cursor-default bg-surface-mint text-primary'
              : alcanza
                ? 'bg-primary text-text-on-primary hover:shadow-card-hover'
                : 'cursor-not-allowed bg-surface-beige text-text-muted'
          }`}
        >
          <Icon name={canjeada ? 'check_circle' : 'redeem'} className="text-[16px]" />
          {canjeada ? 'Canjeada' : alcanza ? 'Canjear' : 'Monedas insuficientes'}
        </button>
      </div>
    </div>
  )
}
