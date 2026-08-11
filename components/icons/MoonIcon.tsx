import type { IconProps } from "./types";

export function MoonIcon({ size = 24, ...props }: IconProps) {
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
      <path d="M20.5 14.7A8.5 8.5 0 0 1 9.3 3.5a7.2 7.2 0 1 0 11.2 11.2Z" />
    </svg>
  );
}
