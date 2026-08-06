/**
 * types.ts — modelo de datos mock (CLAUDE.md §4, §5, §6).
 * Estos tipos describen la forma de los JSON en /src/data/*.json.
 */
import type { RangoExplorador, RolExplorador } from '@/state/types'

export type PilarAAA = 'Aprende' | 'Automatiza' | 'Amplifica'

export interface Level {
  id: number
  slug: string
  nombre: string
  aaa: PilarAAA
  senalDominio: string
  moduloIds: string[]
  /** XP total de los módulos del nivel = umbral para desbloquear el siguiente */
  xpObjetivo: number
}

export type TipoModulo = 'aprende' | 'aplica'
export type FuenteConceptual = 'F1' | 'F2' | 'AKB'

/** Copy alterno de un módulo según el rol del explorador (tronco común niveles 1–2, ramas desde el 3) */
export interface VarianteRol {
  titulo?: string
  descripcion?: string
}

export interface Module {
  id: string
  levelId: number
  titulo: string
  descripcion: string
  /** Métrica dual (CLAUDE.md §5, no negociable): 'aplica' vale más XP que 'aprende' */
  tipo: TipoModulo
  xp: number
  monedas: number
  fuenteConceptual: FuenteConceptual
  variantesPorRol?: Partial<Record<RolExplorador, VarianteRol>>
}

export interface RankingEntry {
  id: string
  nombre: string
  xp: number
  rango: RangoExplorador
  /** Semilla determinística para un avatar/inicial ilustrativo (sin fotos reales) */
  avatarSeed: string
}

export type CategoriaRecompensa = 'reconocimiento' | 'tiempo_protegido' | 'acceso_eventos' | 'visibilidad'

export interface Reward {
  id: string
  titulo: string
  descripcion: string
  categoria: CategoriaRecompensa
  costoMonedas: number
  /** Siempre true en el prototipo: cero recompensas monetarias (CLAUDE.md §7) */
  placeholder: true
}

export interface EvaluationQuestion {
  id: string
  /** Dimensión de madurez D1–D5 (escala parametrizable, CLAUDE.md §7) */
  dimension: 'D1' | 'D2' | 'D3' | 'D4' | 'D5'
  etiquetaDimension: string
  pregunta: string
  opciones: { valor: number; texto: string }[]
}

export interface EvaluationThreshold {
  rango: RangoExplorador
  min: number
  max: number
  /** Nivel de trayectoria (1–6) sugerido como punto de entrada para este rango */
  nivelSugerido: number
}
