import { describe, expect, it } from "vitest";
import { formatRelativeTime } from "./format-time";

function isoSecondsAgo(seconds: number): string {
  return new Date(Date.now() - seconds * 1000).toISOString();
}

describe("formatRelativeTime", () => {
  it("returns 'just now' for timestamps under a minute old", () => {
    expect(formatRelativeTime(isoSecondsAgo(30))).toBe("just now");
  });

  it("formats minutes", () => {
    expect(formatRelativeTime(isoSecondsAgo(5 * 60))).toBe("5m ago");
  });

  it("formats hours", () => {
    expect(formatRelativeTime(isoSecondsAgo(3 * 60 * 60))).toBe("3h ago");
  });

  it("formats days", () => {
    expect(formatRelativeTime(isoSecondsAgo(2 * 24 * 60 * 60))).toBe("2d ago");
  });

  it("falls back to a locale date string after a week", () => {
    const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(eightDaysAgo.toISOString())).toBe(eightDaysAgo.toLocaleDateString());
  });
});
