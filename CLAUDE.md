# CLAUDE.md — Covalto³ · Ruta de Formación IA ("Explorador IA")

> Instrucciones de proyecto para Claude Code. Este archivo es la fuente de verdad del build.
> Léelo completo antes de escribir código. Lee también `docs/concepto-visual.png` (el concepto de UI/mecánica) y `docs/Covalto3_Ruta_Formacion_Documento_Base.md` (el documento ancla del contenido).

> ⚠️ **Nota de alcance (2026-08-06):** el stakeholder pidió explícitamente sumar una
> base de datos real (Postgres/Supabase) para una tabla de usuarios — nombre, alias,
> correo `@covalto.com`, nivel/XP/monedas/racha/módulos/sellos, fecha de registro y
> último acceso. Esto **contradice a propósito** el "sin backend real" de §1/§7 y el
> "sin llamadas de red" de §9 originales — fue una decisión consciente, no un
> incumplimiento accidental de este documento. El resto de los guardrails (cero
> recompensas monetarias, cero PII de terceros en ilustraciones, etc.) sigue vigente
> tal cual. Detalle técnico y limitaciones de seguridad conocidas en `README.md` §
> "Base de datos (Supabase)" y en `supabase/migrations/0001_usuarios.sql`. El
> prototipo sigue siendo 100% demostrable sin la BD conectada (cae a modo local).

---

## 1 · Qué construimos

Un **prototipo web interactivo** de la ruta de formación gamificada **"Explorador IA"** de Covalto³: un viaje de aprendizaje de IA donde cada colaborador pasa de *usuario* a *multiplicador*. El objetivo del prototipo es **demostrar el concepto a stakeholders** (People, TI, comité) y servir de base para decidir la plataforma definitiva.

Es un **prototipo de front-end con datos mock** — sin backend real, sin datos reales de colaboradores, sin lógica de recompensas monetarias. Debe verse pulido y navegable de punta a punta.

---

## 2 · Contexto (por qué existe)

Covalto³ es el programa de transformación AI-Native de Covalto (2026–2028). Esta ruta es la **cara vivencial de la Línea 1 (Capacidades)**: convierte la formación en un viaje con progresión visible.

Dato que dirige el diseño: el baseline de madurez (autoevaluación **D1–D5**) muestra fuerza en el uso individual (D1/D2) y **brecha real en compartir y liderar (D4/D5)**. Por eso los niveles altos de la ruta (**Liderazgo**, **Experto**) premian justo ese comportamiento. La ruta y el pipeline de **AI Champions** son el mismo embudo.

---

## 3 · Alcance del prototipo (pantallas)

| # | Pantalla | Contenido |
| :-- | :-- | :-- |
| 1 | **Landing / Hero** | "Mi viaje. Mi misión. Mi futuro con IA." + CTA "Despega ahora" |
| 2 | **Autoevaluación (placement)** | Cuestionario corto D1–D5 que asigna un **rango de entrada** (Novato → Explorador → Avanzado → Experto) |
| 3 | **Mapa de trayectoria** | Los **6 niveles** como planetas; estado bloqueado/activo/completado; posición actual |
| 4 | **Detalle de nivel** | Módulos del nivel, XP por módulo, acción "completar" |
| 5 | **Pasaporte del Explorador** | Perfil + **sellos de misión** (uno por nivel), monedas, barra XP, racha, nivel/rango |
| 6 | **HUD persistente** | Monedas · Nivel · progreso XP · racha (como las tarjetas del arte) |
| 7 | **Ranking de Exploradores** | Leaderboard por XP (mock) |
| 8 | **Comunidad / Hackatón** | Tarjetas teaser: foros, retos, Hackatón Covalto IA, Día IA |
| 9 | **Recompensas** | Catálogo de recompensas (solo **no monetarias** en el prototipo — ver §7) |

**Estado (state):** un único "explorador" en memoria + `localStorage`. Completar un módulo otorga XP/monedas, desbloquea niveles, otorga sellos, actualiza racha y posición en el ranking. Debe existir un botón **"reiniciar progreso"**.

---

## 4 · Los 6 niveles (contenido canónico)

| # | Nivel | AAA+ | Señal de dominio |
| :-- | :-- | :-- | :-- |
| 1 | **Despegue** | Aprende | Fundamentos; primer prompt útil |
| 2 | **Exploración** | Aprende | Usa herramientas del ecosistema con confianza |
| 3 | **Desafío** | Automatiza | Resuelve un caso real de su trabajo con IA |
| 4 | **Nuevos Mundos** | Automatiza | Construye una automatización |
| 5 | **Liderazgo** | Amplifica | **Comparte y multiplica** (cierra brecha D4) |
| 6 | **Experto IA** | Amplifica | Referente / facilitador → candidato a AI Champion |

