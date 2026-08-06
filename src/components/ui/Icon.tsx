import type { CSSProperties } from 'react'

/**
 * Icon.tsx — envoltorio delgado sobre Material Symbols Outlined.
 * La fuente de íconos está auto-hospedada (paquete `material-symbols`),
 * por lo que no hay llamadas de red en tiempo de ejecución.
 */
interface IconProps {
  /** Nombre del ícono en snake_case, p. ej. "rocket_launch" */
  name: string
  className?: string
  style?: CSSProperties
}

export function Icon({ name, className = '', style }: IconProps) {
  return (
    <span className={`material-symbols-outlined select-none ${className}`} style={style} aria-hidden="true">
      {name}
    </span>
  )
}
