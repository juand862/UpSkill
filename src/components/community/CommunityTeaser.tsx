import { Icon } from '@/components/ui/Icon'
import { useTheme } from '@/theme/ThemeContext'

interface CommunityTeaserProps {
  icono: string
  titulo: string
  descripcion: string
  etiqueta: string
  cta: string
  destacado?: boolean
  /** Ilustración de campaña (tema espacial) — CLAUDE.md §6 */
  imagenEspacial?: string
}

/** Tarjeta teaser de la capa social de la ruta (CLAUDE.md, pantalla 8) — // PLACEHOLDER, sin backend */
export function CommunityTeaser({
  icono,
  titulo,
  descripcion,
  etiqueta,
  cta,
  destacado,
  imagenEspacial,
}: CommunityTeaserProps) {
  const { tema } = useTheme()
  const mostrarImagen = destacado && tema === 'espacial' && imagenEspacial

  return (
    <div
      className={`relative flex flex-col gap-3 overflow-hidden rounded-card p-6 shadow-card ${
        destacado ? 'bg-primary text-text-on-primary' : 'border border-[var(--color-border)] bg-surface'
      }`}
    >
      {mostrarImagen && (
        <img
          src={imagenEspacial}
          alt=""
          className="pointer-events-none absolute -right-3 -top-3 w-28 opacity-95 sm:w-32"
        />
      )}
      <div className="flex items-center gap-2">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            destacado ? 'bg-white/15' : 'bg-surface-mint text-primary'
          }`}
        >
          <Icon name={icono} className="text-xl" />
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            destacado ? 'bg-white/15' : 'bg-surface-beige text-text-muted'
          }`}
        >
          {etiqueta}
        </span>
      </div>
      <h3 className={`text-lg font-bold ${mostrarImagen ? 'max-w-[65%]' : ''}`}>{titulo}</h3>
      <p className={`text-sm ${mostrarImagen ? 'max-w-[75%]' : ''} ${destacado ? 'opacity-90' : 'text-text-muted'}`}>
        {descripcion}
      </p>
      <button
        type="button"
        className={`relative mt-auto self-start rounded-full px-4 py-1.5 text-sm font-semibold ${
          destacado ? 'bg-accent text-text-on-accent' : 'bg-surface-mint text-primary'
        }`}
      >
        {cta}
      </button>
    </div>
  )
}
