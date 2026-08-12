export const RIBBON_STYLES = [
  { id: "classic", label: "Classic" },
  { id: "holographic", label: "Holographic" },
  { id: "glitter", label: "Glitter" },
  { id: "chrome", label: "Chrome" },
] as const;

export type RibbonStyle = (typeof RIBBON_STYLES)[number]["id"];

export const DEFAULT_RIBBON_STYLE: RibbonStyle = "classic";

const RIBBON_STYLE_IDS = new Set<string>(RIBBON_STYLES.map((r) => r.id));

export function isRibbonStyle(value: string): value is RibbonStyle {
  return RIBBON_STYLE_IDS.has(value);
}
