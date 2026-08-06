import { Icon } from '@/components/ui/Icon'

interface PlaceholderScreenProps {
  icono: string
  titulo: string
  /** Número de bloque del §10 de CLAUDE.md donde se construye esta pantalla */
  bloque: number
  descripcion: string
}

/**
 * // PLACEHOLDER: pantalla temporal para rutas cuyo contenido real llega en
 * un bloque posterior del build (CLAUDE.md §10). Mantiene la navegación
 * completa del prototipo desde el Bloque 2.
 */
export function PlaceholderScreen({ icono, titulo, bloque, descripcion }: PlaceholderScreenProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-[var(--color-border)] bg-surface px-6 py-16 text-center shadow-card">
      <Icon name={icono} className="text-4xl text-primary" />
      <h1 className="text-xl font-semibold">{titulo}</h1>
      <p className="max-w-md text-sm text-text-muted">{descripcion}</p>
      <span className="mt-2 rounded-full bg-surface-beige px-3 py-1 text-xs font-medium text-text-muted">
        Se construye en el Bloque {bloque}
      </span>
    </div>
  )
}
