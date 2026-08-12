-- Lets profile owners pick from a curated set of accent-color themes.
-- Run this in the Supabase SQL editor (or `supabase db push` once the project is linked).

alter table public.profiles
  add column if not exists theme text not null default 'classic';

alter table public.profiles
  add constraint profiles_theme_check
  check (theme in ('classic', 'punk', 'scene', 'skater', 'emo', 'cyber', 'sunset', 'glitter'));
