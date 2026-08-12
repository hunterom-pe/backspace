import type { IconProps } from "./types";

export function UsersIcon({ size = 24, ...props }: IconProps) {
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
      <circle cx="8.5" cy="8" r="3.2" />
      <path d="M2.5 20c0-3.6 2.7-6.5 6-6.5s6 2.9 6 6.5" />
      <path d="M15 5.1c1.4.3 2.4 1.6 2.4 3.1s-1 2.8-2.4 3.1" />
      <path d="M15.5 13.7c2.4.6 4 2.9 4 5.5" />
    </svg>
  );
}
