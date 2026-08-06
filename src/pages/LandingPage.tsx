import { useNavigate } from 'react-router-dom'
import { NOMBRE_EXPERIENCIA, NOMBRE_PROGRAMA, TAGLINE_CAMPANA, TAGLINE_JOURNEY } from '@/config/branding'
import { Icon } from '@/components/ui/Icon'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

/**
 * LandingPage — pantalla 1 del alcance (CLAUDE.md §3).
 *
 * Flujo confirmado: el CTA "Despega ahora" va directo al Mapa de
 * trayectoria con el estado mock por defecto; la autoevaluación de
 * placement queda disponible aparte, sin bloquear la entrada.
 */
export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen overflow-hidden text-text-on-dark" style={{ background: 'var(--gradient-hero)' }}>
      <div className="pointer-events-none absolute inset-0" style={{ background: 'var(--gradient-space-accent)' }} />

      <header className="relative flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 font-semibold">
          <Icon name="rocket_launch" />
          {NOMBRE_PROGRAMA}
        </div>
        <ThemeToggle />
      </header>

      <main className="relative mx-auto flex max-w-2xl flex-col items-center px-6 pb-24 pt-16 text-center">
        <p className="text-sm font-medium uppercase tracking-widest opacity-80">{NOMBRE_EXPERIENCIA}</p>
        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">{TAGLINE_CAMPANA}</h1>
        <p className="mt-4 text-lg opacity-90">{TAGLINE_JOURNEY}</p>
        <p className="mt-6 max-w-lg text-sm opacity-75">
          Embárcate en una ruta gamificada de capacitación en Inteligencia Artificial y lleva tu conocimiento a
          otro nivel. Completa misiones, gana XP y monedas, colecciona sellos y conviértete en referente IA.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/mapa')}
            className="flex items-center gap-2 rounded-full bg-accent px-8 py-3 font-semibold text-text-on-accent shadow-card transition hover:shadow-card-hover"
          >
            <Icon name="rocket_launch" />
            Despega ahora
          </button>
          <button
            type="button"
            onClick={() => navigate('/evaluacion')}
            className="text-sm underline decoration-dotted underline-offset-4 opacity-80 hover:opacity-100"
          >
            Prefiero autoevaluarme primero
          </button>
        </div>
      </main>
    </div>
  )
}
