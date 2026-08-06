import { useEffect, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { getRanking } from '@/data/dataService'
import { useExplorer } from '@/state/explorerContext'
import { listarRankingUsuarios, isSupabaseConfigured } from '@/backend/usersService'
import type { UsuarioDB } from '@/backend/types'

const MEDALLA: Record<number, string> = { 1: '#FFBA1F', 2: '#C0C0C0', 3: '#CD7F32' }

/** Inicial visual del avatar mock, a partir del nombre (sin fotos ni datos reales) */
function inicial(nombre: string) {
  return nombre.trim().charAt(0).toUpperCase()
}

interface FilaRanking {
  id: string
  nombreMostrado: string
  xp: number
  rango: string
  esUsuarioActual: boolean
}

/**
 * LeaderboardTable — ranking por XP (CLAUDE.md, pantalla 7).
 *
 * Si hay una BD conectada (Supabase) con al menos un explorador real
 * registrado, muestra ese ranking real (por alias, no por nombre — cero
 * PII expuesta públicamente). Si no, cae al ranking mock de siempre con
 * el explorador local insertado en su posición.
 */
export function LeaderboardTable() {
  const { estado } = useExplorer()
  const [usuariosReales, setUsuariosReales] = useState<UsuarioDB[] | null>(null)
  const [cargando, setCargando] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    listarRankingUsuarios(20)
      .then(setUsuariosReales)
      .catch((error: unknown) => {
        // eslint-disable-next-line no-console
        console.error('[ranking] no se pudo cargar el ranking real de Supabase:', error)
        setUsuariosReales(null)
      })
      .finally(() => setCargando(false))
  }, [])

  const hayDatosReales = usuariosReales !== null && usuariosReales.length > 0

  const filas: FilaRanking[] = hayDatosReales
    ? usuariosReales!.map((u) => ({
        id: u.id,
        nombreMostrado: u.alias ?? u.nombre,
        xp: u.xp_total,
        rango: u.rango,
        esUsuarioActual: estado.correo !== null && u.correo.toLowerCase() === estado.correo.toLowerCase(),
      }))
    : [
        ...getRanking().map((r) => ({ id: r.id, nombreMostrado: r.nombre, xp: r.xp, rango: r.rango, esUsuarioActual: false })),
        {
          id: 'yo',
          nombreMostrado: estado.alias ?? estado.nombre,
          xp: estado.xpTotal,
          rango: estado.rango,
          esUsuarioActual: true,
        },
      ].sort((a, b) => b.xp - a.xp)

  if (cargando) {
    return (
      <div className="rounded-card border border-[var(--color-border)] bg-surface p-8 text-center text-sm text-text-muted shadow-card">
        Cargando ranking…
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
        <Icon name={hayDatosReales ? 'database' : 'science'} className="text-[14px]" />
        {hayDatosReales ? 'Ranking real, desde la base de datos' : 'Ranking de demostración (datos mock)'}
      </p>
      <div className="overflow-hidden rounded-card border border-[var(--color-border)] bg-surface shadow-card">
        <div className="grid grid-cols-[3rem_1fr_6rem_6rem] gap-2 border-b border-[var(--color-border)] bg-surface-beige px-4 py-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
          <span>#</span>
          <span>Explorador</span>
          <span className="text-right">Rango</span>
          <span className="text-right">XP</span>
        </div>
        {filas.map((fila, indice) => {
          const posicion = indice + 1
          return (
            <div
              key={fila.id}
              className={`grid grid-cols-[3rem_1fr_6rem_6rem] items-center gap-2 border-b border-[var(--color-border)] px-4 py-3 text-sm last:border-0 ${
                fila.esUsuarioActual ? 'bg-accent/10 font-semibold' : ''
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
                  {inicial(fila.nombreMostrado)}
                </span>
                <span className="truncate">
                  {fila.nombreMostrado} {fila.esUsuarioActual && <span className="text-accent">(tú)</span>}
                </span>
              </span>
              <span className="text-right text-text-muted">{fila.rango}</span>
              <span className="text-right">{fila.xp.toLocaleString('es-MX')}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
