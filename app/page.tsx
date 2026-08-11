import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/AppShell/AppShell";
import { ProfileCard } from "@/components/ProfileCard/ProfileCard";
import { AboutCard } from "@/components/AboutCard/AboutCard";
import { Top8Card } from "@/components/Top8Card/Top8Card";
import { SpotifyCard } from "@/components/SpotifyCard/SpotifyCard";
import { WallCard } from "@/components/WallCard/WallCard";
import { PostsFeed } from "@/components/PostsFeed/PostsFeed";
import type { Profile } from "@/lib/types";
import styles from "./page.module.css";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className={styles.page}>
        <h1 className={styles.title}>Backspace</h1>
        <p className={styles.subtitle}>
          Your profile, your Top 8, your wall — back from the dead. Sign up to claim your
          username.
        </p>
        <div className={styles.ctas}>
          <Link href="/signup" className={styles.primary}>
            Sign up
          </Link>
          <Link href="/login" className={styles.secondary}>
            Log in
          </Link>
        </div>
      </main>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, username, display_name, avatar_url, location, tagline, mood_status, about_me, interests, spotify_embed_url, status",
    )
    .eq("id", user.id)
    .single<Profile>();

  if (!profile) {
    return (
      <main className={styles.page}>
        <p className={styles.subtitle}>
          We couldn&apos;t load your profile. Try refreshing, or log out and back in.
        </p>
      </main>
    );
  }

  const name = profile.display_name || profile.username;

  return (
    <AppShell
      displayName={name}
      username={profile.username}
      sidebar={
        <>
          <ProfileCard profile={profile} />
          <AboutCard profile={profile} />
          <Top8Card />
        </>
      }
      main={
        <>
          <SpotifyCard embedUrl={profile.spotify_embed_url} />
          <WallCard />
          <PostsFeed />
        </>
      }
    />
  );
}
