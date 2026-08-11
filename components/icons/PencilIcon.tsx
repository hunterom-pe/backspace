import type { IconProps } from "./types";

export function PencilIcon({ size = 24, ...props }: IconProps) {
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
      <path d="M4 20l1-4.2L14.8 5 19 9.2 9.2 19 4 20Z" />
      <line x1="12.8" y1="7" x2="17" y2="11.2" />
    </svg>
  );
}
