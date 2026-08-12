-- Adds a photo gallery to each profile (one running album, MySpace-style —
-- no separate album management).
-- Run this in the Supabase SQL editor (or `supabase db push` once the project is linked).

create table public.photos (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  storage_path text not null,
  photo_url text not null,
  caption text,
  created_at timestamptz not null default now()
);

alter table public.photos enable row level security;

-- Reuses can_view_profile() from 0005 so a private profile's photos follow
-- the same friends-only rule as its Wall.
create policy "photos are visible per profile privacy"
  on public.photos for select
  to authenticated
  using (public.can_view_profile(owner_id));

create policy "users can add their own photos"
  on public.photos for insert
  to authenticated
  with check (auth.uid() = owner_id);

create policy "users can delete their own photos"
  on public.photos for delete
  to authenticated
  using (auth.uid() = owner_id);

-- storage: photo uploads --------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

create policy "photo images are publicly accessible"
  on storage.objects for select
  to public
  using (bucket_id = 'photos');

create policy "users can upload their own photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "users can delete their own photo files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
