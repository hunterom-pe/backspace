export function fireConfettiAt(x: number, y: number) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("confetti-burst", { detail: { x, y } }));
}

export function fireConfettiFromElement(el: Element) {
  const rect = el.getBoundingClientRect();
  fireConfettiAt(rect.left + rect.width / 2, rect.top + rect.height / 2);
}
