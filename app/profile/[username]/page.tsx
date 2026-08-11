import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/AppShell/AppShell";
import { ProfileCard } from "@/components/ProfileCard/ProfileCard";
import { AboutCard } from "@/components/AboutCard/AboutCard";
import { Top8Card } from "@/components/Top8Card/Top8Card";
import { Top8Editor } from "@/components/Top8Editor/Top8Editor";
import { SpotifyCard } from "@/components/SpotifyCard/SpotifyCard";
import { WallCard } from "@/components/WallCard/WallCard";
import { FriendButton } from "@/components/FriendButton/FriendButton";
import { getFriendshipState, getFriendsPageData } from "@/lib/friends/queries";
import { getTop8 } from "@/lib/top8/queries";
import { getWallComments } from "@/lib/wall/queries";
import { PROFILE_COLUMNS, type Profile } from "@/lib/types";

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
  const [friendshipState, top8Slots, friendsData, wallComments] = await Promise.all([
    isOwnProfile ? Promise.resolve(null) : getFriendshipState(supabase, user.id, profile.id),
    getTop8(supabase, profile.id),
    isOwnProfile ? getFriendsPageData(supabase, user.id) : Promise.resolve(null),
    getWallComments(supabase, profile.id),
  ]);

  return (
    <AppShell
      viewerDisplayName={viewer.display_name || viewer.username}
      viewerUsername={viewer.username}
      sidebar={
        <>
          <ProfileCard
            profile={profile}
            isOwnProfile={isOwnProfile}
            action={
              friendshipState ? (
                <FriendButton
                  targetId={profile.id}
                  state={friendshipState}
                  redirectTo={`/profile/${profile.username}`}
                />
              ) : null
            }
          />
          <AboutCard profile={profile} isOwnProfile={isOwnProfile} />
          {isOwnProfile && friendsData ? (
            <Top8Editor
              initialSlots={top8Slots}
              availableFriends={friendsData.friends.map((f) => f.profile)}
            />
          ) : (
            <Top8Card slots={top8Slots} />
          )}
        </>
      }
      main={
        <>
          <SpotifyCard embedUrl={profile.spotify_embed_url} />
          <WallCard profileId={profile.id} viewerId={user.id} comments={wallComments} />
        </>
      }
    />
  );
}
