/**
 * ThemeContext.tsx — flag de tema 'covalto' | 'espacial' (CLAUDE.md §6).
 *
 * Decisión de marca ABIERTA: el arte de referencia usa una estética espacial
 * que no es el sistema Covalto. En vez de cerrar esa decisión en el código,
 * exponemos un flag alternable y persistido, con 'covalto' (marca + acentos
 * espaciales) como default — así el prototipo no compromete la decisión.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Tema = 'covalto' | 'espacial'

const STORAGE_KEY = 'explorador-ia-tema'
const TEMA_POR_DEFECTO: Tema = 'covalto'

interface ThemeContextValue {
  tema: Tema
  alternarTema: () => void
  setTema: (tema: Tema) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function leerTemaGuardado(): Tema {
  if (typeof window === 'undefined') return TEMA_POR_DEFECTO
  const guardado = window.localStorage.getItem(STORAGE_KEY)
  return guardado === 'covalto' || guardado === 'espacial' ? guardado : TEMA_POR_DEFECTO
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tema, setTemaState] = useState<Tema>(leerTemaGuardado)

  // Refleja el tema en <html data-theme="..."> para que los tokens CSS apliquen
  useEffect(() => {
    document.documentElement.dataset.theme = tema
    window.localStorage.setItem(STORAGE_KEY, tema)
  }, [tema])

  const setTema = (nuevo: Tema) => setTemaState(nuevo)
  const alternarTema = () => setTemaState((actual) => (actual === 'covalto' ? 'espacial' : 'covalto'))

  return <ThemeContext.Provider value={{ tema, alternarTema, setTema }}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>')
  return ctx
}
