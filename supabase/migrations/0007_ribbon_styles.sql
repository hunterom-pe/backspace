-- Lets profile owners pick a Top 8 ribbon badge finish.
-- Run this in the Supabase SQL editor (or `supabase db push` once the project is linked).

alter table public.profiles
  add column if not exists ribbon_style text not null default 'classic';

alter table public.profiles
  add constraint profiles_ribbon_style_check
  check (ribbon_style in ('classic', 'holographic', 'glitter', 'chrome'));
