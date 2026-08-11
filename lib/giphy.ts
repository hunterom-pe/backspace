// GIF URLs only ever come from our own /api/giphy/search proxy, but
// wall_comments.gif_url is rendered as <img src> for every viewer, and the
// server action is reachable directly (not just through our UI), so we
// still verify the domain server-side before storing it.
const GIPHY_MEDIA_PATTERN = /^https:\/\/(media\d*|i)\.giphy\.com\//;

export function isGiphyUrl(url: string): boolean {
  return GIPHY_MEDIA_PATTERN.test(url);
}
