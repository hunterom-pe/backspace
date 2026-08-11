import { describe, expect, it } from "vitest";
import { isGiphyUrl } from "./giphy";

describe("isGiphyUrl", () => {
  it("accepts media subdomain URLs", () => {
    expect(isGiphyUrl("https://media3.giphy.com/media/abc/giphy.gif")).toBe(true);
  });

  it("accepts the i.giphy.com CDN host", () => {
    expect(isGiphyUrl("https://i.giphy.com/abc.gif")).toBe(true);
  });

  it("rejects non-giphy hosts, including lookalikes", () => {
    expect(isGiphyUrl("https://evil.com/media.giphy.com/giphy.gif")).toBe(false);
    expect(isGiphyUrl("https://notgiphy.com/giphy.gif")).toBe(false);
  });

  it("rejects non-https URLs", () => {
    expect(isGiphyUrl("http://media.giphy.com/giphy.gif")).toBe(false);
  });
});
