/**
 * Icon.tsx — envoltorio delgado sobre Material Symbols Outlined.
 * La fuente de íconos está auto-hospedada (paquete `material-symbols`),
 * por lo que no hay llamadas de red en tiempo de ejecución.
 */
interface IconProps {
  /** Nombre del ícono en snake_case, p. ej. "rocket_launch" */
  name: string
  className?: string
}

export function Icon({ name, className = '' }: IconProps) {
  return (
    <span className={`material-symbols-outlined select-none ${className}`} aria-hidden="true">
      {name}
    </span>
  )
}
