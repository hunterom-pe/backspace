import type { IconProps } from "./types";

export function MusicNoteIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 18.5V5.5l10-2v13" />
      <circle cx="6.5" cy="18.5" r="2.7" />
      <circle cx="16.5" cy="16.5" r="2.7" />
    </svg>
  );
}
