import type { IconProps } from "./types";

export function SunIcon({ size = 24, ...props }: IconProps) {
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
      <circle cx="12" cy="12" r="4.2" />
      <line x1="12" y1="1.75" x2="12" y2="4.25" />
      <line x1="12" y1="19.75" x2="12" y2="22.25" />
      <line x1="1.75" y1="12" x2="4.25" y2="12" />
      <line x1="19.75" y1="12" x2="22.25" y2="12" />
      <line x1="4.6" y1="4.6" x2="6.35" y2="6.35" />
      <line x1="17.65" y1="17.65" x2="19.4" y2="19.4" />
      <line x1="4.6" y1="19.4" x2="6.35" y2="17.65" />
      <line x1="17.65" y1="6.35" x2="19.4" y2="4.6" />
    </svg>
  );
}
