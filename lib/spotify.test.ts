import { describe, expect, it } from "vitest";
import { toSpotifyEmbedUrl } from "./spotify";

describe("toSpotifyEmbedUrl", () => {
  it("converts a normal share link to its embed form", () => {
    expect(toSpotifyEmbedUrl("https://open.spotify.com/track/abc123")).toBe(
      "https://open.spotify.com/embed/track/abc123",
    );
  });

  it("leaves an already-embed link untouched", () => {
    const url = "https://open.spotify.com/embed/album/xyz789";
    expect(toSpotifyEmbedUrl(url)).toBe(url);
  });

  it("preserves query strings", () => {
    expect(toSpotifyEmbedUrl("https://open.spotify.com/playlist/abc?si=xyz")).toBe(
      "https://open.spotify.com/embed/playlist/abc?si=xyz",
    );
  });

  it("trims surrounding whitespace", () => {
    expect(toSpotifyEmbedUrl("  https://open.spotify.com/track/abc123  ")).toBe(
      "https://open.spotify.com/embed/track/abc123",
    );
  });

  it("rejects non-spotify URLs", () => {
    expect(toSpotifyEmbedUrl("https://evil.com/open.spotify.com/track/abc")).toBeNull();
  });

  it("rejects unsupported resource types", () => {
    expect(toSpotifyEmbedUrl("https://open.spotify.com/user/someone")).toBeNull();
  });

  it("rejects empty input", () => {
    expect(toSpotifyEmbedUrl("")).toBeNull();
    expect(toSpotifyEmbedUrl("   ")).toBeNull();
  });
});
