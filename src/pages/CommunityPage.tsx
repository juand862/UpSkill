import { CommunityTeaser } from '@/components/community/CommunityTeaser'

// PLACEHOLDER: contenido teaser de la capa social — sin foros/eventos reales todavía (doc base §8)
const TEASERS = [
  {
    icono: 'forum',
    etiqueta: 'Comunidad IA',
    titulo: 'Foros y charlas con expertos',
    descripcion: 'Comparte dudas, casos de uso y aprende de otros exploradores en el foro de la Comunidad IA.',
    cta: 'Entrar al foro',
  },
  {
    icono: 'flag',
    etiqueta: 'Retos',
    titulo: 'Retos y eventos globales',
    descripcion: 'Retos periódicos que otorgan XP y sellos extra por resolver casos reales con IA.',
    cta: 'Ver retos activos',
  },
  {
    icono: 'emoji_events',
    etiqueta: 'Hackatón',
    titulo: 'Hackatón Covalto IA',
    descripcion: 'Innova · Colabora · Transforma. Forma equipo, propone una idea y compite por reconocimiento.',
    cta: 'Acepta el reto',
    destacado: true,
  },
  {
    icono: 'event',
    etiqueta: 'Evento ancla',
    titulo: 'Día IA Covalto',
    descripcion: 'El evento ancla de la comunidad, más el boletín semanal con lo mejor del space de IA.',
    cta: 'Ver próxima fecha',
  },
] as const

export function CommunityPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Comunidad / Hackatón</h1>
        <p className="mt-1 text-sm text-text-muted">
          La capa social que sostiene la ruta — foros, retos, Hackatón y el Día IA Covalto.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {TEASERS.map((teaser) => (
          <CommunityTeaser key={teaser.titulo} {...teaser} />
        ))}
      </div>
    </div>
  )
}
