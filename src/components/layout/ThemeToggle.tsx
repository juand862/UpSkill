import { useTheme } from '@/theme/ThemeContext'
import { Icon } from '@/components/ui/Icon'

/**
 * Selector visible de tema — permite alternar 'covalto' | 'espacial' en vivo
 * para la demo a stakeholders (CLAUDE.md §6, decisión de marca abierta).
 */
export function ThemeToggle() {
  const { tema, alternarTema } = useTheme()

  return (
    <button
      type="button"
      onClick={alternarTema}
      title="Alternar tema visual (prototipo — decisión de marca abierta)"
      className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-surface px-3 py-1.5 text-sm font-medium text-text shadow-card transition hover:shadow-card-hover"
    >
      <Icon name={tema === 'covalto' ? 'rocket_launch' : 'auto_awesome'} className="text-[18px]" />
      <span className="hidden sm:inline">{tema === 'covalto' ? 'Tema Covalto' : 'Tema Espacial'}</span>
    </button>
  )
}
