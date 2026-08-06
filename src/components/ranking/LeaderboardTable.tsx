import { Icon } from '@/components/ui/Icon'
import { getRanking } from '@/data/dataService'
import { useExplorer } from '@/state/explorerContext'

const MEDALLA: Record<number, string> = { 1: '#FFBA1F', 2: '#C0C0C0', 3: '#CD7F32' }

/** Inicial visual del avatar mock, a partir del nombre (sin fotos ni datos reales) */
function inicial(nombre: string) {
  return nombre.trim().charAt(0).toUpperCase()
}

/**
 * LeaderboardTable — ranking mock por XP, con el explorador actual
 * insertado en su posición real (CLAUDE.md, pantalla 7).
 */
export function LeaderboardTable() {
  const {
    estado: { nombre, xpTotal, rango },
  } = useExplorer()

  const filas = [...getRanking(), { id: 'yo', nombre, xp: xpTotal, rango, avatarSeed: 'yo', esUsuarioActual: true }]
    .sort((a, b) => b.xp - a.xp)

  return (
    <div className="overflow-hidden rounded-card border border-[var(--color-border)] bg-surface shadow-card">
      <div className="grid grid-cols-[3rem_1fr_6rem_6rem] gap-2 border-b border-[var(--color-border)] bg-surface-beige px-4 py-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
        <span>#</span>
        <span>Explorador</span>
        <span className="text-right">Rango</span>
        <span className="text-right">XP</span>
      </div>
      {filas.map((fila, indice) => {
        const posicion = indice + 1
        const esUsuarioActual = 'esUsuarioActual' in fila && fila.esUsuarioActual
        return (
          <div
            key={fila.id}
            className={`grid grid-cols-[3rem_1fr_6rem_6rem] items-center gap-2 border-b border-[var(--color-border)] px-4 py-3 text-sm last:border-0 ${
              esUsuarioActual ? 'bg-accent/10 font-semibold' : ''
            }`}
          >
            <span className="flex items-center gap-1">
              {posicion <= 3 ? (
                <Icon name="emoji_events" className="text-lg" style={{ color: MEDALLA[posicion] }} />
              ) : (
                <span className="text-text-muted">{posicion}</span>
              )}
            </span>
            <span className="flex items-center gap-2 truncate">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-text-on-primary">
                {inicial(fila.nombre)}
              </span>
              <span className="truncate">
                {fila.nombre} {esUsuarioActual && <span className="text-accent">(tú)</span>}
              </span>
            </span>
            <span className="text-right text-text-muted">{fila.rango}</span>
            <span className="text-right">{fila.xp.toLocaleString('es-MX')}</span>
          </div>
        )
      })}
    </div>
  )
}
