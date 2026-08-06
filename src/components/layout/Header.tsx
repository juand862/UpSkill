import { NavLink } from 'react-router-dom'
import { NOMBRE_EXPERIENCIA } from '@/config/branding'
import { Icon } from '@/components/ui/Icon'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { PersistentHUD } from '@/components/hud/PersistentHUD'
import { useReiniciarProgreso } from '@/state/explorerContext'

const NAV_ITEMS = [
  { to: '/mapa', label: 'Mapa', icono: 'route' },
  { to: '/pasaporte', label: 'Pasaporte', icono: 'badge' },
  { to: '/ranking', label: 'Ranking', icono: 'leaderboard' },
  { to: '/comunidad', label: 'Comunidad', icono: 'groups' },
  { to: '/recompensas', label: 'Recompensas', icono: 'redeem' },
]

/** Enlace de navegación con estado activo resaltado */
function NavItem({ to, label, icono }: (typeof NAV_ITEMS)[number]) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
          isActive ? 'bg-primary text-text-on-primary' : 'text-text-muted hover:bg-surface-mint'
        }`
      }
    >
      <Icon name={icono} className="text-[18px]" />
      <span className="hidden md:inline">{label}</span>
    </NavLink>
  )
}

export function Header() {
  const reiniciarProgreso = useReiniciarProgreso()

  const confirmarReinicio = () => {
    // eslint-disable-next-line no-alert -- confirmación simple, prototipo sin modal propio todavía
    if (window.confirm('¿Reiniciar todo tu progreso? Se perderán XP, monedas, sellos y racha.')) {
      reiniciarProgreso()
    }
  }

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <NavLink to="/mapa" className="flex items-center gap-2 font-semibold text-primary">
          <Icon name="rocket_launch" />
          {NOMBRE_EXPERIENCIA}
        </NavLink>

        <nav className="flex flex-wrap items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={confirmarReinicio}
            title="Reiniciar progreso (prototipo)"
            className="flex items-center gap-1 rounded-full border border-[var(--color-border)] px-2.5 py-1.5 text-text-muted transition hover:text-primary"
          >
            <Icon name="restart_alt" className="text-[18px]" />
          </button>
        </div>

        <div className="w-full border-t border-[var(--color-border)] pt-3">
          <PersistentHUD />
        </div>
      </div>
    </header>
  )
}
