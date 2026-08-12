-- Adds user blocking and private profiles.
-- Run this in the Supabase SQL editor (or `supabase db push` once the project is linked).

-- private profiles ---------------------------------------------------------------

alter table public.profiles
  add column if not exists is_private boolean not null default false;

-- blocking --------------------------------------------------------------------

create table public.blocked_users (
  blocker_id uuid not null references public.profiles (id) on delete cascade,
  blocked_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint blocked_users_not_self check (blocker_id <> blocked_id),
  primary key (blocker_id, blocked_id)
);

alter table public.blocked_users enable row level security;

-- Only the blocker can see a block exists — the blocked party isn't told,
-- consistent with how most apps keep the block itself private.
create policy "users can view blocks they created"
  on public.blocked_users for select
  to authenticated
  using (auth.uid() = blocker_id);

create policy "users can block others"
  on public.blocked_users for insert
  to authenticated
  with check (auth.uid() = blocker_id);

create policy "users can unblock others"
  on public.blocked_users for delete
  to authenticated
  using (auth.uid() = blocker_id);

-- is_blocked: true if either user has blocked the other. security definer so a
-- caller can learn "is there a block between us" without being able to see who
-- blocked whom (that stays governed by the select policy above).
create function public.is_blocked(a uuid, b uuid)
returns boolean
language sql
security definer set search_path = ''
stable
as $$
  select exists (
    select 1 from public.blocked_users
    where (blocker_id = a and blocked_id = b)
       or (blocker_id = b and blocked_id = a)
  );
$$;

grant execute on function public.is_blocked(uuid, uuid) to authenticated;

-- can_view_profile: false only when target_id is private and the caller is
-- neither the owner nor an accepted friend. Used to gate the Wall (the one
-- piece of profile content that lives in its own RLS-protected table); the
-- profiles row itself stays broadly readable since search, messaging, and
-- authorship joins across the app depend on resolving any username/avatar.
create function public.can_view_profile(target_id uuid)
returns boolean
language sql
security definer set search_path = ''
stable
as $$
  select
    auth.uid() = target_id
    or not exists (
      select 1 from public.profiles where id = target_id and is_private
    )
    or exists (
      select 1 from public.friendships
      where status = 'accepted'
        and (
          (requester_id = auth.uid() and recipient_id = target_id)
          or (recipient_id = auth.uid() and requester_id = target_id)
        )
    );
$$;

grant execute on function public.can_view_profile(uuid) to authenticated;

-- Re-scope wall comments to profile privacy.

drop policy "wall comments are visible to any signed-in user" on public.wall_comments;

create policy "wall comments are visible per profile privacy"
  on public.wall_comments for select
  to authenticated
  using (public.can_view_profile(profile_id));

drop policy "users can post wall comments" on public.wall_comments;

create policy "users can post wall comments"
  on public.wall_comments for insert
  to authenticated
  with check (
    auth.uid() = author_id
    and not public.is_blocked(author_id, profile_id)
    and public.can_view_profile(profile_id)
  );

-- Block new interactions across the other write paths. Existing rows
-- (past comments, likes, messages, friendships) are left alone — blocking
-- stops new interaction, it doesn't retroactively erase history.

drop policy "users can send friend requests" on public.friendships;

create policy "users can send friend requests"
  on public.friendships for insert
  to authenticated
  with check (
    auth.uid() = requester_id
    and not public.is_blocked(requester_id, recipient_id)
  );

drop policy "users can comment on posts" on public.post_comments;

create policy "users can comment on posts"
  on public.post_comments for insert
  to authenticated
  with check (
    auth.uid() = author_id
    and not public.is_blocked(
      author_id,
      (select user_id from public.posts where id = post_id)
    )
  );

drop policy "users can like posts" on public.post_likes;

create policy "users can like posts"
  on public.post_likes for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and not public.is_blocked(
      user_id,
      (select user_id from public.posts where id = post_id)
    )
  );

drop policy "users can send messages" on public.messages;

create policy "users can send messages"
  on public.messages for insert
  to authenticated
  with check (
    auth.uid() = sender_id
    and not public.is_blocked(sender_id, recipient_id)
  );
