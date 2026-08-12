import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/AppShell/AppShell";
import { Card } from "@/components/Card/Card";
import { ProfileCard } from "@/components/ProfileCard/ProfileCard";
import { AboutCard } from "@/components/AboutCard/AboutCard";
import { StampStrip } from "@/components/StampStrip/StampStrip";
import { RecentVisitors } from "@/components/RecentVisitors/RecentVisitors";
import { Top8Editor } from "@/components/Top8Editor/Top8Editor";
import { SpotifyCard } from "@/components/SpotifyCard/SpotifyCard";
import { PostComposer } from "@/components/PostsFeed/PostComposer";
import { PostsFeed } from "@/components/PostsFeed/PostsFeed";
import { PencilIcon } from "@/components/icons";
import { getTop8 } from "@/lib/top8/queries";
import { getFriendsPageData } from "@/lib/friends/queries";
import { getFeedPosts } from "@/lib/posts/queries";
import { getRecentVisitors } from "@/lib/visits/queries";
import { PROFILE_COLUMNS, type Profile } from "@/lib/types";

export const metadata: Metadata = { title: "Feed" };

export default async function FeedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", user.id)
    .single<Profile>();

  if (!profile) {
    redirect("/login");
  }

  const name = profile.display_name || profile.username;
  const [top8Slots, { friends }, feedPosts, recentVisitors] = await Promise.all([
    getTop8(supabase, user.id),
    getFriendsPageData(supabase, user.id),
    getFeedPosts(supabase, user.id),
    getRecentVisitors(supabase, user.id),
  ]);

  return (
    <AppShell
      viewerId={user.id}
      viewerDisplayName={name}
      viewerUsername={profile.username}
      sidebarTheme={profile.theme}
      sidebar={
        <>
          <ProfileCard profile={profile} isOwnProfile />
          <RecentVisitors visits={recentVisitors} />
          <AboutCard profile={profile} isOwnProfile />
          <StampStrip />
          <Top8Editor
            initialSlots={top8Slots}
            availableFriends={friends.map((f) => f.profile)}
          />
          <SpotifyCard embedUrl={profile.spotify_embed_url} />
        </>
      }
      main={
        <>
          <Card title="Post" icon={<PencilIcon size={17} aria-hidden="true" />}>
            <PostComposer />
          </Card>
          <PostsFeed viewerId={user.id} posts={feedPosts} />
        </>
      }
    />
  );
}
