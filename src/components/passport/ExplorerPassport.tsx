import { Icon } from '@/components/ui/Icon'
import { MissionStamp } from '@/components/passport/MissionStamp'
import { getLevels } from '@/data/dataService'
import { useExplorer } from '@/state/explorerContext'
import { useTheme } from '@/theme/ThemeContext'
import { astronautaMini, pasaporteLibro } from '@/assets/espacial'
import { ID_EXPLORADOR_MOCK } from '@/state/types'

const ETIQUETA_ROL: Record<string, string> = {
  tecnico: 'Rol técnico',
  no_tecnico: 'Rol no técnico',
}

/**
 * ExplorerPassport — perfil + sellos de misión + estadísticas (CLAUDE.md,
 * pantalla 5), con la metáfora de "pasaporte" a dos páginas del arte de
 * referencia, reinterpretada con el sistema de diseño Covalto.
 */
export function ExplorerPassport() {
  const {
    estado: { nombre, rol, rango, nivelActual, xpTotal, monedas, racha, sellosObtenidos },
  } = useExplorer()
  const { tema } = useTheme()
  const niveles = getLevels()

  return (
    <div className="space-y-6">
      {tema === 'espacial' && (
        <div className="flex justify-center rounded-card bg-surface p-3 shadow-card">
          <img
            src={pasaporteLibro}
            alt="Pasaporte del Explorador IA — ilustración de campaña"
            className="max-h-64 rounded-lg object-contain"
          />
        </div>
      )}

      <div className="grid gap-4 rounded-card bg-surface-beige p-4 shadow-card md:grid-cols-[1fr_1.4fr] md:p-6">
        {/* Página izquierda: perfil */}
        <div className="rounded-card bg-surface p-6 shadow-card">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
            <Icon name="badge" className="text-[16px]" />
            Pasaporte del Explorador IA
          </div>

          <div className="mt-4 flex flex-col items-center text-center">
            {tema === 'espacial' ? (
              <img
                src={astronautaMini}
                alt=""
                className="h-20 w-20 rounded-full object-cover shadow-card ring-2 ring-accent/50"
              />
            ) : (
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-text-on-primary shadow-card">
                <Icon name="rocket_launch" className="text-3xl" />
              </span>
            )}
            <p className="mt-3 text-lg font-bold">{nombre}</p>
            <p className="text-xs text-text-muted">ID explorador: {ID_EXPLORADOR_MOCK}</p>
            <p className="mt-1 text-xs text-text-muted">{ETIQUETA_ROL[rol]}</p>
          </div>

          <div className="mt-5 space-y-1 border-t border-[var(--color-border)] pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Nivel actual</span>
              <span className="font-semibold">{nivelActual} / 6</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Rango</span>
              <span className="font-semibold">{rango}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Sellos obtenidos</span>
              <span className="font-semibold">{sellosObtenidos.length} / 6</span>
            </div>
          </div>
        </div>

        {/* Página derecha: sellos de misión */}
        <div className="rounded-card bg-surface p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Sellos de misión</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {niveles.map((nivel) => (
              <MissionStamp key={nivel.id} nivel={nivel} obtenido={sellosObtenidos.includes(nivel.id)} />
            ))}
          </div>
          <p className="mt-4 text-xs text-text-muted">
            {sellosObtenidos.length < 6
              ? 'Sigue completando misiones para convertirte en Experto IA.'
              : '¡Trayectoria completa! Eres un referente Experto IA.'}
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile icono="monetization_on" etiqueta="Monedas Covalto" valor={monedas.toLocaleString('es-MX')} />
        <StatTile icono="bolt" etiqueta="XP total" valor={xpTotal.toLocaleString('es-MX')} />
        <StatTile icono="local_fire_department" etiqueta="Racha" valor={`${racha.dias} días`} />
        <StatTile icono="military_tech" etiqueta="Rango" valor={rango} />
      </div>
    </div>
  )
}

function StatTile({ icono, etiqueta, valor }: { icono: string; etiqueta: string; valor: string }) {
  return (
    <div className="rounded-card bg-surface p-4 text-center shadow-card">
      <Icon name={icono} className="text-2xl text-accent" />
      <p className="mt-1 text-lg font-bold">{valor}</p>
      <p className="text-xs text-text-muted">{etiqueta}</p>
    </div>
  )
}
