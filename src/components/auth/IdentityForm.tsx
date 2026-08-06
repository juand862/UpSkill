import { useState, type FormEvent } from 'react'
import { Icon } from '@/components/ui/Icon'
import { useExplorer } from '@/state/explorerContext'
import {
  crearUsuario,
  obtenerUsuarioPorCorreo,
  validarCorreoCovalto,
  isSupabaseConfigured,
} from '@/backend/usersService'
import { usuarioDbAEstado } from '@/backend/mapping'

/**
 * IdentityForm — registro/inicio "sin contraseña" por correo @covalto.com.
 *
 * // PLACEHOLDER de seguridad: no hay verificación real del correo (sin
 * magic link ni Supabase Auth) — cualquiera puede escribir cualquier
 * correo @covalto.com. Suficiente para una demo de prototipo, no para
 * producción. Ver nota en supabase/migrations/0001_usuarios.sql.
 */
export function IdentityForm() {
  const { estado, dispatch } = useExplorer()
  const [nombre, setNombre] = useState('')
  const [alias, setAlias] = useState('')
  const [correo, setCorreo] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isSupabaseConfigured) {
    return (
      <div className="rounded-card border border-dashed border-[var(--color-border)] bg-surface p-6 text-sm text-text-muted">
        <p className="flex items-center gap-2 font-semibold text-text">
          <Icon name="cloud_off" className="text-[18px]" />
          La base de datos no está conectada en este entorno
        </p>
        <p className="mt-2">
          Para identificarte y guardar tu progreso real, define <code>VITE_SUPABASE_URL</code> y{' '}
          <code>VITE_SUPABASE_ANON_KEY</code> (ver README). Mientras tanto, el prototipo sigue funcionando en modo
          local con datos de demo.
        </p>
      </div>
    )
  }

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault()
    setError(null)

    if (!nombre.trim()) {
      setError('Escribe tu nombre.')
      return
    }
    if (!validarCorreoCovalto(correo)) {
      setError('El correo debe ser del dominio @covalto.com')
      return
    }

    setCargando(true)
    try {
      const existente = await obtenerUsuarioPorCorreo(correo)
      const usuario = existente ?? (await crearUsuario({ nombre, alias: alias || undefined, correo, rol: estado.rol }))
      dispatch({ type: 'IDENTIFICAR_USUARIO', estado: usuarioDbAEstado(usuario) })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo conectar con la base de datos. Intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <form onSubmit={enviar} className="space-y-4 rounded-card border border-[var(--color-border)] bg-surface p-6 shadow-card">
      <div>
        <h2 className="text-lg font-bold">Identifícate con tu correo Covalto</h2>
        <p className="mt-1 text-sm text-text-muted">
          Si ya tienes progreso guardado con este correo, lo recuperamos. Si no, creamos tu explorador desde cero.
        </p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Nombre</span>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre completo"
            className="w-full rounded-full border border-[var(--color-border)] bg-bg px-4 py-2 text-sm outline-none focus:border-primary"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium">Alias (público, se muestra en el Ranking)</span>
          <input
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            placeholder="Opcional — p. ej. NovaExplorador"
            className="w-full rounded-full border border-[var(--color-border)] bg-bg px-4 py-2 text-sm outline-none focus:border-primary"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium">Correo Covalto</span>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="tu.nombre@covalto.com"
            className="w-full rounded-full border border-[var(--color-border)] bg-bg px-4 py-2 text-sm outline-none focus:border-primary"
          />
        </label>
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-sm text-red-600">
          <Icon name="error" className="text-[16px]" />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={cargando}
        className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-text-on-primary shadow-card transition disabled:opacity-60"
      >
        <Icon name={cargando ? 'progress_activity' : 'login'} className="text-[18px]" />
        {cargando ? 'Conectando…' : 'Entrar'}
      </button>
    </form>
  )
}
