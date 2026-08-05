# Covalto³ · Ruta de Formación IA — "Explorador IA"

Prototipo front-end (React + Vite + TypeScript + Tailwind) de la ruta de
formación gamificada de Covalto³ (Línea 1 · Capacidades). **Sin backend,
datos 100% mock, cero PII, recompensas solo no monetarias.**

Ver `CLAUDE.md` para las instrucciones de build completas y
`docs/Covalto3_Ruta_Formacion_Documento_Base.md` para el contenido ancla.

## Requisitos

- Node.js 20+

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de producción en dist/
npm run preview  # sirve el build de producción localmente
```

## Stack

- **React 19 + Vite + TypeScript**
- **Tailwind CSS v4** (vía `@tailwindcss/vite`), tokens de marca definidos en
  `src/styles/index.css` y conectados a utilidades con `@theme inline`
- **Tipografía Noto Sans** e **íconos Material Symbols Outlined**
  auto-hospedados (`@fontsource/noto-sans`, `material-symbols`) — sin
  llamadas de red en tiempo de ejecución
- **React Router** para la navegación entre pantallas
- Estado del "explorador" en Context + `useReducer`, persistido en
  `localStorage`

## Estructura

```
src/
├── config/       # constantes de branding (nombre de la experiencia, etc.)
├── theme/        # flag de tema 'covalto' | 'espacial'
├── data/         # capa de datos mock (JSON) + servicio de acceso
├── state/        # estado global del explorador (reducer + persistencia)
├── components/   # componentes reutilizables por dominio (hud, map, level, ...)
└── pages/        # una página por pantalla del prototipo
```

## Decisiones de marca abiertas

El sistema de diseño implementa un **flag de tema** (`covalto` | `espacial`,
alternable en el header) en vez de cerrar la decisión de marca — ver
CLAUDE.md §6 y el documento base §2/§12.5.
