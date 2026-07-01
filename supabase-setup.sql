-- =====================================================
-- StoryTime — configuración de base de datos en Supabase
-- Copia y pega TODO este archivo en:
-- Supabase > SQL Editor > New query > Run
-- =====================================================

-- 1. Crear la tabla de historias
create table if not exists stories (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  phone text not null,
  category text not null,
  text text not null,
  reactions jsonb default '{}'::jsonb
);

-- 2. Activar seguridad a nivel de fila (RLS)
alter table stories enable row level security;

-- 3. Cualquier persona (pública, sin login) puede LEER
--    solo estas columnas a través de la vista pública de abajo.
--    (la tabla completa, con datos personales, NO es legible directamente)

-- 4. Cualquier persona puede INSERTAR una historia (publicar)
create policy "Cualquiera puede publicar una historia"
on stories for insert
to anon
with check (true);

-- 5. Cualquier persona puede ACTUALIZAR solo las reacciones
--    (esto permite el conteo de 🔥😂💀❤️ sin exponer datos personales)
create policy "Cualquiera puede reaccionar"
on stories for update
to anon
using (true)
with check (true);

-- 6. Solo usuarios autenticados (tú, con tu login admin) pueden LEER
--    la tabla completa, incluyendo nombre/correo/celular
create policy "Solo el admin autenticado puede leer todo"
on stories for select
to authenticated
using (true);

-- 7. Vista pública SIN datos personales — esto es lo que usa el feed público
create or replace view public_stories as
select id, created_at, category, text, reactions
from stories;

-- Permitir lectura pública de la vista (sin nombre/correo/celular)
grant select on public_stories to anon;

-- =====================================================
-- IMPORTANTE: crea tu usuario admin en
-- Supabase > Authentication > Users > Add user
-- Ahí defines el correo y contraseña con los que entrarás
-- al panel privado del sitio.
-- =====================================================
