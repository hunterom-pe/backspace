import type { IconProps } from "./types";

export function SendIcon({ size = 24, ...props }: IconProps) {
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
      <path d="M21 3 3 10.2l7.2 2.6L12.8 20 21 3Z" />
      <line x1="10.6" y1="13.4" x2="21" y2="3" />
    </svg>
  );
}
