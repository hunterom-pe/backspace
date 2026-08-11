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

Deployed on Netlify via [`netlify.toml`](netlify.toml), which runs `npm run build` and
applies [`@netlify/plugin-nextjs`](https://github.com/netlify/next-runtime) for SSR,
Server Actions, and route handler support (this isn't a static export — those all need
a server runtime). Node version is pinned to 22 in both `netlify.toml` and `.nvmrc`,
comfortably above Next.js 16's minimum of 20.9.

To deploy:

1. In Netlify, "Add new site" → "Import an existing project" → pick this repo. Netlify
   reads `netlify.toml` automatically; no build settings need to be entered by hand.
2. In the site's **Environment variables** settings, add the same four variables from
   `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
   `SUPABASE_SECRET_KEY`, `GIPHY_API_KEY`).
3. In the Supabase dashboard, add the deployed Netlify URL to **Authentication → URL
   Configuration** (Site URL and Redirect URLs) so email confirmation links and OAuth
   redirects resolve correctly in production instead of pointing at `localhost`.
4. Deploy. Every subsequent push to the connected branch redeploys automatically.
