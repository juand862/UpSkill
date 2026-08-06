/**
 * dataService.ts — capa de acceso a los datos mock (CLAUDE.md §7:
 * "Aísla los datos tras una capa simple para que sea intercambiable").
 *
 * Todo el resto de la app importa de aquí, nunca de los .json directamente,
 * así que cambiar la fuente de datos (a un LMS, a una API real, etc.) el
 * día de mañana no toca a los componentes.
 */
import levelsData from './levels.json'
import modulesData from './modules.json'
import rankingData from './ranking.json'
import rewardsData from './rewards.json'
import evaluationData from './evaluation.json'
import type { RolExplorador } from '@/state/types'
import type {
  Level,
  Module,
  RankingEntry,
  Reward,
  EvaluationQuestion,
  EvaluationThreshold,
} from './types'

const levels = levelsData as Level[]
const modules = modulesData as Module[]
const ranking = rankingData as RankingEntry[]
const rewards = rewardsData as Reward[]
const evaluation = evaluationData as {
  escala: { min: number; max: number }
  preguntas: EvaluationQuestion[]
  umbrales: EvaluationThreshold[]
}

/** Todos los niveles, en orden de trayectoria (1 → 6) */
export function getLevels(): Level[] {
  return [...levels].sort((a, b) => a.id - b.id)
}

export function getLevelById(id: number): Level | undefined {
  return levels.find((nivel) => nivel.id === id)
}

export function getLevelBySlug(slug: string): Level | undefined {
  return levels.find((nivel) => nivel.slug === slug)
}

/**
 * Módulos de un nivel, aplicando la variante de copy del rol si existe
 * (tronco común niveles 1–2, ramas por rol desde el 3 — CLAUDE.md §7).
 */
export function getModulesByLevel(levelId: number, rol?: RolExplorador): Module[] {
  return modules
    .filter((modulo) => modulo.levelId === levelId)
    .map((modulo) => aplicarVarianteRol(modulo, rol))
}

export function getModuleById(id: string, rol?: RolExplorador): Module | undefined {
  const modulo = modules.find((m) => m.id === id)
  return modulo ? aplicarVarianteRol(modulo, rol) : undefined
}

function aplicarVarianteRol(modulo: Module, rol?: RolExplorador): Module {
  const variante = rol ? modulo.variantesPorRol?.[rol] : undefined
  if (!variante) return modulo
  return {
    ...modulo,
    titulo: variante.titulo ?? modulo.titulo,
    descripcion: variante.descripcion ?? modulo.descripcion,
  }
}

/** Ranking mock ordenado por XP descendente */
export function getRanking(): RankingEntry[] {
  return [...ranking].sort((a, b) => b.xp - a.xp)
}

export function getRewards(): Reward[] {
  return rewards
}

export function getEvaluationQuestions(): EvaluationQuestion[] {
  return evaluation.preguntas
}

export function getEvaluationThresholds(): EvaluationThreshold[] {
  return evaluation.umbrales
}

/** Dado un puntaje total (suma de las 5 dimensiones), resuelve el umbral aplicable */
export function resolverUmbralPorPuntaje(puntaje: number): EvaluationThreshold {
  const umbrales = getEvaluationThresholds()
  const encontrado = umbrales.find((u) => puntaje >= u.min && puntaje <= u.max)
  // Si el puntaje cae fuera de rango (no debería, con la escala 5–25), usa los extremos
  return encontrado ?? (puntaje < umbrales[0].min ? umbrales[0] : umbrales[umbrales.length - 1])
}
