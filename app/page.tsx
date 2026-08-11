import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BackspaceMark } from "@/components/Logo/BackspaceMark";
import { AppShell } from "@/components/AppShell/AppShell";
import { ProfileCard } from "@/components/ProfileCard/ProfileCard";
import { AboutCard } from "@/components/AboutCard/AboutCard";
import { Top8Editor } from "@/components/Top8Editor/Top8Editor";
import { SpotifyCard } from "@/components/SpotifyCard/SpotifyCard";
import { WallCard } from "@/components/WallCard/WallCard";
import { PostsFeed } from "@/components/PostsFeed/PostsFeed";
import { getTop8 } from "@/lib/top8/queries";
import { getFriendsPageData } from "@/lib/friends/queries";
import { getWallComments } from "@/lib/wall/queries";
import { getFeedPosts } from "@/lib/posts/queries";
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
        <div className={styles.hero}>
          <div className={styles.brand}>
            <span className={styles.mark}>
              <BackspaceMark size={30} />
            </span>
            <h1 className={styles.title}>backspace</h1>
          </div>
          <p className={styles.tagline}>
            Hit backspace on the last twenty years of the internet.
          </p>
          <p className={styles.subtitle}>
            Profiles, Top 8s, wall posts, and away messages — the whole bit is back. Claim your
            username before your middle school nemesis does.
          </p>
          <div className={styles.ctas}>
            <Link href="/signup" className="btn-primary">
              Sign up
            </Link>
            <Link href="/login" className="btn-secondary">
              Log in
            </Link>
          </div>
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
  const [top8Slots, { friends }, wallComments, feedPosts] = await Promise.all([
    getTop8(supabase, user.id),
    getFriendsPageData(supabase, user.id),
    getWallComments(supabase, user.id),
    getFeedPosts(supabase, user.id),
  ]);

  return (
    <AppShell
      viewerId={user.id}
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
          <WallCard profileId={profile.id} viewerId={user.id} comments={wallComments} />
          <PostsFeed viewerId={user.id} posts={feedPosts} />
        </>
      }
    />
  );
}
