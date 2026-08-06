import { RewardCard } from '@/components/rewards/RewardCard'
import { getRewards } from '@/data/dataService'
import { useExplorer } from '@/state/explorerContext'

export function RewardsPage() {
  const {
    estado: { monedas, recompensasCanjeadas },
    dispatch,
  } = useExplorer()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Recompensas</h1>
        <p className="mt-1 text-sm text-text-muted">
          Catálogo 100% no monetario: reconocimiento, tiempo protegido, acceso a eventos y visibilidad. Canjea con
          tus Monedas Covalto.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {getRewards().map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            monedasDisponibles={monedas}
            canjeada={recompensasCanjeadas.includes(reward.id)}
            onCanjear={() =>
              dispatch({ type: 'CANJEAR_RECOMPENSA', recompensaId: reward.id, costoMonedas: reward.costoMonedas })
            }
          />
        ))}
      </div>
    </div>
  )
}
