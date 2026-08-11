import type { SVGProps } from "react";

export function BackspaceMark({ size = 40, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
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
      aria-hidden="true"
      {...props}
    >
      <path d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9L3.6 12.9a1.1 1.1 0 0 1 0-1.8L9 5Z" />
      <path d="M12.5 9.5 16.5 14.5M16.5 9.5 12.5 14.5" />
    </svg>
  );
}
