# Backspace

A modern rebuild of MySpace's core social profile experience — profiles, Top 8, wall
comments, mood status, posts, messaging, and notifications — built with Next.js
(App Router) and Supabase.

## Stack

- **Framework**: Next.js 16 (App Router), deployed on Netlify
- **Backend**: Supabase — Postgres, Auth (email/password), Storage (avatars), Realtime
  (presence + live notifications/messages)
- **Styling**: plain CSS / CSS Modules with CSS variables for theming (dark mode via
  `data-theme`, persisted in `localStorage`)
- **GIFs**: Giphy API

## Getting started

1. Copy `.env.example` to `.env.local` and fill in your Supabase and Giphy keys:

   ```bash
   cp .env.example .env.local
   ```

   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Supabase
     project settings → API.
   - `SUPABASE_SECRET_KEY` — same page; server-only, never exposed to the client.
   - `GIPHY_API_KEY` — from the [Giphy developer dashboard](https://developers.giphy.com/).

2. Apply the database schema. In the Supabase dashboard SQL editor, run the migration
   at [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) (creates
   all tables, row-level security policies, the avatar storage bucket, and the trigger
   that creates a `profiles` row on signup). If you have the Supabase CLI linked to the
   project instead, `supabase db push` works too.

3. Install dependencies and run the dev server:

   ```bash
   npm install
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Project structure

- `app/` — routes (App Router)
- `lib/supabase/` — Supabase client helpers: `client.ts` (browser), `server.ts`
  (Server Components/Route Handlers), `proxy.ts` (session refresh, used by the root
  `proxy.ts` — Next.js 16 renamed `middleware.ts` to `proxy.ts`)
- `supabase/migrations/` — SQL schema, run manually via the Supabase SQL editor

## Deployment

Deployed on Netlify, connected to this repository. Set the same environment variables
from `.env.local` in the Netlify site's build settings.
