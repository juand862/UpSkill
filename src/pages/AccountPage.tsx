import { IdentityForm } from '@/components/auth/IdentityForm'
import { Icon } from '@/components/ui/Icon'
import { useExplorer, useCerrarSesion } from '@/state/explorerContext'
import { isSupabaseConfigured } from '@/backend/usersService'

function formatearFecha(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })
}

export function AccountPage() {
  const { estado } = useExplorer()
  const cerrarSesion = useCerrarSesion()
  const identificado = Boolean(estado.correo)

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Mi cuenta</h1>
        <p className="mt-1 text-sm text-text-muted">
          {isSupabaseConfigured
            ? 'Identifícate con tu correo @covalto.com para que tu progreso se guarde en la base de datos real y aparezcas en el Ranking con tu alias.'
            : 'Esta sección requiere una base de datos conectada (ver README).'}
        </p>
      </div>

      {identificado ? (
        <div className="space-y-4 rounded-card border border-[var(--color-border)] bg-surface p-6 shadow-card">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-text-on-primary">
              <Icon name="verified_user" className="text-2xl" />
            </span>
            <div>
              <p className="font-bold">{estado.nombre}</p>
              <p className="text-sm text-text-muted">{estado.correo}</p>
            </div>
          </div>

          <div className="space-y-1 border-t border-[var(--color-border)] pt-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Alias público</span>
              <span className="font-semibold">{estado.alias ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Registrado</span>
              <span className="font-semibold">{formatearFecha(estado.fechaRegistro)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Último acceso</span>
              <span className="font-semibold">{formatearFecha(estado.ultimoAcceso)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={cerrarSesion}
            className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-text-muted transition hover:border-primary hover:text-primary"
          >
            <Icon name="logout" className="text-[18px]" />
            Cerrar sesión (volver al modo local)
          </button>
        </div>
      ) : (
        <IdentityForm />
      )}
    </div>
  )
}
