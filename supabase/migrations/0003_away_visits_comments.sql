-- Adds custom away messages, a per-profile visitor log, and post comments.
-- Run this in the Supabase SQL editor (or `supabase db push` once the project is linked).

-- away messages ---------------------------------------------------------------

alter table public.profiles
  add column if not exists away_message text;

-- profile visits (who viewed) --------------------------------------------------

create table public.profile_visits (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  visitor_id uuid not null references public.profiles (id) on delete cascade,
  visited_at timestamptz not null default now(),
  constraint profile_visits_not_self check (profile_id <> visitor_id),
  primary key (profile_id, visitor_id)
);

alter table public.profile_visits enable row level security;

create policy "profile owners can view their visit log"
  on public.profile_visits for select
  to authenticated
  using (auth.uid() = profile_id);

-- Visits are recorded through record_profile_visit() below (security
-- definer), not direct inserts, so no insert/update policy is needed.

-- record_profile_visit replaces increment_profile_views: it still bumps the
-- view counter but also upserts a per-visitor row, so repeat visits from the
-- same person just refresh visited_at instead of growing the table forever.
drop function if exists public.increment_profile_views(uuid);

create function public.record_profile_visit(target_id uuid)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  if target_id <> auth.uid() then
    update public.profiles set profile_views = profile_views + 1 where id = target_id;

    insert into public.profile_visits (profile_id, visitor_id, visited_at)
    values (target_id, auth.uid(), now())
    on conflict (profile_id, visitor_id)
    do update set visited_at = excluded.visited_at;
  end if;
end;
$$;

grant execute on function public.record_profile_visit(uuid) to authenticated;

-- post comments -----------------------------------------------------------------

alter table public.posts
  add column if not exists comment_count integer not null default 0;

create table public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  gif_url text,
  created_at timestamptz not null default now()
);

alter table public.post_comments enable row level security;

create policy "post comments are visible to any signed-in user"
  on public.post_comments for select
  to authenticated
  using (true);

create policy "users can comment on posts"
  on public.post_comments for insert
  to authenticated
  with check (auth.uid() = author_id);

create policy "authors or post owners can delete a comment"
  on public.post_comments for delete
  to authenticated
  using (
    auth.uid() = author_id
    or auth.uid() = (select user_id from public.posts where id = post_id)
  );

create function public.handle_post_comment_change()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if (tg_op = 'INSERT') then
    update public.posts set comment_count = comment_count + 1 where id = new.post_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.posts set comment_count = greatest(comment_count - 1, 0) where id = old.post_id;
    return old;
  end if;
  return null;
end;
$$;

create trigger on_post_comment_change
  after insert or delete on public.post_comments
  for each row execute function public.handle_post_comment_change();

-- notifications: post_comment type -----------------------------------------------

alter type public.notification_type add value if not exists 'post_comment';
