import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/AppShell/AppShell";
import { ProfileCard } from "@/components/ProfileCard/ProfileCard";
import { AboutCard } from "@/components/AboutCard/AboutCard";
import { Top8Card } from "@/components/Top8Card/Top8Card";
import { SpotifyCard } from "@/components/SpotifyCard/SpotifyCard";
import { WallCard } from "@/components/WallCard/WallCard";
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

  return (
    <AppShell
      viewerDisplayName={viewer.display_name || viewer.username}
      viewerUsername={viewer.username}
      sidebar={
        <>
          <ProfileCard profile={profile} isOwnProfile={isOwnProfile} />
          <AboutCard profile={profile} isOwnProfile={isOwnProfile} />
          <Top8Card />
        </>
      }
      main={
        <>
          <SpotifyCard embedUrl={profile.spotify_embed_url} />
          <WallCard />
        </>
      }
    />
  );
}
