# Covalto³ · Ruta de Formación IA — "Explorador IA"

Prototipo de la ruta de formación gamificada de Covalto³ (Línea 1 ·
Capacidades). React + Vite + TypeScript + Tailwind. **Datos mock por
defecto, cero PII de colaboradores reales, recompensas solo no
monetarias.**

> **Nota de alcance:** el prototipo arrancó 100% front-end/sin backend
> (`CLAUDE.md` §7, §9 original). Por decisión explícita del stakeholder se
> sumó un backend real (Postgres/Supabase) para una tabla de usuarios —
> ver la nota fechada en `CLAUDE.md` y la sección **Base de datos** abajo.
> Sigue funcionando sin él: si no hay una BD conectada, todo cae de vuelta
> al modo local/demo tal como arrancó el prototipo.

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
  `localStorage` (modo local) y sincronizado con **Supabase** (Postgres)
  cuando el explorador se identifica con su correo `@covalto.com`

## Estructura

```
src/
├── config/       # constantes de branding (nombre de la experiencia, etc.)
├── theme/        # flag de tema 'covalto' | 'espacial'
├── data/         # capa de datos mock (JSON) + servicio de acceso — niveles, módulos...
├── backend/      # capa de acceso a la BD real (Supabase): cliente, tipos, usersService
├── state/        # estado global del explorador (reducer + persistencia dual)
├── components/   # componentes reutilizables por dominio (hud, map, level, auth, ...)
└── pages/        # una página por pantalla del prototipo
```

## Base de datos (Supabase)

Tabla `usuarios`: nombre, alias (público, se muestra en el Ranking en vez
del nombre real), correo (debe ser `@covalto.com`, validado en el cliente
y en la BD), rol, rango, nivel/XP/monedas/racha, módulos completados,
sellos, recompensas canjeadas, fecha de registro y último acceso. Esquema
completo en `supabase/migrations/0001_usuarios.sql`.

**Setup (no lo puedo hacer por ti — requiere tu cuenta):**

1. Crea un proyecto gratis en [supabase.com](https://supabase.com).
2. En el dashboard, ve a **SQL Editor**, pega el contenido de
   `supabase/migrations/0001_usuarios.sql` y ejecútalo.
3. Ve a **Settings → API** y copia el **Project URL** y la **anon public
   key** (⚠️ nunca la `service_role`, esa es secreta).
4. Copia `.env.example` a `.env.local` y pega ambos valores:
   ```bash
   cp .env.example .env.local
   ```
5. `npm run dev` — ya deberías poder identificarte desde **Cuenta** en el
   header.
6. Para producción (Vercel): agrega las mismas dos variables en
   *Project Settings → Environment Variables* y vuelve a desplegar.

**⚠️ Limitación de seguridad conocida:** este prototipo no implementa
Supabase Auth (no estaba en el alcance pedido). El front-end usa la
`anon key`, que es pública, y las políticas de RLS son permisivas —
cualquiera con esa clave puede leer/escribir cualquier fila de
`usuarios`, no solo la suya. Aceptable para una demo interna; **no usar
así con datos reales de producción** sin agregar autenticación real
(magic link restringido a `@covalto.com`) — el detalle está comentado en
la propia migración SQL.

## Decisiones de marca abiertas

El sistema de diseño implementa un **flag de tema** (`covalto` | `espacial`,
alternable en el header) en vez de cerrar la decisión de marca — ver
CLAUDE.md §6 y el documento base §2/§12.5.
