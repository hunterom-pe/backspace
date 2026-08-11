-- Adds profile view counts and custom banner images.
-- Run this in the Supabase SQL editor (or `supabase db push` once the project is linked).

alter table public.profiles
  add column if not exists profile_views integer not null default 0,
  add column if not exists banner_url text;

-- profile_views is incremented by visitors, not the owner, so it can't go
-- through the existing "users can update their own profile" RLS policy.
-- A narrow security-definer function keeps the bypass scoped to exactly
-- this one counter instead of opening up general cross-user updates.
create or replace function public.increment_profile_views(target_id uuid)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  if target_id <> auth.uid() then
    update public.profiles set profile_views = profile_views + 1 where id = target_id;
  end if;
end;
$$;

grant execute on function public.increment_profile_views(uuid) to authenticated;

-- storage: banner uploads --------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('banners', 'banners', true)
on conflict (id) do nothing;

create policy "banner images are publicly accessible"
  on storage.objects for select
  to public
  using (bucket_id = 'banners');

create policy "users can upload their own banner"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'banners' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "users can update their own banner"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'banners' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "users can delete their own banner"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'banners' and (storage.foldername(name))[1] = auth.uid()::text);
