import type { IconProps } from "./types";

export function GifFrameIcon({ size = 24, ...props }: IconProps) {
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
      <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
      <circle cx="8" cy="10" r="1.4" fill="currentColor" stroke="none" />
      <path d="M2.5 16.5 8 12l3.5 3 4-4.5 6 5.5" />
    </svg>
  );
}
