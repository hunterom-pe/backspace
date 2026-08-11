import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/AppShell/AppShell";
import { ProfileCard } from "@/components/ProfileCard/ProfileCard";
import { AboutCard } from "@/components/AboutCard/AboutCard";
import { Top8Editor } from "@/components/Top8Editor/Top8Editor";
import { SpotifyCard } from "@/components/SpotifyCard/SpotifyCard";
import { WallCard } from "@/components/WallCard/WallCard";
import { PostsFeed } from "@/components/PostsFeed/PostsFeed";
import { getTop8 } from "@/lib/top8/queries";
import { getFriendsPageData } from "@/lib/friends/queries";
import { PROFILE_COLUMNS, type Profile } from "@/lib/types";
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
    .select(PROFILE_COLUMNS)
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
  const [top8Slots, { friends }] = await Promise.all([
    getTop8(supabase, user.id),
    getFriendsPageData(supabase, user.id),
  ]);

  return (
    <AppShell
      viewerDisplayName={name}
      viewerUsername={profile.username}
      sidebar={
        <>
          <ProfileCard profile={profile} isOwnProfile />
          <AboutCard profile={profile} isOwnProfile />
          <Top8Editor
            initialSlots={top8Slots}
            availableFriends={friends.map((f) => f.profile)}
          />
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
