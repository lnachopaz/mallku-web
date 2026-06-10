-- =====================================================================
-- MALLKU · Tablas de la base de datos (clientes y pedidos)
-- ---------------------------------------------------------------------
-- Ejecutar UNA VEZ en Supabase: Dashboard → SQL Editor → New query
-- → pegar todo este archivo → Run.
-- =====================================================================

-- ── Perfiles de clientes (datos de envío) ────────────────────────────
create table if not exists public.perfiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  nombre      text,
  telefono    text,
  direccion   text,
  ciudad      text default 'San Miguel de Tucumán',
  creado      timestamptz default now(),
  actualizado timestamptz default now()
);

alter table public.perfiles enable row level security;

create policy "perfil propio: leer"
  on public.perfiles for select using (auth.uid() = id);
create policy "perfil propio: crear"
  on public.perfiles for insert with check (auth.uid() = id);
create policy "perfil propio: editar"
  on public.perfiles for update using (auth.uid() = id);

-- ── Historial de pedidos ─────────────────────────────────────────────
create table if not exists public.pedidos (
  id      bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  items   jsonb not null,
  total   numeric not null,
  nombre  text,
  nota    text,
  creado  timestamptz default now()
);

alter table public.pedidos enable row level security;

create policy "pedidos propios: leer"
  on public.pedidos for select using (auth.uid() = user_id);
create policy "pedidos propios: crear"
  on public.pedidos for insert with check (auth.uid() = user_id);

-- Índice para listar rápido los pedidos de cada cliente
create index if not exists pedidos_user_creado on public.pedidos (user_id, creado desc);
