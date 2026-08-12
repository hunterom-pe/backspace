import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/AppShell/AppShell";
import { Card } from "@/components/Card/Card";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { ProfileCard } from "@/components/ProfileCard/ProfileCard";
import { AboutCard } from "@/components/AboutCard/AboutCard";
import { StampStrip } from "@/components/StampStrip/StampStrip";
import { Top8Card } from "@/components/Top8Card/Top8Card";
import { Top8Editor } from "@/components/Top8Editor/Top8Editor";
import { SpotifyCard } from "@/components/SpotifyCard/SpotifyCard";
import { WallCard } from "@/components/WallCard/WallCard";
import { FriendButton } from "@/components/FriendButton/FriendButton";
import { MessageLink } from "@/components/MessageLink/MessageLink";
import { BlockButton } from "@/components/BlockButton/BlockButton";
import { RecentVisitors } from "@/components/RecentVisitors/RecentVisitors";
import { PhotosCard } from "@/components/PhotosCard/PhotosCard";
import { UnderConstructionBanner } from "@/components/UnderConstructionBanner/UnderConstructionBanner";
import { LockIcon, BanIcon } from "@/components/icons";
import { getFriendshipState, getFriendsPageData } from "@/lib/friends/queries";
import { getBlockState } from "@/lib/blocking/queries";
import { getTop8 } from "@/lib/top8/queries";
import { getWallComments } from "@/lib/wall/queries";
import { getRecentVisitors } from "@/lib/visits/queries";
import { getPhotos } from "@/lib/photos/queries";
import { PROFILE_COLUMNS, type Profile } from "@/lib/types";
import layoutStyles from "./profile-layout.module.css";

export async function generateMetadata(
  props: PageProps<"/profile/[username]">,
): Promise<Metadata> {
  const { username } = await props.params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, tagline, about_me, avatar_url")
    .eq("username", username)
    .single();

  if (!profile) {
    return { title: "Profile not found" };
  }

  const name = profile.display_name || profile.username;
  const description = profile.tagline || profile.about_me || `@${profile.username} on backspace`;

  return {
    title: name,
    description,
    openGraph: {
      title: name,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : undefined,
    },
    twitter: {
      title: name,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : undefined,
    },
  };
}

export default async function ProfilePage(props: PageProps<"/profile/[username]">) {
  const { username } = await props.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: viewer } = await supabase
    .from("profiles")
    .select("username, display_name")
    .eq("id", user.id)
    .single();

  if (!viewer) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("username", username)
    .single<Profile>();

  if (!profile) {
    notFound();
  }

  const isOwnProfile = profile.id === user.id;
  const redirectTo = `/profile/${profile.username}`;

  const blockState = isOwnProfile
    ? { blockedByViewer: false, blockedByTarget: false }
    : await getBlockState(supabase, user.id, profile.id);

  if (blockState.blockedByViewer || blockState.blockedByTarget) {
    return (
      <AppShell
        viewerId={user.id}
        viewerDisplayName={viewer.display_name || viewer.username}
        viewerUsername={viewer.username}
        sidebar={
          <Card title={blockState.blockedByViewer ? "Blocked" : "Unavailable"}>
            <EmptyState icon={<BanIcon size={26} aria-hidden="true" />}>
              {blockState.blockedByViewer
                ? "You've blocked this account. Unblock them to see their profile again."
                : "This profile isn't available."}
            </EmptyState>
            {blockState.blockedByViewer ? (
              <BlockButton targetId={profile.id} isBlocked redirectTo="/friends" />
            ) : null}
          </Card>
        }
        main={null}
      />
    );
  }

  const friendshipState = isOwnProfile
    ? null
    : await getFriendshipState(supabase, user.id, profile.id);
  const canViewFull =
    isOwnProfile || !profile.is_private || friendshipState?.status === "friends";

  const profileAction = friendshipState ? (
    <>
      <FriendButton targetId={profile.id} state={friendshipState} redirectTo={redirectTo} />
      <MessageLink username={profile.username} />
      <BlockButton targetId={profile.id} isBlocked={false} redirectTo={redirectTo} />
    </>
  ) : null;

  if (!canViewFull) {
    return (
      <AppShell
        viewerId={user.id}
        viewerDisplayName={viewer.display_name || viewer.username}
        viewerUsername={viewer.username}
        sidebarTheme={profile.theme}
        pageTheme={profile.theme}
        sidebar={
          <>
            <ProfileCard
              profile={profile}
              isOwnProfile={false}
              minimal
              action={profileAction}
            />
            <Card title="Private profile">
              <EmptyState icon={<LockIcon size={26} aria-hidden="true" />}>
                @{profile.username} has a private profile. Add them as a friend to see their
                Wall, Top 8, and more.
              </EmptyState>
            </Card>
          </>
        }
        main={null}
      />
    );
  }

  const [top8Slots, friendsData, wallComments, recentVisitors, photos] = await Promise.all([
    getTop8(supabase, profile.id),
    isOwnProfile ? getFriendsPageData(supabase, user.id) : Promise.resolve(null),
    getWallComments(supabase, profile.id),
    isOwnProfile ? getRecentVisitors(supabase, profile.id) : Promise.resolve(null),
    getPhotos(supabase, profile.id),
    isOwnProfile
      ? Promise.resolve(null)
      : supabase.rpc("record_profile_visit", { target_id: profile.id }),
  ]);

  return (
    <AppShell
      viewerId={user.id}
      viewerDisplayName={viewer.display_name || viewer.username}
      viewerUsername={viewer.username}
      sidebarTheme={profile.theme}
      mainTheme={profile.theme}
      pageTheme={profile.theme}
      sidebar={
        <>
          <ProfileCard profile={profile} isOwnProfile={isOwnProfile} action={profileAction} />
          <StampStrip />
          <AboutCard profile={profile} isOwnProfile={isOwnProfile} />
          {isOwnProfile && recentVisitors ? <RecentVisitors visits={recentVisitors} /> : null}
        </>
      }
      main={
        <>
          {profile.show_under_construction ? <UnderConstructionBanner /> : null}
          <div className={layoutStyles.topRow}>
            {isOwnProfile && friendsData ? (
              <Top8Editor
                initialSlots={top8Slots}
                availableFriends={friendsData.friends.map((f) => f.profile)}
                ribbonStyle={profile.ribbon_style}
              />
            ) : (
              <Top8Card slots={top8Slots} ribbonStyle={profile.ribbon_style} />
            )}
            <SpotifyCard embedUrl={profile.spotify_embed_url} />
          </div>
          <PhotosCard photos={photos} isOwnProfile={isOwnProfile} redirectTo={redirectTo} />
          <WallCard profileId={profile.id} viewerId={user.id} comments={wallComments} />
        </>
      }
    />
  );
}
