-- ============================================================
-- 0001_usuarios.sql — tabla de usuarios de "Explorador IA"
--
-- Decisión de alcance: el prototipo pasó de ser 100% front-end (CLAUDE.md
-- §7/§9 original) a tener un backend real (Postgres/Supabase) por
-- decisión explícita del stakeholder. Ver nota en CLAUDE.md.
--
-- Cómo aplicar esta migración:
--   1. Crea un proyecto en https://supabase.com (gratis para prototipos)
--   2. Ve a "SQL Editor" en el dashboard y pega el contenido de este archivo
--   3. Ejecuta. Repite con futuras migraciones en orden (0002_*, 0003_*...)
-- ============================================================

create extension if not exists pgcrypto; -- para gen_random_uuid()

create table if not exists public.usuarios (
  id uuid primary key default gen_random_uuid(),

  -- Identidad
  nombre text not null,
  alias text, -- nombre público mostrado en el ranking (privacidad: el nombre real no se expone ahí)
  correo text not null unique,

  -- Segmentación (CLAUDE.md §7: tronco común niveles 1-2, ramas desde el 3)
  rol text not null default 'no_tecnico'
    constraint usuarios_rol_valido check (rol in ('tecnico', 'no_tecnico')),

  -- Progresión (mismo modelo que src/state/types.ts en el front-end)
  rango text not null default 'Novato'
    constraint usuarios_rango_valido check (rango in ('Novato', 'Explorador', 'Avanzado', 'Experto')),
  nivel_actual integer not null default 1
    constraint usuarios_nivel_valido check (nivel_actual between 1 and 6),
  xp_total integer not null default 0 constraint usuarios_xp_total_no_negativo check (xp_total >= 0),
  xp_nivel_actual integer not null default 0
    constraint usuarios_xp_nivel_no_negativo check (xp_nivel_actual >= 0),
  xp_nivel_objetivo integer not null default 260, -- xpObjetivo del nivel 1 "Despegue" en src/data/levels.json
  monedas integer not null default 0 constraint usuarios_monedas_no_negativas check (monedas >= 0),
  racha_dias integer not null default 0,
  ultima_actividad date,

  -- "Cursos realizados" = módulos completados (mismo concepto que modulosCompletados en el front-end)
  cursos_completados text[] not null default '{}',
  sellos_obtenidos integer[] not null default '{}',
  recompensas_canjeadas text[] not null default '{}',

  -- Autoevaluación D1-D5 (Bloque 7)
  evaluacion_completada boolean not null default false,
  respuestas_evaluacion jsonb,

  -- Metadatos de la tabla de usuarios
  fecha_registro timestamptz not null default now(),
  ultimo_acceso timestamptz not null default now(),

  -- Guardrail de dominio: solo colaboradores Covalto (pedido del stakeholder)
  constraint usuarios_correo_dominio_covalto check (correo ~* '^[a-z0-9._%+-]+@covalto\.com$')
);

-- Ranking ordena por XP con frecuencia — índice dedicado
create index if not exists usuarios_xp_total_idx on public.usuarios (xp_total desc);
create unique index if not exists usuarios_correo_idx on public.usuarios (lower(correo));

-- Mantiene ultimo_acceso fresco en cada UPDATE sin que el cliente tenga que enviarlo
create or replace function public.usuarios_set_ultimo_acceso()
returns trigger as $$
begin
  new.ultimo_acceso = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists usuarios_touch_ultimo_acceso on public.usuarios;
create trigger usuarios_touch_ultimo_acceso
  before update on public.usuarios
  for each row
  execute function public.usuarios_set_ultimo_acceso();

-- ============================================================
-- ⚠️ RLS — PLACEHOLDER DE SEGURIDAD, LEER ANTES DE USAR EN PRODUCCIÓN
--
-- Este prototipo NO implementa Supabase Auth (no se pidió en el alcance
-- actual). El front-end habla con Supabase usando la clave pública
-- "anon key". Sin Auth real, no hay forma de que RLS distinga "eres tú"
-- de "eres cualquiera" — así que estas políticas permiten que cualquier
-- persona con la anon key (que es pública, va en el bundle del front-end)
-- lea y escriba CUALQUIER fila, no solo la suya.
--
-- Es aceptable para una demo interna de prototipo. NO lo dejes así si
-- esto llega a producción con datos reales de colaboradores: agrega
-- Supabase Auth (magic link restringido a @covalto.com) y cambia estas
-- políticas a `auth.jwt() ->> 'email' = correo`.
-- ============================================================
alter table public.usuarios enable row level security;

drop policy if exists "usuarios_select_anon" on public.usuarios;
create policy "usuarios_select_anon" on public.usuarios
  for select
  using (true);

drop policy if exists "usuarios_insert_anon" on public.usuarios;
create policy "usuarios_insert_anon" on public.usuarios
  for insert
  with check (true);

drop policy if exists "usuarios_update_anon" on public.usuarios;
create policy "usuarios_update_anon" on public.usuarios
  for update
  using (true)
  with check (true);

comment on table public.usuarios is
  'Usuarios de la ruta "Explorador IA". PLACEHOLDER de seguridad: RLS permisivo sin Supabase Auth, ver comentario arriba.';
