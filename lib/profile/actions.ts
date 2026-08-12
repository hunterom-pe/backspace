"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { toSpotifyEmbedUrl } from "@/lib/spotify";
import { DEFAULT_PROFILE_THEME, isProfileTheme } from "@/lib/theme";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const MAX_BANNER_BYTES = 8 * 1024 * 1024;

function fail(message: string): never {
  redirect(`/profile/edit?error=${encodeURIComponent(message)}`);
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: existing } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (!existing) {
    fail("We couldn't find your profile.");
  }

  const rawSpotifyUrl = String(formData.get("spotify_embed_url") ?? "").trim();
  let spotifyEmbedUrl: string | null = null;
  if (rawSpotifyUrl) {
    spotifyEmbedUrl = toSpotifyEmbedUrl(rawSpotifyUrl);
    if (!spotifyEmbedUrl) {
      fail("That doesn't look like a valid open.spotify.com link.");
    }
  }

  const rawTheme = String(formData.get("theme") ?? "");

  const updates: Record<string, string | boolean | null> = {
    display_name: String(formData.get("display_name") ?? "").trim() || null,
    location: String(formData.get("location") ?? "").trim() || null,
    tagline: String(formData.get("tagline") ?? "").trim() || null,
    mood_status: String(formData.get("mood_status") ?? "").trim() || null,
    away_message: String(formData.get("away_message") ?? "").trim() || null,
    about_me: String(formData.get("about_me") ?? "").trim() || null,
    interests: String(formData.get("interests") ?? "").trim() || null,
    spotify_embed_url: spotifyEmbedUrl,
    theme: isProfileTheme(rawTheme) ? rawTheme : DEFAULT_PROFILE_THEME,
    is_private: formData.get("is_private") === "on",
  };

  const avatarFile = formData.get("avatar");
  if (avatarFile instanceof File && avatarFile.size > 0) {
    if (!avatarFile.type.startsWith("image/")) {
      fail("Avatar must be an image file.");
    }
    if (avatarFile.size > MAX_AVATAR_BYTES) {
      fail("Avatar must be under 5MB.");
    }

    const ext = avatarFile.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, avatarFile, { upsert: true, contentType: avatarFile.type });

    if (uploadError) {
      fail(uploadError.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);
    updates.avatar_url = `${publicUrl}?v=${Date.now()}`;
  }

  const bannerFile = formData.get("banner");
  if (bannerFile instanceof File && bannerFile.size > 0) {
    if (!bannerFile.type.startsWith("image/")) {
      fail("Banner must be an image file.");
    }
    if (bannerFile.size > MAX_BANNER_BYTES) {
      fail("Banner must be under 8MB.");
    }

    const ext = bannerFile.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/banner.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("banners")
      .upload(path, bannerFile, { upsert: true, contentType: bannerFile.type });

    if (uploadError) {
      fail(uploadError.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("banners").getPublicUrl(path);
    updates.banner_url = `${publicUrl}?v=${Date.now()}`;
  }

  const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
  if (error) {
    fail(error.message);
  }

  revalidatePath("/", "layout");
  redirect(`/profile/${existing.username}`);
}
