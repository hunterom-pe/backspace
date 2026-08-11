export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  location: string | null;
  tagline: string | null;
  mood_status: string | null;
  about_me: string | null;
  interests: string | null;
  spotify_embed_url: string | null;
  status: "online" | "away" | "offline";
};
