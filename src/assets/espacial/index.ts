/**
 * index.ts — arte de campaña del tema 'espacial' (CLAUDE.md §6).
 *
 * Recortes del concepto visual de referencia (docs/concepto-visual.png),
 * el mismo arte aprobado por el equipo para la campaña "Explorador IA".
 * Solo se usan cuando el flag de tema está en 'espacial'; el tema
 * 'covalto' sigue usando el sistema de iconos de marca (Material Symbols).
 */
import planeta1 from './planet-1-despegue.webp'
import planeta2 from './planet-2-exploracion.webp'
import planeta3 from './planet-3-desafio.webp'
import planeta4 from './planet-4-nuevos-mundos.webp'
import planeta5 from './planet-5-liderazgo.webp'
import planeta6 from './planet-6-experto.webp'
import astronautaHero from './astronauta-hero.webp'
import astronautaMini from './astronauta-mini.webp'
import pasaporteLibro from './pasaporte-libro.webp'
import trofeoHackaton from './trofeo-hackaton.webp'

/** Ilustración de planeta por nivel (1–6), para el tema espacial */
export const PLANETA_POR_NIVEL: Record<number, string> = {
  1: planeta1,
  2: planeta2,
  3: planeta3,
  4: planeta4,
  5: planeta5,
  6: planeta6,
}

export { astronautaHero, astronautaMini, pasaporteLibro, trofeoHackaton }
