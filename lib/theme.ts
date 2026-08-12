export const PROFILE_THEMES = [
  { id: "classic", label: "Classic" },
  { id: "punk", label: "Punk Pink" },
  { id: "scene", label: "Scene Kid" },
  { id: "skater", label: "Skater" },
  { id: "emo", label: "Emo" },
  { id: "cyber", label: "Cyber Y2K" },
  { id: "sunset", label: "Sunset Pop" },
  { id: "glitter", label: "Glitter Gold" },
] as const;

export type ProfileTheme = (typeof PROFILE_THEMES)[number]["id"];

export const DEFAULT_PROFILE_THEME: ProfileTheme = "classic";

const THEME_IDS = new Set<string>(PROFILE_THEMES.map((t) => t.id));

export function isProfileTheme(value: string): value is ProfileTheme {
  return THEME_IDS.has(value);
}
