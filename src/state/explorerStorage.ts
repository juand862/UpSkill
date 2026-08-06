/**
 * explorerStorage.ts — wrapper de localStorage para el estado del explorador.
 * Capa delgada y aislada para que sea trivial cambiar de mecanismo de
 * persistencia si el prototipo evoluciona (CLAUDE.md §7, "Plataforma").
 */
import type { ExplorerState } from './types'

const STORAGE_KEY = 'explorador-ia-state'

export function leerEstadoGuardado(): ExplorerState | null {
  if (typeof window === 'undefined') return null
  try {
    const crudo = window.localStorage.getItem(STORAGE_KEY)
    return crudo ? (JSON.parse(crudo) as ExplorerState) : null
  } catch {
    // localStorage corrupto o inaccesible (modo privado, cuota, etc.) → empezar de cero
    return null
  }
}

export function guardarEstado(estado: ExplorerState): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(estado))
}

export function borrarEstadoGuardado(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}
