import type { IconProps } from "./types";

export function UserPlusIcon({ size = 24, ...props }: IconProps) {
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
      <circle cx="9.5" cy="7.5" r="3.5" />
      <path d="M3 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
      <line x1="18" y1="7.5" x2="18" y2="13.5" />
      <line x1="15" y1="10.5" x2="21" y2="10.5" />
    </svg>
  );
}