Cada nivel se llena con 3–5 módulos mock. Fuente conceptual del contenido: F1 (formación Google), F2 (Labs EUC), y skills del AKB — usa títulos plausibles, no inventes datos internos.

---

## 5 · Mecánica de gamificación

XP · Monedas Covalto · Niveles + rango · Racha (días) · Pasaporte con sellos · Rankings · Recompensas.

**Principio de métrica dual (no negociable):** la XP debe premiar **aplicar** IA a trabajo real, no solo consumir contenido. Evita mecánicas que premien actividad vacía. Refléjalo en cómo se otorgan puntos (p. ej. módulos "aplica" valen más que módulos "aprende").

---

## 6 · Sistema de diseño

**Marca Covalto (sistema base):**
- Verde primario `#062323`, verde-2 `#0c3634`, verde-3 `#134c48`
- Ámbar acento `#FFBA1F`, verde menta `#84C28B`
- Superficies: off-white `#F9F8F7`, menta `#F0FDF1`, beige `#F5EFE4`
- Tipografía **Noto Sans**; íconos **Material Symbols Outlined**
- Tarjetas redondeadas, sombras suaves

**Motivo espacial (capa de campaña):** el arte de referencia usa una estética de exploración espacial (astronauta, planetas, pasaporte). Trátalo como **capa ilustrativa/temática** sobre el sistema Covalto, no como reemplazo de la marca.

> ⚠️ **Decisión de marca abierta.** Implementa el theming con **tokens CSS** y un **flag de tema** (`covalto` | `espacial`) para poder alternar. Default: `covalto` con acentos espaciales. Así el prototipo no cierra la decisión.

---

## 7 · Decisiones ABIERTAS — construye con mocks y flags, no inventes compromisos

| Tema | Cómo tratarlo en el prototipo |
| :-- | :-- |
| **Recompensas** | Solo **no monetarias** (reconocimiento, tiempo protegido, acceso a eventos, visibilidad). NO implementes lógica de dinero/becas. Márcalas como placeholder. |
| **Plataforma** | Prototipo self-contained; **sin backend**. Aísla los datos tras una capa simple (`/src/data` + un servicio) para que sea intercambiable. No asumas LMS ni Google ni AKB. |
| **Estructura de rutas** | Default: **tronco común (niveles 1–2) + ramas por rol (3+)**. Deja el rol como un selector mock. |
| **Escala D1–D5** | Usa 1–5 en el prototipo, pero deja la escala parametrizable. |
| **Nombre** | Trabaja con "Explorador IA"; hazlo fácil de renombrar (una constante). |

---

## 8 · Stack propuesto (prototipo)

- **React + Vite + TypeScript + Tailwind CSS**
- Datos mock en `/src/data/*.json` (levels, modules, ranking, rewards, evaluation)
- Estado global ligero (Context o Zustand) + persistencia en `localStorage`
- Sin dependencias de backend, sin llamadas de red, sin secretos
- Componentes reutilizables; código legible y comentado en español

*(Es una propuesta de arranque, no una decisión de plataforma. Si propones otro stack, susténtalo primero.)*

---

## 9 · Guardrails (banca regulada)

- **Cero PII y cero datos reales** de colaboradores; todo es ficticio/mock.
- Nada de personajes con IP de terceros ni marcas ajenas en ilustraciones/íconos.
- Sin llamadas de red ni claves. Es un prototipo local.
- Mantén trazable qué es real vs. placeholder (comenta los `// PLACEHOLDER`).

---

## 10 · Orden de build sugerido

1. Scaffold Vite + TS + Tailwind; define tokens de marca y el flag de tema.
2. Layout base + HUD persistente (monedas/nivel/XP/racha).
3. Datos mock (`levels.json`, `modules.json`, `ranking.json`, `rewards.json`, `evaluation.json`).
4. Mapa de trayectoria (6 niveles) con estados bloqueado/activo/completado.
5. Detalle de nivel + lógica de completar módulo (otorga XP/monedas/sello).
6. Pasaporte del Explorador.
7. Autoevaluación de placement → asigna rango de entrada.
8. Ranking, Comunidad/Hackatón, Recompensas (placeholders).
9. Pulido visual contra `docs/concepto-visual.png` + botón reiniciar progreso.

Al terminar cada bloque, verifica que el flujo completo siga navegable.
