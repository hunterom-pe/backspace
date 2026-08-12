"use client";

import type { ButtonHTMLAttributes, MouseEvent } from "react";
import { fireConfettiFromElement } from "@/lib/confetti";

/** Drop-in replacement for a submit button that fires a confetti burst on
 *  click, then lets the form submit normally — for server-action forms that
 *  otherwise have no client-side hook to trigger the effect from. */
export function ConfettiButton({
  onClick,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    fireConfettiFromElement(event.currentTarget);
    onClick?.(event);
  }

  return <button {...props} onClick={handleClick} />;
}
