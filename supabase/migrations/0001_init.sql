-- Backspace v1 schema: profiles, friendships, top8, posts, wall, messages, notifications.
-- Run this in the Supabase SQL editor (or `supabase db push` once the project is linked).

create type public.friendship_status as enum ('pending', 'accepted');
create type public.presence_status as enum ('online', 'away', 'offline');
create type public.notification_type as enum (
  'friend_request',
  'friend_accepted',
  'wall_comment',
  'message',
  'top8_added'
);

-- profiles ------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  display_name text,
  avatar_url text,
  location text,
  tagline text,
  mood_status text,
  about_me text,
  interests text,
  spotify_embed_url text,
  status public.presence_status not null default 'offline',
  last_active_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are visible to any signed-in user"
  on public.profiles for select
  to authenticated
  using (true);

create policy "users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- friendships -----------------------------------------------------------------

create table public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles (id) on delete cascade,
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  status public.friendship_status not null default 'pending',
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  constraint friendships_not_self check (requester_id <> recipient_id),
  constraint friendships_unique_pair unique (requester_id, recipient_id)
);

alter table public.friendships enable row level security;

create policy "involved users can view a friendship"
  on public.friendships for select
  to authenticated
  using (auth.uid() = requester_id or auth.uid() = recipient_id);

create policy "users can send friend requests"
  on public.friendships for insert
  to authenticated
  with check (auth.uid() = requester_id);

create policy "involved users can update a friendship"
  on public.friendships for update
  to authenticated
  using (auth.uid() = requester_id or auth.uid() = recipient_id);

create policy "involved users can delete a friendship"
  on public.friendships for delete
  to authenticated
  using (auth.uid() = requester_id or auth.uid() = recipient_id);

-- top8 --------------------------------------------------------------------

create table public.top8 (
  user_id uuid not null references public.profiles (id) on delete cascade,
  friend_id uuid not null references public.profiles (id) on delete cascade,
  position smallint not null check (position between 1 and 8),
  updated_at timestamptz not null default now(),
  constraint top8_not_self check (user_id <> friend_id),
  constraint top8_unique_position unique (user_id, position),
  constraint top8_unique_friend unique (user_id, friend_id)
);

alter table public.top8 enable row level security;

create policy "top8 is visible to any signed-in user"
  on public.top8 for select
  to authenticated
  using (true);

create policy "users can manage their own top8"
  on public.top8 for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- posts ---------------------------------------------------------------------

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  gif_url text,
  like_count integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;

create policy "posts are visible to any signed-in user"
  on public.posts for select
  to authenticated
  using (true);

create policy "users can create their own posts"
  on public.posts for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can delete their own posts"
  on public.posts for delete
  to authenticated
  using (auth.uid() = user_id);

-- post_likes ------------------------------------------------------------------

create table public.post_likes (
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

alter table public.post_likes enable row level security;

create policy "post likes are visible to any signed-in user"
  on public.post_likes for select
  to authenticated
  using (true);

create policy "users can like posts"
  on public.post_likes for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can unlike posts"
  on public.post_likes for delete
  to authenticated
  using (auth.uid() = user_id);

create function public.handle_post_like_change()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if (tg_op = 'INSERT') then
    update public.posts set like_count = like_count + 1 where id = new.post_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.posts set like_count = greatest(like_count - 1, 0) where id = old.post_id;
    return old;
  end if;
  return null;
end;
$$;

create trigger on_post_like_change
  after insert or delete on public.post_likes
  for each row execute function public.handle_post_like_change();

-- wall_comments ---------------------------------------------------------------

create table public.wall_comments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  gif_url text,
  created_at timestamptz not null default now()
);

alter table public.wall_comments enable row level security;

create policy "wall comments are visible to any signed-in user"
  on public.wall_comments for select
  to authenticated
  using (true);

create policy "users can post wall comments"
  on public.wall_comments for insert
  to authenticated
  with check (auth.uid() = author_id);

create policy "authors or wall owners can delete a wall comment"
  on public.wall_comments for delete
  to authenticated
  using (auth.uid() = author_id or auth.uid() = profile_id);

-- messages --------------------------------------------------------------------

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles (id) on delete cascade,
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  gif_url text,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  constraint messages_not_self check (sender_id <> recipient_id)
);

alter table public.messages enable row level security;

create policy "participants can view their messages"
  on public.messages for select
  to authenticated
  using (auth.uid() = sender_id or auth.uid() = recipient_id);

create policy "users can send messages"
  on public.messages for insert
  to authenticated
  with check (auth.uid() = sender_id);

create policy "recipients can mark messages read"
  on public.messages for update
  to authenticated
  using (auth.uid() = recipient_id)
  with check (auth.uid() = recipient_id);

-- notifications -----------------------------------------------------------------

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type public.notification_type not null,
  actor_id uuid references public.profiles (id) on delete set null,
  reference_id uuid,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "users can view their own notifications"
  on public.notifications for select
  to authenticated
  using (auth.uid() = user_id);

create policy "signed-in users can create notifications for others"
  on public.notifications for insert
  to authenticated
  with check (auth.uid() = actor_id);

create policy "users can mark their own notifications read"
  on public.notifications for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- auto-create a profile row on signup ------------------------------------------

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  candidate_username text;
begin
  candidate_username := coalesce(
    new.raw_user_meta_data ->> 'username',
    split_part(new.email, '@', 1)
  );

  -- fall back to a unique username if the preferred one is already taken
  if exists (select 1 from public.profiles where username = candidate_username) then
    candidate_username := candidate_username || '_' || substr(new.id::text, 1, 8);
  end if;

  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    candidate_username,
    coalesce(new.raw_user_meta_data ->> 'display_name', candidate_username)
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- realtime ----------------------------------------------------------------------

alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.messages;

-- storage: avatar uploads --------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatar images are publicly accessible"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

create policy "users can upload their own avatar"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "users can update their own avatar"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "users can delete their own avatar"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
