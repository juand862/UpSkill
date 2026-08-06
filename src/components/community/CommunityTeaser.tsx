import { Icon } from '@/components/ui/Icon'

interface CommunityTeaserProps {
  icono: string
  titulo: string
  descripcion: string
  etiqueta: string
  cta: string
  destacado?: boolean
}

/** Tarjeta teaser de la capa social de la ruta (CLAUDE.md, pantalla 8) — // PLACEHOLDER, sin backend */
export function CommunityTeaser({ icono, titulo, descripcion, etiqueta, cta, destacado }: CommunityTeaserProps) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-card p-6 shadow-card ${
        destacado ? 'bg-primary text-text-on-primary' : 'border border-[var(--color-border)] bg-surface'
      }`}
    >
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
      <h3 className="text-lg font-bold">{titulo}</h3>
      <p className={`text-sm ${destacado ? 'opacity-90' : 'text-text-muted'}`}>{descripcion}</p>
      <button
        type="button"
        className={`mt-auto self-start rounded-full px-4 py-1.5 text-sm font-semibold ${
          destacado ? 'bg-accent text-text-on-accent' : 'bg-surface-mint text-primary'
        }`}
      >
        {cta}
      </button>
    </div>
  )
}
