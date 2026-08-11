import type { IconProps } from "./types";

export function HeartIcon({
  size = 24,
  filled = false,
  ...props
}: IconProps & { filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 20.3s-7.4-4.5-9.8-9.2C.7 7.7 2.5 4 6.3 4c2.3 0 3.7 1.4 5.7 3.5C14 5.4 15.4 4 17.7 4c3.8 0 5.6 3.7 4.1 7.1-2.4 4.7-9.8 9.2-9.8 9.2Z" />
    </svg>
  );
}
