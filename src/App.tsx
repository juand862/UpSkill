import { NOMBRE_EXPERIENCIA, NOMBRE_PROGRAMA, TAGLINE_CAMPANA } from '@/config/branding'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Icon } from '@/components/ui/Icon'

/**
 * App.tsx — checkpoint del Bloque 1.
 *
 * // PLACEHOLDER: esta pantalla es una vitrina temporal del sistema de diseño
 * (tokens de marca + flag de tema). Se reemplaza en el Bloque 2 por el
 * layout real con enrutamiento (React Router) y el HUD persistente.
 */
const SWATCHES = [
  { nombre: 'Verde primario', variable: '--color-primary' },
  { nombre: 'Verde-2', variable: '--color-primary-2' },
  { nombre: 'Verde-3', variable: '--color-primary-3' },
  { nombre: 'Ámbar acento', variable: '--color-accent' },
  { nombre: 'Verde menta', variable: '--color-mint' },
]

function App() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 font-semibold text-primary">
          <Icon name="rocket_launch" />
          {NOMBRE_PROGRAMA} · {NOMBRE_EXPERIENCIA}
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-16">
        {/* Hero con el motivo espacial como capa ilustrativa sobre la marca */}
        <section
          className="relative overflow-hidden rounded-card p-10 text-text-on-dark shadow-card"
          style={{ background: 'var(--gradient-hero)' }}
        >
          <div className="pointer-events-none absolute inset-0" style={{ background: 'var(--gradient-space-accent)' }} />
          <p className="relative text-sm font-medium uppercase tracking-wide opacity-80">
            Bloque 1 · Tokens de marca + flag de tema
          </p>
          <h1 className="relative mt-2 text-3xl font-bold">{TAGLINE_CAMPANA}</h1>
          <p className="relative mt-3 max-w-xl opacity-90">
            Sistema de diseño Covalto³ con tema <strong>{NOMBRE_EXPERIENCIA}</strong>. Usa el botón de la
            esquina superior para alternar entre el tema <em>Covalto</em> (default) y el tema{' '}
            <em>Espacial</em> de campaña.
          </p>
        </section>

        {/* Paleta de marca */}
        <section className="mt-8 rounded-card border border-[var(--color-border)] bg-surface p-6 shadow-card">
          <h2 className="mb-4 text-lg font-semibold">Paleta de marca</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {SWATCHES.map((s) => (
              <div key={s.variable} className="text-center">
                <div
                  className="mx-auto h-14 w-14 rounded-full border border-[var(--color-border)] shadow-card"
                  style={{ background: `var(${s.variable})` }}
                />
                <p className="mt-2 text-xs text-text-muted">{s.nombre}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Muestra de superficies + tipografía + íconos */}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-card bg-surface-mint p-4 shadow-card">
            <Icon name="eco" className="text-primary" />
            <p className="mt-2 text-sm">Superficie menta</p>
          </div>
          <div className="rounded-card bg-surface-beige p-4 shadow-card">
            <Icon name="star" className="text-accent" />
            <p className="mt-2 text-sm">Superficie beige</p>
          </div>
          <div className="rounded-card bg-primary p-4 text-text-on-primary shadow-card">
            <Icon name="military_tech" />
            <p className="mt-2 text-sm">Tipografía Noto Sans + íconos Material Symbols</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
