/**
 * explorerContext.tsx — Context + Provider del estado global del explorador,
 * persistido en localStorage (CLAUDE.md §3, §8).
 */
import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react'
import { explorerReducer, ESTADO_INICIAL, type ExplorerAction } from './explorerReducer'
import { leerEstadoGuardado, guardarEstado, borrarEstadoGuardado } from './explorerStorage'
import type { ExplorerState } from './types'

interface ExplorerContextValue {
  estado: ExplorerState
  dispatch: Dispatch<ExplorerAction>
}

const ExplorerContext = createContext<ExplorerContextValue | undefined>(undefined)

function inicializar(): ExplorerState {
  return leerEstadoGuardado() ?? ESTADO_INICIAL
}

export function ExplorerProvider({ children }: { children: ReactNode }) {
  const [estado, dispatch] = useReducer(explorerReducer, undefined, inicializar)

  useEffect(() => {
    guardarEstado(estado)
  }, [estado])

  return <ExplorerContext.Provider value={{ estado, dispatch }}>{children}</ExplorerContext.Provider>
}

export function useExplorer(): ExplorerContextValue {
  const ctx = useContext(ExplorerContext)
  if (!ctx) throw new Error('useExplorer debe usarse dentro de <ExplorerProvider>')
  return ctx
}

/** Reinicia el progreso en memoria y en localStorage (botón "reiniciar progreso", CLAUDE.md §3) */
export function useReiniciarProgreso() {
  const { dispatch } = useExplorer()
  return () => {
    borrarEstadoGuardado()
    dispatch({ type: 'REINICIAR_PROGRESO' })
  }
}
