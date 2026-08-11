export const PROFILE_COLUMNS =
  "id, username, display_name, avatar_url, banner_url, location, tagline, mood_status, about_me, interests, spotify_embed_url, status, last_active_at, profile_views";

export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  location: string | null;
  tagline: string | null;
  mood_status: string | null;
  about_me: string | null;
  interests: string | null;
  spotify_embed_url: string | null;
  status: "online" | "away" | "offline";
  last_active_at: string;
  profile_views: number;
};
