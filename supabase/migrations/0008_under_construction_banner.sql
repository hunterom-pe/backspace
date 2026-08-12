-- Lets profile owners toggle a retro "under construction" marquee banner.
-- Run this in the Supabase SQL editor (or `supabase db push` once the project is linked).

alter table public.profiles
  add column if not exists show_under_construction boolean not null default false;
