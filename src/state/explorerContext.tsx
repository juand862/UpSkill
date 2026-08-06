/**
 * explorerContext.tsx — Context + Provider del estado global del explorador.
 *
 * Persistencia dual (CLAUDE.md, nota de alcance sobre backend real):
 *  - Modo local/demo (`estado.correo === null`): solo localStorage, como
 *    arrancó el prototipo.
 *  - Modo identificado (`estado.correo` con un @covalto.com válido):
 *    localStorage sigue siendo la caché instantánea, pero la fuente de
 *    verdad es la tabla `usuarios` en Supabase (src/backend/) — cada
 *    cambio de estado se sincroniza ahí con un debounce corto.
 */
import { createContext, useContext, useEffect, useReducer, useRef, type Dispatch, type ReactNode } from 'react'
import { explorerReducer, ESTADO_INICIAL, type ExplorerAction } from './explorerReducer'
import { leerEstadoGuardado, guardarEstado, borrarEstadoGuardado } from './explorerStorage'
import { actualizarProgresoUsuario, obtenerUsuarioPorCorreo, isSupabaseConfigured } from '@/backend/usersService'
import { estadoAActualizacionUsuario, usuarioDbAEstado } from '@/backend/mapping'
import type { ExplorerState } from './types'

interface ExplorerContextValue {
  estado: ExplorerState
  dispatch: Dispatch<ExplorerAction>
}

const ExplorerContext = createContext<ExplorerContextValue | undefined>(undefined)

function inicializar(): ExplorerState {
  return leerEstadoGuardado() ?? ESTADO_INICIAL
}

const DEBOUNCE_SYNC_MS = 500

export function ExplorerProvider({ children }: { children: ReactNode }) {
  const [estado, dispatch] = useReducer(explorerReducer, undefined, inicializar)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const estadoRef = useRef(estado)
  estadoRef.current = estado

  // Caché local instantánea — siempre, en ambos modos (funciona sin red)
  useEffect(() => {
    guardarEstado(estado)
  }, [estado])

  // Sincronización con la BD real cuando hay un explorador identificado
  useEffect(() => {
    if (!estado.correo || !isSupabaseConfigured) return

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      actualizarProgresoUsuario(estado.correo!, estadoAActualizacionUsuario(estado)).catch((error: unknown) => {
        // No rompe la UI: el progreso ya vive en localStorage como respaldo
        // eslint-disable-next-line no-console
        console.error('[usuarios] no se pudo sincronizar el progreso con Supabase:', error)
      })
    }, DEBOUNCE_SYNC_MS)

    return () => clearTimeout(debounceRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo re-sincroniza por cambios de estado, no de función
  }, [estado])

  // Al montar con una sesión identificada en caché, refresca desde la BD
  // (por si el progreso cambió desde otro dispositivo/pestaña). Si los
  // datos son idénticos a la caché, no despacha nada — evita un ciclo de
  // escritura de vuelta a la BD sin cambios reales (ver efecto de arriba).
  useEffect(() => {
    if (!estado.correo || !isSupabaseConfigured) return
    obtenerUsuarioPorCorreo(estado.correo)
      .then((usuario) => {
        if (!usuario) return
        const fresco = usuarioDbAEstado(usuario)
        if (JSON.stringify(fresco) !== JSON.stringify(estadoRef.current)) {
          dispatch({ type: 'IDENTIFICAR_USUARIO', estado: fresco })
        }
      })
      .catch((error: unknown) => {
        // eslint-disable-next-line no-console
        console.error('[usuarios] no se pudo refrescar el progreso desde Supabase:', error)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al montar
  }, [])

  return <ExplorerContext.Provider value={{ estado, dispatch }}>{children}</ExplorerContext.Provider>
}

export function useExplorer(): ExplorerContextValue {
  const ctx = useContext(ExplorerContext)
  if (!ctx) throw new Error('useExplorer debe usarse dentro de <ExplorerProvider>')
  return ctx
}

/** Reinicia el progreso (conserva identidad si está identificado) — botón "reiniciar progreso" */
export function useReiniciarProgreso() {
  const { dispatch } = useExplorer()
  return () => {
    borrarEstadoGuardado()
    dispatch({ type: 'REINICIAR_PROGRESO' })
  }
}

/** Cierra sesión: vuelve al modo local/demo, sin tocar la fila real en Supabase */
export function useCerrarSesion() {
  const { dispatch } = useExplorer()
  return () => {
    borrarEstadoGuardado()
    dispatch({ type: 'CERRAR_SESION' })
  }
}
