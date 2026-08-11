const SPOTIFY_URL_PATTERN =
  /^https:\/\/open\.spotify\.com\/(embed\/)?(track|album|playlist|artist|episode|show)\/[A-Za-z0-9]+(\?.*)?$/;

// Users paste a normal share link; we normalize it to the embeddable form.
// Only open.spotify.com URLs are accepted since this becomes an iframe src
// on every viewer's page.
export function toSpotifyEmbedUrl(rawUrl: string): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;
  if (!SPOTIFY_URL_PATTERN.test(trimmed)) return null;
  if (trimmed.includes("/embed/")) return trimmed;
  return trimmed.replace("open.spotify.com/", "open.spotify.com/embed/");
}
